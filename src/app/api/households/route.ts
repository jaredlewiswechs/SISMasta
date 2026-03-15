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
        { primaryEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const [households, total] = await Promise.all([
      prisma.household.findMany({
        where,
        include: {
          students: { select: { id: true, firstName: true, lastName: true, gradeLevel: true } },
          guardians: { select: { id: true, firstName: true, lastName: true, relationship: true } },
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

    const { name, primaryEmail, primaryPhone, address, guardians, ...rest } = body;

    if (!name || !primaryEmail) {
      return NextResponse.json(
        { error: "name and primaryEmail are required" },
        { status: 400 }
      );
    }

    const household = await prisma.household.create({
      data: {
        name,
        primaryEmail,
        primaryPhone,
        address,
        schoolId,
        ...rest,
        ...(guardians && {
          guardians: {
            create: guardians,
          },
        }),
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
      details: { name, primaryEmail },
      userId,
      schoolId,
    });

    return NextResponse.json(household, { status: 201 });
  } catch (error) {
    console.error("POST /api/households error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
