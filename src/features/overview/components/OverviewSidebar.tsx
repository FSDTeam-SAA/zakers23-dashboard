import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
const nav: [
  string,
  "grid" | "chart" | "users" | "document" | "settings" | "activity",
  string,
][] = [
  ["Dashboard", "grid", "/"],
  ["Developments", "document", "/developments"],
  ["Neighborhoods", "users", "/neighborhoods"],
  ["Waterfront Properties", "activity", "/waterfront-properties"],
  ["Insights", "chart", "/insights"],
  ["Inquiries", "document", "/inquiries"],
  ["Settings", "settings", "/settings"],
];
export function OverviewSidebar({ active = "Dashboard" }: { active?: string }) {
  return (
    <aside className="hidden h-dvh w-[300px] shrink-0 flex-col justify-between overflow-y-auto bg-cream px-6 pb-6 pt-3 lg:sticky lg:top-0 lg:flex">
      <div className="space-y-14">
        <Image
          className="mx-auto"
          src="/figma/image-2.png"
          alt="The Miami Condo Source"
          width={150}
          height={150}
        />
        <nav className="space-y-6">
          {nav.map(([label, icon, href]) => (
            <Link
              href={href}
              key={label}
              className={`flex h-12 items-center gap-2 rounded-lg px-3 font-inter font-semibold ${active === label ? "bg-gold text-white" : "text-ink hover:bg-[#eee9df]"}`}
            >
              <Icon name={icon} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Image className="size-11 rounded-full object-cover" src="/figma/image-1.jpeg" alt="Demo Name" width={44} height={44} />
          <div className="min-w-0">
            <p className="truncate font-inter font-bold">Demo Name</p>
            <p className="text-sm text-muted">Super Admin</p>
          </div>
        </div>
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-danger font-inter font-semibold text-danger transition-colors hover:bg-red-50">
          <span aria-hidden="true">↪</span>Log out
        </button>
      </div>
    </aside>
  );
}
