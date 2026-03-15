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
    const cohortId = searchParams.get("cohortId");
    const dayOfWeek = searchParams.get("dayOfWeek");

    const where: any = { schoolId };
    if (cohortId) where.cohortId = cohortId;
    if (dayOfWeek) where.dayOfWeek = dayOfWeek;

    const scheduleBlocks = await prisma.scheduleBlock.findMany({
      where,
      include: {
        cohort: { select: { id: true, name: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(scheduleBlocks);
  } catch (error) {
    console.error("GET /api/schedule error:", error);
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

    const { cohortId, subject, dayOfWeek, startTime, endTime, teacherId, location } = body;

    if (!cohortId || !subject || !dayOfWeek || !startTime || !endTime) {
      return NextResponse.json(
        { error: "cohortId, subject, dayOfWeek, startTime, and endTime are required" },
        { status: 400 }
      );
    }

    const block = await prisma.scheduleBlock.create({
      data: {
        cohortId,
        subject,
        dayOfWeek,
        startTime,
        endTime,
        teacherId,
        location,
        schoolId,
      },
      include: {
        cohort: { select: { id: true, name: true } },
        teacher: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "ScheduleBlock",
      entityId: block.id,
      details: { cohortId, subject, dayOfWeek },
      userId,
      schoolId,
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error("POST /api/schedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
