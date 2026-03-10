"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Select,
  Badge
} from "@/components/ui"
import { Header } from "@/components/layout"
import {
  Gauge,
  Key,
  Mail,
  Server,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Database
} from "lucide-react"

// Mock data for rate limits
const rateLimits = {
  free: { requests: 1000, period: "month" },
  pro: { requests: 100000, period: "month" },
  enterprise: { requests: 0, period: "unlimited" },
}

// Mock data for OAuth settings
const oauthSettings = {
  tokenExpiry: "3600",
  refreshTokenExpiry: "604800",
  allowedScopes: ["read", "write", "delete", "admin"],
  requirePKCE: true,
  allowImplicitGrant: false,
}

// Mock data for email templates
const emailTemplates = [
  { id: "welcome", name: "Welcome Email", status: "active", lastModified: "2024-02-15" },
  { id: "verification", name: "Email Verification", status: "active", lastModified: "2024-02-10" },
  { id: "password_reset", name: "Password Reset", status: "active", lastModified: "2024-01-20" },
  { id: "app_approved", name: "App Approved", status: "active", lastModified: "2024-02-28" },
  { id: "app_rejected", name: "App Rejected", status: "active", lastModified: "2024-02-28" },
  { id: "rate_limit_warning", name: "Rate Limit Warning", status: "draft", lastModified: "2024-03-05" },
]

// Mock data for system config
const systemConfig = {
  apiVersion: "v1",
  maintenanceMode: false,
  debugMode: false,
  logLevel: "info",
  maxUploadSize: "10",
  sessionTimeout: "30",
}

export default function SettingsPage() {
  const [rateLimit, setRateLimit] = useState(rateLimits)
  const [oauth, setOauth] = useState(oauthSettings)
  const [config, setConfig] = useState(systemConfig)

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Settings"
        description="Configure platform settings and system preferences"
      />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-[hsl(var(--primary))]" />
              <CardTitle>Rate Limits</CardTitle>
            </div>
            <CardDescription>Configure API rate limits for each subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Free Tier (requests/month)
                </label>
                <Input
                  type="number"
                  value={rateLimit.free.requests}
                  onChange={(e) =>
                    setRateLimit({
                      ...rateLimit,
                      free: { ...rateLimit.free, requests: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Pro Tier (requests/month)
                </label>
                <Input
                  type="number"
                  value={rateLimit.pro.requests}
                  onChange={(e) =>
                    setRateLimit({
                      ...rateLimit,
                      pro: { ...rateLimit.pro, requests: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Enterprise Tier
                </label>
                <Input value="Unlimited" disabled className="bg-[hsl(var(--secondary))]" />
              </div>
            </div>
            <div className="mt-4">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Rate Limits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* OAuth Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-[hsl(var(--primary))]" />
              <CardTitle>OAuth Settings</CardTitle>
            </div>
            <CardDescription>Configure OAuth 2.0 authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Access Token Expiry (seconds)
                </label>
                <Input
                  type="number"
                  value={oauth.tokenExpiry}
                  onChange={(e) => setOauth({ ...oauth, tokenExpiry: e.target.value })}
                />
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Default: 3600 (1 hour)
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Refresh Token Expiry (seconds)
                </label>
                <Input
                  type="number"
                  value={oauth.refreshTokenExpiry}
                  onChange={(e) => setOauth({ ...oauth, refreshTokenExpiry: e.target.value })}
                />
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Default: 604800 (7 days)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">Require PKCE</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Require Proof Key for Code Exchange for public clients
                  </p>
                </div>
                <Button
                  variant={oauth.requirePKCE ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOauth({ ...oauth, requirePKCE: !oauth.requirePKCE })}
                >
                  {oauth.requirePKCE ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                    Allow Implicit Grant
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Allow the implicit grant flow (not recommended)
                  </p>
                </div>
                <Button
                  variant={oauth.allowImplicitGrant ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setOauth({ ...oauth, allowImplicitGrant: !oauth.allowImplicitGrant })}
                >
                  {oauth.allowImplicitGrant ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                Allowed Scopes
              </label>
              <div className="flex flex-wrap gap-2">
                {oauth.allowedScopes.map((scope) => (
                  <Badge key={scope} variant="secondary">
                    {scope}
                  </Badge>
                ))}
                <Button variant="outline" size="sm">
                  + Add Scope
                </Button>
              </div>
            </div>

            <div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save OAuth Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[hsl(var(--primary))]" />
              <CardTitle>Email Templates</CardTitle>
            </div>
            <CardDescription>Manage automated email templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))]/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">{template.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Last modified: {template.lastModified}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={template.status === "active" ? "success" : "secondary"}>
                      {template.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-[hsl(var(--primary))]" />
              <CardTitle>System Configuration</CardTitle>
            </div>
            <CardDescription>Core system settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  API Version
                </label>
                <Select
                  value={config.apiVersion}
                  onChange={(e) => setConfig({ ...config, apiVersion: e.target.value })}
                >
                  <option value="v1">v1 (Current)</option>
                  <option value="v2">v2 (Beta)</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Log Level
                </label>
                <Select
                  value={config.logLevel}
                  onChange={(e) => setConfig({ ...config, logLevel: e.target.value })}
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Session Timeout (minutes)
                </label>
                <Input
                  type="number"
                  value={config.sessionTimeout}
                  onChange={(e) => setConfig({ ...config, sessionTimeout: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Max Upload Size (MB)
                </label>
                <Input
                  type="number"
                  value={config.maxUploadSize}
                  onChange={(e) => setConfig({ ...config, maxUploadSize: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Maintenance Mode
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Temporarily disable API access for maintenance
                    </p>
                  </div>
                </div>
                <Button
                  variant={config.maintenanceMode ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                >
                  {config.maintenanceMode ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">Debug Mode</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Enable verbose logging and error details
                    </p>
                  </div>
                </div>
                <Button
                  variant={config.debugMode ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setConfig({ ...config, debugMode: !config.debugMode })}
                >
                  {config.debugMode ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
