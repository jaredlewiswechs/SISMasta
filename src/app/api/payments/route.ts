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
    const invoiceId = searchParams.get("invoiceId");
    const householdId = searchParams.get("householdId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = { schoolId };
    if (invoiceId) where.invoiceId = invoiceId;
    if (householdId) where.invoice = { householdId };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          invoice: { select: { id: true, invoiceNumber: true, householdId: true } },
        },
        orderBy: { paymentDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({
      payments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/payments error:", error);
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

    const { invoiceId, amount, method, reference, ...rest } = body;

    if (!invoiceId || !amount || !method) {
      return NextResponse.json(
        { error: "invoiceId, amount, and method are required" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, schoolId },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount,
        method,
        reference,
        paymentDate: new Date(),
        schoolId,
        ...rest,
      },
      include: {
        invoice: { select: { id: true, invoiceNumber: true } },
      },
    });

    // Update invoice status based on payments
    const totalPaid = await prisma.payment.aggregate({
      where: { invoiceId },
      _sum: { amount: true },
    });

    const paidAmount = totalPaid._sum.amount || 0;
    const newStatus = paidAmount >= invoice.amount ? "Paid" : "Partial";

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus, paidAmount },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Payment",
      entityId: payment.id,
      details: { invoiceId, amount, method },
      userId,
      schoolId,
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
