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

    const intervention = await prisma.interventionCase.findFirst({
      where: { id: params.id },
      include: {
        student: true,
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

    const existing = await prisma.interventionCase.findFirst({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Intervention not found" }, { status: 404 });
    }

    if (body.startDate) body.startDate = new Date(body.startDate);
    if (body.resolvedDate) body.resolvedDate = new Date(body.resolvedDate);
    if (body.followUpDate) body.followUpDate = new Date(body.followUpDate);

    const intervention = await prisma.interventionCase.update({
      where: { id: params.id },
      data: body,
      include: {
        student: { select: { id: true, legalFirstName: true, legalLastName: true } },
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "InterventionCase",
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
