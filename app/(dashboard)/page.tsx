"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { Header } from "@/components/layout"
import {
  Users,
  AppWindow,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Server,
  Database,
  Wifi,
  Shield
} from "lucide-react"

// Mock data for stats
const stats = [
  {
    name: "Total Developers",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Active Apps",
    value: "1,423",
    change: "+8.2%",
    trend: "up",
    icon: AppWindow,
  },
  {
    name: "API Requests Today",
    value: "4.2M",
    change: "+23.1%",
    trend: "up",
    icon: Activity,
  },
  {
    name: "Revenue (MTD)",
    value: "$48,392",
    change: "-2.4%",
    trend: "down",
    icon: DollarSign,
  },
]

// Mock data for recent registrations
const recentRegistrations = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Corp",
    registeredAt: "2 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.chen@techstart.io",
    company: "TechStart",
    registeredAt: "15 minutes ago",
    status: "approved",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@devhub.com",
    company: "DevHub Inc",
    registeredAt: "1 hour ago",
    status: "pending",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.r@cloudnine.co",
    company: "CloudNine",
    registeredAt: "2 hours ago",
    status: "approved",
  },
  {
    id: 5,
    name: "Alex Kim",
    email: "alex.kim@startuplab.io",
    company: "StartupLab",
    registeredAt: "3 hours ago",
    status: "rejected",
  },
]

// Mock data for pending reviews
const pendingReviews = [
  {
    id: 1,
    appName: "WeatherAPI Pro",
    developer: "john.doe@example.com",
    submittedAt: "15 minutes ago",
    type: "New App",
    priority: "high",
  },
  {
    id: 2,
    appName: "TaskMaster Integration",
    developer: "sarah.chen@techstart.io",
    submittedAt: "2 hours ago",
    type: "Update",
    priority: "medium",
  },
  {
    id: 3,
    appName: "DataSync Pro",
    developer: "mike.j@devhub.com",
    submittedAt: "4 hours ago",
    type: "New App",
    priority: "low",
  },
  {
    id: 4,
    appName: "Analytics Dashboard",
    developer: "emily.r@cloudnine.co",
    submittedAt: "6 hours ago",
    type: "Update",
    priority: "medium",
  },
]

// System health indicators
const systemHealth = [
  {
    name: "API Gateway",
    status: "healthy",
    uptime: "99.99%",
    latency: "45ms",
    icon: Server,
  },
  {
    name: "Database Cluster",
    status: "healthy",
    uptime: "99.97%",
    latency: "12ms",
    icon: Database,
  },
  {
    name: "CDN",
    status: "degraded",
    uptime: "98.5%",
    latency: "120ms",
    icon: Wifi,
  },
  {
    name: "Auth Service",
    status: "healthy",
    uptime: "100%",
    latency: "28ms",
    icon: Shield,
  },
]

// Quick actions
const quickActions = [
  { name: "Add Developer", icon: Plus, href: "/developers/new" },
  { name: "Review Apps", icon: FileText, href: "/apps?status=pending" },
  { name: "View Analytics", icon: Activity, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (status) {
    case "success":
    case "approved":
    case "healthy":
      return "success"
    case "warning":
    case "degraded":
      return "warning"
    case "destructive":
    case "rejected":
    case "unhealthy":
      return "destructive"
    case "pending":
      return "secondary"
    default:
      return "default"
  }
}

function getPriorityBadgeVariant(priority: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "warning"
    case "low":
      return "secondary"
    default:
      return "default"
  }
}

function getHealthIcon(status: string) {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />
    case "degraded":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "unhealthy":
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" description="Overview of your SoapBox developer platform" />

      <div className="flex-1 p-8 space-y-8 overflow-auto">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{stat.value}</div>
                <div className="flex items-center text-xs mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-emerald-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="text-[hsl(var(--muted-foreground))] ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Registrations Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Registrations</CardTitle>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/developers'}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--muted-foreground))]">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--muted-foreground))]">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--muted-foreground))]">Company</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--muted-foreground))]">Registered</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map((registration) => (
                    <tr key={registration.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted))]/50">
                      <td className="py-3 px-4 text-sm text-[hsl(var(--foreground))]">{registration.name}</td>
                      <td className="py-3 px-4 text-sm text-[hsl(var(--muted-foreground))]">{registration.email}</td>
                      <td className="py-3 px-4 text-sm text-[hsl(var(--foreground))]">{registration.company}</td>
                      <td className="py-3 px-4 text-sm text-[hsl(var(--muted-foreground))]">{registration.registeredAt}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(registration.status)}>
                          {registration.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Reviews */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Reviews</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {pendingReviews.length} pending
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between py-3 px-4 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                          {review.appName}
                        </p>
                        <Badge variant={getPriorityBadgeVariant(review.priority)} className="text-xs">
                          {review.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {review.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                        {review.developer} - {review.submittedAt}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health & Quick Actions */}
          <div className="space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <service.icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        <div>
                          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                            {service.name}
                          </p>
                          <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            {service.uptime} uptime - {service.latency}
                          </p>
                        </div>
                      </div>
                      {getHealthIcon(service.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action.name}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.location.href = action.href}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
