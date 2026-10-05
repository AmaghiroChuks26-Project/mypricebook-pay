"""Create product catalog, pricing, and inventory tables.

Revision ID: 20261004_0001
Revises:
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20261004_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("id", sa.Uuid(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("generic_name", sa.String(length=160), nullable=True),
        sa.Column("brand", sa.String(length=120), nullable=True),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("strength", sa.String(length=80), nullable=True),
        sa.Column("dosage_form", sa.String(length=80), nullable=True),
        sa.Column("pack_size", sa.String(length=80), nullable=True),
        sa.Column("sku", sa.String(length=64), nullable=False),
        sa.Column("unit", sa.String(length=40), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.CheckConstraint(
            "status IN ('active', 'inactive')", name="ck_products_status"
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("sku"),
    )
    op.create_table(
        "product_pricing",
        sa.Column("product_id", sa.Uuid(as_uuid=True), nullable=False),
        sa.Column("currency", sa.String(length=3), server_default="NGN", nullable=False),
        sa.Column("selling_price_kobo", sa.BigInteger(), nullable=False),
        sa.Column("cost_price_kobo", sa.BigInteger(), nullable=False),
        sa.CheckConstraint("currency = 'NGN'", name="ck_product_pricing_currency"),
        sa.CheckConstraint(
            "selling_price_kobo >= 0",
            name="ck_product_pricing_selling_price_nonnegative",
        ),
        sa.CheckConstraint(
            "cost_price_kobo >= 0",
            name="ck_product_pricing_cost_price_nonnegative",
        ),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("product_id"),
    )
    op.create_table(
        "product_inventory",
        sa.Column("product_id", sa.Uuid(as_uuid=True), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("reorder_level", sa.Integer(), nullable=False),
        sa.CheckConstraint(
            "quantity >= 0", name="ck_product_inventory_quantity_nonnegative"
        ),
        sa.CheckConstraint(
            "reorder_level >= 0",
            name="ck_product_inventory_reorder_level_nonnegative",
        ),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("product_id"),
    )


def downgrade() -> None:
    op.drop_table("product_inventory")
    op.drop_table("product_pricing")
    op.drop_table("products")
