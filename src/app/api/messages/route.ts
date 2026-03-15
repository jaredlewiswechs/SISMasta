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
    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");
    const unreadOnly = searchParams.get("unread") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = { schoolId };
    if (threadId) where.threadId = threadId;
    if (unreadOnly) where.read = false;

    // Return threads or messages depending on query
    if (threadId) {
      const messages = await prisma.message.findMany({
        where,
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      });

      // Mark as read
      await prisma.message.updateMany({
        where: { threadId, recipientId: userId, read: false },
        data: { read: true, readAt: new Date() },
      });

      return NextResponse.json(messages);
    }

    const threads = await prisma.messageThread.findMany({
      where: {
        schoolId,
        participants: { some: { userId } },
      },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, role: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error("GET /api/messages error:", error);
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

    const { threadId, recipientId, subject, content } = body;

    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    let targetThreadId = threadId;

    // Create new thread if needed
    if (!targetThreadId) {
      if (!recipientId || !subject) {
        return NextResponse.json(
          { error: "recipientId and subject are required for new threads" },
          { status: 400 }
        );
      }

      const thread = await prisma.messageThread.create({
        data: {
          subject,
          schoolId,
          participants: {
            create: [{ userId }, { userId: recipientId }],
          },
        },
      });
      targetThreadId = thread.id;
    }

    const message = await prisma.message.create({
      data: {
        threadId: targetThreadId,
        senderId: userId,
        recipientId,
        content,
        schoolId,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Update thread timestamp
    await prisma.messageThread.update({
      where: { id: targetThreadId },
      data: { updatedAt: new Date() },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Message",
      entityId: message.id,
      details: { threadId: targetThreadId },
      userId,
      schoolId,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
