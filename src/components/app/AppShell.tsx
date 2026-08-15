import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bell,
  Code2,
  Compass,
  GraduationCap,
  History,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
  Swords,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze Code", icon: Code2 },
  { to: "/learning", label: "My Learning", icon: GraduationCap },
  { to: "/challenges", label: "Challenges", icon: Swords },
  { to: "/concepts", label: "Concepts", icon: Compass },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/history", label: "History", icon: History },
] as const;

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-lg border border-primary/30 bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-primary">
        <Sparkles className="size-4" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-semibold tracking-tight">
            CodeLens AI
          </span>
          <span className="block text-[10px] text-muted-foreground">
            Understand the code. Master the concept.
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
                className="absolute inset-0 rounded-xl border border-primary/25 bg-[color-mix(in_oklab,var(--primary)_14%,transparent)]"
              />
            )}
            <item.icon className={cn("relative size-4", active && "text-primary")} />
            <span className="relative font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-1 pt-1">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavList {...(onNavigate ? { onNavigate } : {})} />
      </div>
      <div className="space-y-1 border-t border-sidebar-border pt-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground">
          <Settings className="size-4" />
          Settings
        </button>
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-sidebar-accent"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan text-sm font-semibold text-primary-foreground">
            PP
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-medium">Prem Parmar</span>
            <span className="block truncate text-xs text-muted-foreground">
              Developer in Progress
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarInner />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="absolute inset-y-0 left-0 w-[272px] border-r border-sidebar-border bg-sidebar"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </motion.aside>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="rounded-lg p-2 text-muted-foreground hover:bg-surface-2 lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search concepts, analyses, challenges…"
              className="h-9 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
            />
          </div>
          <span className="flex-1 truncate text-sm font-medium sm:hidden">
            {title ?? "CodeLens AI"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative rounded-lg border border-border bg-surface p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-cyan" />
            </button>
            <Link
              to="/profile"
              className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan text-xs font-semibold text-primary-foreground"
            >
              PP
            </Link>
          </div>
        </header>
        <main className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
