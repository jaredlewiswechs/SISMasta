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
    const required = searchParams.get("required");
    const active = searchParams.get("active");

    const where: any = { schoolId };
    if (required === "true") where.required = true;
    if (active === "true") where.active = true;

    const forms = await prisma.form.findMany({
      where,
      include: {
        _count: { select: { submissions: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("GET /api/forms error:", error);
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

    const { name, description, fields, required: isRequired } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const form = await prisma.form.create({
      data: {
        name,
        description,
        fields: fields || [],
        required: isRequired || false,
        active: true,
        schoolId,
        createdById: userId,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Form",
      entityId: form.id,
      details: { name, required: isRequired },
      userId,
      schoolId,
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("POST /api/forms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
