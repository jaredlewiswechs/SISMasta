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

    const intervention = await prisma.intervention.findFirst({
      where: { id: params.id, schoolId },
      include: {
        student: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        notes: {
          include: {
            author: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!intervention) {
      return NextResponse.json({ error: "Intervention not found" }, { status: 404 });
    }

    return NextResponse.json(intervention);
  } catch (error) {
    console.error("GET /api/interventions/[id] error:", error);
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

    const existing = await prisma.intervention.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Intervention not found" }, { status: 404 });
    }

    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.endDate) body.endDate = new Date(body.endDate);

    const intervention = await prisma.intervention.update({
      where: { id: params.id },
      data: body,
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "Intervention",
      entityId: intervention.id,
      details: { updatedFields: Object.keys(body) },
      userId,
      schoolId,
    });

    return NextResponse.json(intervention);
  } catch (error) {
    console.error("PUT /api/interventions/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
