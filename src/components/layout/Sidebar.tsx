import Link from "next/link";
import { BarChart3, Funnel, Home, Users } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/revenue", label: "Revenue", icon: BarChart3 },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/funnel", label: "Funnel", icon: Funnel },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:flex">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="h-9 w-9 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 flex items-center justify-center font-semibold">
          S
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Sales CRM</span>
          <span className="text-xs text-zinc-500">Analytics Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              <span className="text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-50">
                <Icon className="h-4 w-4" />
              </span>
              <span className="transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

