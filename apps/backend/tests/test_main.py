import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# --- Unit tests ---

def test_get_message_returns_200():
    response = client.get("/api/message")
    assert response.status_code == 200


def test_get_message_body():
    response = client.get("/api/message")
    data = response.json()
    assert data["message"] == "Hello from the Kargo demo API!"
    assert data["status"] == "ok"
    assert "version" in data


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


# --- Regression tests ---
# These guard against specific bugs or contract changes that have been
# caught before and must never regress.

def test_message_endpoint_returns_json():
    """Response must always be JSON, not plain text."""
    response = client.get("/api/message")
    assert response.headers["content-type"].startswith("application/json")


def test_message_has_required_fields():
    """API contract: message, version, and status must always be present."""
    response = client.get("/api/message")
    data = response.json()
    for field in ("message", "version", "status"):
        assert field in data, f"Missing required field: {field}"


def test_unknown_route_returns_404():
    """No catch-all routes — unknown paths must return 404."""
    response = client.get("/api/does-not-exist")
    assert response.status_code == 404
