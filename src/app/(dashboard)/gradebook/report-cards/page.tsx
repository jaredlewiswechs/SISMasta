"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Send,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

type ReportCardStatus = "draft" | "published" | "not-started";

interface StudentReportCard {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  status: ReportCardStatus;
  lastUpdated: string;
  subjects: {
    name: string;
    grade: string;
    masteryLevel: string;
    comment: string;
  }[];
  teacherComment: string;
  attendanceSummary: { present: number; absent: number; tardy: number };
}

const GRADING_PERIODS = [
  { label: "Q1 - Fall 2025", value: "q1" },
  { label: "Q2 - Winter 2025-26", value: "q2" },
  { label: "Q3 - Spring 2026", value: "q3" },
];

const MOCK_REPORT_CARDS: StudentReportCard[] = [
  {
    id: "s1", firstName: "Aiden", lastName: "Chen", grade: "3", status: "published", lastUpdated: "2026-03-10",
    subjects: [
      { name: "Mathematics", grade: "A", masteryLevel: "Exceeding", comment: "Excellent problem-solving skills." },
      { name: "English Language Arts", grade: "B+", masteryLevel: "Meeting", comment: "Strong reader, improving writing." },
      { name: "Science", grade: "A-", masteryLevel: "Meeting", comment: "Curious and engaged in experiments." },
      { name: "Social Studies", grade: "B", masteryLevel: "Meeting", comment: "Good participation in discussions." },
    ],
    teacherComment: "Aiden is a motivated student who consistently exceeds expectations in math. He shows natural curiosity and leadership during group activities.",
    attendanceSummary: { present: 42, absent: 1, tardy: 2 },
  },
  {
    id: "s2", firstName: "Bella", lastName: "Rodriguez", grade: "3", status: "draft", lastUpdated: "2026-03-12",
    subjects: [
      { name: "Mathematics", grade: "B", masteryLevel: "Meeting", comment: "Solid understanding of concepts." },
      { name: "English Language Arts", grade: "A", masteryLevel: "Exceeding", comment: "Exceptional creative writing skills." },
      { name: "Science", grade: "B+", masteryLevel: "Meeting", comment: "Works well in lab settings." },
      { name: "Social Studies", grade: "A-", masteryLevel: "Meeting", comment: "Excellent research projects." },
    ],
    teacherComment: "Bella brings creativity and enthusiasm to the classroom. Her writing has shown remarkable growth this quarter.",
    attendanceSummary: { present: 38, absent: 4, tardy: 3 },
  },
  {
    id: "s3", firstName: "Carlos", lastName: "Nguyen", grade: "4", status: "draft", lastUpdated: "2026-03-11",
    subjects: [
      { name: "Mathematics", grade: "A-", masteryLevel: "Meeting", comment: "Strong computational skills." },
      { name: "English Language Arts", grade: "B", masteryLevel: "Approaching", comment: "Improving reading comprehension." },
      { name: "Science", grade: "A", masteryLevel: "Exceeding", comment: "Outstanding scientific inquiry." },
      { name: "Social Studies", grade: "B+", masteryLevel: "Meeting", comment: "Good analytical thinking." },
    ],
    teacherComment: "Carlos excels in science and math. We are working together on building stronger reading habits.",
    attendanceSummary: { present: 45, absent: 0, tardy: 0 },
  },
  {
    id: "s4", firstName: "Daisy", lastName: "Park", grade: "4", status: "not-started", lastUpdated: "",
    subjects: [
      { name: "Mathematics", grade: "B+", masteryLevel: "Meeting", comment: "" },
      { name: "English Language Arts", grade: "A-", masteryLevel: "Meeting", comment: "" },
      { name: "Science", grade: "B", masteryLevel: "Approaching", comment: "" },
      { name: "Social Studies", grade: "B+", masteryLevel: "Meeting", comment: "" },
    ],
    teacherComment: "",
    attendanceSummary: { present: 40, absent: 3, tardy: 2 },
  },
  {
    id: "s5", firstName: "Ethan", lastName: "Williams", grade: "3", status: "published", lastUpdated: "2026-03-09",
    subjects: [
      { name: "Mathematics", grade: "C+", masteryLevel: "Approaching", comment: "Needs practice with multiplication." },
      { name: "English Language Arts", grade: "B-", masteryLevel: "Meeting", comment: "Enjoys group reading." },
      { name: "Science", grade: "B", masteryLevel: "Meeting", comment: "Active participant in class." },
      { name: "Social Studies", grade: "B-", masteryLevel: "Approaching", comment: "Working on map skills." },
    ],
    teacherComment: "Ethan is a kind and collaborative student. With more focused practice in math, he can reach his full potential.",
    attendanceSummary: { present: 41, absent: 2, tardy: 2 },
  },
  {
    id: "s6", firstName: "Fiona", lastName: "Davis", grade: "5", status: "not-started", lastUpdated: "",
    subjects: [
      { name: "Mathematics", grade: "B-", masteryLevel: "Approaching", comment: "" },
      { name: "English Language Arts", grade: "A", masteryLevel: "Exceeding", comment: "" },
      { name: "Science", grade: "B+", masteryLevel: "Meeting", comment: "" },
      { name: "Social Studies", grade: "A-", masteryLevel: "Meeting", comment: "" },
    ],
    teacherComment: "",
    attendanceSummary: { present: 35, absent: 7, tardy: 3 },
  },
  {
    id: "s7", firstName: "Gabriel", lastName: "Martinez", grade: "5", status: "draft", lastUpdated: "2026-03-13",
    subjects: [
      { name: "Mathematics", grade: "A", masteryLevel: "Exceeding", comment: "Advanced problem solver." },
      { name: "English Language Arts", grade: "B+", masteryLevel: "Meeting", comment: "Eloquent speaker." },
      { name: "Science", grade: "A-", masteryLevel: "Meeting", comment: "Methodical in experiments." },
      { name: "Social Studies", grade: "A", masteryLevel: "Exceeding", comment: "Excellent historical analysis." },
    ],
    teacherComment: "Gabriel is a well-rounded student who demonstrates leadership and intellectual curiosity across all subjects.",
    attendanceSummary: { present: 43, absent: 1, tardy: 1 },
  },
  {
    id: "s8", firstName: "Hannah", lastName: "Taylor", grade: "4", status: "not-started", lastUpdated: "",
    subjects: [
      { name: "Mathematics", grade: "B", masteryLevel: "Meeting", comment: "" },
      { name: "English Language Arts", grade: "B+", masteryLevel: "Meeting", comment: "" },
      { name: "Science", grade: "A-", masteryLevel: "Meeting", comment: "" },
      { name: "Social Studies", grade: "B", masteryLevel: "Approaching", comment: "" },
    ],
    teacherComment: "",
    attendanceSummary: { present: 39, absent: 3, tardy: 3 },
  },
];

const STATUS_CONFIG: Record<ReportCardStatus, { label: string; variant: "success" | "warning" | "secondary" }> = {
  published: { label: "Published", variant: "success" },
  draft: { label: "Draft", variant: "warning" },
  "not-started": { label: "Not Started", variant: "secondary" },
};

export default function ReportCardsPage() {
  const [gradingPeriod, setGradingPeriod] = useState("q3");
  const [reportCards, setReportCards] = useState(MOCK_REPORT_CARDS);
  const [previewStudent, setPreviewStudent] = useState<StudentReportCard | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  const publishedCount = reportCards.filter((r) => r.status === "published").length;
  const draftCount = reportCards.filter((r) => r.status === "draft").length;
  const notStartedCount = reportCards.filter((r) => r.status === "not-started").length;

  const handleGenerate = (studentId: string) => {
    setGenerating(studentId);
    setTimeout(() => {
      setReportCards((prev) =>
        prev.map((r) =>
          r.id === studentId ? { ...r, status: "draft" as ReportCardStatus, lastUpdated: "2026-03-15" } : r
        )
      );
      setGenerating(null);
    }, 1500);
  };

  const handlePublish = (studentId: string) => {
    setReportCards((prev) =>
      prev.map((r) =>
        r.id === studentId ? { ...r, status: "published" as ReportCardStatus, lastUpdated: "2026-03-15" } : r
      )
    );
  };

  const handleDownload = (studentName: string) => {
    alert(`Downloading PDF report card for ${studentName}... (placeholder)`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
          <p className="text-sm text-gray-500">Generate and publish student report cards</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-52">
            <Select value={gradingPeriod} onChange={(e) => setGradingPeriod(e.target.value)}>
              {GRADING_PERIODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
              <p className="text-xs text-gray-500">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
              <p className="text-xs text-gray-500">Draft</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-gray-100 p-2">
              <FileText className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-500">{notStartedCount}</p>
              <p className="text-xs text-gray-500">Not Started</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {reportCards.map((student) => {
              const statusConfig = STATUS_CONFIG[student.status];
              return (
                <div key={student.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-gray-500">
                        Grade {student.grade}
                        {student.lastUpdated && ` - Updated ${student.lastUpdated}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>

                    {student.status === "not-started" && (
                      <Button size="sm" variant="outline" onClick={() => handleGenerate(student.id)} disabled={generating === student.id}>
                        {generating === student.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <FileText className="mr-1 h-4 w-4" />}
                        Generate
                      </Button>
                    )}

                    {student.status === "draft" && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => setPreviewStudent(student)}>
                          <Eye className="mr-1 h-4 w-4" />
                          Preview
                        </Button>
                        <Button size="sm" variant="primary" onClick={() => handlePublish(student.id)}>
                          <Send className="mr-1 h-4 w-4" />
                          Publish
                        </Button>
                      </>
                    )}

                    {student.status === "published" && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => setPreviewStudent(student)}>
                          <Eye className="mr-1 h-4 w-4" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownload(`${student.firstName} ${student.lastName}`)}>
                          <Download className="mr-1 h-4 w-4" />
                          PDF
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Modal open={!!previewStudent} onClose={() => setPreviewStudent(null)} title="Report Card Preview" size="xl">
        {previewStudent && (
          <div className="space-y-6">
            {/* Student Header */}
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{previewStudent.firstName} {previewStudent.lastName}</h3>
                  <p className="text-sm text-gray-600">Grade {previewStudent.grade} - Q3 Spring 2026</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Micro School Academy</p>
                  <p>Report Card</p>
                </div>
              </div>
            </div>

            {/* Subjects Table */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Academic Performance</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left font-medium text-gray-500">Subject</th>
                    <th className="py-2 text-center font-medium text-gray-500">Grade</th>
                    <th className="py-2 text-center font-medium text-gray-500">Mastery</th>
                    <th className="py-2 text-left font-medium text-gray-500">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewStudent.subjects.map((subj, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium text-gray-900">{subj.name}</td>
                      <td className="py-2 text-center">
                        <Badge variant={subj.grade.startsWith("A") ? "success" : subj.grade.startsWith("B") ? "default" : "warning"}>
                          {subj.grade}
                        </Badge>
                      </td>
                      <td className="py-2 text-center text-xs text-gray-600">{subj.masteryLevel}</td>
                      <td className="py-2 text-xs text-gray-600">{subj.comment || "---"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Attendance */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Attendance Summary</h4>
              <div className="flex gap-6 text-sm">
                <span className="text-green-600">Present: {previewStudent.attendanceSummary.present}</span>
                <span className="text-red-600">Absent: {previewStudent.attendanceSummary.absent}</span>
                <span className="text-yellow-600">Tardy: {previewStudent.attendanceSummary.tardy}</span>
              </div>
            </div>

            {/* Teacher Comment */}
            {previewStudent.teacherComment && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Teacher Comments</h4>
                <p className="rounded-lg bg-gray-50 p-3 text-sm italic text-gray-700">{previewStudent.teacherComment}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
              <Button variant="outline" onClick={() => setPreviewStudent(null)}>Close</Button>
              <Button variant="outline" onClick={() => handleDownload(`${previewStudent.firstName} ${previewStudent.lastName}`)}>
                <Download className="mr-1 h-4 w-4" />
                Download PDF
              </Button>
              {previewStudent.status === "draft" && (
                <Button onClick={() => { handlePublish(previewStudent.id); setPreviewStudent(null); }}>
                  <Send className="mr-1 h-4 w-4" />
                  Publish
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
