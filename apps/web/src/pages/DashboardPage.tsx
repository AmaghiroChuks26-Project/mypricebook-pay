import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CircleAlert,
  Clock3,
  CreditCard,
  Ellipsis,
  Package,
  Plus,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { DataTable, type TableColumn } from "../components/ui/DataTable";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { demoLowStock, demoSummary, demoTransactions, demoTrend } from "../lib/demoData";
import { formatMoney, formatNumber } from "../lib/format";
import type { BadgeTone, PaymentStatus, Transaction } from "../types";

const statusTone: Record<PaymentStatus, BadgeTone> = {
  Paid: "success",
  Pending: "warning",
  Failed: "danger",
};

const transactionColumns: TableColumn<Transaction>[] = [
  {
    key: "reference",
    label: "Sale",
    render: (transaction) => (
      <span className="transaction-name">
        <strong>{transaction.reference}</strong>
        <span>{transaction.description}</span>
      </span>
    ),
  },
  { key: "time", label: "Time", render: (transaction) => transaction.time },
  {
    key: "status",
    label: "Status",
    render: (transaction) => <Badge tone={statusTone[transaction.status]} dot>{transaction.status}</Badge>,
  },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    render: (transaction) => <strong className="amount-cell">{formatMoney(transaction.amountKobo)}</strong>,
  },
];

function SalesTrend() {
  const maxAmount = Math.max(...demoTrend.map((point) => point.amountKobo));

  return (
    <Card className="trend-card">
      <div className="panel-heading">
        <div>
          <p className="panel-eyebrow">SALES ACTIVITY</p>
          <h2>Sales trend</h2>
        </div>
        <button className="icon-button panel-menu" aria-label="More sales trend options" title="Options are not available in the demo" disabled>
          <Ellipsis size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="trend-summary">
        <strong>{formatMoney(demoSummary.weeklyRevenueKobo)}</strong>
        <span className="trend-summary__period">This week</span>
        <span className="trend-change"><ArrowUpRight size={14} aria-hidden="true" /> 12.8%</span>
      </div>
      <div className="trend-chart" role="img" aria-label="Daily sales from Friday to Thursday, trending upward to 482,350 naira today">
        <div className="trend-chart__guides" aria-hidden="true"><i /><i /><i /></div>
        <div className="trend-chart__bars" aria-hidden="true">
          {demoTrend.map((point, index) => (
            <div className="trend-chart__column" key={point.day}>
              <span
                className={`trend-chart__bar ${index === demoTrend.length - 1 ? "trend-chart__bar--today" : ""}`}
                style={{ height: `${Math.max(12, (point.amountKobo / maxAmount) * 100)}%` }}
                title={`${point.day}: ${formatMoney(point.amountKobo)}`}
              />
              <span className={index === demoTrend.length - 1 ? "is-current-day" : ""}>{point.day}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="trend-legend"><span /><span>Confirmed sales</span></div>
    </Card>
  );
}

function LowStockPanel() {
  return (
    <Card className="stock-card">
      <div className="panel-heading">
        <div>
          <p className="panel-eyebrow">NEEDS ATTENTION</p>
          <h2>Low stock <span className="heading-count">{demoLowStock.length}</span></h2>
        </div>
        <Link className="icon-button panel-link" to="/inventory" aria-label="View all inventory">
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <ul className="stock-list">
        {demoLowStock.map((product) => (
          <li className="stock-item" key={product.id}>
            <span className="stock-item__icon" aria-hidden="true"><Package size={17} /></span>
            <span className="stock-item__main">
              <strong>{product.name}</strong>
              <span>{product.category} · reorder at {product.reorderAt}</span>
            </span>
            <Badge tone={product.quantity <= 4 ? "danger" : "warning"}>{product.quantity} left</Badge>
          </li>
        ))}
      </ul>
      <Link className="panel-footer-link" to="/inventory">View inventory <ArrowRight size={15} aria-hidden="true" /></Link>
    </Card>
  );
}

function InventorySummary() {
  return (
    <Card className="inventory-summary">
      <div className="panel-heading">
        <div>
          <p className="panel-eyebrow">INVENTORY</p>
          <h2>Stock overview</h2>
        </div>
        <span className="stat-card__icon stat-card__icon--green" aria-hidden="true"><Boxes size={19} /></span>
      </div>
      <p className="inventory-summary__value">{formatNumber(demoSummary.inventoryUnits)} <span>units on hand</span></p>
      <div className="inventory-summary__rule" />
      <div className="inventory-summary__bottom">
        <span>Estimated stock value</span>
        <strong>{formatMoney(demoSummary.inventoryValueKobo)}</strong>
      </div>
      <div className="inventory-summary__alert"><CircleAlert size={15} aria-hidden="true" /> {demoSummary.lowStockCount} products below reorder level</div>
    </Card>
  );
}

function PaymentSummary() {
  const segments = [
    { label: "Paid", value: demoSummary.paidPercent, tone: "paid" },
    { label: "Pending", value: demoSummary.pendingPercent, tone: "pending" },
    { label: "Failed", value: demoSummary.failedPercent, tone: "failed" },
  ];

  return (
    <Card className="payment-summary">
      <div className="panel-heading">
        <div>
          <p className="panel-eyebrow">PAYMENTS</p>
          <h2>Payment status</h2>
        </div>
        <CreditCard className="panel-muted-icon" size={19} aria-hidden="true" />
      </div>
      <div className="payment-summary__meter" role="img" aria-label="86 percent paid, 9 percent pending, 5 percent failed">
        {segments.map((segment) => (
          <span key={segment.label} className={`payment-summary__segment payment-summary__segment--${segment.tone}`} style={{ width: `${segment.value}%` }} />
        ))}
      </div>
      <ul className="payment-summary__legend">
        {segments.map((segment) => (
          <li key={segment.label}>
            <span className={`legend-dot legend-dot--${segment.tone}`} aria-hidden="true" />
            <span>{segment.label}</span>
            <strong>{segment.value}%</strong>
          </li>
        ))}
      </ul>
      <div className="payment-summary__note"><Clock3 size={15} aria-hidden="true" /> Pending amounts are not included in revenue</div>
    </Card>
  );
}

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow="THURSDAY, 1 OCTOBER 2026"
        title="Good morning, shop owner"
        description="Here’s what’s happening at your shop today."
        action={
          <button className="button button--primary button--md" type="button" title="Sales creation is not connected in the demo" disabled>
            <Plus size={17} aria-hidden="true" /><span>New sale</span>
          </button>
        }
      />

      <div className="demo-banner" role="note">
        <span className="demo-banner__badge">DEMO</span>
        <span>Sample figures for a fictional shop. No real customer or payment data.</span>
      </div>

      <section className="stats-grid" aria-label="Today's business summary">
        <StatCard
          label="Revenue today"
          value={formatMoney(demoSummary.revenueKobo)}
          detail={<><span className="stat-up"><TrendingUp size={13} aria-hidden="true" /> {demoSummary.revenueChangePercent}%</span> vs yesterday</>}
          icon={<CreditCard size={19} />}
          tone="green"
        />
        <StatCard
          label="Today's sales"
          value={formatNumber(demoSummary.salesCount)}
          detail={`Sales confirmed today`}
          icon={<ReceiptText size={19} />}
          tone="blue"
        />
        <StatCard
          label="Pending payments"
          value={formatNumber(demoSummary.pendingCount)}
          detail={`${formatMoney(demoSummary.pendingAmountKobo)} awaiting confirmation`}
          icon={<Clock3 size={19} />}
          tone="amber"
        />
        <StatCard
          label="Low-stock products"
          value={formatNumber(demoSummary.lowStockCount)}
          detail="Below their reorder level"
          icon={<Package size={19} />}
          tone="coral"
        />
      </section>

      <section className="dashboard-grid dashboard-grid--primary" aria-label="Sales and stock activity">
        <SalesTrend />
        <LowStockPanel />
      </section>

      <section className="dashboard-grid dashboard-grid--secondary" aria-label="Inventory and payment summaries">
        <InventorySummary />
        <PaymentSummary />
      </section>

      <Card className="transactions-card">
        <div className="panel-heading transactions-card__heading">
          <div>
            <p className="panel-eyebrow">LATEST ACTIVITY</p>
            <h2>Recent transactions</h2>
          </div>
          <Link className="panel-footer-link panel-footer-link--heading" to="/sales">View all sales <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <DataTable
          caption="Recent demo sales and their payment status"
          columns={transactionColumns}
          rows={demoTransactions}
          rowKey={(transaction) => transaction.id}
        />
      </Card>

      <footer className="dashboard-footer">
        <span>Demo workspace · Figures are illustrative only</span>
        <span>Updated just now <ArrowDownRight size={13} aria-hidden="true" /></span>
      </footer>
    </div>
  );
}