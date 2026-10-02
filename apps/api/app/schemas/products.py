from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class ProductPricing(BaseModel):
    model_config = ConfigDict(frozen=True)

    currency: str = "NGN"
    selling_price_kobo: int = Field(ge=0)
    cost_price_kobo: int = Field(ge=0)

    @field_validator("currency")
    @classmethod
    def currency_must_be_ngn(cls, value: str) -> str:
        if value != "NGN":
            raise ValueError("currency must be NGN")
        return value


class ProductStock(BaseModel):
    model_config = ConfigDict(frozen=True)

    quantity: int = Field(ge=0)
    reorder_level: int = Field(ge=0)


class ProductResponse(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: UUID
    name: str = Field(min_length=1, max_length=160)
    generic_name: str | None = Field(default=None, max_length=160)
    brand: str | None = Field(default=None, max_length=120)
    category: str = Field(min_length=1, max_length=80)
    strength: str | None = Field(default=None, max_length=80)
    dosage_form: str | None = Field(default=None, max_length=80)
    pack_size: str | None = Field(default=None, max_length=80)
    sku: str = Field(min_length=1, max_length=64)
    unit: str = Field(min_length=1, max_length=40)
    status: ProductStatus
    pricing: ProductPricing
    stock: ProductStock
    created_at: datetime
    updated_at: datetime


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int = Field(ge=0)


class ProductFilters(BaseModel):
    search: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=80)
    status: ProductStatus | None = None

    @field_validator("search", "category")
    @classmethod
    def strip_filter_values(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        if not stripped:
            raise ValueError("filter value must not be blank")
        return stripped