"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
  Shield,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react"

interface Developer {
  id: string
  name: string
  email: string
  company: string
  registeredAt: string
  status: "active" | "pending" | "suspended"
}

interface App {
  id: string
  name: string
  developer: string
  developerEmail: string
  submittedAt: string
  status: "approved" | "pending" | "rejected"
  type?: string
  priority?: string
}

interface AnalyticsData {
  stats: {
    totalDevelopers: number
    developersChange: number
    activeApps: number
    appsChange: number
    apiRequestsToday: number
    apiRequestsChange: number
    revenueMonth: number
    revenueChange: number
  }
  systemHealth: Array<{
    name: string
    status: "healthy" | "degraded" | "unhealthy"
    uptime: string
    latency: string
  }>
}

// Quick actions (static)
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
    case "active":
    case "healthy":
      return "success"
    case "warning":
    case "degraded":
      return "warning"
    case "destructive":
    case "rejected":
    case "unhealthy":
    case "suspended":
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

function getServiceIcon(name: string) {
  switch (name.toLowerCase()) {
    case "api gateway":
      return Server
    case "database cluster":
    case "database":
      return Database
    case "cdn":
      return Wifi
    case "auth service":
    case "authentication":
      return Shield
    default:
      return Server
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

export default function DashboardPage() {
  const router = useRouter()
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [pendingApps, setPendingApps] = useState<App[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch all data in parallel
      const [developersRes, appsRes, analyticsRes] = await Promise.all([
        fetch("/api/developers"),
        fetch("/api/apps"),
        fetch("/api/analytics"),
      ])

      // Handle developers
      if (developersRes.ok) {
        const developersData = await developersRes.json()
        const developersList = developersData.developers || developersData || []
        // Get the 5 most recent registrations
        setDevelopers(
          developersList
            .sort((a: Developer, b: Developer) =>
              new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
            )
            .slice(0, 5)
        )
      }

      // Handle apps - filter for pending reviews
      if (appsRes.ok) {
        const appsData = await appsRes.json()
        const appsList = appsData.apps || appsData || []
        setPendingApps(
          appsList
            .filter((app: App) => app.status === "pending")
            .slice(0, 4)
        )
      }

      // Handle analytics
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Build stats from analytics or use defaults
  const stats = analytics?.stats
    ? [
        {
          name: "Total Developers",
          value: formatNumber(analytics.stats.totalDevelopers),
          change: `${analytics.stats.developersChange >= 0 ? "+" : ""}${analytics.stats.developersChange}%`,
          trend: analytics.stats.developersChange >= 0 ? "up" : "down",
          icon: Users,
        },
        {
          name: "Active Apps",
          value: formatNumber(analytics.stats.activeApps),
          change: `${analytics.stats.appsChange >= 0 ? "+" : ""}${analytics.stats.appsChange}%`,
          trend: analytics.stats.appsChange >= 0 ? "up" : "down",
          icon: AppWindow,
        },
        {
          name: "API Requests Today",
          value: formatNumber(analytics.stats.apiRequestsToday),
          change: `${analytics.stats.apiRequestsChange >= 0 ? "+" : ""}${analytics.stats.apiRequestsChange}%`,
          trend: analytics.stats.apiRequestsChange >= 0 ? "up" : "down",
          icon: Activity,
        },
        {
          name: "Revenue (MTD)",
          value: formatCurrency(analytics.stats.revenueMonth),
          change: `${analytics.stats.revenueChange >= 0 ? "+" : ""}${analytics.stats.revenueChange}%`,
          trend: analytics.stats.revenueChange >= 0 ? "up" : "down",
          icon: DollarSign,
        },
      ]
    : [
        { name: "Total Developers", value: "-", change: "-", trend: "up", icon: Users },
        { name: "Active Apps", value: "-", change: "-", trend: "up", icon: AppWindow },
        { name: "API Requests Today", value: "-", change: "-", trend: "up", icon: Activity },
        { name: "Revenue (MTD)", value: "-", change: "-", trend: "up", icon: DollarSign },
      ]

  // System health from analytics or use defaults
  const systemHealth = analytics?.systemHealth || []

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" description="Overview of your SoapBox developer platform" />

      <div className="flex-1 p-8 space-y-8 overflow-auto">
        {/* Error State */}
        {error && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
                <Button variant="outline" size="sm" onClick={fetchData} className="ml-auto">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </div>
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/developers')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
              </div>
            ) : developers.length === 0 ? (
              <div className="py-12 text-center text-[hsl(var(--muted-foreground))]">
                No recent registrations
              </div>
            ) : (
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
                    {developers.map((registration) => (
                      <tr key={registration.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted))]/50">
                        <td className="py-3 px-4 text-sm text-[hsl(var(--foreground))]">{registration.name}</td>
                        <td className="py-3 px-4 text-sm text-[hsl(var(--muted-foreground))]">{registration.email}</td>
                        <td className="py-3 px-4 text-sm text-[hsl(var(--foreground))]">{registration.company}</td>
                        <td className="py-3 px-4 text-sm text-[hsl(var(--muted-foreground))]">
                          {formatRelativeTime(registration.registeredAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusBadgeVariant(registration.status)}>
                            {registration.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/developers/${registration.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Reviews */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Reviews</CardTitle>
              <Badge variant="secondary" className="ml-2">
                {pendingApps.length} pending
              </Badge>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
                </div>
              ) : pendingApps.length === 0 ? (
                <div className="py-12 text-center text-[hsl(var(--muted-foreground))]">
                  No pending reviews
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApps.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-center justify-between py-3 px-4 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                            {review.name}
                          </p>
                          {review.priority && (
                            <Badge variant={getPriorityBadgeVariant(review.priority)} className="text-xs">
                              {review.priority}
                            </Badge>
                          )}
                          {review.type && (
                            <Badge variant="outline" className="text-xs">
                              {review.type}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                          {review.developerEmail || review.developer} - {formatRelativeTime(review.submittedAt || review.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/apps/${review.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--muted-foreground))]" />
                  </div>
                ) : systemHealth.length === 0 ? (
                  <div className="py-8 text-center text-[hsl(var(--muted-foreground))]">
                    No health data available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {systemHealth.map((service) => {
                      const ServiceIcon = getServiceIcon(service.name)
                      return (
                        <div
                          key={service.name}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-3">
                            <ServiceIcon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
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
                      )
                    })}
                  </div>
                )}
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
                      onClick={() => router.push(action.href)}
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
