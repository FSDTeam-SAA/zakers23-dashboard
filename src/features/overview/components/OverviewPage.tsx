import { OverviewHeader } from "./OverviewHeader";
import { OverviewSidebar } from "./OverviewSidebar";
import { MetricCard } from "./MetricCard";
import { QuickActions } from "./QuickActions";
import { RecentInquiries } from "./RecentInquiries";
import type { OverviewMetric } from "../types";

const metrics: OverviewMetric[] = [
  { value: "128", label: "Total Developments", icon: "document", trend: "up" }, { value: "18", label: "Total Neighborhoods", icon: "users", trend: "up" }, { value: "342", label: "Construction Updates", icon: "settings", trend: "up" }, { value: "76", label: "Published Articles", icon: "document", trend: "up" }, { value: "1,204", label: "Total Inquiries", icon: "activity", trend: "up" }, { value: "37", label: "Pending Inquiries", icon: "activity", trend: "down" },
];

export function OverviewPage() { return <div className="min-h-dvh bg-canvas text-ink lg:flex"><OverviewSidebar/><div className="min-w-0 flex-1"><OverviewHeader/><main id="main-content" className="mx-auto max-w-[1620px] space-y-6 px-5 py-6 sm:px-8"><section aria-label="Portfolio overview" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{metrics.map((metric) => <MetricCard key={metric.label} {...metric}/>)}</section><QuickActions/><RecentInquiries/></main></div></div>; }
