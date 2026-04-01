import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const { auth } = await import("~/lib/auth");
  const request = getRequest();
  if (!request) return null;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session;
});

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { session };
  },
  component: () => <Outlet />,
});
