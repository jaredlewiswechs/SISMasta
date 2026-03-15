import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        campuses: true,
        _count: {
          select: {
            students: true,
            users: true,
            cohorts: true,
          },
        },
      },
    });

    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json(school);
  } catch (error) {
    console.error("GET /api/school error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const userId = (session.user as any).id;
    const body = await request.json();

    // Only allow updating specific school settings fields
    const allowedFields = [
      "name",
      "address",
      "city",
      "state",
      "zip",
      "phone",
      "email",
      "website",
      "academicModel",
      "billingFrequency",
      "gradesServed",
      "maxCapacity",
      "admissionsStatus",
      "charterMode",
      "logoUrl",
      "brandColor",
      "timezone",
    ];

    const data: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        data[key] = body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const school = await prisma.school.update({
      where: { id: schoolId },
      data,
      include: {
        campuses: true,
        _count: {
          select: {
            students: true,
            users: true,
            cohorts: true,
          },
        },
      },
    });

    await createAuditLog({
      action: "UPDATE",
      entityType: "School",
      entityId: school.id,
      details: { updatedFields: Object.keys(data) },
      userId,
      schoolId,
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error("PUT /api/school error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
