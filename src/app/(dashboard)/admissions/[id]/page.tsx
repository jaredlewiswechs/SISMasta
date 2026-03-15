"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Shield,
  Star,
  Upload,
  User,
  Users,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// --- Mock Data ---

const APPLICATION = {
  id: "APP-009",
  childName: "Mia Thompson",
  childDob: "2020-08-15",
  childAge: 5,
  grade: "K",
  gender: "Female",
  currentSchool: "Little Stars Preschool",
  allergies: "None",
  specialNeeds: "None reported",
  parentName: "Robert Thompson",
  parentEmail: "robert.thompson@example.com",
  parentPhone: "(555) 100-1009",
  parentOccupation: "Software Engineer",
  address: "1234 Elm Street, Springfield, IL 62704",
  secondaryContact: "Lisa Thompson (Mother)",
  secondaryPhone: "(555) 200-1009",
  secondaryEmail: "lisa.thompson@example.com",
  source: "Referral",
  referredBy: "Harris Family",
  interestLevel: "High",
  stage: "under_review" as const,
  createdAt: "2026-01-05",
  tourDate: "2026-01-18",
  tourGuide: "Ms. Rodriguez",
  tourNotes: "Family was very engaged. Asked about STEM curriculum and outdoor learning.",
  applicationDate: "2026-01-25",
  charterMode: true,
};

const TIMELINE = [
  { date: "2026-01-05", time: "10:30 AM", event: "Inquiry received", status: "inquiry", user: "System", icon: "circle" },
  { date: "2026-01-06", time: "9:15 AM", event: "Tour requested by parent", status: "tour_requested", user: "Robert Thompson", icon: "calendar" },
  { date: "2026-01-08", time: "2:00 PM", event: "Tour scheduled for Jan 18", status: "tour_requested", user: "Ms. Rodriguez", icon: "calendar" },
  { date: "2026-01-18", time: "10:00 AM", event: "Tour completed", status: "tour_completed", user: "Ms. Rodriguez", icon: "check" },
  { date: "2026-01-25", time: "3:45 PM", event: "Application submitted", status: "application_submitted", user: "Robert Thompson", icon: "file" },
  { date: "2026-01-28", time: "11:00 AM", event: "Application moved to review", status: "under_review", user: "Admin", icon: "clock" },
];

const DOCUMENTS = [
  { name: "Birth Certificate", status: "uploaded", date: "2026-01-25" },
  { name: "Immunization Records", status: "uploaded", date: "2026-01-25" },
  { name: "Previous Report Card", status: "uploaded", date: "2026-01-26" },
  { name: "Proof of Residence", status: "missing", date: null },
  { name: "Parent Photo ID", status: "uploaded", date: "2026-01-25" },
  { name: "IEP/504 Plan", status: "not_applicable", date: null },
];

const NOTES = [
  { id: 1, author: "Ms. Rodriguez", date: "2026-01-18", text: "Family attended tour. Both parents present. Very interested in the project-based learning model. Father asked detailed questions about math curriculum. Mother interested in after-school programs." },
  { id: 2, author: "Admin", date: "2026-01-28", text: "Application complete and moved to review. Missing proof of residence document - follow up needed." },
  { id: 3, author: "Dr. Patel", date: "2026-02-02", text: "Reviewed application. Strong candidate. Previous preschool reports show grade-level readiness. Recommend acceptance pending document completion." },
];

const CHARTER_AUDIT = [
  { action: "Inquiry logged", timestamp: "2026-01-05 10:30:22 EST", user: "System", method: "Web form" },
  { action: "Added to lottery pool", timestamp: "2026-01-05 10:30:23 EST", user: "System", method: "Auto" },
  { action: "Tour scheduled", timestamp: "2026-01-08 14:00:00 EST", user: "Ms. Rodriguez", method: "Manual" },
  { action: "Application received", timestamp: "2026-01-25 15:45:12 EST", user: "System", method: "Web form" },
  { action: "Moved to review", timestamp: "2026-01-28 11:00:33 EST", user: "Admin", method: "Manual" },
];

// --- Component ---

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const [newNote, setNewNote] = useState("");
  const [showCharterAudit, setShowCharterAudit] = useState(false);

  const app = APPLICATION;

  const timelineIcon = (type: string) => {
    switch (type) {
      case "calendar": return <Calendar className="h-4 w-4" />;
      case "check": return <CheckCircle2 className="h-4 w-4" />;
      case "file": return <FileText className="h-4 w-4" />;
      case "clock": return <Clock className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admissions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{app.childName}</h1>
            <Badge variant="purple">Under Review</Badge>
            <Badge variant="primary">{app.grade}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Application {params.id} &middot; Submitted {app.applicationDate}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-1" />
          Schedule Tour
        </Button>
        <Button variant="outline" size="sm">
          <Clock className="h-4 w-4 mr-1" />
          Move to Review
        </Button>
        <Button variant="primary" size="sm">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Accept
        </Button>
        <Button variant="secondary" size="sm">
          <Clock className="h-4 w-4 mr-1" />
          Waitlist
        </Button>
        <Button variant="danger" size="sm">
          <XCircle className="h-4 w-4 mr-1" />
          Deny
        </Button>
        <Button variant="primary" size="sm">
          <Star className="h-4 w-4 mr-1" />
          Enroll
        </Button>
        {app.charterMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCharterAudit(!showCharterAudit)}
          >
            <Shield className="h-4 w-4 mr-1" />
            Charter Audit Log
          </Button>
        )}
      </div>

      {/* Charter Audit Log */}
      {showCharterAudit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              Charter Compliance Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CHARTER_AUDIT.map((entry, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-700">{entry.action}</td>
                      <td className="py-2 px-3 text-gray-500 font-mono text-xs">{entry.timestamp}</td>
                      <td className="py-2 px-3 text-gray-700">{entry.user}</td>
                      <td className="py-2 px-3">
                        <Badge variant={entry.method === "Auto" ? "info" : entry.method === "Web form" ? "success" : "default"}>
                          {entry.method}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-700">
                <Shield className="h-3 w-3 inline mr-1" />
                Seat Offer Log: No seat offers have been extended for this application yet.
                All actions are timestamped and immutable for charter compliance reporting.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            {DOCUMENTS.filter((d) => d.status === "missing").length > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs text-red-700">
                {DOCUMENTS.filter((d) => d.status === "missing").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notes
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-700">
              {NOTES.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="timeline">
            Timeline
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-700">
              {TIMELINE.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {([
                    ["Full Name", app.childName],
                    ["Date of Birth", app.childDob],
                    ["Age", `${app.childAge} years old`],
                    ["Gender", app.gender],
                    ["Applying for Grade", app.grade],
                    ["Current School", app.currentSchool],
                    ["Allergies", app.allergies],
                    ["Special Needs", app.specialNeeds],
                  ] as const).map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-sm text-gray-500">{label}</dt>
                      <dd className="text-sm font-medium text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* Parent / Household Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  Parent / Household
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {([
                    ["Primary Contact", app.parentName],
                    ["Email", app.parentEmail],
                    ["Phone", app.parentPhone],
                    ["Occupation", app.parentOccupation],
                    ["Address", app.address],
                    ["Secondary Contact", app.secondaryContact],
                    ["Secondary Phone", app.secondaryPhone],
                    ["Secondary Email", app.secondaryEmail],
                  ] as const).map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-sm text-gray-500">{label}</dt>
                      <dd className="text-sm font-medium text-gray-900 text-right max-w-[220px]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* Tour Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  Tour Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tour Date</dt>
                    <dd className="text-sm font-medium text-gray-900">{app.tourDate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Tour Guide</dt>
                    <dd className="text-sm font-medium text-gray-900">{app.tourGuide}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd><Badge variant="success">Completed</Badge></dd>
                  </div>
                </dl>
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs font-medium text-gray-700 mb-1">Tour Notes</p>
                  <p className="text-sm text-gray-600">{app.tourNotes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Source / Interest */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  Inquiry Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Source</dt>
                    <dd><Badge variant="info">{app.source}</Badge></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Referred By</dt>
                    <dd className="text-sm font-medium text-gray-900">{app.referredBy}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Interest Level</dt>
                    <dd><Badge variant="success">{app.interestLevel}</Badge></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Inquiry Date</dt>
                    <dd className="text-sm font-medium text-gray-900">{app.createdAt}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents Checklist</CardTitle>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-200">
                {DOCUMENTS.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {doc.status === "uploaded" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : doc.status === "missing" ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        {doc.date && (
                          <p className="text-xs text-gray-500">Uploaded {doc.date}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          doc.status === "uploaded"
                            ? "success"
                            : doc.status === "missing"
                            ? "danger"
                            : "default"
                        }
                      >
                        {doc.status === "uploaded"
                          ? "Uploaded"
                          : doc.status === "missing"
                          ? "Missing"
                          : "N/A"}
                      </Badge>
                      {doc.status === "uploaded" && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {doc.status === "missing" && (
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-700">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  {DOCUMENTS.filter((d) => d.status === "missing").length} document(s) still required before enrollment can be finalized.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes &amp; Communication</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add note */}
              <div className="mb-6">
                <textarea
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 min-h-[80px]"
                  placeholder="Add a note about this application..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <Button variant="primary" size="sm">
                    <Send className="h-4 w-4 mr-1" />
                    Add Note
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Email Parent
                  </Button>
                </div>
              </div>

              {/* Notes list */}
              <div className="space-y-4">
                {NOTES.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{note.author}</p>
                          <p className="text-xs text-gray-500">{note.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                  {TIMELINE.map((event, i) => (
                    <div key={i} className="relative flex gap-4 ml-0">
                      {/* Icon dot */}
                      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        i === TIMELINE.length - 1
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}>
                        {timelineIcon(event.icon)}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <p className="text-sm font-medium text-gray-900">{event.event}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{event.date} at {event.time}</span>
                          <span className="text-xs text-gray-400">&middot;</span>
                          <span className="text-xs text-gray-500">{event.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
