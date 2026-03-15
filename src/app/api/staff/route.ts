import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const active = searchParams.get("active");

    const where: any = {
      schoolId,
      role: { in: ["SCHOOL_LEADER", "TEACHER", "FINANCE_MANAGER"] },
    };
    if (role) where.role = role;
    if (active === "true") where.active = true;
    if (active === "false") where.active = false;

    const staff = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true,
        staffProfile: {
          select: {
            id: true,
            title: true,
            hireDate: true,
            bio: true,
          },
        },
      },
      orderBy: { lastName: "asc" },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("GET /api/staff error:", error);
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

    const { firstName, lastName, email, password, phone, title, hireDate, bio } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName, and email are required" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const tempPassword = password || Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const staff = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        role: "TEACHER",
        passwordHash,
        active: true,
        schoolId,
        staffProfile: {
          create: {
            title: title || null,
            hireDate: hireDate ? new Date(hireDate) : null,
            bio: bio || null,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        active: true,
        createdAt: true,
        staffProfile: {
          select: {
            id: true,
            title: true,
            hireDate: true,
            bio: true,
          },
        },
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Staff",
      entityId: staff.id,
      details: { firstName, lastName, email, role: "TEACHER" },
      userId,
      schoolId,
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error("POST /api/staff error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
