"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data for the app
const mockApp = {
  id: "app_abc123def456",
  name: "WeatherBot Pro",
  description:
    "An intelligent weather assistant that provides real-time forecasts, severe weather alerts, and personalized recommendations based on user location and preferences.",
  clientId: "cli_7x9k2m4n5p8q",
  clientSecret: "sec_••••••••••••••••",
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-02-20T14:45:00Z",
  status: "pending" as "pending" | "approved" | "rejected" | "suspended",
  developer: {
    id: "dev_xyz789",
    name: "Sarah Chen",
    email: "sarah.chen@techstartup.io",
    company: "TechStartup Inc.",
  },
  oauth: {
    redirectUris: [
      "https://weatherbot.app/callback",
      "https://staging.weatherbot.app/callback",
      "http://localhost:3000/callback",
    ],
    scopes: [
      "user:read",
      "user:location",
      "weather:current",
      "weather:forecast",
      "alerts:subscribe",
    ],
    grantTypes: ["authorization_code", "refresh_token"],
  },
  webhooks: [
    {
      id: "wh_001",
      url: "https://weatherbot.app/webhooks/soapbox",
      events: ["user.created", "subscription.updated"],
      status: "active",
    },
    {
      id: "wh_002",
      url: "https://weatherbot.app/webhooks/alerts",
      events: ["alert.triggered"],
      status: "inactive",
    },
  ],
  apiUsage: {
    totalRequests: 156420,
    requestsThisMonth: 23450,
    avgLatency: 145,
    errorRate: 0.8,
    lastApiCall: "2025-02-28T18:22:00Z",
  },
  reviewNotes: [
    {
      id: "note_001",
      author: "Admin Mike",
      content:
        "Initial review: App looks legitimate. Requesting additional documentation on data handling practices.",
      createdAt: "2025-01-16T09:00:00Z",
    },
    {
      id: "note_002",
      author: "Admin Lisa",
      content:
        "Developer provided updated privacy policy. Reviewing OAuth scope requests.",
      createdAt: "2025-01-18T14:30:00Z",
    },
  ],
};

type ReviewStatus = "pending" | "approved" | "rejected" | "suspended";

const statusConfig: Record<
  ReviewStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending Review",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  approved: {
    label: "Approved",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
  suspended: {
    label: "Suspended",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
};

export default function AppDetailPage() {
  const [app, setApp] = useState(mockApp);
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const handleStatusChange = (newStatus: ReviewStatus) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setApp((prev) => ({ ...prev, status: newStatus }));
      setIsSubmitting(false);
    }, 500);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const note = {
        id: `note_${Date.now()}`,
        author: "Current Admin",
        content: newNote,
        createdAt: new Date().toISOString(),
      };
      setApp((prev) => ({
        ...prev,
        reviewNotes: [...prev.reviewNotes, note],
      }));
      setNewNote("");
      setIsSubmitting(false);
    }, 500);
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this app? This action cannot be undone."
      )
    ) {
      // Simulate API call
      alert("App deleted successfully");
    }
  };

  const status = statusConfig[app.status];

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link
              href="/apps"
              className="text-sm text-zinc-400 hover:text-zinc-200 mb-2 inline-block"
            >
              &larr; Back to Apps
            </Link>
            <h1 className="text-3xl font-bold text-white">{app.name}</h1>
            <p className="text-zinc-400 mt-1">{app.description}</p>
          </div>
          <div
            className={`px-4 py-2 rounded-full ${status.bgColor} ${status.color} font-medium`}
          >
            {status.label}
          </div>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Manage this application's review status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {app.status !== "approved" && (
                <Button
                  onClick={() => handleStatusChange("approved")}
                  disabled={isSubmitting}
                >
                  Approve App
                </Button>
              )}
              {app.status !== "rejected" && (
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange("rejected")}
                  disabled={isSubmitting}
                >
                  Reject App
                </Button>
              )}
              {app.status === "approved" && (
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange("suspended")}
                  disabled={isSubmitting}
                >
                  Suspend App
                </Button>
              )}
              {app.status === "suspended" && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange("approved")}
                  disabled={isSubmitting}
                >
                  Reactivate App
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="border-red-800 text-red-400 hover:bg-red-950 hover:text-red-300"
              >
                Delete App
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* App Information */}
          <Card>
            <CardHeader>
              <CardTitle>App Information</CardTitle>
              <CardDescription>Basic details about this application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">App Name</label>
                <p className="text-white font-medium">{app.name}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Description</label>
                <p className="text-zinc-200">{app.description}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Client ID</label>
                <p className="text-zinc-200 font-mono bg-zinc-800 px-3 py-2 rounded">
                  {app.clientId}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400">Created</label>
                  <p className="text-zinc-200">{formatDate(app.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Last Updated</label>
                  <p className="text-zinc-200">{formatDate(app.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Developer Information</CardTitle>
              <CardDescription>Details about the app developer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Developer Name</label>
                <p className="text-white font-medium">
                  <Link
                    href={`/developers/${app.developer.id}`}
                    className="text-green-400 hover:text-green-300 hover:underline"
                  >
                    {app.developer.name}
                  </Link>
                </p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Email</label>
                <p className="text-zinc-200">{app.developer.email}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Company</label>
                <p className="text-zinc-200">{app.developer.company}</p>
              </div>
              <div className="pt-2">
                <Link href={`/developers/${app.developer.id}`}>
                  <Button variant="outline" size="sm">
                    View Developer Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* OAuth Settings */}
          <Card>
            <CardHeader>
              <CardTitle>OAuth Settings</CardTitle>
              <CardDescription>OAuth configuration and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Redirect URIs</label>
                <div className="mt-1 space-y-1">
                  {app.oauth.redirectUris.map((uri, index) => (
                    <p
                      key={index}
                      className="text-zinc-200 font-mono text-sm bg-zinc-800 px-3 py-2 rounded"
                    >
                      {uri}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Requested Scopes</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {app.oauth.scopes.map((scope, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-zinc-800 text-zinc-200 text-sm rounded font-mono"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Grant Types</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {app.oauth.grantTypes.map((grant, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-400/10 text-green-400 text-sm rounded"
                    >
                      {grant}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>API Usage Statistics</CardTitle>
              <CardDescription>Usage metrics for this application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-sm text-zinc-400">Total Requests</p>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(app.apiUsage.totalRequests)}
                  </p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-sm text-zinc-400">This Month</p>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(app.apiUsage.requestsThisMonth)}
                  </p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-sm text-zinc-400">Avg Latency</p>
                  <p className="text-2xl font-bold text-white">
                    {app.apiUsage.avgLatency}ms
                  </p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-sm text-zinc-400">Error Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {app.apiUsage.errorRate}%
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-sm text-zinc-400">
                  Last API Call:{" "}
                  <span className="text-zinc-200">
                    {formatDate(app.apiUsage.lastApiCall)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhook Configurations */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Configurations</CardTitle>
            <CardDescription>
              Configured webhooks for this application
            </CardDescription>
          </CardHeader>
          <CardContent>
            {app.webhooks.length === 0 ? (
              <p className="text-zinc-400">No webhooks configured</p>
            ) : (
              <div className="space-y-4">
                {app.webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="border border-zinc-800 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="text-white font-mono text-sm">
                            {webhook.url}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              webhook.status === "active"
                                ? "bg-green-400/10 text-green-400"
                                : "bg-zinc-700 text-zinc-400"
                            }`}
                          >
                            {webhook.status}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {webhook.events.map((event, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded"
                            >
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Review Notes & Comments</CardTitle>
            <CardDescription>
              Internal notes about this application review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {app.reviewNotes.map((note) => (
                <div
                  key={note.id}
                  className="border-l-2 border-zinc-700 pl-4 py-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{note.author}</span>
                    <span className="text-zinc-500 text-sm">
                      {formatDate(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-zinc-300">{note.content}</p>
                </div>
              ))}

              {/* Add new note */}
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <label className="text-sm text-zinc-400 mb-2 block">
                  Add a Note
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your review notes here..."
                  className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSubmitting}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
