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
    const householdId = searchParams.get("householdId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = { household: { schoolId } };
    if (householdId) where.householdId = householdId;
    if (status) where.status = status;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          household: { select: { id: true, name: true } },
          payments: true,
        },
        orderBy: { dueDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return NextResponse.json({
      invoices,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/invoices error:", error);
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

    const { householdId, dueDate, amount, description, lineItems, tuitionPlanId, discount, tax } = body;

    if (!householdId || !dueDate || !amount) {
      return NextResponse.json(
        { error: "householdId, dueDate, and amount are required" },
        { status: 400 }
      );
    }

    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    const discountVal = discount || 0;
    const taxVal = tax || 0;
    const totalDue = amount - discountVal + taxVal;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        householdId,
        dueDate: new Date(dueDate),
        amount,
        discount: discountVal,
        tax: taxVal,
        totalDue,
        description,
        lineItems: lineItems || undefined,
        tuitionPlanId,
        status: "PENDING",
      },
      include: {
        household: { select: { id: true, name: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Invoice",
      entityId: invoice.id,
      details: { invoiceNumber, amount, householdId },
      userId,
      schoolId,
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("POST /api/invoices error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
