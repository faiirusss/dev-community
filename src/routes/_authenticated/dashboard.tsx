import { createFileRoute, Link } from "@tanstack/react-router";
import { useSession, signOut } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Code2,
  LogOut,
  Home,
  Shield,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                <Code2 className="size-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">DEV</span>
            </Link>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Home className="size-4" />
                Home
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/";
                    },
                  },
                });
              }}
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Shield className="size-8 text-primary" />
              Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              This is a protected route. Only authenticated users can see this
              page.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-500" />
                Authentication Verified
              </CardTitle>
              <CardDescription>
                You're viewing a protected page — your session is active.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/50 p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(
                    {
                      userId: session?.user?.id,
                      name: session?.user?.name,
                      email: session?.user?.email,
                      sessionToken: session?.session?.token
                        ? `${session.session.token.slice(0, 12)}...`
                        : undefined,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
