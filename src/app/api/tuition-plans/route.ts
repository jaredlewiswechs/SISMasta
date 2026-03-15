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
    const active = searchParams.get("active");
    const frequency = searchParams.get("frequency");

    const where: any = { schoolId };
    if (active === "true") where.active = true;
    if (active === "false") where.active = false;
    if (frequency) where.frequency = frequency;

    const plans = await prisma.tuitionPlan.findMany({
      where,
      include: {
        _count: { select: { students: true, invoices: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("GET /api/tuition-plans error:", error);
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

    const { name, amount, frequency, description, siblingDiscount, active } = body;

    if (!name || amount == null || !frequency) {
      return NextResponse.json(
        { error: "name, amount, and frequency are required" },
        { status: 400 }
      );
    }

    const plan = await prisma.tuitionPlan.create({
      data: {
        name,
        amount,
        frequency,
        description: description || null,
        siblingDiscount: siblingDiscount ?? 0,
        active: active ?? true,
        schoolId,
      },
      include: {
        _count: { select: { students: true, invoices: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "TuitionPlan",
      entityId: plan.id,
      details: { name, amount, frequency },
      userId,
      schoolId,
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("POST /api/tuition-plans error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
