from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint_reports_healthy() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_local_web_origin_is_allowed_by_cors() -> None:
    response = client.options(
        "/api/v1/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_http_errors_use_the_standard_error_envelope() -> None:
    response = client.get("/api/v1/missing")

    assert response.status_code == 404
    assert response.json() == {
        "error": {"code": "http_error", "message": "Not Found"}
    }