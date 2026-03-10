"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface Developer {
  id: string;
  name: string;
  email: string;
  organization: string;
  createdAt: string;
  status: "active" | "pending" | "suspended";
  avatarUrl: string | null;
  subscription: {
    tier: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    monthlyPrice: number;
    apiCallsIncluded: number;
    apiCallsUsed: number;
  };
  billing: {
    paymentMethod: string;
    billingEmail: string;
    nextInvoiceDate: string;
    totalSpent: number;
  };
  usage: {
    totalApiCalls: number;
    callsThisMonth: number;
    avgResponseTime: number;
    errorRate: number;
    topEndpoints: Array<{ endpoint: string; calls: number }>;
  };
}

interface App {
  id: string;
  name: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  apiCalls: number;
  lastActive: string;
}

interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ip: string;
}

type DeveloperStatus = "active" | "pending" | "suspended";
type AppStatus = "active" | "suspended" | "pending";

function getStatusBadgeVariant(status: DeveloperStatus | AppStatus) {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "suspended":
      return "destructive";
    default:
      return "secondary";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getActionIcon(action: string) {
  switch (action) {
    case "api_key_created":
      return (
        <svg
          className="h-4 w-4 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      );
    case "subscription_upgraded":
      return (
        <svg
          className="h-4 w-4 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    case "app_created":
      return (
        <svg
          className="h-4 w-4 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      );
    case "login":
      return (
        <svg
          className="h-4 w-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
      );
    case "account_created":
      return (
        <svg
          className="h-4 w-4 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="h-4 w-4 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
}

export default function DeveloperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const developerId = params.id as string;

  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchDeveloper = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch developer details and apps in parallel
      const [developerRes, appsRes] = await Promise.all([
        fetch(`/api/developers/${developerId}`),
        fetch(`/api/developers/${developerId}/apps`),
      ]);

      if (!developerRes.ok) {
        const errorData = await developerRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch developer");
      }

      const developerData = await developerRes.json();
      setDeveloper(developerData);

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApps(appsData.apps || appsData || []);
      }

      // Activity log might be part of developer data or a separate endpoint
      if (developerData.activityLog) {
        setActivityLog(developerData.activityLog);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [developerId]);

  useEffect(() => {
    fetchDeveloper();
  }, [fetchDeveloper]);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`/api/developers/${developerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to approve developer");
      }

      const updatedDeveloper = await response.json();
      setDeveloper(prev => prev ? { ...prev, status: updatedDeveloper.status || "active" } : null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve developer");
    } finally {
      setIsApproving(false);
    }
  };

  const handleSuspend = async () => {
    setIsSuspending(true);
    try {
      const response = await fetch(`/api/developers/${developerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suspend" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to suspend developer");
      }

      const updatedDeveloper = await response.json();
      setDeveloper(prev => prev ? { ...prev, status: updatedDeveloper.status || "suspended" } : null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to suspend developer");
    } finally {
      setIsSuspending(false);
    }
  };

  const handleActivate = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(`/api/developers/${developerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to activate developer");
      }

      const updatedDeveloper = await response.json();
      setDeveloper(prev => prev ? { ...prev, status: updatedDeveloper.status || "active" } : null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to activate developer");
    } finally {
      setIsApproving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/developers/${developerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete developer");
      }

      router.push("/developers");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete developer");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="mx-auto max-w-7xl">
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <p>{error || "Developer not found"}</p>
                <Button variant="outline" size="sm" onClick={fetchDeveloper} className="ml-auto">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push("/developers")}>
                  Back to Developers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const usagePercentage = developer.subscription
    ? Math.round(
        (developer.subscription.apiCallsUsed /
          developer.subscription.apiCallsIncluded) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  {developer.name}
                </h1>
                <Badge variant={getStatusBadgeVariant(developer.status)}>
                  {developer.status.charAt(0).toUpperCase() +
                    developer.status.slice(1)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                Developer ID: {developerId}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchDeveloper}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {developer.status === "pending" && (
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Approving...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approve
                  </>
                )}
              </Button>
            )}
            {developer.status === "active" && (
              <Button
                variant="outline"
                onClick={handleSuspend}
                disabled={isSuspending}
              >
                {isSuspending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Suspending...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    Suspend
                  </>
                )}
              </Button>
            )}
            {developer.status === "suspended" && (
              <Button
                onClick={handleActivate}
                disabled={isApproving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Activating...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Activate
                  </>
                )}
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-500">Delete Developer Account</CardTitle>
                <CardDescription>
                  Are you sure you want to delete this developer account? This
                  action cannot be undone. All associated apps and data will be
                  permanently removed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Developer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Developer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-xl font-semibold text-white">
                  {developer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-white">{developer.name}</p>
                  <p className="text-sm text-zinc-400">{developer.email}</p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Organization</span>
                  <span className="text-sm font-medium text-white">
                    {developer.organization}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Created</span>
                  <span className="text-sm font-medium text-white">
                    {formatDate(developer.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-zinc-400">Status</span>
                  <Badge variant={getStatusBadgeVariant(developer.status)}>
                    {developer.status.charAt(0).toUpperCase() +
                      developer.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Billing */}
          {developer.subscription && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription & Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    {developer.subscription.tier}
                  </span>
                  <Badge
                    variant={
                      developer.subscription.status === "active"
                        ? "success"
                        : "warning"
                    }
                  >
                    {developer.subscription.status}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-400">Monthly Price</span>
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(developer.subscription.monthlyPrice)}
                    </span>
                  </div>
                  {developer.billing && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">Payment Method</span>
                        <span className="text-sm font-medium text-white">
                          {developer.billing.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">Billing Email</span>
                        <span className="text-sm font-medium text-white">
                          {developer.billing.billingEmail}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">Next Invoice</span>
                        <span className="text-sm font-medium text-white">
                          {formatDate(developer.billing.nextInvoiceDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-zinc-400">Total Spent</span>
                        <span className="text-sm font-medium text-green-500">
                          {formatCurrency(developer.billing.totalSpent)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Usage Statistics */}
          {developer.usage && (
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Current billing period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {developer.subscription && (
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-zinc-400">
                        {formatNumber(developer.subscription.apiCallsUsed)} /{" "}
                        {formatNumber(developer.subscription.apiCallsIncluded)}
                      </span>
                      <span className="font-medium text-white">
                        {usagePercentage}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${
                          usagePercentage > 90
                            ? "bg-red-500"
                            : usagePercentage > 70
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg bg-zinc-800/50 p-3">
                    <p className="text-xs text-zinc-400">Total API Calls</p>
                    <p className="text-lg font-semibold text-white">
                      {formatNumber(developer.usage.totalApiCalls)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/50 p-3">
                    <p className="text-xs text-zinc-400">Avg Response Time</p>
                    <p className="text-lg font-semibold text-white">
                      {developer.usage.avgResponseTime}ms
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/50 p-3">
                    <p className="text-xs text-zinc-400">This Month</p>
                    <p className="text-lg font-semibold text-white">
                      {formatNumber(developer.usage.callsThisMonth)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/50 p-3">
                    <p className="text-xs text-zinc-400">Error Rate</p>
                    <p className="text-lg font-semibold text-white">
                      {developer.usage.errorRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Apps and Activity Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Registered Apps */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Apps</CardTitle>
              <CardDescription>
                {apps.length} application{apps.length !== 1 ? "s" : ""}{" "}
                registered
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apps.length === 0 ? (
                <div className="py-8 text-center text-zinc-400">
                  No apps registered yet
                </div>
              ) : (
                <div className="space-y-3">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/30 p-4 cursor-pointer hover:bg-zinc-800/50"
                      onClick={() => router.push(`/apps/${app.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-700">
                          <svg
                            className="h-5 w-5 text-zinc-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-white">{app.name}</p>
                          <p className="text-xs text-zinc-400">
                            Created {formatDate(app.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">
                            {formatNumber(app.apiCalls)}
                          </p>
                          <p className="text-xs text-zinc-400">API calls</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent account activity</CardDescription>
            </CardHeader>
            <CardContent>
              {activityLog.length === 0 ? (
                <div className="py-8 text-center text-zinc-400">
                  No recent activity
                </div>
              ) : (
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                          {getActionIcon(activity.action)}
                        </div>
                        {index < activityLog.length - 1 && (
                          <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-zinc-800" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-white">
                          {activity.description}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                          <span>{formatDateTime(activity.timestamp)}</span>
                          <span>-</span>
                          <span>{activity.ip}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Endpoints */}
        {developer.usage?.topEndpoints && developer.usage.topEndpoints.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top API Endpoints</CardTitle>
              <CardDescription>Most frequently used endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {developer.usage.topEndpoints.map((endpoint, index) => {
                  const maxCalls = developer.usage.topEndpoints[0].calls;
                  const percentage = (endpoint.calls / maxCalls) * 100;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <code className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-zinc-300">
                          {endpoint.endpoint}
                        </code>
                        <span className="font-medium text-white">
                          {formatNumber(endpoint.calls)} calls
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
