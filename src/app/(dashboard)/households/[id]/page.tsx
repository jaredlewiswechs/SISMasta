"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Home,
  Users,
  DollarSign,
  MessageSquare,
  FileText,
  CreditCard,
  GraduationCap,
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

const household = {
  id: "h1",
  name: "Rodriguez Family",
  address: "1234 Oak Lane",
  city: "Austin",
  state: "TX",
  zip: "78701",
  billingEmail: "billing@rodriguez.com",
  billingPhone: "(512) 555-0199",
  communicationPref: "EMAIL",
  custodyNotes: null,
};

const guardians = [
  {
    id: "g1",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    phone: "(512) 555-0123",
    relationship: "Mother",
    isPrimary: true,
    isPayer: true,
    emergencyContacts: [
      { name: "Ana Lopez", phone: "(512) 555-0150", relationship: "Grandmother", priority: 1 },
    ],
  },
  {
    id: "g2",
    name: "Carlos Rodriguez",
    email: "carlos@example.com",
    phone: "(512) 555-0124",
    relationship: "Father",
    isPrimary: false,
    isPayer: false,
    emergencyContacts: [],
  },
];

const students = [
  {
    id: "s1",
    name: "Emma Rodriguez",
    grade: "3rd",
    cohort: "Alpha",
    enrollmentStatus: "ACTIVE",
    attendanceRate: 96,
  },
];

const invoices = [
  { id: "inv1", invoiceNumber: "INV-1050", amount: 1200, totalDue: 1200, status: "PAID", dueDate: "2026-03-01", paidDate: "2026-02-28", description: "March 2026 Tuition" },
  { id: "inv2", invoiceNumber: "INV-1035", amount: 1200, totalDue: 1200, status: "PAID", dueDate: "2026-02-01", paidDate: "2026-01-30", description: "February 2026 Tuition" },
  { id: "inv3", invoiceNumber: "INV-1020", amount: 1200, totalDue: 1200, status: "PAID", dueDate: "2026-01-01", paidDate: "2025-12-29", description: "January 2026 Tuition" },
  { id: "inv4", invoiceNumber: "INV-1005", amount: 1200, totalDue: 1200, status: "PAID", dueDate: "2025-12-01", paidDate: "2025-11-28", description: "December 2025 Tuition" },
];

const messages = [
  { id: "m1", subject: "Peanut allergy reminder", from: "Maria Rodriguez", date: "2026-03-10", read: true, preview: "Just a reminder that Emma has a severe peanut allergy..." },
  { id: "m2", subject: "Conference scheduling", from: "Admin", date: "2026-03-05", read: true, preview: "Thank you for scheduling the parent-teacher conference for..." },
  { id: "m3", subject: "Field trip permission", from: "Admin", date: "2026-02-20", read: true, preview: "Please sign the attached permission form for the upcoming..." },
];

const householdDocuments = [
  { id: "d1", name: "Tuition Contract 2025-26", type: "TUITION_CONTRACT", studentName: "Emma Rodriguez", uploadedAt: "2025-08-01", verified: true },
  { id: "d2", name: "Birth Certificate", type: "BIRTH_CERTIFICATE", studentName: "Emma Rodriguez", uploadedAt: "2024-07-15", verified: true },
  { id: "d3", name: "Immunization Record", type: "IMMUNIZATION_RECORD", studentName: "Emma Rodriguez", uploadedAt: "2024-07-15", verified: true },
  { id: "d4", name: "Handbook Acknowledgment", type: "HANDBOOK_ACK", studentName: "Emma Rodriguez", uploadedAt: "2024-08-01", verified: true },
];

// ── Page Component ───────────────────────────────────────────────────

export default function HouseholdDetailPage() {
  const totalBalance = invoices
    .filter((inv) => inv.status !== "PAID")
    .reduce((sum, inv) => sum + inv.totalDue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/households">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <Home className="h-6 w-6 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {household.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                {household.address}, {household.city}, {household.state}{" "}
                {household.zip}
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Household
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-8 w-8 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Guardians</p>
              <p className="text-xl font-bold">{guardians.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <GraduationCap className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Students</p>
              <p className="text-xl font-bold">{students.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-gray-500">Balance Due</p>
              <p className={`text-xl font-bold ${totalBalance > 0 ? "text-red-600" : "text-green-600"}`}>
                ${totalBalance.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Mail className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Comm. Pref</p>
              <p className="text-xl font-bold">{household.communicationPref}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="guardians">
        <TabsList>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="billing">Billing Ledger</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* ── Guardians Tab ──────────────────────────────────── */}
        <TabsContent value="guardians">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {guardians.map((guardian) => (
              <Card key={guardian.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{guardian.name}</CardTitle>
                    <div className="flex gap-1">
                      <Badge variant="secondary">{guardian.relationship}</Badge>
                      {guardian.isPrimary && <Badge variant="default">Primary</Badge>}
                      {guardian.isPayer && <Badge variant="info">Payer</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {guardian.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {guardian.phone}
                  </div>
                  {guardian.emergencyContacts.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Emergency Contacts
                      </p>
                      {guardian.emergencyContacts.map((ec, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>
                            {ec.name} ({ec.relationship})
                          </span>
                          <span className="text-gray-500">{ec.phone}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Students Tab ───────────────────────────────────── */}
        <TabsContent value="students">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Cohort</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <Link
                          href={`/students/${s.id}`}
                          className="font-medium text-indigo-600 hover:underline"
                        >
                          {s.name}
                        </Link>
                      </TableCell>
                      <TableCell>{s.grade}</TableCell>
                      <TableCell>{s.cohort}</TableCell>
                      <TableCell>
                        <Badge variant="success">{s.enrollmentStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">{s.attendanceRate}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Billing Ledger Tab ─────────────────────────────── */}
        <TabsContent value="billing">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                Invoice History
              </CardTitle>
              <div className="text-sm text-gray-500">
                Billing email: {household.billingEmail}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">
                        {inv.invoiceNumber}
                      </TableCell>
                      <TableCell>{inv.description}</TableCell>
                      <TableCell>${inv.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inv.status === "PAID"
                              ? "success"
                              : inv.status === "OVERDUE"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {inv.paidDate
                          ? new Date(inv.paidDate).toLocaleDateString()
                          : "--"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Communication Tab ──────────────────────────────── */}
        <TabsContent value="communication">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                Message History
              </CardTitle>
              <Button size="sm">
                <Mail className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start gap-3 rounded-md border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {msg.subject}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">From: {msg.from}</p>
                      <p className="mt-1 text-sm text-gray-600 truncate">
                        {msg.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Documents Tab ──────────────────────────────────── */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                Family Documents
              </CardTitle>
              <Button size="sm">Upload Document</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Uploaded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {householdDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {doc.type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.studentName}</TableCell>
                      <TableCell>
                        {doc.verified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
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
