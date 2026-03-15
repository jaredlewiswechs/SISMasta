// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = { schoolId };
    if (active === "true") {
      where.published = true;
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ];
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.announcement.count({ where }),
    ]);

    return NextResponse.json({
      announcements,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/announcements error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const userId = (session.user as any).id;
    const body = await request.json();

    const { title, content, audience, expiresAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "title and content are required" },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        audience: audience || "ALL",
        published: true,
        publishedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        schoolId,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Announcement",
      entityId: announcement.id,
      details: { title, audience },
      userId,
      schoolId,
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("POST /api/announcements error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
