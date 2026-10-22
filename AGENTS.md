# QUANTUMDX / QUREX — AGENT WORKSPACE RULES & CLINICAL SAFEGUARDS

## 1. Safety & Behavioral Invariants
- **Inspect Before Editing**: Always inspect relevant files, active dependencies, and current Git status before making modifications.
- **Preserve Existing Architecture & Features**: Do not replace or refactor existing working architecture, models, or UX flows without explicit user permission.
- **Minimal, Explainable & Reversible Changes**: Keep edits scoped, atomic, and thoroughly explained. Never perform broad untested refactors.
- **Zero Secret Exposure**: Never write or expose real API keys, credentials, JWT secrets, patient identifiers, or private tokens in logs, commits, or tests.
- **Non-Destructive Operations**: Never run destructive Git commands (`git reset --hard`, `git clean -fd`, `git checkout .`, `git rebase`). Never delete data files or overwrite database records.
- **No Model Replacement**: Never alter model weights in `models_weights.json` or swap ML/QML algorithms without explicit approval.
- **Honest Verification**: Never fabricate test output or claim a defect is resolved without running concrete verification commands and inspecting output.

## 2. Testing & Verification Standards
- Run relevant unit and integration tests before and after making changes:
  - Backend: `npm run test:backend` (Executes `backend/test_api.js` via Node test runner)
  - Frontend Lint: `npm run test:frontend` (Executes ESLint in `frontend/`)
  - Python Stack: `.venv\Scripts\python.exe -m pytest -v` (Tests pipeline and FastAPI endpoints)
  - Complete Suite: `npm test` from repository root
- Distinguish pre-existing test warnings from newly introduced failures.

## 3. Clinical Gating & Healthcare Responsibility
- Treat disease predictions as high-stakes decision support outputs.
- Retain the 3-tier clinical consensus safety gate:
  - Dual Positive: High Risk Confirmed
  - Dual Negative: Healthy Baselines Confirmed
  - Opposing or Divergent: Inconclusive Review / Safety Gate Active (requires clinical follow-up)
- Never hardcode or calibrate confidence scores simply to create convincing UI output.
- All patient examples in automated tests must use deterministic synthetic test fixtures, never real identifiable patient health information (PHI).
