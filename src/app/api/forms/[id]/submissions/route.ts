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
    const { searchParams } = new URL(request.url);
    const householdId = searchParams.get("householdId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const form = await prisma.form.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const where: any = { formId: params.id };
    if (householdId) where.householdId = householdId;

    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        include: {
          household: { select: { id: true, name: true } },
          submittedBy: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { submittedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.formSubmission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/forms/[id]/submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
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

    const { householdId, data: formData, signature } = body;

    const form = await prisma.form.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!householdId) {
      return NextResponse.json({ error: "householdId is required" }, { status: 400 });
    }

    const submission = await prisma.formSubmission.create({
      data: {
        formId: params.id,
        householdId,
        data: formData || {},
        signature,
        submittedById: userId,
        submittedAt: new Date(),
        status: "Submitted",
      },
      include: {
        household: { select: { id: true, name: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "FormSubmission",
      entityId: submission.id,
      details: { formId: params.id, formName: form.name, householdId },
      userId,
      schoolId,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("POST /api/forms/[id]/submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
