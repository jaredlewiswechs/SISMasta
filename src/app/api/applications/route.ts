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
    const status = searchParams.get("status");
    const gradeLevel = searchParams.get("gradeLevel");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = { schoolId };
    if (status) where.status = status;
    if (gradeLevel) where.gradeLevel = gradeLevel;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/applications error:", error);
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

    const {
      studentFirstName, studentLastName, dateOfBirth, gradeLevel,
      guardianName, guardianEmail, guardianPhone, ...rest
    } = body;

    if (!studentFirstName || !studentLastName || !gradeLevel || !guardianEmail) {
      return NextResponse.json(
        { error: "studentFirstName, studentLastName, gradeLevel, and guardianEmail are required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        studentFirstName,
        studentLastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gradeLevel,
        guardianName,
        guardianEmail,
        guardianPhone,
        status: "Submitted",
        submittedAt: new Date(),
        schoolId,
        ...rest,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Application",
      entityId: application.id,
      details: { studentName: `${studentFirstName} ${studentLastName}`, gradeLevel },
      userId,
      schoolId,
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
