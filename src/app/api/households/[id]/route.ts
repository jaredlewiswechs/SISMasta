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

    const household = await prisma.household.findFirst({
      where: { id: params.id, schoolId },
      include: {
        students: true,
        guardians: true,
        invoices: { orderBy: { dueDate: "desc" }, take: 10 },
      },
    });

    if (!household) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 });
    }

    return NextResponse.json(household);
  } catch (error) {
    console.error("GET /api/households/[id] error:", error);
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

    const existing = await prisma.household.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 });
    }

    const household = await prisma.household.update({
      where: { id: params.id },
      data: body,
      include: { students: true, guardians: true },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "Household",
      entityId: household.id,
      details: { updatedFields: Object.keys(body) },
      userId,
      schoolId,
    });

    return NextResponse.json(household);
  } catch (error) {
    console.error("PUT /api/households/[id] error:", error);
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

    const existing = await prisma.household.findFirst({
      where: { id: params.id, schoolId },
      include: { students: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Household not found" }, { status: 404 });
    }

    if (existing.students.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete household with active students" },
        { status: 400 }
      );
    }

    await prisma.household.delete({ where: { id: params.id } });

    await createAuditLog({
      action: "DELETE",
      entityType: "Household",
      entityId: params.id,
      details: { name: existing.name },
      userId,
      schoolId,
    });

    return NextResponse.json({ message: "Household deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/households/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
