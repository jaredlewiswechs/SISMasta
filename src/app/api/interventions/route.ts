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
    const tier = searchParams.get("tier");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = { schoolId };
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (tier) where.tier = tier;

    const [interventions, total] = await Promise.all([
      prisma.intervention.findMany({
        where,
        include: {
          student: { select: { id: true, firstName: true, lastName: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
          notes: { orderBy: { createdAt: "desc" }, take: 3 },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.intervention.count({ where }),
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

    const { studentId, type, tier, description, goal, assignedToId, ...rest } = body;

    if (!studentId || !type || !description) {
      return NextResponse.json(
        { error: "studentId, type, and description are required" },
        { status: 400 }
      );
    }

    const intervention = await prisma.intervention.create({
      data: {
        studentId,
        type,
        tier: tier || "Tier1",
        description,
        goal,
        assignedToId: assignedToId || userId,
        status: "Active",
        startDate: new Date(),
        schoolId,
        ...rest,
      },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Intervention",
      entityId: intervention.id,
      details: { studentId, type, tier },
      userId,
      schoolId,
    });

    return NextResponse.json(intervention, { status: 201 });
  } catch (error) {
    console.error("POST /api/interventions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
