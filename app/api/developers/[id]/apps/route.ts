import { NextRequest, NextResponse } from "next/server";

// Mock apps data - in production, this would come from a database
const mockAppsData: Record<string, App[]> = {
  dev_abc123: [
    {
      id: "app_1",
      name: "VoiceBot Pro",
      description: "AI-powered voice assistant for customer support",
      status: "active",
      createdAt: "2024-08-20T14:00:00Z",
      updatedAt: "2025-01-28T16:45:00Z",
      apiCalls: 28500,
      lastActive: "2025-01-28T16:45:00Z",
      clientId: "cli_voicebot_prod",
      redirectUris: ["https://voicebot.techcorp.io/callback"],
      scopes: ["speech:synthesize", "speech:transcribe", "voices:list"],
    },
    {
      id: "app_2",
      name: "AudioTranscriber",
      description: "Real-time audio transcription service",
      status: "active",
      createdAt: "2024-09-10T09:30:00Z",
      updatedAt: "2025-01-25T11:20:00Z",
      apiCalls: 12400,
      lastActive: "2025-01-28T15:20:00Z",
      clientId: "cli_transcriber_prod",
      redirectUris: ["https://transcriber.techcorp.io/auth/callback"],
      scopes: ["speech:transcribe"],
    },
    {
      id: "app_3",
      name: "Test Environment",
      description: "Development and testing sandbox",
      status: "suspended",
      createdAt: "2024-10-05T11:00:00Z",
      updatedAt: "2024-12-15T10:00:00Z",
      apiCalls: 1450,
      lastActive: "2024-12-15T10:00:00Z",
      clientId: "cli_test_dev",
      redirectUris: ["http://localhost:3000/callback"],
      scopes: ["speech:synthesize", "speech:transcribe", "voices:list", "speech:clone"],
    },
  ],
  dev_xyz789: [
    {
      id: "app_4",
      name: "PodcastAI",
      description: "Automated podcast generation platform",
      status: "active",
      createdAt: "2024-11-01T08:00:00Z",
      updatedAt: "2025-01-27T14:30:00Z",
      apiCalls: 8900,
      lastActive: "2025-01-27T14:30:00Z",
      clientId: "cli_podcastai_prod",
      redirectUris: ["https://podcastai.example.com/oauth"],
      scopes: ["speech:synthesize", "voices:list"],
    },
  ],
};

interface App {
  id: string;
  name: string;
  description: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  updatedAt: string;
  apiCalls: number;
  lastActive: string;
  clientId: string;
  redirectUris: string[];
  scopes: string[];
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id: developerId } = await context.params;

  // In production, validate authentication and authorization here
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user.isAdmin) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // Parse query parameters for filtering/pagination
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  // Fetch apps for the developer
  // In production: const apps = await db.apps.findMany({ where: { developerId } });
  let apps = mockAppsData[developerId] || [];

  // Apply status filter if provided
  if (status) {
    apps = apps.filter((app) => app.status === status);
  }

  // Calculate pagination
  const total = apps.length;
  const paginatedApps = apps.slice(offset, offset + limit);

  // Return response with pagination metadata
  return NextResponse.json({
    data: paginatedApps,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
    developerId,
  });
}

export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id: developerId } = await context.params;

  // In production, validate authentication and authorization here
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user.isAdmin) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const body = await request.json();
    const { name, description, redirectUris, scopes } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // In production, create the app in the database
    // const app = await db.apps.create({
    //   data: {
    //     developerId,
    //     name,
    //     description,
    //     redirectUris,
    //     scopes,
    //     status: "pending",
    //   },
    // });

    // Mock response
    const newApp: App = {
      id: `app_${Date.now()}`,
      name: name.trim(),
      description: description || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      apiCalls: 0,
      lastActive: new Date().toISOString(),
      clientId: `cli_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      redirectUris: redirectUris || [],
      scopes: scopes || [],
    };

    return NextResponse.json(
      {
        data: newApp,
        message: "App created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating app:", error);
    return NextResponse.json(
      { error: "Failed to create app" },
      { status: 500 }
    );
  }
}
