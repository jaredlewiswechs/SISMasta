"use client";

import { useState } from "react";
import {
  Save,
  Plus,
  X,
  Layers,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type GradingMode = "traditional" | "mastery" | "narrative";
type MasteryLevel = "not-yet" | "approaching" | "meeting" | "exceeding";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
}

interface TraditionalGrade {
  score: number;
  letterGrade: string;
  assignments: { name: string; score: number; maxScore: number }[];
}

interface MasteryGrade {
  level: MasteryLevel;
  skills: string[];
}

interface NarrativeGrade {
  comment: string;
  skills: string[];
}

interface GradeEntry {
  studentId: string;
  traditional: TraditionalGrade;
  mastery: MasteryGrade;
  narrative: NarrativeGrade;
}

const MOCK_STUDENTS: Student[] = [
  { id: "s1", firstName: "Aiden", lastName: "Chen", grade: "3" },
  { id: "s2", firstName: "Bella", lastName: "Rodriguez", grade: "3" },
  { id: "s3", firstName: "Carlos", lastName: "Nguyen", grade: "4" },
  { id: "s4", firstName: "Daisy", lastName: "Park", grade: "4" },
  { id: "s5", firstName: "Ethan", lastName: "Williams", grade: "3" },
  { id: "s6", firstName: "Fiona", lastName: "Davis", grade: "5" },
  { id: "s7", firstName: "Gabriel", lastName: "Martinez", grade: "5" },
  { id: "s8", firstName: "Hannah", lastName: "Taylor", grade: "4" },
  { id: "s9", firstName: "Isaac", lastName: "Brown", grade: "5" },
  { id: "s10", firstName: "Julia", lastName: "Wilson", grade: "3" },
];

const MASTERY_LEVELS: { value: MasteryLevel; label: string; color: string }[] = [
  { value: "not-yet", label: "Not Yet", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "approaching", label: "Approaching", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "meeting", label: "Meeting", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "exceeding", label: "Exceeding", color: "bg-purple-100 text-purple-700 border-purple-200" },
];

function letterGrade(score: number): string {
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 60) return "D";
  return "F";
}

function createDefaultEntry(studentId: string): GradeEntry {
  const score = Math.floor(Math.random() * 30) + 70;
  return {
    studentId,
    traditional: {
      score,
      letterGrade: letterGrade(score),
      assignments: [
        { name: "Homework 1", score: Math.floor(Math.random() * 20) + 80, maxScore: 100 },
        { name: "Quiz 1", score: Math.floor(Math.random() * 15) + 75, maxScore: 100 },
        { name: "Project", score: Math.floor(Math.random() * 15) + 80, maxScore: 100 },
        { name: "Test 1", score: Math.floor(Math.random() * 25) + 70, maxScore: 100 },
      ],
    },
    mastery: {
      level: (["approaching", "meeting", "exceeding"] as MasteryLevel[])[Math.floor(Math.random() * 3)],
      skills: [],
    },
    narrative: {
      comment: "",
      skills: [],
    },
  };
}

export default function GradebookPage() {
  const [mode, setMode] = useState<GradingMode>("traditional");
  const [subject, setSubject] = useState("math");
  const [gradingPeriod, setGradingPeriod] = useState("q3");
  const [bulkMode, setBulkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState<Record<string, string>>({});

  const [entries, setEntries] = useState<Record<string, GradeEntry>>(() => {
    const initial: Record<string, GradeEntry> = {};
    MOCK_STUDENTS.forEach((s) => {
      initial[s.id] = createDefaultEntry(s.id);
    });
    return initial;
  });

  const updateTraditionalScore = (studentId: string, score: number) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        traditional: {
          ...prev[studentId].traditional,
          score,
          letterGrade: letterGrade(score),
        },
      },
    }));
  };

  const updateMasteryLevel = (studentId: string, level: MasteryLevel) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        mastery: { ...prev[studentId].mastery, level },
      },
    }));
  };

  const updateNarrativeComment = (studentId: string, comment: string) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        narrative: { ...prev[studentId].narrative, comment },
      },
    }));
  };

  const addSkill = (studentId: string, modeKey: "mastery" | "narrative") => {
    const skill = skillInput[studentId]?.trim();
    if (!skill) return;
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [modeKey]: {
          ...prev[studentId][modeKey],
          skills: [...prev[studentId][modeKey].skills, skill],
        },
      },
    }));
    setSkillInput((prev) => ({ ...prev, [studentId]: "" }));
  };

  const removeSkill = (studentId: string, modeKey: "mastery" | "narrative", index: number) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [modeKey]: {
          ...prev[studentId][modeKey],
          skills: prev[studentId][modeKey].skills.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gradebook</h1>
          <p className="text-sm text-gray-500">Enter and manage student grades</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={bulkMode ? "primary" : "secondary"}
            size="sm"
            onClick={() => setBulkMode(!bulkMode)}
          >
            <Layers className="mr-1 h-4 w-4" />
            {bulkMode ? "Exit Bulk Mode" : "Bulk Entry"}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-52">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject</label>
          <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="math">Mathematics</option>
            <option value="ela">English Language Arts</option>
            <option value="science">Science</option>
            <option value="social">Social Studies</option>
            <option value="art">Art</option>
            <option value="pe">Physical Education</option>
          </Select>
        </div>
        <div className="w-52">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Grading Period</label>
          <Select value={gradingPeriod} onChange={(e) => setGradingPeriod(e.target.value)}>
            <option value="q1">Q1 - Fall 2025</option>
            <option value="q2">Q2 - Winter 2025-26</option>
            <option value="q3">Q3 - Spring 2026</option>
            <option value="q4">Q4 - Summer 2026</option>
          </Select>
        </div>
      </div>

      {/* Mode Tabs */}
      <Tabs defaultValue="traditional" value={mode} onValueChange={(val: string) => setMode(val as GradingMode)}>
        <TabsList>
          <TabsTrigger value="traditional">Traditional</TabsTrigger>
          <TabsTrigger value="mastery">Mastery</TabsTrigger>
          <TabsTrigger value="narrative">Narrative</TabsTrigger>
        </TabsList>

        {/* Traditional Mode */}
        <TabsContent value="traditional">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Student</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">HW 1</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Quiz 1</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Project</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Test 1</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Overall</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-500">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {MOCK_STUDENTS.map((student) => {
                      const entry = entries[student.id];
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium">
                                {student.firstName[0]}{student.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                                <p className="text-xs text-gray-500">Grade {student.grade}</p>
                              </div>
                            </div>
                          </td>
                          {entry.traditional.assignments.map((a, idx) => (
                            <td key={idx} className="px-4 py-3 text-center">
                              {bulkMode ? (
                                <input
                                  type="number"
                                  min={0}
                                  max={a.maxScore}
                                  value={a.score}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setEntries((prev) => {
                                      const updated = { ...prev };
                                      updated[student.id] = {
                                        ...updated[student.id],
                                        traditional: {
                                          ...updated[student.id].traditional,
                                          assignments: updated[student.id].traditional.assignments.map(
                                            (ass, i) => (i === idx ? { ...ass, score: val } : ass)
                                          ),
                                        },
                                      };
                                      const avg = Math.round(
                                        updated[student.id].traditional.assignments.reduce((sum, ass) => sum + ass.score, 0) /
                                          updated[student.id].traditional.assignments.length
                                      );
                                      updated[student.id].traditional.score = avg;
                                      updated[student.id].traditional.letterGrade = letterGrade(avg);
                                      return updated;
                                    });
                                  }}
                                  className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              ) : (
                                <span className={a.score >= 80 ? "text-green-600" : a.score >= 70 ? "text-yellow-600" : "text-red-600"}>
                                  {a.score}
                                </span>
                              )}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center">
                            {bulkMode ? (
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={entry.traditional.score}
                                onChange={(e) => updateTraditionalScore(student.id, parseInt(e.target.value) || 0)}
                                className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <span className="font-bold">{entry.traditional.score}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge
                              variant={
                                entry.traditional.letterGrade.startsWith("A") ? "success"
                                  : entry.traditional.letterGrade.startsWith("B") ? "default"
                                  : entry.traditional.letterGrade.startsWith("C") ? "warning"
                                  : "destructive"
                              }
                            >
                              {entry.traditional.letterGrade}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mastery Mode */}
        <TabsContent value="mastery">
          <div className="space-y-4">
            {MOCK_STUDENTS.map((student) => {
              const entry = entries[student.id];
              return (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-3 sm:w-48">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-gray-500">Grade {student.grade}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex gap-2">
                          {MASTERY_LEVELS.map((level) => (
                            <button
                              key={level.value}
                              onClick={() => updateMasteryLevel(student.id, level.value)}
                              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                                entry.mastery.level === level.value
                                  ? level.color
                                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                        <div>
                          <div className="mb-1 flex flex-wrap gap-1">
                            {entry.mastery.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="gap-1">
                                {skill}
                                <button onClick={() => removeSkill(student.id, "mastery", idx)}>
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add skill tag..."
                              value={skillInput[student.id] || ""}
                              onChange={(e) => setSkillInput((prev) => ({ ...prev, [student.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); addSkill(student.id, "mastery"); }
                              }}
                              className="rounded-md border border-gray-300 px-2 py-1 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button onClick={() => addSkill(student.id, "mastery")} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Narrative Mode */}
        <TabsContent value="narrative">
          <div className="space-y-4">
            {MOCK_STUDENTS.map((student) => {
              const entry = entries[student.id];
              return (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-gray-500">Grade {student.grade}</p>
                        </div>
                      </div>
                      <textarea
                        placeholder="Write narrative comments about this student's progress, strengths, and areas for growth..."
                        value={entry.narrative.comment}
                        onChange={(e) => updateNarrativeComment(student.id, e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Skill Tags</label>
                        <div className="mb-1 flex flex-wrap gap-1">
                          {entry.narrative.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="gap-1">
                              {skill}
                              <button onClick={() => removeSkill(student.id, "narrative", idx)}>
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add skill tag..."
                            value={skillInput[student.id] || ""}
                            onChange={(e) => setSkillInput((prev) => ({ ...prev, [student.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { e.preventDefault(); addSkill(student.id, "narrative"); }
                            }}
                            className="rounded-md border border-gray-300 px-2 py-1 text-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button onClick={() => addSkill(student.id, "narrative")} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
