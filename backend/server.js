const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

app.use(cors());
app.use(express.json());

// Auth & Database Routes
const authRouter = require("./auth");
app.use("/api/auth", authRouter);

// Serve built frontend in production if dist exists
const distPath = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

// Home API info
app.get("/api", (req, res) => {
    res.json({
        status: "success",
        message: "QuantumDx Hybrid QML API Gateway is running",
        pythonBackend: PYTHON_API_URL
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "Node.js API",
        pythonBackend: "Connected"
    });
});

// All benchmark results
app.get("/api/benchmarks", (req, res) => {
    try {
        const resultsDir = path.join(__dirname, "..", "results");
        if (!fs.existsSync(resultsDir)) {
            return res.json({ status: "success", benchmarks: {} });
        }
        const files = fs.readdirSync(resultsDir).filter(f => f.endsWith(".json"));
        const benchmarks = {};
        for (const file of files) {
            try {
                const content = fs.readFileSync(path.join(resultsDir, file), "utf8");
                const data = JSON.parse(content);
                const key = file.replace(".json", "");
                benchmarks[key] = data;
            } catch (err) {
                console.error("Error reading benchmark file:", file, err);
            }
        }
        res.json({
            status: "success",
            benchmarks
        });
    } catch (err) {
        console.error("Error loading benchmarks:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Verified Clinical Dataset Samples
app.get("/api/dataset-samples", (req, res) => {
    try {
        const samplesPath = path.join(__dirname, "..", "frontend", "src", "verified_samples.json");
        if (fs.existsSync(samplesPath)) {
            const data = JSON.parse(fs.readFileSync(samplesPath, "utf8"));
            return res.json({ status: "success", samples: data });
        }
        res.json({ status: "success", samples: {} });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Prediction
app.post("/api/quantum-predict", async (req, res) => {
    try {
        const response = await fetch(`${PYTHON_API_URL}/quantum-predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error("Python Quantum API error:", error);

        res.status(500).json({
            status: "error",
            message: "Could not connect to Quantum Python API",
            error: error.message
        });
    }
});
// Classical prediction
app.post("/api/predict", async (req, res) => {
    try {
        const response = await fetch(`${PYTHON_API_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error("Python Classical API error:", error);

        res.status(500).json({
            status: "error",
            message: "Could not connect to Classical Python API",
            error: error.message
        });
    }
});

// SPA Fallback for client-side routing in production
if (fs.existsSync(distPath)) {
    app.use((req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(distPath, "index.html"));
    });
}

// Start Node.js server
app.listen(PORT, () => {
    console.log(`Node.js backend running at http://localhost:${PORT}`);
});
