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
    const date = searchParams.get("date");
    const cohortId = searchParams.get("cohortId");
    const studentId = searchParams.get("studentId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = { student: { schoolId } };
    if (date) where.date = new Date(date);
    if (cohortId) where.cohortId = cohortId;
    if (studentId) where.studentId = studentId;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const records = await prisma.attendanceRecord.findMany({
      where,
      include: {
        student: {
          select: { id: true, legalFirstName: true, legalLastName: true, grade: true, cohortId: true },
        },
      },
      orderBy: [{ date: "desc" }, { student: { legalLastName: "asc" } }],
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET /api/attendance error:", error);
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

    const { records } = body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: "records array is required" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      records.map(async (record: any) => {
        const { studentId, date, status, notes, cohortId } = record;

        return prisma.attendanceRecord.upsert({
          where: {
            studentId_date: { studentId, date: new Date(date) },
          },
          update: { status, notes },
          create: {
            studentId,
            date: new Date(date),
            status,
            notes,
            cohortId,
          },
        });
      })
    );

    await createAuditLog({
      action: "BULK_UPDATE",
      entityType: "Attendance",
      entityId: "bulk",
      details: { recordCount: records.length, date: records[0]?.date },
      userId,
      schoolId,
    });

    return NextResponse.json({ updated: results.length, records: results }, { status: 201 });
  } catch (error) {
    console.error("POST /api/attendance error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
