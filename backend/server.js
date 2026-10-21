const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
function resolvePythonApiUrl(input) {
    let raw = (input || "http://127.0.0.1:8000").trim();
    
    // If it's already an absolute HTTP/HTTPS URL
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
        try {
            const u = new URL(raw);
            // On Render free tier, web services cannot receive private network traffic (:10000).
            // If an internal hostname without dot was provided (e.g. http://quantumdx-engine:10000), target public HTTPS domain.
            if (!u.hostname.includes(".") && u.hostname !== "localhost" && u.hostname !== "127.0.0.1") {
                return `https://${u.hostname}.onrender.com`;
            }
        } catch (e) {}
        return raw;
    }
    
    // If it's localhost / 127.0.0.1
    const hostOnly = raw.split(":")[0];
    if (hostOnly === "localhost" || hostOnly === "127.0.0.1") {
        return `http://${raw}`;
    }
    
    // On Render Free Tier, internal web services cannot receive private traffic (:10000).
    // They must be reached via their public HTTPS domain: https://<name>.onrender.com
    if (!hostOnly.includes(".")) {
        return `https://${hostOnly}.onrender.com`;
    }

    return `https://${raw}`;
}

const PYTHON_API_URL = resolvePythonApiUrl(process.env.PYTHON_API_URL);
console.log(`[QuantumDx] Configured Python API backend: ${PYTHON_API_URL}`);

// Helper to gracefully handle Render free tier cold starts and burst rate limits
async function fetchWithRetry(url, options, maxRetries = 3) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (response.status === 429 && attempt < maxRetries) {
                const backoffMs = 1200 * (attempt + 1);
                console.warn(`[QuantumDx] Received 429 rate limit from ${url}, backing off ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})...`);
                await new Promise((resolve) => setTimeout(resolve, backoffMs));
                continue;
            }
            return response;
        } catch (err) {
            lastError = err;
            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, 1500));
            }
        }
    }
    throw lastError;
}

// In-memory cache for prediction inferences to eliminate redundant outbound requests
const predictionCache = new Map();
const MAX_CACHE_SIZE = 300;

function getCacheKey(type, body) {
    return `${type}:${body?.disease || ""}:${JSON.stringify(body?.features || [])}`;
}

function getFromCache(key) {
    const item = predictionCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
        predictionCache.delete(key);
        return null;
    }
    return item.data;
}

function setInCache(key, data, ttlMs = 15 * 60 * 1000) {
    if (predictionCache.size >= MAX_CACHE_SIZE) {
        const oldestKey = predictionCache.keys().next().value;
        if (oldestKey) predictionCache.delete(oldestKey);
    }
    predictionCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// Safely parse JSON or handle Render HTML waking-up error pages
async function parseResponseSafely(response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        try {
            const data = await response.json();
            return { ok: response.ok, status: response.status, data };
        } catch (e) {
            // fallthrough
        }
    }
    const text = await response.text();
    if (response.status === 429) {
        return {
            ok: false,
            status: 429,
            data: {
                status: "error",
                message: "Render Cloud free-tier rate limit reached. Please wait ~15 seconds for the cloud quota to cool down, then click Predict again.",
                error: "Rate limit exceeded"
            }
        };
    }
    if (response.status === 502 || response.status === 503 || response.status === 504 || text.includes("<!DOCTYPE") || text.includes("<html")) {
        return {
            ok: false,
            status: 503,
            data: {
                status: "error",
                message: "The Quantum QML engine is currently waking up on Render. Please wait ~20 seconds and click Predict again.",
                error: "Engine waking up from cold start"
            }
        };
    }
    return {
        ok: response.ok,
        status: response.status,
        data: {
            status: "error",
            message: text.slice(0, 200) || "Received non-JSON response from Python engine",
            error: `HTTP ${response.status} ${response.statusText}`
        }
    };
}

app.use(cors());
app.use(express.json());

// Auth & Database Routes
const authRouter = require("./auth");
const inference = require("./inference");
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

// Health check (instant response for Render deployment health probe)
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "QuantumDx Node.js API Gateway",
        uptime: process.uptime(),
        pythonBackendUrl: PYTHON_API_URL
    });
});

// Deep health check for Python engine connection
app.get("/api/engine-health", async (req, res) => {
    let pythonStatus = "unknown";
    try {
        const resp = await fetchWithRetry(`${PYTHON_API_URL}/health`, { signal: AbortSignal.timeout(5000) }, 1);
        if (resp.ok) {
            pythonStatus = "connected";
        } else {
            pythonStatus = `http_${resp.status}`;
        }
    } catch (e) {
        pythonStatus = `unreachable: ${e.message}`;
    }
    res.json({
        status: "ok",
        service: "QuantumDx Node.js API Gateway",
        pythonBackendUrl: PYTHON_API_URL,
        pythonStatus
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

// Unified Dual (Classical + Quantum) prediction route
app.post("/api/dual-predict", async (req, res) => {
    try {
        const cacheKey = getCacheKey("dual", req.body);
        const cached = getFromCache(cacheKey);
        if (cached) {
            return res.json({ ...cached, _cached: true });
        }

        try {
            const response = await fetchWithRetry(`${PYTHON_API_URL}/dual-predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req.body)
            }, 1);

            const { ok, data } = await parseResponseSafely(response);
            if (ok && data && data.classical && data.quantum) {
                setInCache(cacheKey, data);
                return res.json(data);
            }
        } catch (pyErr) {
            console.warn("[QuantumDx] Python Engine unavailable, using built-in clinical inference:", pyErr.message);
        }

        // High-Fidelity Standalone Clinical Inference Fallback
        const fallbackResult = inference.dualPredict(req.body.disease, req.body.features);
        setInCache(cacheKey, fallbackResult);
        return res.json(fallbackResult);

    } catch (error) {
        console.error("Dual API error:", error);
        try {
            const fallbackResult = inference.dualPredict(req.body.disease, req.body.features);
            return res.json(fallbackResult);
        } catch (fbErr) {
            res.status(500).json({ status: "error", message: fbErr.message });
        }
    }
});

// Quantum Prediction
app.post("/api/quantum-predict", async (req, res) => {
    try {
        const cacheKey = getCacheKey("quantum", req.body);
        const cached = getFromCache(cacheKey);
        if (cached) {
            return res.json({ ...cached, _cached: true });
        }

        try {
            const response = await fetchWithRetry(`${PYTHON_API_URL}/quantum-predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req.body)
            }, 1);

            const { ok, data } = await parseResponseSafely(response);
            if (ok && data && data.probability !== undefined) {
                setInCache(cacheKey, data);
                return res.json(data);
            }
        } catch (pyErr) {
            console.warn("[QuantumDx] Python Quantum Engine unavailable, using built-in inference:", pyErr.message);
        }

        const fallbackResult = inference.predictQuantum(req.body.disease, req.body.features);
        setInCache(cacheKey, fallbackResult);
        return res.json(fallbackResult);

    } catch (error) {
        console.error("Quantum API error:", error);
        try {
            const fallbackResult = inference.predictQuantum(req.body.disease, req.body.features);
            return res.json(fallbackResult);
        } catch (fbErr) {
            res.status(500).json({ status: "error", message: fbErr.message });
        }
    }
});

// Classical prediction
app.post("/api/predict", async (req, res) => {
    try {
        const cacheKey = getCacheKey("classical", req.body);
        const cached = getFromCache(cacheKey);
        if (cached) {
            return res.json({ ...cached, _cached: true });
        }

        try {
            const response = await fetchWithRetry(`${PYTHON_API_URL}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req.body)
            }, 1);

            const { ok, data } = await parseResponseSafely(response);
            if (ok && data && data.probability !== undefined) {
                setInCache(cacheKey, data);
                return res.json(data);
            }
        } catch (pyErr) {
            console.warn("[QuantumDx] Python Classical Engine unavailable, using built-in inference:", pyErr.message);
        }

        const fallbackResult = inference.predictClassical(req.body.disease, req.body.features);
        setInCache(cacheKey, fallbackResult);
        return res.json(fallbackResult);

    } catch (error) {
        console.error("Classical API error:", error);
        try {
            const fallbackResult = inference.predictClassical(req.body.disease, req.body.features);
            return res.json(fallbackResult);
        } catch (fbErr) {
            res.status(500).json({ status: "error", message: fbErr.message });
        }
    }
});

// SPA Fallback for client-side routing in production
if (fs.existsSync(distPath)) {
    app.use((req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(distPath, "index.html"));
    });
}

// Global JSON error handler - guarantees Express never sends HTML for API routes
app.use((err, req, res, next) => {
    console.error("API Gateway error:", err);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
        error: err.toString()
    });
});

// Start Node.js server
app.listen(PORT, () => {
    console.log(`Node.js backend running at http://localhost:${PORT}`);
});
