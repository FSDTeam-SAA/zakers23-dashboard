import { Icon } from "@/components/ui/icon";
import type { OverviewMetric } from "../types";

export function MetricCard({ label, value, icon, trend }: OverviewMetric) {
  return <article className="flex min-h-[204px] flex-col gap-3 rounded border border-line bg-white p-6"><div className="flex items-start justify-between"><span className="grid size-14 place-items-center rounded-full bg-line text-ink"><Icon name={icon} size={22}/></span><div className="relative mt-1 h-14 w-36 overflow-hidden"><div className={`absolute inset-x-0 bottom-0 h-10 opacity-10 ${trend === "down" ? "bg-danger" : "bg-gold"}`} style={{ clipPath: "polygon(0 75%, 18% 36%, 34% 0, 51% 55%, 68% 80%, 85% 95%, 100% 100%, 100% 100%, 0 100%)" }} /><div className={`absolute inset-x-0 bottom-0 h-14 ${trend === "down" ? "border-b-2 border-danger" : "border-b-2 border-gold"}`} style={{ clipPath: "polygon(0 75%, 18% 36%, 34% 0, 51% 55%, 68% 80%, 85% 95%, 100% 100%, 100% 100%, 0 100%)" }} /></div></div><p className="mt-1 font-display text-5xl font-bold leading-none text-ink">{value}</p><p className="text-base text-muted">{label}</p></article>;
}
