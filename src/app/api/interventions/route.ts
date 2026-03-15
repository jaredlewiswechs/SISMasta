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
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = { student: { schoolId } };
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (type) where.type = type;

    const [interventions, total] = await Promise.all([
      prisma.interventionCase.findMany({
        where,
        include: {
          student: { select: { id: true, legalFirstName: true, legalLastName: true } },
          notes: { orderBy: { createdAt: "desc" }, take: 3 },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.interventionCase.count({ where }),
    ]);

    return NextResponse.json({
      interventions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/interventions error:", error);
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

    const { studentId, type, concern, plan, accommodations } = body;

    if (!studentId || !type || !concern) {
      return NextResponse.json(
        { error: "studentId, type, and concern are required" },
        { status: 400 }
      );
    }

    const intervention = await prisma.interventionCase.create({
      data: {
        studentId,
        type,
        concern,
        plan,
        accommodations,
        status: "OPEN",
        startDate: new Date(),
      },
      include: {
        student: { select: { id: true, legalFirstName: true, legalLastName: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "InterventionCase",
      entityId: intervention.id,
      details: { studentId, type },
      userId,
      schoolId,
    });

    return NextResponse.json(intervention, { status: 201 });
  } catch (error) {
    console.error("POST /api/interventions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
