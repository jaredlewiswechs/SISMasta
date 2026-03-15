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
    const gradeLevel = searchParams.get("gradeLevel");
    const status = searchParams.get("status");

    const where: any = { schoolId };
    if (gradeLevel) where.gradeLevel = gradeLevel;
    if (status) where.status = status;

    const entries = await prisma.waitlistEntry.findMany({
      where,
      orderBy: [{ position: "asc" }, { addedAt: "asc" }],
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

    const { studentName, gradeLevel, guardianName, guardianEmail, guardianPhone, notes } = body;

    if (!studentName || !gradeLevel || !guardianEmail) {
      return NextResponse.json(
        { error: "studentName, gradeLevel, and guardianEmail are required" },
        { status: 400 }
      );
    }

    // Get next position
    const lastEntry = await prisma.waitlistEntry.findFirst({
      where: { schoolId, gradeLevel },
      orderBy: { position: "desc" },
    });

    const entry = await prisma.waitlistEntry.create({
      data: {
        studentName,
        gradeLevel,
        guardianName,
        guardianEmail,
        guardianPhone,
        notes,
        position: (lastEntry?.position || 0) + 1,
        status: "Waiting",
        addedAt: new Date(),
        schoolId,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "WaitlistEntry",
      entityId: entry.id,
      details: { studentName, gradeLevel, position: entry.position },
      userId,
      schoolId,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/waitlist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
