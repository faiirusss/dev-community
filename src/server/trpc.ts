import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "~/db";
import { auth } from "~/lib/auth";

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await auth.api.getSession({
    headers: opts.req.headers,
  });

  return {
    req: opts.req,
    db,
    session,
    user: session?.user ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,  
      user: ctx.user,        
    },
  })
})

export const router = t.router;
export const publicProcedure = t.procedure;

/** Must be logged in — throws UNAUTHORIZED otherwise */
export const protectedProcedure = t.procedure.use(isAuthenticated)