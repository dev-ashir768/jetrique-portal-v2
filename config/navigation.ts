import {
  LayoutDashboard,
  Plane,
  CalendarCheck,
  Wallet,
  Users,
  FileText,
  Settings,
  Bell,
  Building2,
  Shield,
  BarChart3,
} from "lucide-react"
import { ROUTES } from "./routes"

export interface NavItem {
  title: string
  href: string
  icon: typeof LayoutDashboard
  badge?: string
  children?: NavItem[]
}

export const DASHBOARD_NAV: NavItem[] = [
  { title: "Dashboard", href: ROUTES.DASHBOARD.HOME, icon: LayoutDashboard },
  { title: "Fleet", href: ROUTES.DASHBOARD.FLEET, icon: Plane },
  { title: "Bookings", href: ROUTES.DASHBOARD.BOOKINGS, icon: CalendarCheck },
  { title: "Wallet", href: ROUTES.DASHBOARD.WALLET, icon: Wallet },
  { title: "Team", href: ROUTES.DASHBOARD.TEAM, icon: Users },
  { title: "Documents", href: ROUTES.DASHBOARD.DOCUMENTS, icon: FileText },
  { title: "Notifications", href: ROUTES.DASHBOARD.NOTIFICATIONS, icon: Bell },
  { title: "Settings", href: ROUTES.DASHBOARD.SETTINGS.ROOT, icon: Settings },
]

export const ADMIN_NAV: NavItem[] = [
  { title: "Analytics", href: ROUTES.ADMIN.ANALYTICS, icon: BarChart3 },
  { title: "Organizations", href: ROUTES.ADMIN.ORGANIZATIONS, icon: Building2 },
  { title: "Users", href: ROUTES.ADMIN.USERS, icon: Users },
  { title: "Bookings", href: ROUTES.ADMIN.BOOKINGS, icon: CalendarCheck },
  { title: "Wallet", href: ROUTES.ADMIN.WALLET, icon: Wallet },
  { title: "RBAC", href: ROUTES.ADMIN.RBAC, icon: Shield },
  { title: "Settings", href: ROUTES.ADMIN.SETTINGS, icon: Settings },
]
