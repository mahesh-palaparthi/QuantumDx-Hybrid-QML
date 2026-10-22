const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("./server");
const db = require("./db");

test("GET /health returns 200 and healthy gateway status", async () => {
  const res = await request(app).get("/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
  assert.equal(res.body.service, "QuantumDx Node.js API Gateway");
  assert.ok(typeof res.body.uptime === "number");
});

test("GET /api/health returns 200 ok", async () => {
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "ok");
});

test("GET /api returns gateway information", async () => {
  const res = await request(app).get("/api");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "success");
  assert.ok(res.body.pythonBackend);
});

test("POST /api/auth/register validates required input fields", async () => {
  const res = await request(app).post("/api/auth/register").send({});
  assert.equal(res.status, 400);
  assert.equal(res.body.status, "error");
});

test("POST /api/auth/register rejects short passwords under 6 chars", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ fullName: "Dr. Unit Test", email: "unit@quantumdx.ai", password: "123" });
  assert.equal(res.status, 400);
  assert.match(res.body.message, /at least 6 characters/i);
});

test("POST /api/auth/login validates credentials correctly", async () => {
  const resInvalid = await request(app)
    .post("/api/auth/login")
    .send({ email: "nonexistent@quantumdx.ai", password: "badpassword" });
  assert.equal(resInvalid.status, 401);
  assert.equal(resInvalid.body.status, "error");

  const resValid = await request(app)
    .post("/api/auth/login")
    .send({ email: "dr.sarah@quantumdx.ai", password: "doctor123" });
  assert.equal(resValid.status, 200);
  assert.equal(resValid.body.status, "success");
  assert.ok(resValid.body.token);
  assert.ok(resValid.body.user);
  assert.equal(resValid.body.user.passwordHash, undefined); // Sensitive hash must not leak
});

test("GET /api/auth/demo/:role logs in valid clinical demo accounts", async () => {
  const res = await request(app).get("/api/auth/demo/doctor");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "success");
  assert.equal(res.body.user.role, "doctor");
  assert.ok(res.body.token);
});

test("Protected route GET /api/auth/me enforces HMAC token validation", async () => {
  // 1. Missing token
  const resNoAuth = await request(app).get("/api/auth/me");
  assert.equal(resNoAuth.status, 401);

  // 2. Forged / invalid token
  const resForged = await request(app)
    .get("/api/auth/me")
    .set("Authorization", "Bearer invalid.tampered.token");
  assert.equal(resForged.status, 401);

  // 3. Valid authenticated doctor session
  const loginRes = await request(app).get("/api/auth/demo/doctor");
  const token = loginRes.body.token;

  const resAuth = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${token}`);
  assert.equal(resAuth.status, 200);
  assert.equal(resAuth.body.status, "success");
  assert.equal(resAuth.body.user.email, "dr.sarah@quantumdx.ai");
});

test("Screenings history API allows saving and querying records", async () => {
  const recordPayload = {
    patientName: "Synthetic Regression Test Patient",
    disease: "early_stage_diabetes",
    classicalPred: 1,
    classicalProb: 0.92,
    quantumPred: 1,
    quantumProb: 0.81,
    consensusVerdict: "High Risk Confirmed (Dual Positive)",
  };

  const saveRes = await request(app)
    .post("/api/auth/screenings")
    .send(recordPayload);
  assert.equal(saveRes.status, 201);
  assert.equal(saveRes.body.status, "success");
  assert.ok(saveRes.body.record.id);

  const getRes = await request(app).get("/api/auth/screenings");
  assert.equal(getRes.status, 200);
  assert.ok(Array.isArray(getRes.body.screenings));
  assert.ok(getRes.body.screenings.length > 0);

  // Test deletion of synthetic test record via DELETE /api/auth/screenings/:id
  const savedId = saveRes.body.record.id;
  const deleteRes = await request(app).delete(`/api/auth/screenings/${savedId}`);
  assert.equal(deleteRes.status, 200);
  assert.equal(deleteRes.body.status, "success");

  // Verify deletion: querying deleted record should not return it or 404 on re-delete
  const deleteNotFound = await request(app).delete(`/api/auth/screenings/${savedId}`);
  assert.equal(deleteNotFound.status, 404);
});

test("Prediction route contracts: /api/dual-predict returns valid classical and quantum results", async () => {
  const diabetesInput = [
    60, "Male", "Yes", "Yes", "No", "Yes", "Yes", "No",
    "Yes", "Yes", "No", "Yes", "Yes", "No", "No", "No"
  ];

  const res = await request(app)
    .post("/api/dual-predict")
    .send({ disease: "early_stage_diabetes", features: diabetesInput });

  assert.equal(res.status, 200);
  assert.ok(res.body.classical, "Must return classical prediction");
  assert.ok(res.body.quantum, "Must return quantum prediction");

  // Verify classical structure
  assert.ok(typeof res.body.classical.prediction === "number");
  assert.ok(typeof res.body.classical.probability === "number");
  assert.ok(res.body.classical.probability >= 0 && res.body.classical.probability <= 1);

  // Verify quantum structure
  assert.ok(typeof res.body.quantum.prediction === "number");
  assert.ok(typeof res.body.quantum.probability === "number");
  assert.ok(res.body.quantum.probability >= 0 && res.body.quantum.probability <= 1);
  assert.ok(res.body.quantum.metadata);
  assert.equal(res.body.quantum.metadata.n_qubits, 4);
});

test("Prediction route contracts: /api/predict handles single classical query", async () => {
  const res = await request(app)
    .post("/api/predict")
    .send({
      disease: "heart_disease",
      features: [70, 1, 4, 130, 322, 0, 2, 109, 0, 2.4, 2, 3, 3]
    });

  assert.equal(res.status, 200);
  assert.ok(typeof res.body.prediction === "number");
  assert.ok(typeof res.body.probability === "number");
});

test("Prediction route contracts: /api/quantum-predict handles single quantum query", async () => {
  const res = await request(app)
    .post("/api/quantum-predict")
    .send({
      disease: "heart_disease",
      features: [70, 1, 4, 130, 322, 0, 2, 109, 0, 2.4, 2, 3, 3]
    });

  assert.equal(res.status, 200);
  assert.ok(typeof res.body.prediction === "number");
  assert.ok(typeof res.body.probability === "number");
  assert.ok(res.body.metadata);
});

test("GET /api/benchmarks returns benchmark dataset metrics", async () => {
  const res = await request(app).get("/api/benchmarks");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "success");
  assert.ok(res.body.benchmarks);
});

test("GET /api/dataset-samples returns verified clinical cohort samples", async () => {
  const res = await request(app).get("/api/dataset-samples");
  assert.equal(res.status, 200);
  assert.equal(res.body.status, "success");
  assert.ok(res.body.samples);
});
