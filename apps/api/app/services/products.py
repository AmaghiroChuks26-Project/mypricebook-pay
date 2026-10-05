from functools import lru_cache
from uuid import UUID

from app.core.config import get_settings
from app.db.session import get_session_factory
from app.repositories.product_repository import InMemoryProductRepository, ProductRepository
from app.repositories.postgres_product_repository import PostgresProductRepository
from app.schemas.products import (
    ProductFilters,
    ProductListResponse,
    ProductResponse,
)


class ProductService:
    def __init__(self, repository: ProductRepository) -> None:
        self._repository = repository

    def list_products(self, filters: ProductFilters) -> ProductListResponse:
        products = self._repository.list_all()
        if filters.search:
            search = filters.search.casefold()
            products = tuple(
                product
                for product in products
                if any(
                    search in value.casefold()
                    for value in (
                        product.name,
                        product.generic_name or "",
                        product.brand or "",
                        product.sku,
                    )
                )
            )
        if filters.category:
            category = filters.category.casefold()
            products = tuple(
                product for product in products if product.category.casefold() == category
            )
        if filters.status:
            products = tuple(product for product in products if product.status == filters.status)

        return ProductListResponse(items=list(products), total=len(products))

    def get_product(self, product_id: UUID) -> ProductResponse | None:
        return self._repository.get_by_id(product_id)


@lru_cache
def get_product_service() -> ProductService:
    settings = get_settings()
    if settings.database_url:
        repository: ProductRepository = PostgresProductRepository(get_session_factory())
    else:
        repository = InMemoryProductRepository()
    return ProductService(repository)