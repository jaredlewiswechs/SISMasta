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
    const studentId = searchParams.get("studentId");
    const subject = searchParams.get("subject");
    const gradingPeriodId = searchParams.get("gradingPeriodId");

    const where: any = { student: { schoolId } };
    if (studentId) where.studentId = studentId;
    if (subject) where.subject = subject;
    if (gradingPeriodId) where.gradingPeriodId = gradingPeriodId;

    const records = await prisma.progressRecord.findMany({
      where,
      include: {
        student: { select: { id: true, legalFirstName: true, legalLastName: true } },
        gradingPeriod: { select: { id: true, name: true } },
      },
      orderBy: [{ subject: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET /api/progress error:", error);
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

    const { studentId, subject, letterGrade, masteryLevel, narrative, gradingPeriodId, assignmentName, score, maxScore, category, mode } = body;

    if (!studentId || !subject || !gradingPeriodId) {
      return NextResponse.json(
        { error: "studentId, subject, and gradingPeriodId are required" },
        { status: 400 }
      );
    }

    const record = await prisma.progressRecord.create({
      data: {
        studentId,
        subject,
        letterGrade,
        masteryLevel,
        narrative,
        assignmentName,
        score,
        maxScore,
        category,
        mode,
        gradingPeriodId,
      },
      include: {
        student: { select: { id: true, legalFirstName: true, legalLastName: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "ProgressRecord",
      entityId: record.id,
      details: { studentId, subject, letterGrade },
      userId,
      schoolId,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("POST /api/progress error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
