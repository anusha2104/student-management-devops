
from app import app


def test_health_endpoint():
    client = app.test_client()
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_get_students_endpoint():
    client = app.test_client()
    response = client.get("/api/students")

    assert response.status_code == 200
    assert isinstance(response.get_json(), list)
