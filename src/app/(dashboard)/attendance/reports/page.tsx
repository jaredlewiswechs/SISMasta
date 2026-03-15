"use client";

import { useState } from "react";
import {
  Download,
  BarChart3,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface CohortSummary {
  name: string;
  present: number;
  absent: number;
  tardy: number;
  excused: number;
  total: number;
}

interface StudentTimeline {
  id: string;
  name: string;
  grade: string;
  cohort: string;
  attendanceRate: number;
  days: { date: string; status: "present" | "absent" | "tardy" | "excused" }[];
}

interface AbsencePattern {
  studentName: string;
  pattern: string;
  frequency: number;
  severity: "low" | "medium" | "high";
}

const COHORT_SUMMARIES: CohortSummary[] = [
  { name: "Morning Cohort", present: 88, absent: 5, tardy: 4, excused: 3, total: 100 },
  { name: "Afternoon Cohort", present: 82, absent: 8, tardy: 6, excused: 4, total: 100 },
  { name: "Tuesday/Thursday", present: 45, absent: 2, tardy: 1, excused: 2, total: 50 },
  { name: "Enrichment Group", present: 28, absent: 1, tardy: 1, excused: 0, total: 30 },
];

const STUDENT_TIMELINES: StudentTimeline[] = [
  {
    id: "s1", name: "Aiden Chen", grade: "3", cohort: "Morning", attendanceRate: 95,
    days: [
      { date: "Mar 3", status: "present" }, { date: "Mar 4", status: "present" },
      { date: "Mar 5", status: "tardy" }, { date: "Mar 6", status: "present" },
      { date: "Mar 7", status: "present" }, { date: "Mar 10", status: "present" },
      { date: "Mar 11", status: "present" }, { date: "Mar 12", status: "absent" },
      { date: "Mar 13", status: "present" }, { date: "Mar 14", status: "present" },
    ],
  },
  {
    id: "s2", name: "Bella Rodriguez", grade: "3", cohort: "Morning", attendanceRate: 80,
    days: [
      { date: "Mar 3", status: "present" }, { date: "Mar 4", status: "absent" },
      { date: "Mar 5", status: "absent" }, { date: "Mar 6", status: "present" },
      { date: "Mar 7", status: "present" }, { date: "Mar 10", status: "tardy" },
      { date: "Mar 11", status: "present" }, { date: "Mar 12", status: "present" },
      { date: "Mar 13", status: "absent" }, { date: "Mar 14", status: "present" },
    ],
  },
  {
    id: "s3", name: "Carlos Nguyen", grade: "4", cohort: "Morning", attendanceRate: 100,
    days: [
      { date: "Mar 3", status: "present" }, { date: "Mar 4", status: "present" },
      { date: "Mar 5", status: "present" }, { date: "Mar 6", status: "present" },
      { date: "Mar 7", status: "present" }, { date: "Mar 10", status: "present" },
      { date: "Mar 11", status: "present" }, { date: "Mar 12", status: "present" },
      { date: "Mar 13", status: "present" }, { date: "Mar 14", status: "present" },
    ],
  },
  {
    id: "s6", name: "Fiona Davis", grade: "5", cohort: "Afternoon", attendanceRate: 70,
    days: [
      { date: "Mar 3", status: "absent" }, { date: "Mar 4", status: "absent" },
      { date: "Mar 5", status: "present" }, { date: "Mar 6", status: "tardy" },
      { date: "Mar 7", status: "present" }, { date: "Mar 10", status: "absent" },
      { date: "Mar 11", status: "excused" }, { date: "Mar 12", status: "present" },
      { date: "Mar 13", status: "present" }, { date: "Mar 14", status: "present" },
    ],
  },
  {
    id: "s7", name: "Gabriel Martinez", grade: "5", cohort: "Afternoon", attendanceRate: 90,
    days: [
      { date: "Mar 3", status: "present" }, { date: "Mar 4", status: "present" },
      { date: "Mar 5", status: "present" }, { date: "Mar 6", status: "absent" },
      { date: "Mar 7", status: "present" }, { date: "Mar 10", status: "present" },
      { date: "Mar 11", status: "present" }, { date: "Mar 12", status: "present" },
      { date: "Mar 13", status: "tardy" }, { date: "Mar 14", status: "present" },
    ],
  },
];

const ABSENCE_PATTERNS: AbsencePattern[] = [
  { studentName: "Fiona Davis", pattern: "Frequent Monday absences", frequency: 4, severity: "high" },
  { studentName: "Bella Rodriguez", pattern: "Consecutive day absences", frequency: 3, severity: "medium" },
  { studentName: "Isaac Brown", pattern: "Increasing tardy trend", frequency: 2, severity: "low" },
  { studentName: "Hannah Taylor", pattern: "Friday absences pattern", frequency: 2, severity: "medium" },
];

const STATUS_COLORS: Record<string, string> = {
  present: "bg-green-400",
  absent: "bg-red-400",
  tardy: "bg-yellow-400",
  excused: "bg-blue-400",
};

const SEVERITY_BADGE: Record<string, "destructive" | "warning" | "default"> = {
  high: "destructive",
  medium: "warning",
  low: "default",
};

export default function AttendanceReportsPage() {
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("2026-03-15");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterCohort, setFilterCohort] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"charts" | "timeline">("charts");

  const filteredTimelines = STUDENT_TIMELINES.filter((s) => {
    if (filterStudent && !s.name.toLowerCase().includes(filterStudent.toLowerCase())) return false;
    if (filterCohort !== "all" && s.cohort.toLowerCase() !== filterCohort) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-sm text-gray-500">Analyze attendance patterns and trends</p>
        </div>
        <Button variant="outline">
          <Download className="mr-1 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">End Date</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="w-48">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Cohort</label>
              <Select value={filterCohort} onChange={(e) => setFilterCohort(e.target.value)}>
                <option value="all">All Cohorts</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
              </Select>
            </div>
            <div className="w-40">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="tardy">Tardy</option>
                <option value="excused">Excused</option>
              </Select>
            </div>
            <div className="w-52">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Search Student</label>
              <Input
                placeholder="Student name..."
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === "charts" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setViewMode("charts")}
        >
          <BarChart3 className="mr-1 h-4 w-4" />
          Summary Charts
        </Button>
        <Button
          variant={viewMode === "timeline" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setViewMode("timeline")}
        >
          <CalendarDays className="mr-1 h-4 w-4" />
          Student Timeline
        </Button>
      </div>

      {viewMode === "charts" && (
        <>
          {/* Cohort Summary Bar Charts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-500" />
                Attendance by Cohort
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {COHORT_SUMMARIES.map((cohort) => (
                  <div key={cohort.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{cohort.name}</span>
                      <span className="text-sm text-gray-500">
                        {Math.round((cohort.present / cohort.total) * 100)}% present
                      </span>
                    </div>
                    <div className="flex h-8 overflow-hidden rounded-md">
                      <div className="bg-green-400 transition-all" style={{ width: `${(cohort.present / cohort.total) * 100}%` }} title={`Present: ${cohort.present}`} />
                      <div className="bg-red-400 transition-all" style={{ width: `${(cohort.absent / cohort.total) * 100}%` }} title={`Absent: ${cohort.absent}`} />
                      <div className="bg-yellow-400 transition-all" style={{ width: `${(cohort.tardy / cohort.total) * 100}%` }} title={`Tardy: ${cohort.tardy}`} />
                      <div className="bg-blue-400 transition-all" style={{ width: `${(cohort.excused / cohort.total) * 100}%` }} title={`Excused: ${cohort.excused}`} />
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-400" /> Present: {cohort.present}</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" /> Absent: {cohort.absent}</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-400" /> Tardy: {cohort.tardy}</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400" /> Excused: {cohort.excused}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Absence Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Absence Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ABSENCE_PATTERNS.map((pattern, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                        {pattern.studentName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{pattern.studentName}</p>
                        <p className="text-xs text-gray-500">{pattern.pattern}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{pattern.frequency} occurrences</span>
                      <Badge variant={SEVERITY_BADGE[pattern.severity]}>{pattern.severity}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              Student Attendance Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTimelines.map((student) => (
                <div key={student.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">Grade {student.grade} - {student.cohort}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${student.attendanceRate >= 90 ? "text-green-600" : student.attendanceRate >= 80 ? "text-yellow-600" : "text-red-600"}`}>
                        {student.attendanceRate}%
                      </p>
                      <p className="text-xs text-gray-500">Attendance Rate</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {student.days.map((day, idx) => (
                      <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                        <div className={`h-6 w-full rounded ${STATUS_COLORS[day.status]}`} title={`${day.date}: ${day.status}`} />
                        <span className="text-[10px] text-gray-400">{day.date.split(" ")[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Present</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Absent</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-yellow-400" /> Tardy</span>
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Excused</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
