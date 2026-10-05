from collections.abc import Callable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.data.demo_products import DEMO_PRODUCTS
from app.db.models import ProductInventoryRecord, ProductPricingRecord, ProductRecord
from app.db.session import get_session_factory

SessionFactory = Callable[[], Session]


def seed_demo_products(session_factory: SessionFactory | None = None) -> int:
    factory = session_factory or get_session_factory()
    inserted = 0
    with factory() as session:
        with session.begin():
            for demo in DEMO_PRODUCTS:
                exists = session.scalar(
                    select(ProductRecord.id).where(ProductRecord.id == demo.id)
                )
                if exists is not None:
                    continue
                session.add(
                    ProductRecord(
                        id=demo.id,
                        name=demo.name,
                        generic_name=demo.generic_name,
                        brand=demo.brand,
                        category=demo.category,
                        strength=demo.strength,
                        dosage_form=demo.dosage_form,
                        pack_size=demo.pack_size,
                        sku=demo.sku,
                        unit=demo.unit,
                        status=demo.status.value,
                        created_at=demo.created_at,
                        updated_at=demo.updated_at,
                        pricing=ProductPricingRecord(
                            currency=demo.pricing.currency,
                            selling_price_kobo=demo.pricing.selling_price_kobo,
                            cost_price_kobo=demo.pricing.cost_price_kobo,
                        ),
                        inventory=ProductInventoryRecord(
                            quantity=demo.stock.quantity,
                            reorder_level=demo.stock.reorder_level,
                        ),
                    )
                )
                inserted += 1
    return inserted


def main() -> None:
    count = seed_demo_products()
    print(f"Seeded {count} synthetic demo products.")


if __name__ == "__main__":
    main()
