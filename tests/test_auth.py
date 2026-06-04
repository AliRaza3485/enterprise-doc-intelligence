from fastapi.testclient import TestClient
import sys
sys.path.append("../backend")
from main import app

client = TestClient(app)

def test_register():
    response = client.post("/auth/register", json={
        "username": "testuser99",
        "email": "testuser99@test.com",  # naya email
        "password": "test123"
    })
    # Already registered bhi acceptable hai
    assert response.status_code in [200, 400]

def test_login():
    # Pehle register karo
    client.post("/auth/register", json={
        "username": "logintest",
        "email": "logintest@test.com",
        "password": "test123"
    })
    # Phir login karo
    response = client.post("/auth/login", json={
        "email": "logintest@test.com",
        "password": "test123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password():
    response = client.post("/auth/login", json={
        "email": "logintest@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 400