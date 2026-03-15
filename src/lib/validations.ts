import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  schoolName: z.string().min(1, "School name is required"),
});

export const schoolSetupSchema = z.object({
  name: z.string().min(1, "School name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().default("TX"),
  zip: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional().or(z.literal("")),
  academicModel: z.enum(["FULL_TIME", "HYBRID", "POD", "ENRICHMENT"]),
  billingFrequency: z.enum(["WEEKLY", "MONTHLY", "TERM", "ANNUAL"]),
  gradesServed: z.string().optional(),
  maxCapacity: z.number().int().positive(),
  charterMode: z.boolean().default(false),
});

export const studentSchema = z.object({
  legalFirstName: z.string().min(1, "Legal first name is required"),
  legalLastName: z.string().min(1, "Legal last name is required"),
  preferredName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().optional(),
  grade: z.string().optional(),
  healthAlerts: z.string().optional(),
  accommodations: z.string().optional(),
  tags: z.array(z.string()).default([]),
  scholarshipFlag: z.boolean().default(false),
  tefaFlag: z.boolean().default(false),
  householdId: z.string().min(1, "Household is required"),
  cohortId: z.string().optional(),
  tuitionPlanId: z.string().optional(),
});

export const householdSchema = z.object({
  name: z.string().min(1, "Household name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  billingEmail: z.string().email().optional().or(z.literal("")),
  billingPhone: z.string().optional(),
  communicationPref: z.enum(["EMAIL", "SMS", "BOTH", "IN_APP"]).default("EMAIL"),
  custodyNotes: z.string().optional(),
});

export const tuitionPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  amount: z.number().positive("Amount must be positive"),
  frequency: z.enum(["WEEKLY", "MONTHLY", "TERM", "ANNUAL"]),
  description: z.string().optional(),
  siblingDiscount: z.number().min(0).default(0),
});

export const invoiceSchema = z.object({
  householdId: z.string().min(1, "Household is required"),
  tuitionPlanId: z.string().optional(),
  amount: z.number().positive(),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().optional(),
  expenseCategory: z
    .enum(["TUITION", "INSTRUCTIONAL_MATERIALS", "SERVICES", "FEES", "OTHER"])
    .optional(),
  tefaEligible: z.boolean().default(false),
  lineItems: z
    .array(
      z.object({
        description: z.string(),
        amount: z.number(),
        category: z.string().optional(),
      })
    )
    .optional(),
});

export const attendanceSchema = z.object({
  studentId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum([
    "PRESENT",
    "ABSENT",
    "TARDY",
    "EARLY_PICKUP",
    "EXCUSED_ABSENT",
  ]),
  attendanceType: z
    .enum(["FULL_DAY", "HALF_DAY", "HYBRID_DAY", "ENRICHMENT_ONLY", "OFF_CAMPUS"])
    .default("FULL_DAY"),
  absenceReason: z.string().optional(),
  notes: z.string().optional(),
});

export const messageSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Message content is required"),
  channel: z.enum(["IN_APP", "EMAIL", "SMS"]).default("IN_APP"),
});

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  audience: z.enum(["ALL", "FAMILIES", "STAFF", "COHORT"]).default("ALL"),
  published: z.boolean().default(false),
});

export const interventionSchema = z.object({
  studentId: z.string().min(1),
  type: z.enum([
    "ACADEMIC",
    "BEHAVIORAL",
    "ATTENDANCE",
    "SOCIAL_EMOTIONAL",
    "EXECUTIVE_FUNCTIONING",
    "OTHER",
  ]),
  concern: z.string().min(1, "Concern is required"),
  plan: z.string().optional(),
  accommodations: z.string().optional(),
});

export const progressRecordSchema = z.object({
  studentId: z.string().min(1),
  gradingPeriodId: z.string().min(1),
  subject: z.string().min(1),
  category: z.string().optional(),
  assignmentName: z.string().optional(),
  score: z.number().optional(),
  maxScore: z.number().optional(),
  letterGrade: z.string().optional(),
  masteryLevel: z.enum(["NOT_YET", "APPROACHING", "MEETING", "EXCEEDING"]).optional(),
  narrative: z.string().optional(),
  skillTags: z.array(z.string()).default([]),
  mode: z.enum(["TRADITIONAL", "MASTERY", "NARRATIVE"]).default("TRADITIONAL"),
});

export const calendarEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  allDay: z.boolean().default(false),
  eventType: z
    .enum([
      "GENERAL",
      "HOLIDAY",
      "PROFESSIONAL_DEV",
      "PARENT_CONFERENCE",
      "TOUR",
      "OPEN_HOUSE",
      "ENRICHMENT",
    ])
    .default("GENERAL"),
  recurring: z.boolean().default(false),
  recurrence: z.string().optional(),
  location: z.string().optional(),
});

export const scheduleBlockSchema = z.object({
  name: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  blockType: z
    .enum([
      "CLASS",
      "RECESS",
      "LUNCH",
      "ENRICHMENT",
      "TUTORING",
      "OFFICE_HOURS",
      "ASSEMBLY",
      "OTHER",
    ])
    .default("CLASS"),
  room: z.string().optional(),
  cohortId: z.string().optional(),
});

export const formTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(
    z.object({
      name: z.string(),
      label: z.string(),
      type: z.enum(["text", "textarea", "select", "checkbox", "date", "file", "signature"]),
      required: z.boolean().default(false),
      options: z.array(z.string()).optional(),
    })
  ),
  required: z.boolean().default(false),
  eSignature: z.boolean().default(false),
});

export const applicationSchema = z.object({
  studentId: z.string().min(1),
  source: z.string().optional(),
  tourRequested: z.boolean().default(false),
  tourDate: z.string().optional(),
  notes: z.string().optional(),
});

export const waitlistSchema = z.object({
  grade: z.string().min(1),
  childName: z.string().min(1),
  parentName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});
