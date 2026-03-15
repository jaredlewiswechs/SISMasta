"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  Heart,
  Shield,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// ── Mock Data ────────────────────────────────────────────────────────

const student = {
  id: "s1",
  legalFirstName: "Emma",
  legalLastName: "Rodriguez",
  preferredName: null,
  dateOfBirth: "2017-05-14",
  gender: "Female",
  grade: "3rd",
  enrollmentStatus: "ACTIVE" as const,
  startDate: "2024-08-19",
  exitDate: null,
  healthAlerts: "Peanut allergy (EpiPen in office). Mild asthma - uses inhaler as needed.",
  accommodations: "Preferential seating near front. Extra time on written assignments (1.5x).",
  tags: ["Gifted Math", "Art Club", "Spanish Immersion"],
  scholarshipFlag: false,
  tefaFlag: false,
  photoUrl: null,
  cohort: "Alpha (K-2)",
  tuitionPlan: "Full-Time Monthly - $1,200/mo",
  household: {
    id: "h1",
    name: "Rodriguez Family",
    address: "1234 Oak Lane, Austin, TX 78701",
    guardians: [
      { name: "Maria Rodriguez", relationship: "Mother", phone: "(512) 555-0123", email: "maria@example.com", isPrimary: true },
      { name: "Carlos Rodriguez", relationship: "Father", phone: "(512) 555-0124", email: "carlos@example.com", isPrimary: false },
    ],
  },
};

const attendanceRecords = [
  { date: "2026-03-14", status: "PRESENT", type: "FULL_DAY", checkin: "8:02 AM", checkout: "3:15 PM" },
  { date: "2026-03-13", status: "PRESENT", type: "FULL_DAY", checkin: "7:58 AM", checkout: "3:10 PM" },
  { date: "2026-03-12", status: "TARDY", type: "FULL_DAY", checkin: "8:22 AM", checkout: "3:15 PM" },
  { date: "2026-03-11", status: "PRESENT", type: "FULL_DAY", checkin: "7:55 AM", checkout: "3:12 PM" },
  { date: "2026-03-10", status: "EXCUSED_ABSENT", type: "FULL_DAY", checkin: null, checkout: null },
  { date: "2026-03-07", status: "PRESENT", type: "FULL_DAY", checkin: "8:00 AM", checkout: "3:15 PM" },
];

const progressRecords = [
  { subject: "Mathematics", score: 92, maxScore: 100, letterGrade: "A", masteryLevel: "EXCEEDING", period: "Q3 2025-26" },
  { subject: "ELA", score: 85, maxScore: 100, letterGrade: "B+", masteryLevel: "MEETING", period: "Q3 2025-26" },
  { subject: "Science", score: 88, maxScore: 100, letterGrade: "B+", masteryLevel: "MEETING", period: "Q3 2025-26" },
  { subject: "Social Studies", score: 95, maxScore: 100, letterGrade: "A", masteryLevel: "EXCEEDING", period: "Q3 2025-26" },
  { subject: "Art", score: 90, maxScore: 100, letterGrade: "A-", masteryLevel: "MEETING", period: "Q3 2025-26" },
];

const documents = [
  { id: "d1", name: "Birth Certificate", type: "BIRTH_CERTIFICATE", verified: true, uploadedAt: "2024-07-15" },
  { id: "d2", name: "Immunization Record", type: "IMMUNIZATION_RECORD", verified: true, uploadedAt: "2024-07-15" },
  { id: "d3", name: "Handbook Acknowledgment", type: "HANDBOOK_ACK", verified: true, uploadedAt: "2024-08-01" },
  { id: "d4", name: "Photo Release Form", type: "PHOTO_RELEASE", verified: false, uploadedAt: "2024-08-10" },
];

const interventions = [
  {
    id: "i1",
    type: "ACADEMIC",
    status: "MONITORING",
    concern: "Below grade level in reading fluency",
    plan: "Weekly 1-on-1 reading sessions with Mrs. Davis. Daily 15-minute home reading log.",
    startDate: "2025-10-01",
    followUpDate: "2026-04-01",
    notes: [
      { content: "Reading level improved from F to H. Continue monitoring.", date: "2026-02-15", author: "Mrs. Davis" },
      { content: "Parent conference completed. Family committed to daily reading.", date: "2025-10-15", author: "Mrs. Davis" },
    ],
  },
];

const billingRecords = [
  { invoiceNumber: "INV-1050", amount: 1200, status: "PAID", dueDate: "2026-03-01", paidDate: "2026-02-28" },
  { invoiceNumber: "INV-1035", amount: 1200, status: "PAID", dueDate: "2026-02-01", paidDate: "2026-01-30" },
  { invoiceNumber: "INV-1020", amount: 1200, status: "PAID", dueDate: "2026-01-01", paidDate: "2025-12-29" },
];

const enrollmentHistory = [
  { year: "2025-26", type: "RETURNING", status: "ACTIVE", date: "2025-08-18" },
  { year: "2024-25", type: "NEW", status: "ACTIVE", date: "2024-08-19" },
];

// ── Helpers ──────────────────────────────────────────────────────────

function attendanceStatusIcon(status: string) {
  switch (status) {
    case "PRESENT":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "TARDY":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "ABSENT":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "EXCUSED_ABSENT":
      return <XCircle className="h-4 w-4 text-gray-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

function masteryColor(level: string) {
  switch (level) {
    case "EXCEEDING":
      return "success" as const;
    case "MEETING":
      return "info" as const;
    case "APPROACHING":
      return "warning" as const;
    case "NOT_YET":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

// ── Page Component ───────────────────────────────────────────────────

export default function StudentDetailPage() {
  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
              ER
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {student.legalFirstName} {student.legalLastName}
                </h1>
                <Badge variant="success">{student.enrollmentStatus}</Badge>
              </div>
              <p className="text-sm text-gray-500">
                {student.grade} Grade &middot; {student.cohort} &middot; DOB:{" "}
                {new Date(student.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Student
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ──────────────────────────────────── */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Contact & Household */}
            <Card>
              <CardHeader>
                <CardTitle>Household & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link
                  href={`/households/${student.household.id}`}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  {student.household.name}
                </Link>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  {student.household.address}
                </div>
                <div className="space-y-3 pt-2">
                  {student.household.guardians.map((g, i) => (
                    <div key={i} className="rounded-md border border-gray-100 p-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{g.name}</p>
                        <Badge variant="secondary">{g.relationship}</Badge>
                        {g.isPrimary && <Badge variant="default">Primary</Badge>}
                      </div>
                      <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {g.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {g.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health & Accommodations */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Health Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {student.healthAlerts || "No health alerts on file."}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Accommodations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {student.accommodations || "No accommodations on file."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enrollment History */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollmentHistory.map((e, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{e.year}</TableCell>
                        <TableCell>{e.type}</TableCell>
                        <TableCell>
                          <Badge variant="success">{e.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Attendance Tab ─────────────────────────────────── */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Attendance Records</CardTitle>
              <Badge variant="success">96% this term</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {attendanceStatusIcon(r.status)}
                          <span className="text-sm">{r.status.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{r.type.replace("_", " ")}</TableCell>
                      <TableCell>{r.checkin || "--"}</TableCell>
                      <TableCell>{r.checkout || "--"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Progress Tab ───────────────────────────────────── */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Academic Progress - Q3 2025-26
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Letter Grade</TableHead>
                    <TableHead>Mastery Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progressRecords.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.subject}</TableCell>
                      <TableCell>
                        {r.score}/{r.maxScore}
                      </TableCell>
                      <TableCell>{r.letterGrade}</TableCell>
                      <TableCell>
                        <Badge variant={masteryColor(r.masteryLevel)}>
                          {r.masteryLevel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Documents Tab ──────────────────────────────────── */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                Student Documents
              </CardTitle>
              <Button size="sm">Upload Document</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Uploaded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {d.type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {d.verified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                      </TableCell>
                      <TableCell>{new Date(d.uploadedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Interventions Tab ──────────────────────────────── */}
        <TabsContent value="interventions">
          <div className="space-y-4">
            {interventions.map((intervention) => (
              <Card key={intervention.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      {intervention.type} Intervention
                    </CardTitle>
                    <Badge variant="warning">{intervention.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Concern</p>
                    <p className="text-sm text-gray-900">{intervention.concern}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Plan</p>
                    <p className="text-sm text-gray-900">{intervention.plan}</p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>
                      Started: {new Date(intervention.startDate).toLocaleDateString()}
                    </span>
                    {intervention.followUpDate && (
                      <span>
                        Follow-up: {new Date(intervention.followUpDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {intervention.notes.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                      <div className="space-y-3">
                        {intervention.notes.map((note, i) => (
                          <div key={i} className="rounded-md bg-gray-50 p-3">
                            <p className="text-sm text-gray-900">{note.content}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {note.author} &middot;{" "}
                              {new Date(note.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Billing Tab ────────────────────────────────────── */}
        <TabsContent value="billing">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Billing History
              </CardTitle>
              <p className="text-sm text-gray-500">
                Plan: {student.tuitionPlan}
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingRecords.map((b, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{b.invoiceNumber}</TableCell>
                      <TableCell>${b.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="success">{b.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(b.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {b.paidDate
                          ? new Date(b.paidDate).toLocaleDateString()
                          : "--"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
