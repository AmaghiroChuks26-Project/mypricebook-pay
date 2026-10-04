import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ArrowRight, Boxes, PackageSearch, Search, Sparkles, Tag, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/EmptyState";
import { Field } from "../components/ui/Field";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { getProducts } from "../lib/apiClient";
import { formatMoney } from "../lib/format";
import type { Product } from "../types";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

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

function getStatusTone(status: Product["status"]): "success" | "neutral" {
  return status === "active" ? "success" : "neutral";
}

function ProductCell({ product }: { product: Product }) {
  const meta = [product.brand ?? product.generic_name, product.dosage_form, product.strength]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="product-cell">
      <strong>{product.name}</strong>
      {meta ? <span>{meta}</span> : <span>{product.category}</span>}
    </div>
  );
}

export function PriceBookPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]["value"]>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          setLoading(true);
          setError(null);
          const payload = await getProducts(
            {
              search: searchTerm.trim() || undefined,
              category: categoryFilter !== "all" ? categoryFilter : undefined,
              status: statusFilter !== "all" ? statusFilter : undefined,
            },
            controller.signal,
          );
          setProducts(payload.items);
        } catch (caughtError) {
          if (controller.signal.aborted) return;
          const message = caughtError instanceof Error ? caughtError.message : "Unable to load your Price Book.";
          setError(message);
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      })();
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [categoryFilter, retryKey, searchTerm, statusFilter]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort((left, right) => left.localeCompare(right)),
    [products],
  );

  const metrics = useMemo(() => {
    const activeProducts = products.filter((product) => product.status === "active").length;
    const lowStockProducts = products.filter(
      (product) => product.status === "active" && product.stock.quantity <= product.stock.reorder_level,
    ).length;

    return [
      { label: "Products", value: String(products.length), detail: "catalog items", tone: "green", icon: <PackageSearch size={18} /> },
      { label: "Active products", value: String(activeProducts), detail: "ready to sell", tone: "blue", icon: <Sparkles size={18} /> },
      { label: "Low stock", value: String(lowStockProducts), detail: "below reorder level", tone: "amber", icon: <TrendingDown size={18} /> },
      { label: "Categories", value: String(categories.length), detail: "catalog groups", tone: "coral", icon: <Tag size={18} /> },
    ] as const;
  }, [categories.length, products]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="price-book-page">
      <PageHeader
        title="Price Book"
        description="Your products, prices and stock at a glance."
        action={
          <Button type="button" variant="primary" size="md" disabled>
            Add product
          </Button>
        }
      />

      <section className="price-book__stats" aria-label="Price book summary">
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            icon={metric.icon}
            tone={metric.tone}
          />
        ))}
      </section>

      <section className="price-book__toolbar surface" aria-label="Price book filters">
        <Field
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products, brands or generic names…"
          leadingIcon={<Search size={15} aria-hidden="true" />}
        />

        <div className="price-book__filters">
          <label className="field">
            <span className="field__label">Category</span>
            <select
              className="input price-book__select"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Status</span>
            <select
              className="input price-book__select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number]["value"])}
              aria-label="Filter by status"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {loading ? (
        <div className="table-panel">
          <LoadingState label="Loading Price Book..." />
        </div>
      ) : error ? (
        <div className="table-panel">
          <ErrorState
            title="Unable to load your Price Book."
            description="Check your connection and try again."
            onRetry={() => setRetryKey((current) => current + 1)}
          />
        </div>
      ) : products.length === 0 ? (
        <div className="table-panel">
          <EmptyState
            icon={<Boxes size={22} strokeWidth={1.7} />}
            title="No products found"
            description="Try another search or filter."
          />
        </div>
      ) : (
        <>
          <div className="price-book__desktop">
            <DataTable
              caption="Products in the current Price Book"
              rowKey={(product) => product.id}
              rows={products}
              columns={[
                {
                  key: "product",
                  label: "Product",
                  render: (product) => <ProductCell product={product} />,
                },
                {
                  key: "category",
                  label: "Category",
                  render: (product) => <span>{product.category}</span>,
                },
                {
                  key: "selling-price",
                  label: "Selling Price",
                  render: (product) => <span className="amount-cell">{formatMoney(product.pricing.selling_price_kobo)}</span>,
                  align: "right",
                },
                {
                  key: "cost-price",
                  label: "Cost Price",
                  render: (product) => <span className="amount-cell">{formatMoney(product.pricing.cost_price_kobo)}</span>,
                  align: "right",
                },
                {
                  key: "stock",
                  label: "Stock",
                  render: (product) => (
                    <div className="stock-cell">
                      <strong>{product.stock.quantity}</strong>
                      <span className={`stock-cell__status stock-cell__status--${getStockTone(product)}`}>
                        {getStockLabel(product)}
                      </span>
                    </div>
                  ),
                },
                {
                  key: "status",
                  label: "Status",
                  render: (product) => (
                    <Badge tone={getStatusTone(product.status)} dot={product.status === "active"}>
                      {product.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  ),
                },
                {
                  key: "action",
                  label: "Action",
                  render: (product) => (
                    <Link className="table-action" to={`/inventory/${product.id}`}>
                      View details
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ),
                  align: "right",
                },
              ]}
            />
          </div>

          <div className="price-book__mobile" aria-label="Products in a mobile-friendly list">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-card__header">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.brand ?? product.generic_name ?? product.category}</p>
                  </div>
                  <Badge tone={getStatusTone(product.status)} dot={product.status === "active"}>
                    {product.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="product-card__meta">
                  <div>
                    <span className="product-card__label">Selling price</span>
                    <strong>{formatMoney(product.pricing.selling_price_kobo)}</strong>
                  </div>
                  <div>
                    <span className="product-card__label">Stock</span>
                    <strong>{product.stock.quantity}</strong>
                  </div>
                </div>

                <div className="product-card__footer">
                  <span className={`stock-pill stock-pill--${getStockTone(product)}`}>{getStockLabel(product)}</span>
                  <Link className="table-action" to={`/inventory/${product.id}`}>
                    View details
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
