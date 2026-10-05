from collections.abc import Callable
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import ProductRecord
from app.schemas.products import (
    ProductPricing,
    ProductResponse,
    ProductStatus,
    ProductStock,
)

SessionFactory = Callable[[], Session]


class PostgresProductRepository:
    """Read product snapshots from PostgreSQL through SQLAlchemy sessions."""

    def __init__(self, session_factory: SessionFactory) -> None:
        self._session_factory = session_factory

    def list_all(self) -> tuple[ProductResponse, ...]:
        statement = (
            select(ProductRecord)
            .options(
                selectinload(ProductRecord.pricing),
                selectinload(ProductRecord.inventory),
            )
            .order_by(ProductRecord.id)
        )
        with self._session_factory() as session:
            records = session.scalars(statement).all()
            return tuple(self._to_response(record) for record in records)

    def get_by_id(self, product_id: UUID) -> ProductResponse | None:
        statement = (
            select(ProductRecord)
            .where(ProductRecord.id == product_id)
            .options(
                selectinload(ProductRecord.pricing),
                selectinload(ProductRecord.inventory),
            )
        )
        with self._session_factory() as session:
            record = session.scalar(statement)
            return self._to_response(record) if record is not None else None

    @staticmethod
    def _to_response(record: ProductRecord) -> ProductResponse:
        if record.pricing is None or record.inventory is None:
            raise RuntimeError(f"Product {record.id} is missing pricing or inventory data")
        return ProductResponse(
            id=record.id,
            name=record.name,
            generic_name=record.generic_name,
            brand=record.brand,
            category=record.category,
            strength=record.strength,
            dosage_form=record.dosage_form,
            pack_size=record.pack_size,
            sku=record.sku,
            unit=record.unit,
            status=ProductStatus(record.status),
            pricing=ProductPricing(
                currency=record.pricing.currency,
                selling_price_kobo=record.pricing.selling_price_kobo,
                cost_price_kobo=record.pricing.cost_price_kobo,
            ),
            stock=ProductStock(
                quantity=record.inventory.quantity,
                reorder_level=record.inventory.reorder_level,
            ),
            created_at=record.created_at,
            updated_at=record.updated_at,
        )
