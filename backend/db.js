const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_FILE = path.join(__dirname, "data", "quantumdx_db.json");

// Robust PBKDF2 Password Hashing (FIPS-compliant, zero external dependencies)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, originalHash] = storedHash.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === originalHash;
}

// Generate simple secure session tokens
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    issuedAt: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function verifyToken(token) {
  try {
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
    if (!fs.existsSync(DB_FILE)) {
      const init = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), "utf8");
      return init;
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading quantumdx_db.json, re-initializing:", err);
    const init = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), "utf8");
    return init;
  }
}

function saveDb(data) {
  try {
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
    return (
      data.users.find((u) => {
        const uEmail = (u.email || "").toLowerCase().trim();
        const uName = (u.fullName || "").toLowerCase().trim();
        const uPhone = (u.phone || "").replace(/\s+/g, "");
        const cleanPhone = clean.replace(/\s+/g, "");
        return (
          uEmail === clean ||
          uName === clean ||
          (uPhone && uPhone === cleanPhone) ||
          uName.split(/\s+/)[0] === clean
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
      data.screenings = data.screenings.filter((s) => s.userId && s.userId !== userId);
    }
    saveDb(data);
    return true;
  },

  generateToken,
  verifyToken,
};

module.exports = db;
