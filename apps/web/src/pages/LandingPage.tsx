import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  CreditCard,
  Package,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: CreditCard,
    title: "Payments that reconcile",
    description: "Know what was paid, what is pending, and what needs a second look.",
    tone: "mint",
  },
  {
    icon: Package,
    title: "Stock that stays in sync",
    description: "Connect each confirmed sale to the products that left your shelf.",
    tone: "yellow",
  },
  {
    icon: ReceiptText,
    title: "Receipts without the scramble",
    description: "Keep a clear record of every sale, ready when you need it.",
    tone: "peach",
  },
  {
    icon: TrendingUp,
    title: "A clearer view of your shop",
    description: "See your sales, payment status, and low stock in one place.",
    tone: "blue",
  },
];

const steps = [
  { number: "01", title: "Verify the payment", description: "Confirm the customer's payment before it counts." },
  { number: "02", title: "Record sale and stock", description: "Link the confirmed sale and update inventory together." },
  { number: "03", title: "Receipt and business view", description: "Make the receipt available and refresh shop reporting." },
];

function ProductPreview() {
  return (
    <div className="preview-window" aria-label="Illustrative MyPriceBook Pay dashboard preview">
      <div className="preview-window__topbar">
        <span className="preview-window__brand"><span>+</span> MyPriceBook <span>Pay</span></span>
        <span className="preview-window__crumb">Workspace <b>/</b> Overview</span>
        <span className="preview-window__avatar">AC</span>
      </div>
      <div className="preview-window__body">
        <div className="preview-window__side" aria-hidden="true">
          <i className="preview-window__nav is-current" />
          <i className="preview-window__nav" />
          <i className="preview-window__nav" />
          <i className="preview-window__nav" />
        </div>
        <div className="preview-window__content">
          <div className="preview-window__heading">
            <div><span>THURSDAY, 1 OCTOBER 2026</span><strong>Your shop at a glance</strong></div>
            <span className="preview-window__demo">DEMO DATA</span>
          </div>
          <div className="preview-window__stats">
            <div><span>Revenue received</span><strong>₦482,350</strong><i><ArrowUpRight size={12} /> 12.8%</i></div>
            <div><span>Today's sales</span><strong>38</strong><i>confirmed</i></div>
            <div><span>Pending payments</span><strong>5</strong><i>₦64,500</i></div>
          </div>
          <div className="preview-window__lower">
            <div className="preview-window__chart">
              <span>Sales trend <b>This week</b></span>
              <div className="preview-window__bars" aria-hidden="true">
                {[43, 57, 72, 39, 64, 53, 88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
              </div>
              <div className="preview-window__days"><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span></div>
            </div>
            <div className="preview-window__stock">
              <span>Low stock <b>4</b></span>
              <i><b /> Paracetamol 500mg <small>4 left</small></i>
              <i><b /> ORS sachets <small>7 left</small></i>
              <i><b /> Amoxicillin 500mg <small>3 left</small></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="brand brand--landing" to="/" aria-label="MyPriceBook Pay home">
          <span className="brand__mark"><span>+</span></span>
          <span className="brand__wordmark">MyPriceBook <span>Pay</span></span>
        </Link>
        <nav className="landing-nav" aria-label="Main">
          <a href="#how-it-works">How it works</a>
          <a href="#for-your-shop">For your shop</a>
        </nav>
        <div className="landing-header__actions">
          <Link className="landing-login" to="/login">Log in</Link>
          <Link className="button button--primary button--sm" to="/register">Get started <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__copy">
          <span className="landing-kicker"><span /> FOR PHARMACIES & PATENT MEDICINE SHOPS</span>
          <h1>Connect every payment <span>to every sale.</span></h1>
          <p>MyPriceBook Pay helps Nigerian pharmacies and patent medicine shops connect customer payments with sales, inventory, receipts and business reporting.</p>
          <div className="landing-hero__actions">
            <Link className="button button--primary button--lg" to="/dashboard">Explore the demo <ArrowRight size={17} aria-hidden="true" /></Link>
            <a className="landing-secondary" href="#how-it-works">See how it works <ArrowDownRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="landing-proof"><span><Check size={13} aria-hidden="true" /> Built for the shop counter</span><span><Check size={13} aria-hidden="true" /> Clear payment status</span></div>
        </div>
        <ProductPreview />
        <div className="landing-hero__caption"><span className="demo-pill">DEMO PREVIEW</span> Sample workspace · Fictional shop and figures</div>
      </section>

      <section className="benefits-section" id="for-your-shop">
        <div className="section-intro">
          <p className="eyebrow">ONE CONNECTED WORKFLOW</p>
          <h2>Less guesswork at the counter.<br /><span>More clarity after every sale.</span></h2>
          <p>Payments, stock and sales records belong together. MyPriceBook Pay gives your team one practical place to keep them aligned.</p>
        </div>
        <div className="benefit-grid">
          {benefits.map(({ description, icon: Icon, title, tone }) => (
            <article className="benefit-item" key={title}>
              <span className={`benefit-item__icon benefit-item__icon--${tone}`}><Icon size={20} strokeWidth={1.8} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="steps-section__heading">
          <div><p className="eyebrow">A SIMPLE FLOW</p><h2>From checkout<br />to stock, in sync.</h2></div>
          <p>Payment → Sale → Stock → Receipt → Business Intelligence. Each confirmed payment updates the next step in the same workflow.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <article className="step-item" key={step.number}>
              <div className="step-item__top"><span>{step.number}</span>{index < steps.length - 1 && <span className="step-item__line" />}</div>
              <h3>{step.title}</h3><p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <span className="trust-section__icon"><ShieldCheck size={25} strokeWidth={1.7} aria-hidden="true" /></span>
        <div><p className="eyebrow">BUILT AROUND TRUST</p><h2>Payment status you can rely on.</h2><p>A customer’s checkout screen is not the final word. Payment status is confirmed by the service before a sale is marked paid and stock is updated.</p></div>
        <span className="trust-section__check"><CircleCheck size={20} aria-hidden="true" /> Verified before it counts</span>
      </section>

      <footer className="landing-footer">
        <Link className="brand brand--landing" to="/" aria-label="MyPriceBook Pay home">
          <span className="brand__mark"><span>+</span></span>
          <span className="brand__wordmark">MyPriceBook <span>Pay</span></span>
        </Link>
        <span>Payments, sales and stock in one clear view.</span>
        <div><Link to="/login">Log in</Link><Link to="/register">Get started <ArrowRight size={14} aria-hidden="true" /></Link></div>
        <small>© 2026 MyPriceBook Pay · Demo experience</small>
      </footer>
    </main>
  );
}