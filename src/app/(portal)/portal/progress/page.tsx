"use client";

import { useState } from "react";
import {
  TrendingUp,
  BookOpen,
  Download,
  Star,
  ChevronDown,
  ChevronUp,
  FileText,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type MasteryLevel = "Advanced" | "Proficient" | "Developing" | "Beginning";

interface SubjectProgress {
  id: string;
  subject: string;
  teacher: string;
  currentGrade: string;
  masteryLevel: MasteryLevel;
  recentAssignments: {
    name: string;
    grade: string;
    date: string;
  }[];
  narrative?: string;
}

const mockProgress: SubjectProgress[] = [
  {
    id: "1",
    subject: "Mathematics",
    teacher: "Mr. Patterson",
    currentGrade: "A-",
    masteryLevel: "Proficient",
    recentAssignments: [
      { name: "Multiplication Quiz", grade: "92%", date: "2026-03-12" },
      { name: "Fractions Worksheet", grade: "88%", date: "2026-03-08" },
      { name: "Word Problems Test", grade: "95%", date: "2026-03-01" },
    ],
    narrative: "Emma demonstrates strong mathematical reasoning skills. She excels at problem-solving and is becoming more confident with fraction operations. I recommend continued practice with multi-step word problems.",
  },
  {
    id: "2",
    subject: "English Language Arts",
    teacher: "Ms. Gonzalez",
    currentGrade: "A",
    masteryLevel: "Advanced",
    recentAssignments: [
      { name: "Book Report: Charlotte's Web", grade: "98%", date: "2026-03-10" },
      { name: "Spelling Test Unit 12", grade: "100%", date: "2026-03-07" },
      { name: "Creative Writing: My Hero", grade: "95%", date: "2026-02-28" },
    ],
    narrative: "Emma is an exceptional reader and writer. Her creative writing shows remarkable imagination and vocabulary. She has moved to the advanced reading group this trimester.",
  },
  {
    id: "3",
    subject: "Science",
    teacher: "Mr. Patterson",
    currentGrade: "B+",
    masteryLevel: "Proficient",
    recentAssignments: [
      { name: "Ecosystem Project", grade: "90%", date: "2026-03-11" },
      { name: "Weather Lab Report", grade: "85%", date: "2026-03-04" },
      { name: "Plant Growth Observation", grade: "88%", date: "2026-02-25" },
    ],
    narrative: "Emma shows great curiosity in science. She actively participates in experiments and asks thoughtful questions. Her lab reports are improving in detail and organization.",
  },
  {
    id: "4",
    subject: "Social Studies",
    teacher: "Ms. Gonzalez",
    currentGrade: "A-",
    masteryLevel: "Proficient",
    recentAssignments: [
      { name: "Community Helpers Presentation", grade: "94%", date: "2026-03-09" },
      { name: "Map Skills Quiz", grade: "90%", date: "2026-03-02" },
    ],
  },
  {
    id: "5",
    subject: "Art & Music",
    teacher: "Mr. Kim",
    currentGrade: "A",
    masteryLevel: "Advanced",
    recentAssignments: [
      { name: "Watercolor Landscape", grade: "Excellent", date: "2026-03-06" },
      { name: "Recorder Performance", grade: "Outstanding", date: "2026-02-27" },
    ],
  },
];

const mockReportCards = [
  { id: "1", period: "Fall Trimester 2025", date: "2025-11-21", available: true },
  { id: "2", period: "Winter Trimester 2025-26", date: "2026-03-06", available: true },
  { id: "3", period: "Spring Trimester 2026", date: "2026-06-05", available: false },
];

const masteryColors: Record<MasteryLevel, { bg: string; text: string }> = {
  Advanced: { bg: "bg-purple-100", text: "text-purple-700" },
  Proficient: { bg: "bg-green-100", text: "text-green-700" },
  Developing: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Beginning: { bg: "bg-red-100", text: "text-red-700" },
};

export default function ProgressPage() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>("1");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Progress</h1>
          <p className="text-gray-500">Emma Johnson - 3rd Grade</p>
        </div>
      </div>

      {/* Report Card Downloads */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">Report Cards</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {mockReportCards.map((rc) => (
            <div key={rc.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium text-gray-900">{rc.period}</p>
                <p className="text-sm text-gray-500">{rc.date}</p>
              </div>
              {rc.available ? (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              ) : (
                <span className="text-xs text-gray-400">Not yet available</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subject Progress */}
      <div className="space-y-4">
        {mockProgress.map((subject) => {
          const isExpanded = expandedSubject === subject.id;
          const mastery = masteryColors[subject.masteryLevel];
          return (
            <div key={subject.id} className="rounded-lg border bg-white shadow-sm">
              <button
                className="flex w-full items-center justify-between p-5"
                onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{subject.subject}</p>
                    <p className="text-sm text-gray-500">{subject.teacher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{subject.currentGrade}</p>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${mastery.bg} ${mastery.text}`}
                    >
                      {subject.masteryLevel}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-5 pb-5 pt-4">
                  {/* Recent Grades */}
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Recent Assignments</h3>
                  <div className="mb-4 space-y-2">
                    {subject.recentAssignments.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{a.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">{a.grade}</span>
                          <span className="text-xs text-gray-400">{a.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Narrative Comment */}
                  {subject.narrative && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <h3 className="mb-1 text-sm font-semibold text-blue-800">Teacher Comment</h3>
                      <p className="text-sm text-blue-700">{subject.narrative}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
