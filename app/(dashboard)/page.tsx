"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { Header, PageHeader } from "@/components/layout"
import {
  Users,
  AppWindow,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  FileText
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
    name: "API Requests (24h)",
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

// Mock data for recent activity
const recentActivity = [
  {
    id: 1,
    type: "developer_signup",
    message: "New developer registered: john.doe@example.com",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    type: "app_submitted",
    message: "App submitted for review: WeatherAPI Pro",
    time: "15 minutes ago",
    status: "pending",
  },
  {
    id: 3,
    type: "app_approved",
    message: "App approved: TaskMaster Integration",
    time: "1 hour ago",
    status: "success",
  },
  {
    id: 4,
    type: "rate_limit_exceeded",
    message: "Rate limit exceeded for app: DataSync",
    time: "2 hours ago",
    status: "warning",
  },
  {
    id: 5,
    type: "developer_suspended",
    message: "Developer suspended: spam_user@temp.com",
    time: "3 hours ago",
    status: "destructive",
  },
  {
    id: 6,
    type: "subscription_upgrade",
    message: "Subscription upgraded: acme-corp to Enterprise",
    time: "4 hours ago",
    status: "success",
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
      return "success"
    case "warning":
      return "warning"
    case "destructive":
      return "destructive"
    case "pending":
      return "secondary"
    default:
      return "default"
  }
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" description="Overview of your SoapBox developer platform" />

      <div className="flex-1 p-8 space-y-8">
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

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 border-b border-[hsl(var(--border))] last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[hsl(var(--foreground))] truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(activity.status)} className="ml-4">
                      {activity.status}
                    </Badge>
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
  )
}
