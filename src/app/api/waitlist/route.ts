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
    const grade = searchParams.get("grade");
    const status = searchParams.get("status");

    const where: any = { schoolId };
    if (grade) where.grade = grade;
    if (status) where.status = status;

    const entries = await prisma.waitlistEntry.findMany({
      where,
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("GET /api/waitlist error:", error);
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

    const { childName, grade, parentName, email, phone, notes } = body;

    if (!childName || !grade || !email) {
      return NextResponse.json(
        { error: "childName, grade, and email are required" },
        { status: 400 }
      );
    }

    // Get next position
    const lastEntry = await prisma.waitlistEntry.findFirst({
      where: { schoolId, grade },
      orderBy: { position: "desc" },
    });

    const entry = await prisma.waitlistEntry.create({
      data: {
        childName,
        grade,
        parentName,
        email,
        phone,
        notes,
        position: (lastEntry?.position || 0) + 1,
        status: "WAITING",
        schoolId,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "WaitlistEntry",
      entityId: entry.id,
      details: { childName, grade, position: entry.position },
      userId,
      schoolId,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/waitlist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
