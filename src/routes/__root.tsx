import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import * as React from "react";
import { useState } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "~/lib/trpc";
import { Toaster } from "~/components/ui/toaster";
import { PageContainer } from "~/components/layout/PageContainer";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import appCss from "../styles/app.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dev Community" },
      {
        name: "description",
        content:
          "A place where coders share, stay up-to-date and grow their careers.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

const convex = new ConvexReactClient((import.meta as any).env.VITE_CONVEX_URL as string || "http://localhost:3214");

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url:
            typeof window !== "undefined"
              ? `${window.location.origin}/api/trpc`
              : "http://localhost:3000/api/trpc",
        }),
      ],
    })
  );

  return (
    <RootDocument>
      <ConvexProvider client={convex}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <PageContainer>
              <Outlet />
            </PageContainer>
            <Toaster />
          </QueryClientProvider>
        </trpc.Provider>
      </ConvexProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

