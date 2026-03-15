"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AttendanceStatus = "present" | "absent" | "tardy" | "excused";

interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  note?: string;
}

const mockAttendance: AttendanceRecord[] = [
  { date: "2026-03-02", status: "present" },
  { date: "2026-03-03", status: "present" },
  { date: "2026-03-04", status: "present" },
  { date: "2026-03-05", status: "tardy", note: "Arrived 15 min late" },
  { date: "2026-03-06", status: "present" },
  { date: "2026-03-09", status: "present" },
  { date: "2026-03-10", status: "absent", note: "Sick day" },
  { date: "2026-03-11", status: "excused", note: "Doctor appointment" },
  { date: "2026-03-12", status: "present" },
  { date: "2026-03-13", status: "present" },
];

const statusColors: Record<AttendanceStatus, { bg: string; dot: string; text: string }> = {
  present: { bg: "bg-green-50", dot: "bg-green-500", text: "text-green-700" },
  absent: { bg: "bg-red-50", dot: "bg-red-500", text: "text-red-700" },
  tardy: { bg: "bg-yellow-50", dot: "bg-yellow-500", text: "text-yellow-700" },
  excused: { bg: "bg-blue-50", dot: "bg-blue-500", text: "text-blue-700" },
};

const statusIcons: Record<AttendanceStatus, React.ElementType> = {
  present: CheckCircle2,
  absent: XCircle,
  tardy: Clock,
  excused: AlertTriangle,
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function AttendancePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2)); // March 2026
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);
  const [absenceForm, setAbsenceForm] = useState({
    date: "",
    reason: "",
    notes: "",
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const getAttendance = (day: number): AttendanceRecord | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return mockAttendance.find((a) => a.date === dateStr);
  };

  const summary = {
    present: mockAttendance.filter((a) => a.status === "present").length,
    absent: mockAttendance.filter((a) => a.status === "absent").length,
    tardy: mockAttendance.filter((a) => a.status === "tardy").length,
    excused: mockAttendance.filter((a) => a.status === "excused").length,
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const handleSubmitAbsence = () => {
    setShowAbsenceForm(false);
    setAbsenceForm({ date: "", reason: "", notes: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-500">Emma Johnson - 3rd Grade</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowAbsenceForm(!showAbsenceForm)}>
          <Send className="h-4 w-4" />
          Submit Absence
        </Button>
      </div>

      {/* Submit Absence Form */}
      {showAbsenceForm && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <h3 className="mb-3 font-semibold text-gray-900">Submit an Absence</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Date"
              type="date"
              value={absenceForm.date}
              onChange={(e) => setAbsenceForm({ ...absenceForm, date: e.target.value })}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Reason</label>
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={absenceForm.reason}
                onChange={(e) => setAbsenceForm({ ...absenceForm, reason: e.target.value })}
              >
                <option value="">Select reason...</option>
                <option value="illness">Illness</option>
                <option value="appointment">Medical Appointment</option>
                <option value="family">Family Emergency</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input
              label="Notes (optional)"
              value={absenceForm.notes}
              onChange={(e) => setAbsenceForm({ ...absenceForm, notes: e.target.value })}
              placeholder="Additional details"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={handleSubmitAbsence}>Submit</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAbsenceForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { key: "present", label: "Present", icon: CheckCircle2 },
            { key: "absent", label: "Absent", icon: XCircle },
            { key: "tardy", label: "Tardy", icon: Clock },
            { key: "excused", label: "Excused", icon: AlertTriangle },
          ] as const
        ).map((item) => (
          <div
            key={item.key}
            className={`rounded-lg border p-4 ${statusColors[item.key].bg}`}
          >
            <div className="flex items-center gap-2">
              <item.icon className={`h-4 w-4 ${statusColors[item.key].text}`} />
              <span className={`text-sm font-medium ${statusColors[item.key].text}`}>
                {item.label}
              </span>
            </div>
            <p className={`mt-1 text-2xl font-bold ${statusColors[item.key].text}`}>
              {summary[item.key]}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={prevMonth} className="rounded p-1 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{monthName}</h2>
          <button onClick={nextMonth} className="rounded p-1 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium uppercase text-gray-500"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const record = getAttendance(day);
            const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;
            return (
              <div
                key={day}
                className={`relative flex flex-col items-center rounded-lg p-2 text-sm ${
                  isWeekend ? "bg-gray-50 text-gray-400" : "text-gray-700"
                } ${record ? statusColors[record.status].bg : ""}`}
              >
                <span className="font-medium">{day}</span>
                {record && (
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${statusColors[record.status].dot}`}
                    title={`${record.status}${record.note ? `: ${record.note}` : ""}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          {(["present", "absent", "tardy", "excused"] as const).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status].dot}`} />
              <span className="capitalize">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Timeline */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Attendance</h2>
        <div className="space-y-3">
          {[...mockAttendance].reverse().map((record) => {
            const Icon = statusIcons[record.status];
            const colors = statusColors[record.status];
            return (
              <div
                key={record.date}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className={`rounded-lg p-2 ${colors.bg}`}>
                  <Icon className={`h-4 w-4 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 capitalize">{record.status}</span>
                    <span className="text-sm text-gray-500">{record.date}</span>
                  </div>
                  {record.note && (
                    <p className="text-sm text-gray-500">{record.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
