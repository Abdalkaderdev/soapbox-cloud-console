"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui"
import { Header } from "@/components/layout"
import { TrendingUp, TrendingDown, AlertTriangle, Globe, Activity, Server } from "lucide-react"

// Mock data for API requests chart (placeholder)
const dailyRequests = [
  { date: "Mar 4", requests: 3200000 },
  { date: "Mar 5", requests: 3500000 },
  { date: "Mar 6", requests: 3100000 },
  { date: "Mar 7", requests: 3800000 },
  { date: "Mar 8", requests: 4200000 },
  { date: "Mar 9", requests: 3900000 },
  { date: "Mar 10", requests: 4500000 },
]

// Mock data for top endpoints
const topEndpoints = [
  {
    endpoint: "/api/v1/users",
    method: "GET",
    calls: "1.2M",
    avgLatency: "45ms",
    successRate: "99.8%",
    trend: "up",
  },
  {
    endpoint: "/api/v1/auth/token",
    method: "POST",
    calls: "890K",
    avgLatency: "120ms",
    successRate: "99.5%",
    trend: "up",
  },
  {
    endpoint: "/api/v1/data/sync",
    method: "POST",
    calls: "750K",
    avgLatency: "250ms",
    successRate: "98.2%",
    trend: "down",
  },
  {
    endpoint: "/api/v1/webhooks",
    method: "POST",
    calls: "520K",
    avgLatency: "85ms",
    successRate: "99.9%",
    trend: "up",
  },
  {
    endpoint: "/api/v1/analytics",
    method: "GET",
    calls: "480K",
    avgLatency: "180ms",
    successRate: "99.1%",
    trend: "up",
  },
]

// Mock data for error rates
const errorRates = [
  { code: "400", name: "Bad Request", count: 12450, percentage: "0.3%" },
  { code: "401", name: "Unauthorized", count: 8920, percentage: "0.2%" },
  { code: "403", name: "Forbidden", count: 3100, percentage: "0.07%" },
  { code: "404", name: "Not Found", count: 15600, percentage: "0.37%" },
  { code: "429", name: "Rate Limited", count: 45200, percentage: "1.1%" },
  { code: "500", name: "Server Error", count: 890, percentage: "0.02%" },
  { code: "503", name: "Service Unavailable", count: 120, percentage: "0.003%" },
]

// Mock data for geographic distribution
const geoDistribution = [
  { region: "North America", percentage: 45, requests: "1.9M" },
  { region: "Europe", percentage: 28, requests: "1.2M" },
  { region: "Asia Pacific", percentage: 18, requests: "756K" },
  { region: "South America", percentage: 5, requests: "210K" },
  { region: "Africa", percentage: 2, requests: "84K" },
  { region: "Middle East", percentage: 2, requests: "84K" },
]

function getMethodBadgeVariant(method: string): "default" | "secondary" | "success" | "warning" {
  switch (method) {
    case "GET":
      return "success"
    case "POST":
      return "default"
    case "PUT":
      return "warning"
    case "DELETE":
      return "secondary"
    default:
      return "secondary"
  }
}

export default function AnalyticsPage() {
  const totalRequests = dailyRequests.reduce((sum, day) => sum + day.requests, 0)
  const avgDailyRequests = Math.round(totalRequests / dailyRequests.length)
  const maxRequests = Math.max(...dailyRequests.map(d => d.requests))

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Analytics"
        description="Platform usage metrics and performance insights"
      />

      <div className="flex-1 p-8 space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Total Requests (7d)
              </CardTitle>
              <Activity className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">26.2M</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3% from last week
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Avg. Latency
              </CardTitle>
              <Server className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124ms</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                -8ms from last week
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.2%</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.1% from last week
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Error Rate
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.8%</div>
              <div className="flex items-center text-xs text-red-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.1% from last week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Requests Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>API Requests (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-2 px-4 pb-4">
              {dailyRequests.map((day) => (
                <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full bg-[hsl(var(--primary))] rounded-t-sm transition-all hover:bg-[hsl(var(--primary))]/80"
                    style={{
                      height: `${(day.requests / maxRequests) * 250}px`,
                    }}
                  />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{day.date}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[hsl(var(--border))] pt-4 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(var(--muted-foreground))]">
                  Average: {(avgDailyRequests / 1000000).toFixed(1)}M requests/day
                </span>
                <span className="text-[hsl(var(--muted-foreground))]">
                  Peak: {(maxRequests / 1000000).toFixed(1)}M requests
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Top Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Calls</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Success</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topEndpoints.map((endpoint) => (
                    <TableRow key={endpoint.endpoint}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getMethodBadgeVariant(endpoint.method)} className="text-xs">
                            {endpoint.method}
                          </Badge>
                          <span className="text-sm font-mono">{endpoint.endpoint}</span>
                        </div>
                      </TableCell>
                      <TableCell>{endpoint.calls}</TableCell>
                      <TableCell>{endpoint.avgLatency}</TableCell>
                      <TableCell>
                        <span className={endpoint.successRate.startsWith("99") ? "text-emerald-500" : "text-amber-500"}>
                          {endpoint.successRate}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Error Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Error Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorRates.map((error) => (
                    <TableRow key={error.code}>
                      <TableCell>
                        <Badge
                          variant={error.code.startsWith("5") ? "destructive" : "warning"}
                          className="font-mono"
                        >
                          {error.code}
                        </Badge>
                      </TableCell>
                      <TableCell>{error.name}</TableCell>
                      <TableCell>{error.count.toLocaleString()}</TableCell>
                      <TableCell className="text-[hsl(var(--muted-foreground))]">
                        {error.percentage}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Globe className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {geoDistribution.map((region) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.region}</span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      {region.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[hsl(var(--primary))] rounded-full transition-all"
                      style={{ width: `${region.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {region.requests} requests
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
