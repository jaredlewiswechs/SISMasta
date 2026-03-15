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

    const { searchParams } = new URL(request.url);
    const schoolId = (session.user as any).schoolId;
    const status = searchParams.get("status");
    const grade = searchParams.get("grade");
    const cohortId = searchParams.get("cohortId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = { schoolId };
    if (status) where.status = status;
    if (grade) where.gradeLevel = grade;
    if (cohortId) where.cohortId = cohortId;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          household: { select: { id: true, name: true } },
          cohort: { select: { id: true, name: true } },
        },
        orderBy: { lastName: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      students,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/students error:", error);
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

    const { firstName, lastName, dateOfBirth, gradeLevel, householdId, cohortId, ...rest } = body;

    if (!firstName || !lastName || !dateOfBirth || !gradeLevel || !householdId) {
      return NextResponse.json(
        { error: "firstName, lastName, dateOfBirth, gradeLevel, and householdId are required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gradeLevel,
        householdId,
        cohortId,
        schoolId,
        status: "Active",
        ...rest,
      },
      include: {
        household: { select: { id: true, name: true } },
        cohort: { select: { id: true, name: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Student",
      entityId: student.id,
      details: { firstName, lastName, gradeLevel },
      userId,
      schoolId,
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("POST /api/students error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
