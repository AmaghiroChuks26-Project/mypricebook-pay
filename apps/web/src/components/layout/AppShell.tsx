import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/sales": "Sales",
  "/inventory": "Inventory",
  "/payments": "Payments",
  "/receipts": "Receipts",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/help": "Help",
};

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Overview";

  return (
    <div className="app-shell">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-shell__main">
        <Topbar title={title} menuOpen={menuOpen} onMenuClick={() => setMenuOpen((open) => !open)} />
        <main className="app-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}