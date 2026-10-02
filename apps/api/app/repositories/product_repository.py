from typing import Protocol
from uuid import UUID

from app.data.demo_products import DEMO_PRODUCTS
from app.schemas.products import ProductResponse


class ProductRepository(Protocol):
    def list_all(self) -> tuple[ProductResponse, ...]: ...

    def get_by_id(self, product_id: UUID) -> ProductResponse | None: ...


class InMemoryProductRepository:
    """Temporary immutable repository for local development and API tests."""

    def __init__(self, products: tuple[ProductResponse, ...] = DEMO_PRODUCTS) -> None:
        self._products = products
        self._products_by_id = {product.id: product for product in products}

    def list_all(self) -> tuple[ProductResponse, ...]:
        return self._products

    def get_by_id(self, product_id: UUID) -> ProductResponse | None:
        return self._products_by_id.get(product_id)