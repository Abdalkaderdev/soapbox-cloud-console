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
import { Search, Eye, CheckCircle, Ban, Mail, Loader2, RefreshCw, AlertCircle } from "lucide-react"

interface Developer {
  id: string
  name: string
  email: string
  company: string
  status: "active" | "pending" | "suspended"
  apps: number
  apiCalls: string
  joinedAt: string
  plan: string
}

interface DevelopersResponse {
  developers: Developer[]
  total: number
  stats?: {
    active: number
    pending: number
    suspended: number
  }
}

function getStatusBadgeVariant(status: string): "success" | "warning" | "destructive" | "secondary" {
  switch (status) {
    case "active":
      return "success"
    case "pending":
      return "warning"
    case "suspended":
      return "destructive"
    default:
      return "secondary"
  }
}

function getPlanBadgeVariant(plan: string): "default" | "secondary" | "outline" {
  switch (plan) {
    case "Enterprise":
      return "default"
    case "Pro":
      return "secondary"
    default:
      return "outline"
  }
}

export default function DevelopersPage() {
  const router = useRouter()
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchDevelopers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/developers")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch developers")
      }

      const data: DevelopersResponse = await response.json()
      setDevelopers(data.developers || data as unknown as Developer[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDevelopers()
  }, [fetchDevelopers])

  const handleApprove = async (developerId: string) => {
    setActionLoading(developerId)
    try {
      const response = await fetch(`/api/developers/${developerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to approve developer")
      }

      // Update local state
      setDevelopers(prev =>
        prev.map(dev =>
          dev.id === developerId ? { ...dev, status: "active" } : dev
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve developer")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (developerId: string) => {
    if (!confirm("Are you sure you want to suspend this developer?")) return

    setActionLoading(developerId)
    try {
      const response = await fetch(`/api/developers/${developerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suspend" }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to suspend developer")
      }

      // Update local state
      setDevelopers(prev =>
        prev.map(dev =>
          dev.id === developerId ? { ...dev, status: "suspended" } : dev
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to suspend developer")
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = async (developerId: string) => {
    setActionLoading(developerId)
    try {
      const response = await fetch(`/api/developers/${developerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate" }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to activate developer")
      }

      // Update local state
      setDevelopers(prev =>
        prev.map(dev =>
          dev.id === developerId ? { ...dev, status: "active" } : dev
        )
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to activate developer")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredDevelopers = developers.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || dev.status === statusFilter
    const matchesPlan = planFilter === "all" || dev.plan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const stats = {
    total: developers.length,
    active: developers.filter(d => d.status === "active").length,
    pending: developers.filter(d => d.status === "pending").length,
    suspended: developers.filter(d => d.status === "suspended").length,
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Developers"
        description="Manage registered developers on your platform"
      />

      <div className="flex-1 p-8 space-y-6">
        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
                {isLoading ? "-" : stats.total}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Developers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-500">
                {isLoading ? "-" : stats.active}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-500">
                {isLoading ? "-" : stats.pending}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Pending Approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">
                {isLoading ? "-" : stats.suspended}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Suspended</p>
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
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </Select>
                <Select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="w-[140px]"
                >
                  <option value="all">All Plans</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Pro">Pro</option>
                  <option value="Free">Free</option>
                </Select>
                <Button variant="outline" onClick={fetchDevelopers} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
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
                <Button variant="outline" size="sm" onClick={fetchDevelopers} className="ml-auto">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Developers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Developers</CardTitle>
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
                      <TableHead>Developer</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Apps</TableHead>
                      <TableHead>API Calls</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevelopers.map((developer) => (
                      <TableRow key={developer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{developer.name}</p>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                              {developer.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{developer.company}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(developer.status)}>
                            {developer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPlanBadgeVariant(developer.plan)}>
                            {developer.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>{developer.apps}</TableCell>
                        <TableCell>{developer.apiCalls}</TableCell>
                        <TableCell className="text-[hsl(var(--muted-foreground))]">
                          {developer.joinedAt}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Details"
                              onClick={() => router.push(`/developers/${developer.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {developer.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Approve"
                                onClick={() => handleApprove(developer.id)}
                                disabled={actionLoading === developer.id}
                              >
                                {actionLoading === developer.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                                )}
                              </Button>
                            )}
                            {developer.status === "suspended" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Activate"
                                onClick={() => handleActivate(developer.id)}
                                disabled={actionLoading === developer.id}
                              >
                                {actionLoading === developer.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                                )}
                              </Button>
                            )}
                            {developer.status !== "suspended" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Suspend"
                                onClick={() => handleSuspend(developer.id)}
                                disabled={actionLoading === developer.id}
                              >
                                {actionLoading === developer.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Ban className="h-4 w-4 text-red-500" />
                                )}
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" title="Send Email">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredDevelopers.length === 0 && !isLoading && (
                  <div className="py-12 text-center">
                    <p className="text-[hsl(var(--muted-foreground))]">
                      No developers found matching your criteria.
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
