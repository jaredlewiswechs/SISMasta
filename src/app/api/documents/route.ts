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
    const studentId = searchParams.get("studentId");
    const type = searchParams.get("type");

    const where: any = { student: { schoolId } };
    if (studentId) where.studentId = studentId;
    if (type) where.type = type;

    const documents = await prisma.document.findMany({
      where,
      include: {
        student: { select: { id: true, legalFirstName: true, legalLastName: true } },
      },
      orderBy: { createdAt: "desc" },
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

    const { name, type, studentId, fileUrl, fileSize, mimeType, notes } = body;

    if (!name || !type || !fileUrl || !studentId) {
      return NextResponse.json(
        { error: "name, type, fileUrl, and studentId are required" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        name,
        type,
        studentId,
        fileUrl,
        fileSize,
        mimeType,
        notes,
      },
      include: {
        student: { select: { id: true, legalFirstName: true, legalLastName: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Document",
      entityId: document.id,
      details: { name, type, studentId },
      userId,
      schoolId,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
