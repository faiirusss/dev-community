import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { LIST_SETTINGS } from '~/constants/listSettings'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsLayout,
})

function SettingsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
      <aside className="w-56 shrink-0">
        <nav className="flex flex-col gap-1">
          {LIST_SETTINGS.map(({ label, icon: Icon, to }) => {
            const isActive =
              to === "/settings"
                ? pathname === "/settings"
                : pathname.startsWith(to)

            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}