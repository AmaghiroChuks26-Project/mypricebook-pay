import { Bell, ChevronRight, Menu, Search } from "lucide-react";
import { useState } from "react";
import { demoShop } from "../../lib/demoData";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
  menuOpen: boolean;
}

export function Topbar({ menuOpen, onMenuClick, title }: TopbarProps) {
  const [showNotice, setShowNotice] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="icon-button topbar__menu" onClick={onMenuClick} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="app-sidebar">
          <Menu size={21} aria-hidden="true" />
        </button>
        <div className="breadcrumb" aria-label={`Current page: ${title}`}>
          <span className="breadcrumb__root">Workspace</span>
          <ChevronRight size={15} aria-hidden="true" />
          <span className="breadcrumb__current">{title}</span>
        </div>
      </div>

      <div className="topbar__actions">
        <label className="topbar-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search</span>
          <input type="search" placeholder="Search sales, stock..." aria-label="Search sales and stock (demo)" />
          <kbd aria-hidden="true">/</kbd>
        </label>
        <button
          className="icon-button mobile-search-toggle"
          aria-label="Search sales and stock"
          aria-expanded={showMobileSearch}
          aria-controls="mobile-search-panel"
          onClick={() => setShowMobileSearch((shown) => !shown)}
        >
          <Search size={18} aria-hidden="true" />
        </button>
        {showMobileSearch && (
          <div className="mobile-search-panel" id="mobile-search-panel">
            <label className="topbar-search">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Search</span>
              <input type="search" placeholder="Search sales, stock..." aria-label="Search sales and stock (demo)" autoFocus />
            </label>
          </div>
        )}
        <div className="notification-wrap">
          <button
            className="icon-button notification-button"
            aria-label="Notifications"
            aria-expanded={showNotice}
            onClick={() => setShowNotice((shown) => !shown)}
          >
            <Bell size={19} aria-hidden="true" />
            <span className="notification-button__dot" aria-hidden="true" />
          </button>
          {showNotice && (
            <div className="notification-popover" role="status">
              <strong>Notifications</strong>
              <p>Notifications will appear here when your workspace is connected.</p>
              <span>Demo preview</span>
            </div>
          )}
        </div>
        <div className="topbar-profile" aria-label={`Demo profile for ${demoShop.name}`}>
          <span className="topbar-profile__avatar" aria-hidden="true">{demoShop.ownerInitials}</span>
          <span className="topbar-profile__details">
            <strong>Shop owner</strong>
            <span>{demoShop.name}</span>
          </span>
        </div>
      </div>
    </header>
  );
}