import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 md:px-6">
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            placeholder="Search deals, products, team..."
            className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-900 outline-none ring-zinc-400 focus:border-zinc-300 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-xs font-semibold text-zinc-50 dark:text-zinc-900">
            U
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">User</div>
            <div className="text-xs text-zinc-500">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

