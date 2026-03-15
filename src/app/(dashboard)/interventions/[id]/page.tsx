"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Phone,
  Users,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Plus,
  Edit2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

type NoteType = "General" | "Parent Contact" | "Meeting" | "Progress Update" | "Follow-up" | "Referral";

interface TimelineNote {
  id: string;
  type: NoteType;
  content: string;
  author: string;
  date: string;
}

interface ProgressSnapshot {
  id: string;
  date: string;
  metric: string;
  value: string;
  change: "improved" | "declined" | "stable";
}

const noteTypeIcons: Record<NoteType, typeof MessageSquare> = {
  General: MessageSquare,
  "Parent Contact": Phone,
  Meeting: Users,
  "Progress Update": TrendingUp,
  "Follow-up": RefreshCw,
  Referral: FileText,
};

const noteTypeBadgeVariant: Record<NoteType, "default" | "primary" | "success" | "warning" | "purple" | "orange"> = {
  General: "default",
  "Parent Contact": "primary",
  Meeting: "purple",
  "Progress Update": "success",
  "Follow-up": "warning",
  Referral: "orange",
};

const mockCase = {
  id: "1",
  studentName: "Aiden Johnson",
  studentGrade: "3rd Grade",
  type: "Academic" as const,
  status: "In Progress" as const,
  startDate: "Feb 15, 2026",
  followUpDate: "Mar 20, 2026",
  lastUpdated: "Mar 14, 2026",
  concernDescription:
    "Aiden has been consistently scoring below grade level on reading comprehension assessments since the beginning of the semester. His fluency is adequate, but he struggles with inference and main idea identification. Classroom observations show he often appears disengaged during independent reading time.",
  interventionPlan:
    "1. Daily 20-minute small group reading intervention with Ms. Chen focusing on comprehension strategies\n2. Graphic organizer templates for all reading assignments\n3. Weekly one-on-one check-ins with homeroom teacher\n4. Modified assessment format with additional time and read-aloud option\n5. Home reading log with parent signature (15 min/day)",
  accommodations:
    "- Extended time on reading assessments (1.5x)\n- Preferential seating near teacher during read-alouds\n- Access to audio versions of class texts\n- Chunked reading assignments with check-in points\n- Use of highlighters and annotation tools",
};

const mockTimeline: TimelineNote[] = [
  { id: "n1", type: "General", content: "Case opened. Initial concern identified by homeroom teacher after January assessment results showed a significant drop in reading comprehension scores.", author: "Ms. Rivera", date: "Feb 15, 2026" },
  { id: "n2", type: "Parent Contact", content: "Phone call with Sarah Johnson. Discussed concerns about Aiden's reading. Parent shared that he has been resistant to reading at home. Agreed to implement a home reading routine with a reward chart.", author: "Ms. Rivera", date: "Feb 18, 2026" },
  { id: "n3", type: "Meeting", content: "Team meeting with Ms. Chen (reading specialist), Ms. Rivera (homeroom), and school counselor. Developed intervention plan with tiered support. Will reassess in 4 weeks.", author: "Ms. Rivera", date: "Feb 20, 2026" },
  { id: "n4", type: "Progress Update", content: "Week 2 check-in: Aiden is responding well to small group instruction. He's using graphic organizers independently about 60% of the time. Engagement during independent reading has improved slightly.", author: "Ms. Chen", date: "Mar 3, 2026" },
  { id: "n5", type: "Follow-up", content: "Reviewed latest quiz scores. Aiden improved from 55% to 68% on comprehension questions. Still below grade level target of 75%, but showing positive trajectory. Will continue current interventions.", author: "Ms. Rivera", date: "Mar 10, 2026" },
  { id: "n6", type: "Parent Contact", content: "Email update to parent. Shared progress data and positive feedback. Parent reports Aiden is reading 15 minutes daily at home and showing more interest in books. Recommended chapter book series at his level.", author: "Ms. Rivera", date: "Mar 14, 2026" },
];

const mockSnapshots: ProgressSnapshot[] = [
  { id: "s1", date: "Feb 15", metric: "Reading Comprehension", value: "55%", change: "declined" },
  { id: "s2", date: "Mar 3", metric: "Reading Comprehension", value: "62%", change: "improved" },
  { id: "s3", date: "Mar 10", metric: "Reading Comprehension", value: "68%", change: "improved" },
  { id: "s4", date: "Mar 3", metric: "Graphic Organizer Use", value: "60%", change: "improved" },
  { id: "s5", date: "Mar 10", metric: "Graphic Organizer Use", value: "75%", change: "improved" },
  { id: "s6", date: "Mar 14", metric: "Home Reading Compliance", value: "85%", change: "improved" },
];

export default function InterventionDetailPage() {
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteType, setNoteType] = useState<NoteType>("General");
  const [noteContent, setNoteContent] = useState("");
  const [showUpdatePlan, setShowUpdatePlan] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/interventions"
            className="mt-1 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{mockCase.studentName}</h1>
              <Badge variant="danger">{mockCase.type}</Badge>
              <Badge variant="warning">{mockCase.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-gray-500">{mockCase.studentGrade}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Started: {mockCase.startDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Follow-up: {mockCase.followUpDate}
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Updated: {mockCase.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setShowUpdatePlan(true)} variant="outline">
          <Edit2 className="mr-2 h-4 w-4" />
          Update Plan
        </Button>
        <Button onClick={() => setShowFollowUp(true)} variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Follow-up
        </Button>
        <Button variant="outline">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Resolve
        </Button>
        <Button variant="ghost">
          <AlertCircle className="mr-2 h-4 w-4" />
          Close Case
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Concern Description */}
          <Card>
            <CardHeader>
              <CardTitle>Concern Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-700">{mockCase.concernDescription}</p>
            </CardContent>
          </Card>

          {/* Intervention Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Intervention Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                {mockCase.interventionPlan}
              </pre>
            </CardContent>
          </Card>

          {/* Accommodations */}
          <Card>
            <CardHeader>
              <CardTitle>Accommodations</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                {mockCase.accommodations}
              </pre>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Timeline</CardTitle>
              <Button size="sm" onClick={() => setShowAddNote(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockTimeline.map((note, index) => {
                  const Icon = noteTypeIcons[note.type];
                  return (
                    <div key={note.id} className="relative flex gap-4">
                      {index < mockTimeline.length - 1 && (
                        <div className="absolute left-5 top-10 h-full w-px bg-gray-200" />
                      )}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={noteTypeBadgeVariant[note.type]}>{note.type}</Badge>
                          <span className="text-xs text-gray-400">{note.date}</span>
                          <span className="text-xs text-gray-400">by {note.author}</span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">{note.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Progress Snapshots */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Snapshots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSnapshots.map((snapshot) => (
                  <div key={snapshot.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{snapshot.metric}</p>
                      <p className="text-xs text-gray-500">{snapshot.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{snapshot.value}</span>
                      <span className={`text-xs font-medium ${
                        snapshot.change === "improved" ? "text-green-600" : snapshot.change === "declined" ? "text-red-600" : "text-gray-500"
                      }`}>
                        {snapshot.change === "improved" ? "Up" : snapshot.change === "declined" ? "Down" : "Stable"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Case Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs font-medium text-gray-500">Student</dt>
                  <dd className="text-sm text-gray-900">{mockCase.studentName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Grade</dt>
                  <dd className="text-sm text-gray-900">{mockCase.studentGrade}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Type</dt>
                  <dd><Badge variant="danger">{mockCase.type}</Badge></dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Status</dt>
                  <dd><Badge variant="warning">{mockCase.status}</Badge></dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Total Notes</dt>
                  <dd className="text-sm text-gray-900">{mockTimeline.length}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Days Open</dt>
                  <dd className="text-sm text-gray-900">28</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Note Modal */}
      <Modal open={showAddNote} onClose={() => setShowAddNote(false)} title="Add Note" size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Note Type</label>
            <Select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as NoteType)}
            >
              <option value="General">General</option>
              <option value="Parent Contact">Parent Contact</option>
              <option value="Meeting">Meeting</option>
              <option value="Progress Update">Progress Update</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Referral">Referral</option>
            </Select>
          </div>
          <Textarea
            label="Note Content"
            placeholder="Enter your note..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={6}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAddNote(false)}>Cancel</Button>
            <Button onClick={() => { setShowAddNote(false); setNoteContent(""); }}>Save Note</Button>
          </div>
        </div>
      </Modal>

      {/* Update Plan Modal */}
      <Modal open={showUpdatePlan} onClose={() => setShowUpdatePlan(false)} title="Update Intervention Plan" size="lg">
        <div className="space-y-4">
          <Textarea
            label="Intervention Plan"
            defaultValue={mockCase.interventionPlan}
            rows={8}
          />
          <Textarea
            label="Accommodations"
            defaultValue={mockCase.accommodations}
            rows={6}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowUpdatePlan(false)}>Cancel</Button>
            <Button onClick={() => setShowUpdatePlan(false)}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Follow-up Modal */}
      <Modal open={showFollowUp} onClose={() => setShowFollowUp(false)} title="Schedule Follow-up">
        <div className="space-y-4">
          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Follow-up Date</label>
            <input
              type="date"
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            />
          </div>
          <Textarea
            label="Notes"
            placeholder="Any notes for the follow-up..."
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowFollowUp(false)}>Cancel</Button>
            <Button onClick={() => setShowFollowUp(false)}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
