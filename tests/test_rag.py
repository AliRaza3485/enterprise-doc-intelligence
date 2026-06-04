from fastapi.testclient import TestClient
import sys
sys.path.append("../backend")
from main import app

client = TestClient(app)

def get_token():
    response = client.post("/auth/login", json={
        "email": "test123@test.com",
        "password": "test123"
    })
    return response.json()["access_token"]

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"
