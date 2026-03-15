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

    const plan = await prisma.tuitionPlan.findFirst({
      where: { id: params.id, schoolId },
      include: {
        students: {
          select: {
            id: true,
            legalFirstName: true,
            legalLastName: true,
            grade: true,
          },
        },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            totalDue: true,
            status: true,
            dueDate: true,
          },
          orderBy: { dueDate: "desc" },
          take: 20,
        },
        _count: { select: { students: true, invoices: true } },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Tuition plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET /api/tuition-plans/[id] error:", error);
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

    const existing = await prisma.tuitionPlan.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Tuition plan not found" }, { status: 404 });
    }

    const plan = await prisma.tuitionPlan.update({
      where: { id: params.id },
      data: body,
      include: {
        _count: { select: { students: true, invoices: true } },
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "TuitionPlan",
      entityId: plan.id,
      details: { updatedFields: Object.keys(body) },
      userId,
      schoolId,
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("PUT /api/tuition-plans/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
