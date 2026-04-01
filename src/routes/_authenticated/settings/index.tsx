import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { ProfileSettingsPage } from '~/features/settings/pages/ProfileSettingsPage'

const getProfile = createServerFn({ method: 'GET' }).handler(async () => {
  const { auth } = await import('~/lib/auth')
  const { db } = await import('~/db')
  const { appRouter } = await import('~/server/root')

  const request = getRequest()
  if (!request) return null

  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return null

  const caller = appRouter.createCaller({
    req: request,
    db,
    session,
    user: session.user,
  })

  return caller.user.getCurrentProfile()
})

export const Route = createFileRoute('/_authenticated/settings/')({
  loader: () => getProfile(),
  component: ProfileSettingsPage,
})
