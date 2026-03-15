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
    const studentId = searchParams.get("studentId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: any = { schoolId };
    if (householdId) where.householdId = householdId;
    if (studentId) where.studentId = studentId;
    if (type) where.type = type;
    if (status) where.status = status;

    const documents = await prisma.document.findMany({
      where,
      include: {
        household: { select: { id: true, name: true } },
        student: { select: { id: true, firstName: true, lastName: true } },
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("GET /api/documents error:", error);
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

    const { name, type, householdId, studentId, fileUrl, fileSize, mimeType } = body;

    if (!name || !type || !fileUrl) {
      return NextResponse.json(
        { error: "name, type, and fileUrl are required" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        name,
        type,
        householdId,
        studentId,
        fileUrl,
        fileSize,
        mimeType,
        status: "Pending Review",
        uploadedById: userId,
        uploadedAt: new Date(),
        schoolId,
      },
      include: {
        household: { select: { id: true, name: true } },
        student: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Document",
      entityId: document.id,
      details: { name, type, householdId, studentId },
      userId,
      schoolId,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
