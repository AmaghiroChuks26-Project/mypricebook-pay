import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { ErrorState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { getProductById } from "../lib/apiClient";
import { formatMoney } from "../lib/format";
import type { Product } from "../types";

function getStockTone(product: Product): "success" | "warning" | "danger" {
  if (product.stock.quantity === 0) return "danger";
  if (product.stock.quantity <= product.stock.reorder_level) return "warning";
  return "success";
}

function getStockLabel(product: Product): string {
  if (product.stock.quantity === 0) return "Out of stock";
  if (product.stock.quantity <= product.stock.reorder_level) return "Low stock";
  return "Healthy stock";
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Product not found.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        setLoading(true);
        setError(null);
        const nextProduct = await getProductById(productId, controller.signal);
        setProduct(nextProduct);
      } catch (caughtError) {
        if (controller.signal.aborted) return;
        setError(caughtError instanceof Error ? caughtError.message : "Unable to load product details.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [productId]);

  return (
    <div className="product-detail-page">
      <PageHeader
        title={product?.name ?? "Product details"}
        description={product ? "Full product details from the current catalog." : "Loading product details..."}
        action={
          <Link className="button button--outline button--md" to="/inventory">
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Price Book
          </Link>
        }
      />

      {loading ? (
        <div className="table-panel">
          <LoadingState label="Loading product details..." />
        </div>
      ) : error ? (
        <div className="table-panel">
          <ErrorState
            title="Unable to load this product."
            description="Check your connection and try again."
            onRetry={() => window.location.reload()}
          />
        </div>
      ) : product ? (
        <>
          <section className="product-detail__hero surface">
            <div>
              <p className="eyebrow">Product</p>
              <h2>{product.name}</h2>
              <p className="product-detail__subtitle">
                {product.brand ?? product.generic_name ?? "Unbranded"} • {product.category}
              </p>
            </div>
            <div className="product-detail__status-block">
              <Badge tone={product.status === "active" ? "success" : "neutral"} dot={product.status === "active"}>
                {product.status === "active" ? "Active" : "Inactive"}
              </Badge>
              <span className={`stock-pill stock-pill--${getStockTone(product)}`}>{getStockLabel(product)}</span>
            </div>
          </section>

          <section className="product-detail__grid">
            <article className="surface product-detail__card">
              <h3>Product information</h3>
              <dl className="product-detail__list">
                <div><dt>Generic name</dt><dd>{product.generic_name ?? "—"}</dd></div>
                <div><dt>Brand</dt><dd>{product.brand ?? "—"}</dd></div>
                <div><dt>Category</dt><dd>{product.category}</dd></div>
                <div><dt>Strength</dt><dd>{product.strength ?? "—"}</dd></div>
                <div><dt>Dosage form</dt><dd>{product.dosage_form ?? "—"}</dd></div>
                <div><dt>Pack size</dt><dd>{product.pack_size ?? "—"}</dd></div>
                <div><dt>SKU</dt><dd>{product.sku}</dd></div>
                <div><dt>Unit</dt><dd>{product.unit}</dd></div>
              </dl>
            </article>

            <article className="surface product-detail__card">
              <h3>Pricing & stock</h3>
              <dl className="product-detail__list">
                <div><dt>Selling price</dt><dd>{formatMoney(product.pricing.selling_price_kobo)}</dd></div>
                <div><dt>Cost price</dt><dd>{formatMoney(product.pricing.cost_price_kobo)}</dd></div>
                <div><dt>Stock quantity</dt><dd>{product.stock.quantity}</dd></div>
                <div><dt>Reorder level</dt><dd>{product.stock.reorder_level}</dd></div>
                <div><dt>Stock status</dt><dd>{getStockLabel(product)}</dd></div>
              </dl>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
