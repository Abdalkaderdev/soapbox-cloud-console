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
import { Search, MoreHorizontal, Eye, CheckCircle, Ban, Mail } from "lucide-react"

// Mock data for developers
const mockDevelopers = [
  {
    id: "dev_001",
    name: "John Smith",
    email: "john.smith@acmecorp.com",
    company: "Acme Corporation",
    status: "active",
    apps: 5,
    apiCalls: "1.2M",
    joinedAt: "2024-01-15",
    plan: "Enterprise",
  },
  {
    id: "dev_002",
    name: "Sarah Johnson",
    email: "sarah@techstartup.io",
    company: "Tech Startup Inc",
    status: "active",
    apps: 3,
    apiCalls: "450K",
    joinedAt: "2024-02-20",
    plan: "Pro",
  },
  {
    id: "dev_003",
    name: "Mike Chen",
    email: "mike.chen@devhouse.com",
    company: "DevHouse",
    status: "pending",
    apps: 0,
    apiCalls: "0",
    joinedAt: "2024-03-10",
    plan: "Free",
  },
  {
    id: "dev_004",
    name: "Emily Davis",
    email: "emily@webagency.co",
    company: "Web Agency Co",
    status: "active",
    apps: 8,
    apiCalls: "2.8M",
    joinedAt: "2023-11-05",
    plan: "Enterprise",
  },
  {
    id: "dev_005",
    name: "Alex Thompson",
    email: "alex.t@freelance.dev",
    company: "Independent",
    status: "suspended",
    apps: 2,
    apiCalls: "125K",
    joinedAt: "2024-01-30",
    plan: "Pro",
  },
  {
    id: "dev_006",
    name: "Lisa Wang",
    email: "lisa.wang@bigtech.com",
    company: "BigTech Solutions",
    status: "active",
    apps: 12,
    apiCalls: "5.6M",
    joinedAt: "2023-08-12",
    plan: "Enterprise",
  },
  {
    id: "dev_007",
    name: "David Kim",
    email: "david@newdev.io",
    company: "NewDev Studio",
    status: "pending",
    apps: 0,
    apiCalls: "0",
    joinedAt: "2024-03-09",
    plan: "Free",
  },
  {
    id: "dev_008",
    name: "Rachel Green",
    email: "rachel@consulting.biz",
    company: "Tech Consulting",
    status: "active",
    apps: 4,
    apiCalls: "890K",
    joinedAt: "2024-02-01",
    plan: "Pro",
  },
]

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
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  const filteredDevelopers = mockDevelopers.filter((dev) => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || dev.status === statusFilter
    const matchesPlan = planFilter === "all" || dev.plan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

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
                {mockDevelopers.length}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Developers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-emerald-500">
                {mockDevelopers.filter(d => d.status === "active").length}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-amber-500">
                {mockDevelopers.filter(d => d.status === "pending").length}
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Pending Approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-500">
                {mockDevelopers.filter(d => d.status === "suspended").length}
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Developers</CardTitle>
          </CardHeader>
          <CardContent>
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
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {developer.status === "pending" && (
                          <Button variant="ghost" size="icon" title="Approve">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          </Button>
                        )}
                        {developer.status !== "suspended" && (
                          <Button variant="ghost" size="icon" title="Suspend">
                            <Ban className="h-4 w-4 text-red-500" />
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

            {filteredDevelopers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[hsl(var(--muted-foreground))]">
                  No developers found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
