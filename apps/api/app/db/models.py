from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ProductRecord(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("status IN ('active', 'inactive')", name="ck_products_status"),
    )

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    generic_name: Mapped[str | None] = mapped_column(String(160))
    brand: Mapped[str | None] = mapped_column(String(120))
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    strength: Mapped[str | None] = mapped_column(String(80))
    dosage_form: Mapped[str | None] = mapped_column(String(80))
    pack_size: Mapped[str | None] = mapped_column(String(80))
    sku: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    unit: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    pricing: Mapped["ProductPricingRecord"] = relationship(
        back_populates="product", cascade="all, delete-orphan", uselist=False
    )
    inventory: Mapped["ProductInventoryRecord"] = relationship(
        back_populates="product", cascade="all, delete-orphan", uselist=False
    )


class ProductPricingRecord(Base):
    __tablename__ = "product_pricing"
    __table_args__ = (
        CheckConstraint("currency = 'NGN'", name="ck_product_pricing_currency"),
        CheckConstraint(
            "selling_price_kobo >= 0", name="ck_product_pricing_selling_price_nonnegative"
        ),
        CheckConstraint(
            "cost_price_kobo >= 0", name="ck_product_pricing_cost_price_nonnegative"
        ),
    )

    product_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    )
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="NGN")
    selling_price_kobo: Mapped[int] = mapped_column(BigInteger, nullable=False)
    cost_price_kobo: Mapped[int] = mapped_column(BigInteger, nullable=False)

    product: Mapped[ProductRecord] = relationship(back_populates="pricing")


class ProductInventoryRecord(Base):
    __tablename__ = "product_inventory"
    __table_args__ = (
        CheckConstraint("quantity >= 0", name="ck_product_inventory_quantity_nonnegative"),
        CheckConstraint(
            "reorder_level >= 0", name="ck_product_inventory_reorder_level_nonnegative"
        ),
    )

    product_id: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    reorder_level: Mapped[int] = mapped_column(Integer, nullable=False)

    product: Mapped[ProductRecord] = relationship(back_populates="inventory")
