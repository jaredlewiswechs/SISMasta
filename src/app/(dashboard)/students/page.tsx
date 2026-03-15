"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// ── Mock Data ────────────────────────────────────────────────────────

type EnrollmentStatus = "ACTIVE" | "INQUIRY" | "APPLICANT" | "ACCEPTED" | "WAITLISTED" | "WITHDRAWN" | "GRADUATED";

interface StudentRow {
  id: string;
  legalFirstName: string;
  legalLastName: string;
  preferredName: string | null;
  grade: string;
  cohort: string;
  enrollmentStatus: EnrollmentStatus;
  attendanceRate: number;
  tefaFlag: boolean;
  photoUrl: string | null;
}

const mockStudents: StudentRow[] = [
  { id: "s1", legalFirstName: "Emma", legalLastName: "Rodriguez", preferredName: null, grade: "3rd", cohort: "Alpha", enrollmentStatus: "ACTIVE", attendanceRate: 96, tefaFlag: false, photoUrl: null },
  { id: "s2", legalFirstName: "Liam", legalLastName: "Chen", preferredName: null, grade: "4th", cohort: "Alpha", enrollmentStatus: "ACTIVE", attendanceRate: 100, tefaFlag: true, photoUrl: null },
  { id: "s3", legalFirstName: "Mia", legalLastName: "Johnson", preferredName: null, grade: "3rd", cohort: "Beta", enrollmentStatus: "ACTIVE", attendanceRate: 82, tefaFlag: false, photoUrl: null },
  { id: "s4", legalFirstName: "Noah", legalLastName: "Williams", preferredName: "Noe", grade: "5th", cohort: "Beta", enrollmentStatus: "ACTIVE", attendanceRate: 91, tefaFlag: false, photoUrl: null },
  { id: "s5", legalFirstName: "Ava", legalLastName: "Martinez", preferredName: null, grade: "2nd", cohort: "Alpha", enrollmentStatus: "ACTIVE", attendanceRate: 88, tefaFlag: true, photoUrl: null },
  { id: "s6", legalFirstName: "Ethan", legalLastName: "Brown", preferredName: null, grade: "4th", cohort: "Beta", enrollmentStatus: "ACTIVE", attendanceRate: 94, tefaFlag: false, photoUrl: null },
  { id: "s7", legalFirstName: "Sophia", legalLastName: "Davis", preferredName: "Sophie", grade: "K", cohort: "Gamma", enrollmentStatus: "ACTIVE", attendanceRate: 100, tefaFlag: false, photoUrl: null },
  { id: "s8", legalFirstName: "Jackson", legalLastName: "Wilson", preferredName: null, grade: "1st", cohort: "Gamma", enrollmentStatus: "WAITLISTED", attendanceRate: 0, tefaFlag: false, photoUrl: null },
  { id: "s9", legalFirstName: "Olivia", legalLastName: "Taylor", preferredName: "Liv", grade: "3rd", cohort: "Alpha", enrollmentStatus: "INQUIRY", attendanceRate: 0, tefaFlag: false, photoUrl: null },
  { id: "s10", legalFirstName: "Lucas", legalLastName: "Anderson", preferredName: null, grade: "5th", cohort: "Beta", enrollmentStatus: "WITHDRAWN", attendanceRate: 75, tefaFlag: true, photoUrl: null },
];

const gradeOptions = ["All Grades", "K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const statusOptions: Array<{ label: string; value: string }> = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inquiry", value: "INQUIRY" },
  { label: "Applicant", value: "APPLICANT" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Waitlisted", value: "WAITLISTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
  { label: "Graduated", value: "GRADUATED" },
];
const cohortOptions = ["All Cohorts", "Alpha", "Beta", "Gamma"];

// ── Helpers ──────────────────────────────────────────────────────────

function statusBadgeVariant(status: EnrollmentStatus) {
  switch (status) {
    case "ACTIVE":
      return "success" as const;
    case "INQUIRY":
      return "info" as const;
    case "APPLICANT":
      return "info" as const;
    case "ACCEPTED":
      return "default" as const;
    case "WAITLISTED":
      return "warning" as const;
    case "WITHDRAWN":
      return "secondary" as const;
    case "GRADUATED":
      return "default" as const;
    default:
      return "secondary" as const;
  }
}

function attendanceBadgeVariant(rate: number) {
  if (rate >= 95) return "success" as const;
  if (rate >= 85) return "warning" as const;
  if (rate > 0) return "destructive" as const;
  return "secondary" as const;
}

function displayName(student: StudentRow) {
  const first = student.preferredName || student.legalFirstName;
  return `${first} ${student.legalLastName}`;
}

// ── Page Component ───────────────────────────────────────────────────

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All Grades");
  const [statusFilter, setStatusFilter] = useState("");
  const [cohortFilter, setCohortFilter] = useState("All Cohorts");

  const filteredStudents = mockStudents.filter((s) => {
    const nameMatch = displayName(s).toLowerCase().includes(searchQuery.toLowerCase());
    const gradeMatch = gradeFilter === "All Grades" || s.grade === gradeFilter;
    const statusMatch = !statusFilter || s.enrollmentStatus === statusFilter;
    const cohortMatch = cohortFilter === "All Cohorts" || s.cohort === cohortFilter;
    return nameMatch && gradeMatch && statusMatch && cohortMatch;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500">
            Manage student enrollment, records, and information.
          </p>
        </div>
        <Link href="/students/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-36"
              >
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
              <Select
                value={cohortFilter}
                onChange={(e) => setCohortFilter(e.target.value)}
                className="w-36"
              >
                {cohortOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-gray-500" />
            {filteredStudents.length} Student{filteredStudents.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>TEFA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/students/${student.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                        {student.legalFirstName[0]}
                        {student.legalLastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {displayName(student)}
                        </p>
                        {student.preferredName && (
                          <p className="text-xs text-gray-500">
                            Legal: {student.legalFirstName} {student.legalLastName}
                          </p>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.cohort}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(student.enrollmentStatus)}>
                      {student.enrollmentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.attendanceRate > 0 ? (
                      <Badge variant={attendanceBadgeVariant(student.attendanceRate)}>
                        {student.attendanceRate}%
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.tefaFlag ? (
                      <Badge variant="info">TEFA</Badge>
                    ) : (
                      <span className="text-sm text-gray-400">--</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No students found matching your filters.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
