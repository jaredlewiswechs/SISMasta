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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const eventType = searchParams.get("eventType");

    const where: any = { schoolId };
    if (startDate && endDate) {
      where.startDate = { lte: new Date(endDate) };
      where.endDate = { gte: new Date(startDate) };
    }
    if (eventType) where.eventType = eventType;

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/calendar error:", error);
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

    const { title, description, startDate, endDate, eventType, allDay, location } = body;

    if (!title || !startDate) {
      return NextResponse.json(
        { error: "title and startDate are required" },
        { status: 400 }
      );
    }

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : new Date(startDate),
        eventType: eventType || "GENERAL",
        allDay: allDay || false,
        location,
        schoolId,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "CalendarEvent",
      entityId: event.id,
      details: { title, startDate, eventType },
      userId,
      schoolId,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/calendar error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
