// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;

    const student = await prisma.student.findFirst({
      where: { id: params.id, schoolId },
      include: {
        household: true,
        cohort: true,
        enrollments: true,
        attendanceRecords: { orderBy: { date: "desc" }, take: 30 },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("GET /api/students/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const userId = (session.user as any).id;
    const body = await request.json();

    const existing = await prisma.student.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (body.dateOfBirth) {
      body.dateOfBirth = new Date(body.dateOfBirth);
    }

    const student = await prisma.student.update({
      where: { id: params.id },
      data: body,
      include: {
        household: { select: { id: true, name: true } },
        cohort: { select: { id: true, name: true } },
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "Student",
      entityId: student.id,
      details: { updatedFields: Object.keys(body) },
      userId,
      schoolId,
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("PUT /api/students/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const userId = (session.user as any).id;

    const existing = await prisma.student.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.student.update({
      where: { id: params.id },
      data: { enrollmentStatus: "WITHDRAWN" },
    });

    await createAuditLog({
      action: "DELETE",
      entityType: "Student",
      entityId: params.id,
      details: { name: `${existing.legalFirstName} ${existing.legalLastName}` },
      userId,
      schoolId,
    });

    return NextResponse.json({ message: "Student withdrawn successfully" });
  } catch (error) {
    console.error("DELETE /api/students/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
