// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create school
  const school = await prisma.school.create({
    data: {
      name: "Bright Horizons Microschool",
      address: "1234 Elm Street",
      city: "Austin",
      state: "TX",
      zip: "78701",
      phone: "(512) 555-0100",
      email: "info@brighthorizons.edu",
      academicModel: "HYBRID",
      billingFrequency: "MONTHLY",
      gradesServed: "K-8",
      maxCapacity: 60,
      admissionsStatus: "OPEN",
      brandColor: "#4F46E5",
    },
  });

  // Create admin user
  const adminHash = await bcrypt.hash("password123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@brighthorizons.edu",
      passwordHash: adminHash,
      firstName: "Sarah",
      lastName: "Johnson",
      role: "SUPER_ADMIN",
      schoolId: school.id,
      phone: "(512) 555-0101",
    },
  });

  // Create teacher
  const teacherHash = await bcrypt.hash("password123", 12);
  const teacher = await prisma.user.create({
    data: {
      email: "teacher@brighthorizons.edu",
      passwordHash: teacherHash,
      firstName: "Michael",
      lastName: "Chen",
      role: "TEACHER",
      schoolId: school.id,
      staffProfile: {
        create: {
          title: "Lead Teacher",
          hireDate: new Date("2024-08-01"),
        },
      },
    },
  });

  // Create cohorts
  const morningCohort = await prisma.cohort.create({
    data: {
      name: "Morning K-2",
      grades: "K-2",
      maxSize: 15,
      schoolId: school.id,
      staff: { connect: [{ id: teacher.staffProfile?.id || (await prisma.staffProfile.findUnique({ where: { userId: teacher.id } }))!.id }] },
    },
  });

  const afternoonCohort = await prisma.cohort.create({
    data: {
      name: "Afternoon 3-5",
      grades: "3-5",
      maxSize: 15,
      schoolId: school.id,
    },
  });

  const middleCohort = await prisma.cohort.create({
    data: {
      name: "Middle School 6-8",
      grades: "6-8",
      maxSize: 20,
      schoolId: school.id,
    },
  });

  // Create tuition plans
  const fullTimePlan = await prisma.tuitionPlan.create({
    data: {
      name: "Full-Time Monthly",
      amount: 850,
      frequency: "MONTHLY",
      description: "5-day full-time enrollment",
      siblingDiscount: 10,
      schoolId: school.id,
    },
  });

  const hybridPlan = await prisma.tuitionPlan.create({
    data: {
      name: "3-Day Hybrid",
      amount: 550,
      frequency: "MONTHLY",
      description: "3-day hybrid enrollment (Mon/Wed/Fri)",
      siblingDiscount: 10,
      schoolId: school.id,
    },
  });

  const enrichmentPlan = await prisma.tuitionPlan.create({
    data: {
      name: "Friday Enrichment",
      amount: 200,
      frequency: "MONTHLY",
      description: "Friday enrichment only",
      schoolId: school.id,
    },
  });

  // Create households and families
  const parentHash = await bcrypt.hash("password123", 12);

  // Family 1: Martinez
  const martinezParent = await prisma.user.create({
    data: {
      email: "martinez@email.com",
      passwordHash: parentHash,
      firstName: "Maria",
      lastName: "Martinez",
      role: "FAMILY",
      schoolId: school.id,
      phone: "(512) 555-0201",
    },
  });

  const martinezHousehold = await prisma.household.create({
    data: {
      name: "Martinez Family",
      address: "456 Oak Ave",
      city: "Austin",
      state: "TX",
      zip: "78702",
      billingEmail: "martinez@email.com",
      communicationPref: "EMAIL",
      schoolId: school.id,
      guardians: {
        create: {
          userId: martinezParent.id,
          relationship: "Parent",
          isPrimary: true,
          isPayer: true,
        },
      },
    },
  });

  const student1 = await prisma.student.create({
    data: {
      legalFirstName: "Sofia",
      legalLastName: "Martinez",
      preferredName: "Sofi",
      dateOfBirth: new Date("2018-03-15"),
      gender: "Female",
      grade: "2",
      enrollmentStatus: "ACTIVE",
      startDate: new Date("2025-08-15"),
      schoolId: school.id,
      householdId: martinezHousehold.id,
      cohortId: morningCohort.id,
      tuitionPlanId: fullTimePlan.id,
      tags: ["bilingual", "honors"],
    },
  });

  const student2 = await prisma.student.create({
    data: {
      legalFirstName: "Diego",
      legalLastName: "Martinez",
      dateOfBirth: new Date("2020-07-22"),
      gender: "Male",
      grade: "K",
      enrollmentStatus: "ACTIVE",
      startDate: new Date("2025-08-15"),
      schoolId: school.id,
      householdId: martinezHousehold.id,
      cohortId: morningCohort.id,
      tuitionPlanId: fullTimePlan.id,
    },
  });

  // Family 2: Thompson (TEFA family)
  const thompsonParent = await prisma.user.create({
    data: {
      email: "thompson@email.com",
      passwordHash: parentHash,
      firstName: "James",
      lastName: "Thompson",
      role: "FAMILY",
      schoolId: school.id,
    },
  });

  const thompsonHousehold = await prisma.household.create({
    data: {
      name: "Thompson Family",
      address: "789 Pine Rd",
      city: "Round Rock",
      state: "TX",
      zip: "78664",
      billingEmail: "thompson@email.com",
      communicationPref: "BOTH",
      schoolId: school.id,
      guardians: {
        create: {
          userId: thompsonParent.id,
          relationship: "Parent",
          isPrimary: true,
          isPayer: true,
        },
      },
    },
  });

  const student3 = await prisma.student.create({
    data: {
      legalFirstName: "Emma",
      legalLastName: "Thompson",
      dateOfBirth: new Date("2015-11-03"),
      gender: "Female",
      grade: "5",
      enrollmentStatus: "ACTIVE",
      startDate: new Date("2025-08-15"),
      tefaFlag: true,
      healthAlerts: "Peanut allergy - EpiPen in office",
      schoolId: school.id,
      householdId: thompsonHousehold.id,
      cohortId: afternoonCohort.id,
      tuitionPlanId: hybridPlan.id,
      tags: ["tefa", "allergy-alert"],
    },
  });

  // Family 3: Williams
  const williamsParent = await prisma.user.create({
    data: {
      email: "williams@email.com",
      passwordHash: parentHash,
      firstName: "Lisa",
      lastName: "Williams",
      role: "FAMILY",
      schoolId: school.id,
    },
  });

  const williamsHousehold = await prisma.household.create({
    data: {
      name: "Williams Family",
      address: "321 Cedar Ln",
      city: "Austin",
      state: "TX",
      zip: "78703",
      billingEmail: "williams@email.com",
      schoolId: school.id,
      guardians: {
        create: {
          userId: williamsParent.id,
          relationship: "Parent",
          isPrimary: true,
          isPayer: true,
        },
      },
    },
  });

  const student4 = await prisma.student.create({
    data: {
      legalFirstName: "Liam",
      legalLastName: "Williams",
      dateOfBirth: new Date("2013-05-20"),
      gender: "Male",
      grade: "7",
      enrollmentStatus: "ACTIVE",
      startDate: new Date("2024-08-15"),
      accommodations: "Extra time on tests - 504 plan",
      schoolId: school.id,
      householdId: williamsHousehold.id,
      cohortId: middleCohort.id,
      tuitionPlanId: fullTimePlan.id,
      tags: ["504-plan"],
    },
  });

  // Create grading periods
  const q1 = await prisma.gradingPeriod.create({
    data: {
      name: "Quarter 1",
      startDate: new Date("2025-08-15"),
      endDate: new Date("2025-10-17"),
      schoolId: school.id,
    },
  });

  const q2 = await prisma.gradingPeriod.create({
    data: {
      name: "Quarter 2",
      startDate: new Date("2025-10-20"),
      endDate: new Date("2025-12-19"),
      active: true,
      schoolId: school.id,
    },
  });

  // Create some attendance records for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const student of [student1, student2, student3, student4]) {
    await prisma.attendanceRecord.create({
      data: {
        date: today,
        status: student.id === student3.id ? "ABSENT" : "PRESENT",
        attendanceType: "FULL_DAY",
        absenceReason: student.id === student3.id ? "Doctor appointment" : undefined,
        studentId: student.id,
        cohortId: student.cohortId!,
      },
    });
  }

  // Create invoices
  const invoiceDate = new Date();
  invoiceDate.setDate(1);

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-001",
      amount: 850,
      discount: 85, // sibling discount
      totalDue: 765,
      status: "PAID",
      dueDate: invoiceDate,
      paidDate: new Date(),
      description: "January tuition - Sofia Martinez (sibling discount applied)",
      householdId: martinezHousehold.id,
      tuitionPlanId: fullTimePlan.id,
      expenseCategory: "TUITION",
      payments: {
        create: {
          amount: 765,
          method: "CARD",
          status: "COMPLETED",
          payerType: "FAMILY",
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-002",
      amount: 850,
      totalDue: 850,
      status: "PAID",
      dueDate: invoiceDate,
      paidDate: new Date(),
      description: "January tuition - Diego Martinez",
      householdId: martinezHousehold.id,
      tuitionPlanId: fullTimePlan.id,
      expenseCategory: "TUITION",
      payments: {
        create: {
          amount: 850,
          method: "CARD",
          status: "COMPLETED",
          payerType: "FAMILY",
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-003",
      amount: 550,
      totalDue: 550,
      status: "OVERDUE",
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: "January tuition - Emma Thompson",
      tefaEligible: true,
      expenseCategory: "TUITION",
      householdId: thompsonHousehold.id,
      tuitionPlanId: hybridPlan.id,
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-004",
      amount: 850,
      totalDue: 850,
      status: "PENDING",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      description: "February tuition - Liam Williams",
      householdId: williamsHousehold.id,
      tuitionPlanId: fullTimePlan.id,
      expenseCategory: "TUITION",
    },
  });

  // Create an intervention case
  await prisma.interventionCase.create({
    data: {
      type: "ACADEMIC",
      status: "IN_PROGRESS",
      concern: "Reading comprehension below grade level",
      plan: "Daily 20-minute reading intervention with phonics focus. Biweekly progress monitoring.",
      studentId: student2.id,
      notes: {
        create: [
          {
            content: "Initial assessment shows Diego is reading at a pre-K level. Starting Tier 2 intervention.",
            noteType: "GENERAL",
            authorId: teacher.id,
          },
          {
            content: "Spoke with Maria Martinez about reading support at home. She will read with Diego 15 min/day.",
            noteType: "PARENT_CONTACT",
            authorId: teacher.id,
          },
        ],
      },
    },
  });

  // Create announcements
  await prisma.announcement.create({
    data: {
      title: "Welcome Back to Spring Semester!",
      content:
        "We're excited to welcome everyone back for the spring semester. Please remember to submit any outstanding forms by January 31st.",
      audience: "ALL",
      published: true,
      publishedAt: new Date(),
      schoolId: school.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: "TEFA Updates for 2026-27",
      content:
        "Texas Education Freedom Accounts are now active for the 2026-27 school year. If you're enrolled in TEFA, please make sure your expense documentation is up to date.",
      audience: "FAMILIES",
      published: true,
      publishedAt: new Date(),
      schoolId: school.id,
    },
  });

  // Create calendar events
  await prisma.calendarEvent.create({
    data: {
      title: "Spring Break",
      startDate: new Date("2026-03-16"),
      endDate: new Date("2026-03-20"),
      allDay: true,
      eventType: "HOLIDAY",
      schoolId: school.id,
    },
  });

  await prisma.calendarEvent.create({
    data: {
      title: "Open House",
      description: "Prospective family open house and campus tour",
      startDate: new Date("2026-04-05T10:00:00"),
      endDate: new Date("2026-04-05T12:00:00"),
      eventType: "OPEN_HOUSE",
      location: "Main Campus",
      schoolId: school.id,
    },
  });

  await prisma.calendarEvent.create({
    data: {
      title: "Parent-Teacher Conferences",
      startDate: new Date("2026-04-10"),
      endDate: new Date("2026-04-11"),
      allDay: true,
      eventType: "PARENT_CONFERENCE",
      schoolId: school.id,
    },
  });

  // Create form templates
  await prisma.formTemplate.create({
    data: {
      name: "Enrollment Agreement",
      description: "Annual enrollment contract and handbook acknowledgment",
      required: true,
      eSignature: true,
      fields: [
        { name: "parentName", label: "Parent/Guardian Name", type: "text", required: true },
        { name: "studentName", label: "Student Name", type: "text", required: true },
        { name: "academicYear", label: "Academic Year", type: "text", required: true },
        { name: "handbookAck", label: "I acknowledge receipt of the student handbook", type: "checkbox", required: true },
        { name: "tuitionAck", label: "I agree to the tuition payment terms", type: "checkbox", required: true },
        { name: "signature", label: "Parent/Guardian Signature", type: "signature", required: true },
        { name: "date", label: "Date", type: "date", required: true },
      ],
      schoolId: school.id,
    },
  });

  await prisma.formTemplate.create({
    data: {
      name: "Photo/Media Release",
      description: "Permission for school to use student photos in marketing materials",
      required: false,
      eSignature: true,
      fields: [
        { name: "studentName", label: "Student Name", type: "text", required: true },
        { name: "consent", label: "I grant permission for my child's photo to be used", type: "checkbox", required: true },
        { name: "restrictions", label: "Any restrictions or notes", type: "textarea", required: false },
        { name: "signature", label: "Parent/Guardian Signature", type: "signature", required: true },
      ],
      schoolId: school.id,
    },
  });

  // Create schedule blocks
  const days = [1, 2, 3, 4, 5]; // Mon-Fri
  for (const day of days) {
    await prisma.scheduleBlock.create({
      data: {
        name: "Morning Circle",
        dayOfWeek: day,
        startTime: "08:30",
        endTime: "09:00",
        blockType: "CLASS",
        schoolId: school.id,
        cohortId: morningCohort.id,
      },
    });

    await prisma.scheduleBlock.create({
      data: {
        name: "Math Block",
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "10:00",
        blockType: "CLASS",
        room: "Room A",
        schoolId: school.id,
        cohortId: morningCohort.id,
      },
    });

    await prisma.scheduleBlock.create({
      data: {
        name: "Recess",
        dayOfWeek: day,
        startTime: "10:00",
        endTime: "10:30",
        blockType: "RECESS",
        schoolId: school.id,
        cohortId: morningCohort.id,
      },
    });

    await prisma.scheduleBlock.create({
      data: {
        name: "Reading/ELA",
        dayOfWeek: day,
        startTime: "10:30",
        endTime: "11:30",
        blockType: "CLASS",
        room: "Room A",
        schoolId: school.id,
        cohortId: morningCohort.id,
      },
    });

    await prisma.scheduleBlock.create({
      data: {
        name: "Lunch",
        dayOfWeek: day,
        startTime: "11:30",
        endTime: "12:00",
        blockType: "LUNCH",
        schoolId: school.id,
      },
    });
  }

  // Create waitlist entries
  await prisma.waitlistEntry.create({
    data: {
      position: 1,
      grade: "K",
      childName: "Ava Rodriguez",
      parentName: "Carlos Rodriguez",
      email: "carlos@email.com",
      phone: "(512) 555-0301",
      notes: "Referred by Martinez family",
      schoolId: school.id,
    },
  });

  await prisma.waitlistEntry.create({
    data: {
      position: 2,
      grade: "3",
      childName: "Noah Park",
      parentName: "Jimin Park",
      email: "jimin@email.com",
      schoolId: school.id,
    },
  });

  // Create an application
  await prisma.application.create({
    data: {
      status: "TOUR_COMPLETED",
      tourRequested: true,
      tourDate: new Date("2026-01-15"),
      tourCompleted: true,
      source: "Website",
      notes: "Very interested in the hybrid model. Asked about TEFA compatibility.",
      studentId: student1.id,
      schoolId: school.id,
    },
  });

  console.log("Seed completed successfully!");
  console.log("---");
  console.log("Admin login: admin@brighthorizons.edu / password123");
  console.log("Teacher login: teacher@brighthorizons.edu / password123");
  console.log("Parent login: martinez@email.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
