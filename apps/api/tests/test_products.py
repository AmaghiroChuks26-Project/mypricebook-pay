from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.main import app
from app.schemas.products import ProductPricing, ProductStock

client = TestClient(app)
FIRST_PRODUCT_ID = "00000000-0000-4000-8000-000000000001"


def test_list_products_returns_synthetic_products() -> None:
    response = client.get("/api/v1/products")

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 7
    assert body["items"][0]["id"] == FIRST_PRODUCT_ID
    assert body["items"][0]["pricing"]["currency"] == "NGN"


def test_get_product_returns_matching_product() -> None:
    response = client.get(f"/api/v1/products/{FIRST_PRODUCT_ID}")

    assert response.status_code == 200
    assert response.json()["id"] == FIRST_PRODUCT_ID
    assert response.json()["name"] == "Paracetamol 500 mg Tablets"


def test_unknown_product_returns_standard_error_envelope() -> None:
    response = client.get("/api/v1/products/00000000-0000-4000-8000-000000000099")

    assert response.status_code == 404
    assert response.json() == {
        "error": {"code": "http_error", "message": "Product not found"}
    }


def test_search_matches_product_name_or_generic_name() -> None:
    response = client.get("/api/v1/products", params={"search": "ascorbic"})

    assert response.status_code == 200
    assert [item["name"] for item in response.json()["items"]] == [
        "Vitamin C 1000 mg Tablets"
    ]


def test_category_filter_is_case_insensitive() -> None:
    response = client.get("/api/v1/products", params={"category": "antibiotics"})

    assert response.status_code == 200
    assert [item["category"] for item in response.json()["items"]] == ["Antibiotics"]


def test_status_filter_returns_only_active_products() -> None:
    response = client.get("/api/v1/products", params={"status": "active"})

    assert response.status_code == 200
    assert response.json()["total"] == 6
    assert all(item["status"] == "active" for item in response.json()["items"])


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("selling_price_kobo", -1),
        ("cost_price_kobo", -1),
    ],
)
def test_negative_prices_are_rejected(field: str, value: int) -> None:
    pricing = {"selling_price_kobo": 1, "cost_price_kobo": 1}
    pricing[field] = value

    with pytest.raises(ValidationError):
        ProductPricing(**pricing)


@pytest.mark.parametrize(("quantity", "reorder_level"), [(-1, 0), (0, -1)])
def test_negative_stock_or_reorder_level_is_rejected(
    quantity: int,
    reorder_level: int,
) -> None:
    with pytest.raises(ValidationError):
        ProductStock(quantity=quantity, reorder_level=reorder_level)


def test_product_id_in_demo_data_is_a_uuid() -> None:
    assert UUID(FIRST_PRODUCT_ID).version == 4