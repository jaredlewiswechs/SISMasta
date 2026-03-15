import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;

    // Run all queries in parallel
    const [
      enrollmentCounts,
      invoiceAggregates,
      attendanceCounts,
      interventionCounts,
      school,
      totalActiveStudents,
    ] = await Promise.all([
      // Enrollment counts by status
      prisma.student.groupBy({
        by: ["enrollmentStatus"],
        where: { schoolId },
        _count: { id: true },
      }),

      // Tuition collection stats by invoice status
      prisma.invoice.groupBy({
        by: ["status"],
        where: {
          household: { schoolId },
        },
        _sum: { totalDue: true },
        _count: { id: true },
      }),

      // Attendance records for the last 30 days
      prisma.attendanceRecord.groupBy({
        by: ["status"],
        where: {
          student: { schoolId },
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        _count: { id: true },
      }),

      // Intervention caseload counts by status
      prisma.interventionCase.groupBy({
        by: ["status"],
        where: {
          student: { schoolId },
        },
        _count: { id: true },
      }),

      // School capacity
      prisma.school.findUnique({
        where: { id: schoolId },
        select: { maxCapacity: true },
      }),

      // Total active students for seat utilization
      prisma.student.count({
        where: { schoolId, enrollmentStatus: "ACTIVE" },
      }),
    ]);

    // Format enrollment counts
    const enrollment: Record<string, number> = {};
    for (const row of enrollmentCounts) {
      enrollment[row.enrollmentStatus] = row._count.id;
    }

    // Format tuition collection stats
    const paidStatuses = ["PAID"];
    const overdueStatuses = ["OVERDUE"];
    const pendingStatuses = ["PENDING", "SENT", "DRAFT"];

    let paidAmount = 0;
    let overdueAmount = 0;
    let pendingAmount = 0;
    let totalInvoiceCount = 0;

    for (const row of invoiceAggregates) {
      const amount = row._sum.totalDue || 0;
      totalInvoiceCount += row._count.id;
      if (paidStatuses.includes(row.status)) paidAmount += amount;
      else if (overdueStatuses.includes(row.status)) overdueAmount += amount;
      else if (pendingStatuses.includes(row.status)) pendingAmount += amount;
    }

    // Format attendance rates
    let totalAttendance = 0;
    let presentCount = 0;
    for (const row of attendanceCounts) {
      totalAttendance += row._count.id;
      if (row.status === "PRESENT") presentCount += row._count.id;
    }
    const attendanceRate = totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 10000) / 100
      : 0;

    // Format intervention caseload
    const interventions: Record<string, number> = {};
    let totalOpenCases = 0;
    for (const row of interventionCounts) {
      interventions[row.status] = row._count.id;
      if (["OPEN", "IN_PROGRESS", "MONITORING"].includes(row.status)) {
        totalOpenCases += row._count.id;
      }
    }

    // Seat utilization
    const maxCapacity = school?.maxCapacity || 0;
    const seatUtilization = maxCapacity > 0
      ? Math.round((totalActiveStudents / maxCapacity) * 10000) / 100
      : 0;

    return NextResponse.json({
      enrollment,
      tuition: {
        paidAmount,
        overdueAmount,
        pendingAmount,
        totalInvoiceCount,
      },
      attendance: {
        rate: attendanceRate,
        last30Days: Object.fromEntries(
          attendanceCounts.map((row: any) => [row.status, row._count.id])
        ),
      },
      interventions: {
        byStatus: interventions,
        totalOpenCases,
      },
      seatUtilization: {
        activeStudents: totalActiveStudents,
        maxCapacity,
        percentage: seatUtilization,
      },
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
