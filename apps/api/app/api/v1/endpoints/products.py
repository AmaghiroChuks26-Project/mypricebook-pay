from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query

from app.schemas.products import ProductFilters, ProductListResponse, ProductResponse
from app.services.products import ProductService, get_product_service

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductListResponse)
def list_products(
    filters: Annotated[ProductFilters, Query()],
    service: Annotated[ProductService, Depends(get_product_service)],
) -> ProductListResponse:
    return service.list_products(filters)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: UUID,
    service: Annotated[ProductService, Depends(get_product_service)],
) -> ProductResponse:
    product = service.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product