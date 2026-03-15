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

    const intervention = await prisma.intervention.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!intervention) {
      return NextResponse.json({ error: "Intervention not found" }, { status: 404 });
    }

    const notes = await prisma.interventionNote.findMany({
      where: { interventionId: params.id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/interventions/[id]/notes error:", error);
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

    const { content, progressRating } = body;

    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const intervention = await prisma.intervention.findFirst({
      where: { id: params.id, schoolId },
    });

    if (!intervention) {
      return NextResponse.json({ error: "Intervention not found" }, { status: 404 });
    }

    const note = await prisma.interventionNote.create({
      data: {
        interventionId: params.id,
        content,
        progressRating,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "InterventionNote",
      entityId: note.id,
      details: { interventionId: params.id },
      userId,
      schoolId,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/interventions/[id]/notes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
