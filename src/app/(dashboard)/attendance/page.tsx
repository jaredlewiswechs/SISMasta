"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Save,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type AttendanceStatus = "present" | "absent" | "tardy" | "excused";
type AttendanceType = "full-day" | "half-day" | "hybrid" | "enrichment" | "off-campus";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  cohort: string;
}

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  type: AttendanceType;
  absenceReason: string;
  notes: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: "s1", firstName: "Aiden", lastName: "Chen", grade: "3", cohort: "morning" },
  { id: "s2", firstName: "Bella", lastName: "Rodriguez", grade: "3", cohort: "morning" },
  { id: "s3", firstName: "Carlos", lastName: "Nguyen", grade: "4", cohort: "morning" },
  { id: "s4", firstName: "Daisy", lastName: "Park", grade: "4", cohort: "morning" },
  { id: "s5", firstName: "Ethan", lastName: "Williams", grade: "3", cohort: "morning" },
  { id: "s6", firstName: "Fiona", lastName: "Davis", grade: "5", cohort: "afternoon" },
  { id: "s7", firstName: "Gabriel", lastName: "Martinez", grade: "5", cohort: "afternoon" },
  { id: "s8", firstName: "Hannah", lastName: "Taylor", grade: "4", cohort: "afternoon" },
  { id: "s9", firstName: "Isaac", lastName: "Brown", grade: "5", cohort: "afternoon" },
  { id: "s10", firstName: "Julia", lastName: "Wilson", grade: "3", cohort: "afternoon" },
];

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; activeColor: string; icon: typeof CheckCircle }> = {
  present: { label: "Present", color: "text-gray-400 hover:text-green-600", activeColor: "text-white bg-green-500", icon: CheckCircle },
  absent: { label: "Absent", color: "text-gray-400 hover:text-red-600", activeColor: "text-white bg-red-500", icon: XCircle },
  tardy: { label: "Tardy", color: "text-gray-400 hover:text-yellow-600", activeColor: "text-white bg-yellow-500", icon: Clock },
  excused: { label: "Excused", color: "text-gray-400 hover:text-blue-600", activeColor: "text-white bg-blue-500", icon: ShieldCheck },
};

const ATTENDANCE_TYPES: { label: string; value: AttendanceType }[] = [
  { label: "Full Day", value: "full-day" },
  { label: "Half Day", value: "half-day" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Enrichment", value: "enrichment" },
  { label: "Off-Campus", value: "off-campus" },
];

function getToday(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [activeCohort, setActiveCohort] = useState("all");
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>(() => {
    const initial: Record<string, AttendanceRecord> = {};
    MOCK_STUDENTS.forEach((s) => {
      initial[s.id] = {
        studentId: s.id,
        status: "present",
        type: "full-day",
        absenceReason: "",
        notes: "",
      };
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);

  const filteredStudents = activeCohort === "all"
    ? MOCK_STUDENTS
    : MOCK_STUDENTS.filter((s) => s.cohort === activeCohort);

  const updateRecord = (studentId: string, field: keyof AttendanceRecord, value: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const markAllPresent = () => {
    setRecords((prev) => {
      const updated = { ...prev };
      filteredStudents.forEach((s) => {
        updated[s.id] = { ...updated[s.id], status: "present", absenceReason: "" };
      });
      return updated;
    });
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const presentCount = filteredStudents.filter((s) => records[s.id]?.status === "present").length;
  const absentCount = filteredStudents.filter((s) => records[s.id]?.status === "absent").length;
  const tardyCount = filteredStudents.filter((s) => records[s.id]?.status === "tardy").length;
  const excusedCount = filteredStudents.filter((s) => records[s.id]?.status === "excused").length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500">Record daily student attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
          <Button variant="secondary" onClick={markAllPresent}>
            <CheckCircle className="mr-1 h-4 w-4" />
            Mark All Present
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-xs text-gray-500">Present</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-red-100 p-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{tardyCount}</p>
              <p className="text-xs text-gray-500">Tardy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-blue-100 p-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{excusedCount}</p>
              <p className="text-xs text-gray-500">Excused</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Tabs */}
      <Tabs defaultValue="all" value={activeCohort} onValueChange={setActiveCohort}>
        <TabsList>
          <TabsTrigger value="all">All Students (10)</TabsTrigger>
          <TabsTrigger value="morning">Morning Cohort (5)</TabsTrigger>
          <TabsTrigger value="afternoon">Afternoon Cohort (5)</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCohort}>
          {/* Student Roster */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const record = records[student.id];
                  return (
                    <div key={student.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      {/* Student Info */}
                      <div className="flex items-center gap-3 sm:w-48">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-xs text-gray-500">Grade {student.grade}</p>
                        </div>
                      </div>

                      {/* Status Buttons */}
                      <div className="flex items-center gap-1">
                        {(Object.entries(STATUS_CONFIG) as [AttendanceStatus, typeof STATUS_CONFIG[AttendanceStatus]][]).map(
                          ([status, config]) => {
                            const Icon = config.icon;
                            const isActive = record.status === status;
                            return (
                              <button
                                key={status}
                                onClick={() => updateRecord(student.id, "status", status)}
                                className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                  isActive ? config.activeColor : config.color
                                }`}
                                title={config.label}
                              >
                                <Icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{config.label}</span>
                              </button>
                            );
                          }
                        )}
                      </div>

                      {/* Attendance Type */}
                      <div className="sm:w-40">
                        <Select
                          value={record.type}
                          onChange={(e) => updateRecord(student.id, "type", e.target.value)}
                          className="text-xs"
                        >
                          {ATTENDANCE_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </Select>
                      </div>

                      {/* Absence Reason (shown when absent) */}
                      {record.status === "absent" && (
                        <div className="sm:w-44">
                          <Input
                            placeholder="Absence reason..."
                            value={record.absenceReason}
                            onChange={(e) => updateRecord(student.id, "absenceReason", e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      )}

                      {/* Notes */}
                      <div className="flex-1">
                        <Input
                          placeholder="Notes..."
                          value={record.notes}
                          onChange={(e) => updateRecord(student.id, "notes", e.target.value)}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
