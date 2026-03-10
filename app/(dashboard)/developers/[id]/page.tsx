"use client";

import { useState } from "react";
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

// Mock developer data
const mockDeveloper = {
  id: "dev_abc123",
  name: "John Smith",
  email: "john.smith@techcorp.io",
  organization: "TechCorp Inc.",
  createdAt: "2024-08-15T10:30:00Z",
  status: "active" as "active" | "pending" | "suspended",
  avatarUrl: null,
  subscription: {
    tier: "Professional",
    status: "active",
    currentPeriodStart: "2025-01-01T00:00:00Z",
    currentPeriodEnd: "2025-02-01T00:00:00Z",
    monthlyPrice: 99,
    apiCallsIncluded: 100000,
    apiCallsUsed: 42350,
  },
  billing: {
    paymentMethod: "Visa ending in 4242",
    billingEmail: "billing@techcorp.io",
    nextInvoiceDate: "2025-02-01T00:00:00Z",
    totalSpent: 594,
  },
  usage: {
    totalApiCalls: 245000,
    callsThisMonth: 42350,
    avgResponseTime: 145,
    errorRate: 0.8,
    topEndpoints: [
      { endpoint: "/v1/speech/synthesize", calls: 18500 },
      { endpoint: "/v1/speech/transcribe", calls: 12400 },
      { endpoint: "/v1/voices/list", calls: 8200 },
      { endpoint: "/v1/speech/clone", calls: 3250 },
    ],
  },
};

// Mock apps data
const mockApps = [
  {
    id: "app_1",
    name: "VoiceBot Pro",
    status: "active" as const,
    createdAt: "2024-08-20T14:00:00Z",
    apiCalls: 28500,
    lastActive: "2025-01-28T16:45:00Z",
  },
  {
    id: "app_2",
    name: "AudioTranscriber",
    status: "active" as const,
    createdAt: "2024-09-10T09:30:00Z",
    apiCalls: 12400,
    lastActive: "2025-01-28T15:20:00Z",
  },
  {
    id: "app_3",
    name: "Test Environment",
    status: "suspended" as const,
    createdAt: "2024-10-05T11:00:00Z",
    apiCalls: 1450,
    lastActive: "2024-12-15T10:00:00Z",
  },
];

// Mock activity log
const mockActivityLog = [
  {
    id: "act_1",
    action: "api_key_created",
    description: "Created new API key for VoiceBot Pro",
    timestamp: "2025-01-28T16:45:00Z",
    ip: "192.168.1.100",
  },
  {
    id: "act_2",
    action: "subscription_upgraded",
    description: "Upgraded subscription from Starter to Professional",
    timestamp: "2025-01-15T10:30:00Z",
    ip: "192.168.1.100",
  },
  {
    id: "act_3",
    action: "app_created",
    description: "Created new application: AudioTranscriber",
    timestamp: "2024-09-10T09:30:00Z",
    ip: "192.168.1.105",
  },
  {
    id: "act_4",
    action: "login",
    description: "Logged in from new device",
    timestamp: "2024-09-01T08:00:00Z",
    ip: "10.0.0.50",
  },
  {
    id: "act_5",
    action: "account_created",
    description: "Account created and email verified",
    timestamp: "2024-08-15T10:30:00Z",
    ip: "192.168.1.100",
  },
];

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

  const [isApproving, setIsApproving] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // In production, fetch developer data using the developerId
  const developer = mockDeveloper;
  const apps = mockApps;
  const activityLog = mockActivityLog;

  const handleApprove = async () => {
    setIsApproving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsApproving(false);
    // In production: await fetch(`/api/developers/${developerId}/approve`, { method: 'POST' })
  };

  const handleSuspend = async () => {
    setIsSuspending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSuspending(false);
    // In production: await fetch(`/api/developers/${developerId}/suspend`, { method: 'POST' })
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    router.push("/developers");
    // In production: await fetch(`/api/developers/${developerId}`, { method: 'DELETE' })
  };

  const usagePercentage = Math.round(
    (developer.subscription.apiCallsUsed /
      developer.subscription.apiCallsIncluded) *
      100
  );

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
            {developer.status === "pending" && (
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isApproving ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Approving...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
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
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Suspending...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
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
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <svg
                className="h-4 w-4"
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
                    {isDeleting ? "Deleting..." : "Delete Account"}
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
              </div>
            </CardContent>
          </Card>

          {/* API Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Current billing period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="space-y-3">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/30 p-4"
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
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent account activity</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Top Endpoints */}
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
      </div>
    </div>
  );
}
