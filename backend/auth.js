const express = require("express");
const db = require("./db");

const router = express.Router();

// Helper to extract sanitized user object without password hash
function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

// Middleware to extract user from Authorization header
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "error", message: "Authorization token required" });
  }
  const token = authHeader.split(" ")[1];
  const payload = db.verifyToken(token);
  if (!payload || !payload.userId) {
    return res.status(401).json({ status: "error", message: "Invalid or expired token" });
  }
  const user = db.findUserById(payload.userId);
  if (!user) {
    return res.status(401).json({ status: "error", message: "User account not found" });
  }
  req.user = user;
  next();
}

// 1. REGISTER
router.post("/register", (req, res) => {
  try {
    const { fullName, email, phone, password, role, profile } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Full Name, Email Address, and Password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long.",
      });
    }

    const newUser = db.createUser({
      fullName,
      email,
      phone,
      password,
      role: role || "patient",
      profile: profile || {},
    });

    const token = db.generateToken(newUser);

    res.status(201).json({
      status: "success",
      message: `Welcome to QuantumDx, ${newUser.fullName}! Account created successfully.`,
      token,
      user: sanitizeUser(newUser),
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ status: "error", message: err.message });
  }
});

// 2. LOGIN
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both email address and password.",
      });
    }

    const user = db.verifyCredentials(email, password);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password. Please check your credentials.",
      });
    }

    const token = db.generateToken(user);
    res.json({
      status: "success",
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: "error", message: "Login processing failed" });
  }
});

// 3. GET CURRENT USER PROFILE
router.get("/me", requireAuth, (req, res) => {
  res.json({
    status: "success",
    user: sanitizeUser(req.user),
  });
});

// 4. DEMO QUICK LOGIN (1-Click for Viva Evaluation)
router.get("/demo/:role", (req, res) => {
  const role = req.params.role.toLowerCase();
  let email = "dr.sarah@quantumdx.ai";
  if (role === "researcher") email = "prof.alan@quantumdx.ai";
  if (role === "patient") email = "alex@quantumdx.ai";

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ status: "error", message: `Demo account for ${role} not found.` });
  }

  const token = db.generateToken(user);
  res.json({
    status: "success",
    message: `Logged in as demo ${user.role}: ${user.fullName}`,
    token,
    user: sanitizeUser(user),
  });
});

// 5. SAVE SCREENING RECORD
router.post("/screenings", (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const payload = db.verifyToken(authHeader.split(" ")[1]);
      if (payload) userId = payload.userId;
    }

    const record = db.saveScreeningRecord({
      userId,
      ...req.body,
    });

    res.status(201).json({
      status: "success",
      message: "Patient screening record saved to QuantumDx database.",
      record,
    });
  } catch (err) {
    console.error("Save screening error:", err);
    res.status(500).json({ status: "error", message: "Failed to save screening record" });
  }
});

// 6. GET SCREENING HISTORY
router.get("/screenings", (req, res) => {
  try {
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const payload = db.verifyToken(authHeader.split(" ")[1]);
      if (payload) userId = payload.userId;
    }

    const history = db.getScreeningHistory(userId);
    res.json({
      status: "success",
      count: history.length,
      screenings: history,
    });
  } catch (err) {
    console.error("Get screenings error:", err);
    res.status(500).json({ status: "error", message: "Failed to retrieve screening history" });
  }
});

module.exports = router;
