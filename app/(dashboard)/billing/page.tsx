"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui"
import { Header } from "@/components/layout"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Users,
  ArrowUpRight,
  Download,
  Check
} from "lucide-react"

// Mock data for revenue overview
const revenueStats = {
  totalRevenue: "$148,392",
  monthlyRecurring: "$42,850",
  averageRevenue: "$52.40",
  growthRate: "+18.2%",
}

// Mock data for subscription tiers
const subscriptionTiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    subscribers: 1245,
    revenue: "$0",
    features: ["1,000 API calls/month", "Basic support", "1 app"],
    color: "outline",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    subscribers: 892,
    revenue: "$25,868",
    features: ["100,000 API calls/month", "Priority support", "10 apps", "Analytics"],
    color: "secondary",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    subscribers: 156,
    revenue: "$31,044",
    features: ["Unlimited API calls", "24/7 support", "Unlimited apps", "Advanced analytics", "Custom integrations"],
    color: "default",
  },
]

// Mock data for recent transactions
const recentTransactions = [
  {
    id: "txn_001",
    developer: "Acme Corporation",
    email: "billing@acmecorp.com",
    amount: "$199.00",
    plan: "Enterprise",
    status: "completed",
    date: "2024-03-10",
    type: "subscription",
  },
  {
    id: "txn_002",
    developer: "Tech Startup Inc",
    email: "finance@techstartup.io",
    amount: "$29.00",
    plan: "Pro",
    status: "completed",
    date: "2024-03-10",
    type: "subscription",
  },
  {
    id: "txn_003",
    developer: "BigTech Solutions",
    email: "accounts@bigtech.com",
    amount: "$199.00",
    plan: "Enterprise",
    status: "completed",
    date: "2024-03-09",
    type: "subscription",
  },
  {
    id: "txn_004",
    developer: "Web Agency Co",
    email: "billing@webagency.co",
    amount: "$29.00",
    plan: "Pro",
    status: "pending",
    date: "2024-03-09",
    type: "subscription",
  },
  {
    id: "txn_005",
    developer: "DevHouse",
    email: "pay@devhouse.com",
    amount: "$58.00",
    plan: "Pro",
    status: "completed",
    date: "2024-03-08",
    type: "upgrade",
  },
  {
    id: "txn_006",
    developer: "Global Tech Inc",
    email: "finance@globaltech.com",
    amount: "$199.00",
    plan: "Enterprise",
    status: "refunded",
    date: "2024-03-07",
    type: "subscription",
  },
  {
    id: "txn_007",
    developer: "StartupXYZ",
    email: "admin@startupxyz.io",
    amount: "$29.00",
    plan: "Pro",
    status: "completed",
    date: "2024-03-07",
    type: "subscription",
  },
]

function getStatusBadgeVariant(status: string): "success" | "warning" | "destructive" | "secondary" {
  switch (status) {
    case "completed":
      return "success"
    case "pending":
      return "warning"
    case "refunded":
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

export default function BillingPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Billing"
        description="Revenue overview and subscription management"
      />

      <div className="flex-1 p-8 space-y-6">
        {/* Revenue Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Total Revenue (YTD)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueStats.totalRevenue}</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {revenueStats.growthRate} from last year
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Monthly Recurring
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueStats.monthlyRecurring}</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Avg. Revenue/User
              </CardTitle>
              <Users className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueStats.averageRevenue}</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Active Subscriptions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,048</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.3% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Tiers */}
        <div>
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Subscription Tiers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionTiers.map((tier) => (
              <Card key={tier.name} className={tier.name === "Enterprise" ? "border-[hsl(var(--primary))]" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{tier.name}</CardTitle>
                    {tier.name === "Enterprise" && (
                      <Badge variant="default">Popular</Badge>
                    )}
                  </div>
                  <CardDescription>
                    <span className="text-3xl font-bold text-[hsl(var(--foreground))]">{tier.price}</span>
                    <span className="text-[hsl(var(--muted-foreground))]">{tier.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-[hsl(var(--foreground))]">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[hsl(var(--border))]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[hsl(var(--muted-foreground))]">Subscribers</span>
                      <span className="font-medium">{tier.subscribers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-[hsl(var(--muted-foreground))]">Monthly Revenue</span>
                      <span className="font-medium">{tier.revenue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <p className="font-mono text-sm">{transaction.id}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] capitalize">
                          {transaction.type}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.developer}</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {transaction.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPlanBadgeVariant(transaction.plan)}>
                        {transaction.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[hsl(var(--muted-foreground))]">
                      {transaction.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
