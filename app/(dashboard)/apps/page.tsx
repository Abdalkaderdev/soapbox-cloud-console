"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
import { Search, Eye, CheckCircle, XCircle, ExternalLink, Shield, Loader2, RefreshCw, AlertCircle } from "lucide-react"

interface App {
  id: string
  name: string
  developer: string
  developerEmail: string
  status: "approved" | "pending" | "rejected" | "suspended"
  scopes: string[]
  createdAt: string
  lastActive: string
  apiCalls: string
  rating: number | null
}

interface AppsResponse {
  apps: App[]
  total: number
  stats?: {
    approved: number
    pending: number
    rejected: number
  }
}

function getStatusBadgeVariant(status: string): "success" | "warning" | "destructive" | "secondary" {
  switch (status) {
    case "approved":
      return "success"
    case "pending":
      return "warning"
    case "rejected":
    case "suspended":
      return "destructive"
    default:
      return "secondary"
  }
}

export default function AppsPage() {
  const router = useRouter()
  const [apps, setApps] = useState<App[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchApps = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/apps")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch apps")
      }

      const data: AppsResponse = await response.json()
      setApps(data.apps || data as unknown as App[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  const handleApprove = async (appId: string) => {
    setActionLoading(appId)
    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to approve app")
      }

      // Update local state
      setApps(prev =>
        prev.map(app =>
          app.id === appId ? { ...app, status: "approved" } : app
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve app")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (appId: string) => {
    if (!confirm("Are you sure you want to reject this app?")) return

    setActionLoading(appId)
    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to reject app")
      }

      // Update local state
      setApps(prev =>
        prev.map(app =>
          app.id === appId ? { ...app, status: "rejected" } : app
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject app")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (appId: string) => {
    if (!confirm("Are you sure you want to suspend this app?")) return

    setActionLoading(appId)
    try {
      const response = await fetch(`/api/apps/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suspend" }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to suspend app")
      }

      // Update local state
      setApps(prev =>
        prev.map(app =>
          app.id === appId ? { ...app, status: "suspended" } : app
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to suspend app")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === "pending").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  }

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
                {isLoading ? "-" : stats.total}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Apps</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-500">
                {isLoading ? "-" : stats.pending}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-500">
                {isLoading ? "-" : stats.approved}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">
                {isLoading ? "-" : stats.rejected}
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
                  <option value="suspended">Suspended</option>
                </Select>
                <Button variant="outline" onClick={fetchApps} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline">
                  Export List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
                <Button variant="outline" size="sm" onClick={fetchApps} className="ml-auto">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Apps Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
              </div>
            ) : (
              <>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Details"
                              onClick={() => router.push(`/apps/${app.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="View Scopes">
                              <Shield className="h-4 w-4" />
                            </Button>
                            {app.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Approve"
                                  onClick={() => handleApprove(app.id)}
                                  disabled={actionLoading === app.id}
                                >
                                  {actionLoading === app.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Reject"
                                  onClick={() => handleReject(app.id)}
                                  disabled={actionLoading === app.id}
                                >
                                  {actionLoading === app.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                </Button>
                              </>
                            )}
                            {app.status === "approved" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Suspend"
                                  onClick={() => handleSuspend(app.id)}
                                  disabled={actionLoading === app.id}
                                >
                                  {actionLoading === app.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-amber-500" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="icon" title="Open App">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredApps.length === 0 && !isLoading && (
                  <div className="py-12 text-center">
                    <p className="text-[hsl(var(--muted-foreground))]">
                      No applications found matching your criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
