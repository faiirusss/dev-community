import * as React from "react";
import { useRouterState } from "@tanstack/react-router";
import { signOut, useSession } from "~/lib/auth-client";
import { Header } from "~/components/layout/Header";

type AppSessionValue = {
  session: ReturnType<typeof useSession>["data"];
  isPending: boolean;
  username: string;
  signOut: () => Promise<void>;
};

const AppSessionContext = React.createContext<AppSessionValue | null>(null);

export function useAppSession() {
  const ctx = React.useContext(AppSessionContext);
  if (!ctx) {
    throw new Error("useAppSession must be used within PageContainer");
  }
  return ctx;
}

export function PageContainer({ 
  children,
  noPadding = false
 }: { 
  children: React.ReactNode,
  noPadding?: boolean
 }) {
  const { data: session, isPending } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const hideHeader = pathname === "/login" || pathname === "/register";

  const username =
    session?.user?.username ??   
    session?.user?.email ??
    "Guest"

  const signOutAction = React.useCallback(async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  }, []);

  const value = React.useMemo<AppSessionValue>(
    () => ({
      session,
      isPending,
      username,
      signOut: signOutAction,
    }),
    [session, isPending, username, signOutAction]
  );

  return (
    <AppSessionContext.Provider value={value}>
      <div className="min-h-screen bg-input/20">
        {!hideHeader ? <Header /> : null}
        <div className={hideHeader || noPadding ? undefined : "pt-14"}>
          {children}
        </div>
      </div>
    </AppSessionContext.Provider>
  );
}

