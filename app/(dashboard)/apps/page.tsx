"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui"
import { Header } from "@/components/layout"
import { Search, Eye, CheckCircle, XCircle, ExternalLink, Shield } from "lucide-react"

// Mock data for apps
const mockApps = [
  {
    id: "app_001",
    name: "WeatherAPI Pro",
    developer: "John Smith",
    developerEmail: "john.smith@acmecorp.com",
    status: "approved",
    scopes: ["weather:read", "location:read"],
    createdAt: "2024-02-15",
    lastActive: "2024-03-10",
    apiCalls: "450K",
    rating: 4.8,
  },
  {
    id: "app_002",
    name: "DataSync Manager",
    developer: "Emily Davis",
    developerEmail: "emily@webagency.co",
    status: "approved",
    scopes: ["data:read", "data:write", "sync:manage"],
    createdAt: "2024-01-20",
    lastActive: "2024-03-09",
    apiCalls: "1.2M",
    rating: 4.5,
  },
  {
    id: "app_003",
    name: "TaskMaster Integration",
    developer: "Sarah Johnson",
    developerEmail: "sarah@techstartup.io",
    status: "pending",
    scopes: ["tasks:read", "tasks:write", "users:read"],
    createdAt: "2024-03-08",
    lastActive: "-",
    apiCalls: "0",
    rating: null,
  },
  {
    id: "app_004",
    name: "Analytics Dashboard",
    developer: "Lisa Wang",
    developerEmail: "lisa.wang@bigtech.com",
    status: "approved",
    scopes: ["analytics:read", "reports:generate"],
    createdAt: "2023-11-10",
    lastActive: "2024-03-10",
    apiCalls: "2.8M",
    rating: 4.9,
  },
  {
    id: "app_005",
    name: "Spam Bot Connector",
    developer: "Alex Thompson",
    developerEmail: "alex.t@freelance.dev",
    status: "rejected",
    scopes: ["messages:send", "users:read", "contacts:export"],
    createdAt: "2024-02-28",
    lastActive: "-",
    apiCalls: "0",
    rating: null,
  },
  {
    id: "app_006",
    name: "E-commerce Bridge",
    developer: "Rachel Green",
    developerEmail: "rachel@consulting.biz",
    status: "pending",
    scopes: ["orders:read", "products:read", "inventory:read"],
    createdAt: "2024-03-09",
    lastActive: "-",
    apiCalls: "0",
    rating: null,
  },
  {
    id: "app_007",
    name: "CRM Sync Pro",
    developer: "Lisa Wang",
    developerEmail: "lisa.wang@bigtech.com",
    status: "approved",
    scopes: ["contacts:read", "contacts:write", "deals:manage"],
    createdAt: "2024-01-05",
    lastActive: "2024-03-10",
    apiCalls: "890K",
    rating: 4.6,
  },
  {
    id: "app_008",
    name: "Notification Hub",
    developer: "David Kim",
    developerEmail: "david@newdev.io",
    status: "pending",
    scopes: ["notifications:send", "users:read"],
    createdAt: "2024-03-10",
    lastActive: "-",
    apiCalls: "0",
    rating: null,
  },
]

function getStatusBadgeVariant(status: string): "success" | "warning" | "destructive" | "secondary" {
  switch (status) {
    case "approved":
      return "success"
    case "pending":
      return "warning"
    case "rejected":
      return "destructive"
    default:
      return "secondary"
  }
}

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredApps = mockApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = mockApps.filter(a => a.status === "pending").length
  const approvedCount = mockApps.filter(a => a.status === "approved").length
  const rejectedCount = mockApps.filter(a => a.status === "rejected").length

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Apps"
        description="Review and manage registered applications"
      />

      <div className="flex-1 p-8 space-y-6">
        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
                {mockApps.length}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Apps</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-500">
                {pendingCount}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-500">
                {approvedCount}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">
                {rejectedCount}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                <Input
                  placeholder="Search by app name or developer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-[160px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
                <Button variant="outline">
                  Export List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apps Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>API Calls</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                          {app.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{app.developer}</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {app.developerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {app.scopes.slice(0, 2).map((scope) => (
                          <Badge key={scope} variant="outline" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                        {app.scopes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{app.scopes.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))]">
                      {app.createdAt}
                    </TableCell>
                    <TableCell>{app.apiCalls}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="View Scopes">
                          <Shield className="h-4 w-4" />
                        </Button>
                        {app.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" title="Approve">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Reject">
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        {app.status === "approved" && (
                          <Button variant="ghost" size="icon" title="Open App">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredApps.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[hsl(var(--muted-foreground))]">
                  No applications found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
