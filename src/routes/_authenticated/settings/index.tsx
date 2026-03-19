import { createFileRoute } from '@tanstack/react-router'
import { ProfileSettingsPage } from '~/features/settings/pages/ProfileSettingsPage'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: ProfileSettingsPage,
})
