import { CircleHelp, FileText, Package, ReceiptText, Settings, ChartNoAxesCombined, CreditCard } from "lucide-react";
import { useLocation } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";

const pageContent: Record<string, { title: string; description: string; empty: string; icon: typeof Package }> = {
  "/sales": { title: "Sales", description: "Review and manage sales from your shop.", empty: "Sales workspace coming next", icon: ReceiptText },
  "/inventory": { title: "Price Book", description: "Keep an eye on products and stock levels.", empty: "Your price book will appear here", icon: Package },
  "/payments": { title: "Payments", description: "Follow payment status from checkout to confirmation.", empty: "Payment activity will appear here", icon: CreditCard },
  "/receipts": { title: "Receipts", description: "Find receipts for confirmed sales.", empty: "Receipts will appear here", icon: FileText },
  "/analytics": { title: "Analytics", description: "Understand sales and stock trends over time.", empty: "Your reports are being prepared", icon: ChartNoAxesCombined },
  "/settings": { title: "Settings", description: "Manage your shop and workspace preferences.", empty: "Workspace settings are not connected yet", icon: Settings },
  "/help": { title: "Help", description: "Find guidance for using your workspace.", empty: "Help resources are coming soon", icon: CircleHelp },
};

export function PlaceholderPage() {
  const { pathname } = useLocation();
  const page = pageContent[pathname] ?? pageContent["/sales"];
  const Icon = page.icon;

  return (
    <div className="placeholder-page">
      <PageHeader title={page.title} description={page.description} />
      <div className="placeholder-page__content">
        <span className="demo-pill">FOUNDATION</span>
        <EmptyState
          icon={<Icon size={22} strokeWidth={1.7} />}
          title={page.empty}
          description="This area is a visual foundation only. No shop records are connected."
        />
      </div>
    </div>
  );
}