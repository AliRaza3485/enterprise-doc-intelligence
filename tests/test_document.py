from fastapi.testclient import TestClient
import sys
sys.path.append("../backend")
import os
from main import app

client = TestClient(app)


def get_token():
    # Register karo
    reg_response = client.post("/auth/register", json={
        "username": "doctest",
        "email": "doctest@test.com",
        "password": "test123"
    })
    
    # 200 ya 400 dono theek hain
    assert reg_response.status_code in [200, 400]
    
    # Login karo
    response = client.post("/auth/login", json={
        "email": "doctest@test.com",
        "password": "test123"
    })
    
    assert response.status_code == 200
    return response.json()["access_token"]
def test_upload_document():
    token = get_token()
    
    # Sahi path
    sample_path = os.path.join(
        os.path.dirname(__file__), 
        "sample.txt"
    )
    
    with open(sample_path, "w") as f:
        f.write("This is a test document about AI.")
    
    with open(sample_path, "rb") as f:
        response = client.post(
            f"/documents/upload?token={token}",
            files={"file": ("sample.txt", f, "text/plain")}
        )
    assert response.status_code == 200
   

def test_list_documents():
    token = get_token()
    response = client.get(f"/documents/list?token={token}")
    assert response.status_code == 200
    assert "documents" in response.json()