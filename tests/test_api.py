import asyncio
import pytest
from pydantic import ValidationError
from python_api import (
    health,
    root,
    predict,
    quantum_predict,
    dual_predict,
    demo_patient,
    PredictionRequest,
    resolve_disease,
)


def test_root_endpoint():
    res = root()
    assert res["status"] == "success"
    assert "Hybrid QML" in res["message"]


def test_health_endpoint():
    res = health()
    assert res["status"] == "ok"
    assert res["service"] == "Python FastAPI"
    assert "BreastCancer" in res["classical_predictor"]


def test_resolve_disease_aliases():
    assert resolve_disease(PredictionRequest(features=[1.0] * 16, disease="diabetes")) == "early_stage_diabetes"
    assert resolve_disease(PredictionRequest(features=[1.0] * 13, disease="heart")) == "heart_disease"
    assert resolve_disease(PredictionRequest(features=[1.0] * 30, disease="cancer")) == "breast_cancer"
    assert resolve_disease(PredictionRequest(features=[1.0] * 6, disease="malnutrition")) == "child_malnutrition"


def test_prediction_request_validation():
    with pytest.raises(ValidationError):
        PredictionRequest(features=[])


def test_classical_predict_diabetes():
    features = [60, "Male", "Yes", "Yes", "No", "Yes", "Yes", "No", "Yes", "Yes", "No", "Yes", "Yes", "No", "No", "No"]
    req = PredictionRequest(features=features, disease="early_stage_diabetes")
    res = predict(req)
    assert res["prediction"] in (0, 1)
    assert 0.0 <= res["probability"] <= 1.0
    assert 0.0 <= res["risk_score"] <= 1.0
    assert 0.0 <= res["healthy_confidence"] <= 1.0
    assert "accuracy" in res


def test_classical_predict_heart():
    features = [70, 1, 4, 130, 322, 0, 2, 109, 0, 2.4, 2, 3, 3]
    req = PredictionRequest(features=features, disease="heart_disease")
    res = predict(req)
    assert res["prediction"] in (0, 1)
    assert 0.0 <= res["probability"] <= 1.0


def test_classical_predict_child_malnutrition():
    features = [18, "M", 10.0, 80.0, 135.0, "No"]
    req = PredictionRequest(features=features, disease="child_malnutrition")
    res = predict(req)
    assert res["prediction"] in (0, 1)
    assert 0.0 <= res["probability"] <= 1.0


def test_quantum_predict_diabetes():
    features = [60, "Male", "Yes", "Yes", "No", "Yes", "Yes", "No", "Yes", "Yes", "No", "Yes", "Yes", "No", "No", "No"]
    req = PredictionRequest(features=features, disease="early_stage_diabetes")
    res = asyncio.run(quantum_predict(req))
    assert res["prediction"] in (0, 1)
    assert 0.0 <= res["probability"] <= 1.0
    assert "metadata" in res
    assert res["metadata"]["n_qubits"] == 4


def test_quantum_predict_child_malnutrition():
    features = [18, "M", 10.0, 80.0, 135.0, "No"]
    req = PredictionRequest(features=features, disease="child_malnutrition")
    res = asyncio.run(quantum_predict(req))
    assert res["prediction"] in (0, 1)
    assert 0.0 <= res["probability"] <= 1.0
    assert "metadata" in res
    assert res["metadata"]["n_qubits"] == 4


def test_dual_predict_endpoint():
    features = [70, 1, 4, 130, 322, 0, 2, 109, 0, 2.4, 2, 3, 3]
    req = PredictionRequest(features=features, disease="heart_disease")
    res = asyncio.run(dual_predict(req))
    assert "classical" in res
    assert "quantum" in res
    assert res["classical"]["prediction"] in (0, 1)
    assert res["quantum"]["prediction"] in (0, 1)


def test_demo_patient_endpoint():
    res = demo_patient(disease="heart_disease")
    assert res["disease"] == "heart_disease"
    assert len(res["features"]) == 13
    assert res["actual_label"] in (0, 1)
