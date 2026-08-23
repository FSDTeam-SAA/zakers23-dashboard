import { Icon } from "@/components/ui/icon";
import Link from "next/link";

const actions = [
  ["Add Development", "document", "/developments/new"],
  ["Add Neighborhood", "users", "/neighborhoods/new"],
  ["Create Article", "document", "/insights/new"],
  ["Add Construction Update", "settings", "/developments"],
  ["View Inquiries", "activity", "/inquiries"],
] as const;

export function QuickActions() {
  return (
    <section>
      <p className="text-base text-gold">Shortcuts</p>
      <h2 className="mt-1 font-inter text-2xl font-normal">Quick Actions</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {actions.map(([label, icon, href]) => (
          <Link
            key={label}
            href={href}
            className="dashboard-card group flex min-h-[126px] flex-col items-center justify-center gap-3 rounded border border-gold bg-white p-5 text-center font-inter text-base text-ink hover:bg-[#fffdf6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <span className="grid size-11 place-items-center rounded-full bg-line text-gold transition-transform duration-200 group-hover:scale-105">
              <Icon name={icon} size={19} />
            </span>
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
