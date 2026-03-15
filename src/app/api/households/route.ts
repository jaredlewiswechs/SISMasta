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
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = { schoolId };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { billingEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const [households, total] = await Promise.all([
      prisma.household.findMany({
        where,
        include: {
          students: { select: { id: true, legalFirstName: true, legalLastName: true, grade: true } },
          guardians: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.household.count({ where }),
    ]);

    return NextResponse.json({
      households,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/households error:", error);
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

    const { name, billingEmail, billingPhone, address, ...rest } = body;

    if (!name) {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      );
    }

    const household = await prisma.household.create({
      data: {
        name,
        billingEmail,
        billingPhone,
        address,
        schoolId,
        ...rest,
      },
      include: {
        students: true,
        guardians: true,
      },
    });

    await createAuditLog({
      action: "CREATE",
      entityType: "Household",
      entityId: household.id,
      details: { name, billingEmail },
      userId,
      schoolId,
    });

    return NextResponse.json(household, { status: 201 });
  } catch (error) {
    console.error("POST /api/households error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
