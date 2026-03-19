import { Bell, Settings, Smile, User } from "lucide-react";

export const LIST_SETTINGS = [
 { label: "Profile",       icon: Smile,    to: "/settings" },
 { label: "Customization", icon: Settings, to: "/settings/customization" },
 { label: "Notifications", icon: Bell,     to: "/settings/notifications" },
 { label: "Account",       icon: User,     to: "/settings/account" },
]