import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { AccountSettingsPage } from '~/features/settings/pages/AccountSettingsPage'
import { users, account } from '~/db/schema'

type AccountData = {
  user: {
    id: string
    email: string
    username: string | null
    name: string
  }
  connectedAccounts: {
    id: string
    providerId: string
  }[]
}

const getAccountData = createServerFn({ method: 'GET' }).handler(async (): Promise<AccountData | null> => {
  const { auth } = await import('~/lib/auth')
  const { db } = await import('~/db')

  const request = getRequest()
  if (!request) return null

  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return null

  const [userFound] = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (!userFound) return null

  const connectedAccounts = await db
    .select({
      id: account.id,
      providerId: account.providerId,
    })
    .from(account)
    .where(eq(account.userId, session.user.id))

  return {
    user: userFound,
    connectedAccounts,
  }
})

export const Route = createFileRoute('/_authenticated/settings/account')({
  loader: () => getAccountData(),
  component: AccountSettingsPage,
})