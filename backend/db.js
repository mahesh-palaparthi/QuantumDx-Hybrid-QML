const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_FILE = path.join(__dirname, "data", "quantumdx_db.json");

// Robust PBKDF2 Password Hashing (FIPS-compliant, zero external dependencies)
const PBKDF2_ROUNDS = 100000;
const LEGACY_ROUNDS = 1000;
const TOKEN_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "quantumdx-clinical-sec-key-2026-v1";
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function hashPassword(password, rounds = PBKDF2_ROUNDS) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, rounds, 64, "sha512").toString("hex");
  return `pbkdf2:${rounds}:${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  // Handle modern format: pbkdf2:rounds:salt:hash
  if (storedHash.startsWith("pbkdf2:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 4) return false;
    const rounds = parseInt(parts[1], 10) || PBKDF2_ROUNDS;
    const salt = parts[2];
    const originalHash = parts[3];
    const hash = crypto.pbkdf2Sync(password, salt, rounds, 64, "sha512").toString("hex");
    try {
      return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
    } catch {
      return hash === originalHash;
    }
  }
  // Handle legacy format: salt:hash (1000 rounds)
  if (storedHash.includes(":")) {
    const [salt, originalHash] = storedHash.split(":");
    const hash = crypto.pbkdf2Sync(password, salt, LEGACY_ROUNDS, 64, "sha512").toString("hex");
    try {
      return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
    } catch {
      return hash === originalHash;
    }
  }
  return false;
}

// Generate cryptographically signed HMAC-SHA256 session tokens with expiration
function signData(dataStr) {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(dataStr).digest("base64url");
}

function generateToken(user) {
  const now = Date.now();
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    issuedAt: now,
    exp: now + TOKEN_EXPIRY_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signData(payloadB64);
  return `${payloadB64}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  try {
    if (token.includes(".")) {
      const [payloadB64, signature] = token.split(".");
      const expectedSig = signData(payloadB64);
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expectedSig);
      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return null;
      }
      const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
      if (payload.exp && Date.now() > payload.exp) {
        return null;
      }
      return payload;
    }
    // Backward compatibility for transitional sessions:
    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    return payload;
  } catch (err) {
    return null;
  }
}

// Initialize Database structure and seed demo accounts
function getInitialData() {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: "usr-doctor-1",
        fullName: "Dr. Sarah Jenkins, MD",
        email: "dr.sarah@quantumdx.ai",
        phone: "+1 555-019-2834",
        passwordHash: hashPassword("doctor123"),
        role: "doctor",
        createdAt: now,
        profile: {
          hospitalName: "Metro General Health System",
          department: "Endocrinology & Diabetology",
        },
      },
      {
        id: "usr-researcher-1",
        fullName: "Prof. Alan Turing",
        email: "prof.alan@quantumdx.ai",
        phone: "+1 555-014-9821",
        passwordHash: hashPassword("research123"),
        role: "researcher",
        createdAt: now,
        profile: {
          institution: "Quantum Health AI Institute",
          researchArea: "Quantum Machine Learning & Bioinformatics",
        },
      },
      {
        id: "usr-patient-1",
        fullName: "Alex Mercer",
        email: "alex@quantumdx.ai",
        phone: "+1 555-012-7744",
        passwordHash: hashPassword("patient123"),
        role: "patient",
        createdAt: now,
        profile: {
          dob: "1986-04-12",
          gender: "Male",
        },
      },
    ],
    screenings: [
      {
        id: "scr-seed-1",
        userId: "usr-doctor-1",
        patientName: "Patient #1 (Row 0 - Atypical)",
        disease: "early_stage_diabetes",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        inputFeatures: {
          Age: "40",
          Gender: "Male",
          Polyuria: "No",
          Polydipsia: "Yes",
          sudden_weight_loss: "No",
          weakness: "Yes",
          Obesity: "Yes",
        },
        classicalPred: 1,
        classicalProb: 0.657,
        quantumPred: 0,
        quantumProb: 0.346,
        consensusVerdict: "Inconclusive (Safety Gate Active)",
        riskScore: 0.657,
        recommendedAction: "Mandatory 2-Hour OGTT + Venous HbA1c Lab Confirmation",
      },
      {
        id: "scr-seed-2",
        userId: "usr-doctor-1",
        patientName: "Patient #2 (Row 14 - Classic Onset)",
        disease: "early_stage_diabetes",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        inputFeatures: {
          Age: "60",
          Gender: "Male",
          Polyuria: "Yes",
          Polydipsia: "Yes",
          sudden_weight_loss: "No",
          weakness: "Yes",
          Polyphagia: "Yes",
        },
        classicalPred: 1,
        classicalProb: 0.969,
        quantumPred: 1,
        quantumProb: 0.940,
        consensusVerdict: "High Risk Confirmed (Dual Positive)",
        riskScore: 0.955,
        recommendedAction: "Urgent HbA1c blood draw + Endocrinologist referral",
      },
    ],
  };
}

function loadDb() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const init = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), "utf8");
      return init;
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading quantumdx_db.json, re-initializing:", err);
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const init = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), "utf8");
      return init;
    } catch (writeErr) {
      return getInitialData();
    }
  }
}

function saveDb(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing quantumdx_db.json:", err);
  }
}

// Public Database Methods
const db = {
  findUserByEmail(email) {
    if (!email) return null;
    const data = loadDb();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  findUserByIdentifier(identifier) {
    if (!identifier) return null;
    const data = loadDb();
    const clean = identifier.toLowerCase().trim();
    const cleanNoSpace = clean.replace(/\s+/g, "");
    return (
      data.users.find((u) => {
        const uEmail = (u.email || "").toLowerCase().trim();
        const uName = (u.fullName || "").toLowerCase().trim();
        const uNameNoSpace = uName.replace(/\s+/g, "");
        const uPhone = (u.phone || "").replace(/[\s\-+()]/g, "");
        const cleanPhone = clean.replace(/[\s\-+()]/g, "");
        return (
          uEmail === clean ||
          uName === clean ||
          uNameNoSpace === cleanNoSpace ||
          uName.split(/\s+/)[0] === clean ||
          (uPhone && cleanPhone && uPhone === cleanPhone)
        );
      }) || null
    );
  },

  findUserById(id) {
    const data = loadDb();
    return data.users.find((u) => u.id === id) || null;
  },

  createUser({ fullName, email, phone, password, role, profile = {} }) {
    const data = loadDb();
    const existing = data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: (phone || "").trim(),
      passwordHash: hashPassword(password),
      role: role || "patient",
      createdAt: new Date().toISOString(),
      profile: profile || {},
    };

    data.users.push(newUser);
    saveDb(data);
    return newUser;
  },

  verifyCredentials(identifier, password) {
    const user = this.findUserByIdentifier(identifier) || this.findUserByEmail(identifier);
    if (!user) return null;
    const isValid = verifyPassword(password, user.passwordHash);
    return isValid ? user : null;
  },

  saveScreeningRecord(record) {
    const data = loadDb();
    const newRecord = {
      id: `scr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...record,
    };
    data.screenings.unshift(newRecord);
    saveDb(data);
    return newRecord;
  },

  getScreeningHistory(userId = null, limit = 50) {
    const data = loadDb();
    if (!userId) return data.screenings.slice(0, limit);
    return data.screenings
      .filter((s) => !s.userId || s.userId === userId)
      .slice(0, limit);
  },

  clearScreeningHistory(userId = null) {
    const data = loadDb();
    if (!userId) {
      data.screenings = [];
    } else {
      data.screenings = data.screenings.filter((s) => s.userId !== userId);
    }
    saveDb(data);
    return true;
  },

  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
};

module.exports = db;
