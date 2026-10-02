import {
  ChartNoAxesCombined,
  CircleHelp,
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  Plus,
  ReceiptText,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { demoShop } from "../../lib/demoData";

const primaryLinks = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Sales", to: "/sales", icon: ReceiptText },
  { label: "Inventory", to: "/inventory", icon: Package },
  { label: "Payments", to: "/payments", icon: CreditCard },
  { label: "Receipts", to: "/receipts", icon: FileText },
  { label: "Analytics", to: "/analytics", icon: ChartNoAxesCombined },
];

const secondaryLinks = [
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Help", to: "/help", icon: CircleHelp },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const overviewLink = useRef<HTMLAnchorElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen) {
      overviewLink.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      document.getElementById("menu-toggle")?.focus();
      wasOpen.current = false;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <button className="nav-backdrop" aria-label="Close navigation" onClick={onClose} />
      )}
      <aside id="app-sidebar" className={`sidebar ${isOpen ? "sidebar--open" : ""}`} aria-label="Main navigation">
        <div className="sidebar__brand-row">
          <a className="brand" href="/" aria-label="MyPriceBook Pay home">
            <span className="brand__mark"><Plus size={19} strokeWidth={3} aria-hidden="true" /></span>
            <span className="brand__wordmark">MyPriceBook <span>Pay</span></span>
          </a>
          <button className="icon-button sidebar__close" onClick={onClose} aria-label="Close menu">
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="shop-switcher" aria-label={`Demo shop: ${demoShop.name}`}>
          <span className="shop-switcher__avatar" aria-hidden="true">A</span>
          <span className="shop-switcher__copy">
            <strong>{demoShop.name}</strong>
            <span>{demoShop.location}</span>
          </span>
          <span className="shop-switcher__chevron" aria-hidden="true">⌄</span>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav className="side-nav" aria-label="Workspace">
          {primaryLinks.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              ref={label === "Overview" ? overviewLink : undefined}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `side-nav__link ${isActive ? "is-active" : ""}`}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
              {label === "Payments" && <span className="side-nav__count">5</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__bottom">
          <p className="nav-label">PREFERENCES</p>
          <nav className="side-nav" aria-label="Preferences">
            {secondaryLinks.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => `side-nav__link ${isActive ? "is-active" : ""}`}
              >
                <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar__demo-note">
            <span className="demo-dot" aria-hidden="true" />
            Demo workspace
          </div>
        </div>
      </aside>
    </>
  );
}