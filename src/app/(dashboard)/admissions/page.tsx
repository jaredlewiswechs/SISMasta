"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  TrendingUp,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";

// --- Types ---

type PipelineStage =
  | "inquiry"
  | "tour_requested"
  | "tour_completed"
  | "application_submitted"
  | "under_review"
  | "accepted"
  | "enrolled";

interface Applicant {
  id: string;
  childName: string;
  grade: string;
  parentName: string;
  date: string;
  source: string;
  stage: PipelineStage;
  email: string;
  phone: string;
}

// --- Mock Data ---

const STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: "inquiry", label: "Inquiry", color: "bg-gray-50 border-gray-300" },
  { key: "tour_requested", label: "Tour Requested", color: "bg-blue-50 border-blue-300" },
  { key: "tour_completed", label: "Tour Completed", color: "bg-indigo-50 border-indigo-300" },
  { key: "application_submitted", label: "Application Submitted", color: "bg-yellow-50 border-yellow-300" },
  { key: "under_review", label: "Under Review", color: "bg-orange-50 border-orange-300" },
  { key: "accepted", label: "Accepted", color: "bg-green-50 border-green-300" },
  { key: "enrolled", label: "Enrolled", color: "bg-emerald-50 border-emerald-300" },
];

const STAGE_BADGE_VARIANT: Record<PipelineStage, "default" | "primary" | "info" | "warning" | "purple" | "success"> = {
  inquiry: "default",
  tour_requested: "primary",
  tour_completed: "info",
  application_submitted: "warning",
  under_review: "purple",
  accepted: "success",
  enrolled: "success",
};

const MOCK_APPLICANTS: Applicant[] = [
  { id: "APP-001", childName: "Sophia Martinez", grade: "K", parentName: "Maria Martinez", date: "2026-02-15", source: "Website", stage: "inquiry", email: "maria@example.com", phone: "(555) 100-1001" },
  { id: "APP-002", childName: "Liam Johnson", grade: "1", parentName: "David Johnson", date: "2026-02-18", source: "Referral", stage: "inquiry", email: "david@example.com", phone: "(555) 100-1002" },
  { id: "APP-003", childName: "Olivia Brown", grade: "2", parentName: "Sarah Brown", date: "2026-02-10", source: "Open House", stage: "tour_requested", email: "sarah@example.com", phone: "(555) 100-1003" },
  { id: "APP-004", childName: "Noah Davis", grade: "K", parentName: "Michael Davis", date: "2026-02-12", source: "Website", stage: "tour_requested", email: "michael@example.com", phone: "(555) 100-1004" },
  { id: "APP-005", childName: "Emma Wilson", grade: "3", parentName: "Jennifer Wilson", date: "2026-01-28", source: "Social Media", stage: "tour_completed", email: "jennifer@example.com", phone: "(555) 100-1005" },
  { id: "APP-006", childName: "Aiden Garcia", grade: "1", parentName: "Carlos Garcia", date: "2026-01-20", source: "Referral", stage: "tour_completed", email: "carlos@example.com", phone: "(555) 100-1006" },
  { id: "APP-007", childName: "Isabella Lee", grade: "PK", parentName: "James Lee", date: "2026-01-15", source: "Website", stage: "application_submitted", email: "james@example.com", phone: "(555) 100-1007" },
  { id: "APP-008", childName: "Lucas Anderson", grade: "2", parentName: "Patricia Anderson", date: "2026-01-10", source: "Open House", stage: "application_submitted", email: "patricia@example.com", phone: "(555) 100-1008" },
  { id: "APP-009", childName: "Mia Thompson", grade: "K", parentName: "Robert Thompson", date: "2026-01-05", source: "Referral", stage: "under_review", email: "robert@example.com", phone: "(555) 100-1009" },
  { id: "APP-010", childName: "Ethan White", grade: "1", parentName: "Linda White", date: "2025-12-20", source: "Website", stage: "under_review", email: "linda@example.com", phone: "(555) 100-1010" },
  { id: "APP-011", childName: "Charlotte Harris", grade: "3", parentName: "William Harris", date: "2025-12-15", source: "Social Media", stage: "accepted", email: "william@example.com", phone: "(555) 100-1011" },
  { id: "APP-012", childName: "Mason Clark", grade: "K", parentName: "Elizabeth Clark", date: "2025-12-10", source: "Referral", stage: "accepted", email: "elizabeth@example.com", phone: "(555) 100-1012" },
  { id: "APP-013", childName: "Amelia Lewis", grade: "2", parentName: "Thomas Lewis", date: "2025-12-01", source: "Open House", stage: "accepted", email: "thomas@example.com", phone: "(555) 100-1013" },
  { id: "APP-014", childName: "Harper Robinson", grade: "1", parentName: "Jessica Robinson", date: "2025-11-20", source: "Website", stage: "enrolled", email: "jessica@example.com", phone: "(555) 100-1014" },
  { id: "APP-015", childName: "Alexander Walker", grade: "PK", parentName: "Daniel Walker", date: "2025-11-15", source: "Referral", stage: "enrolled", email: "daniel@example.com", phone: "(555) 100-1015" },
  { id: "APP-016", childName: "Ella Hall", grade: "K", parentName: "Susan Hall", date: "2025-11-10", source: "Social Media", stage: "enrolled", email: "susan@example.com", phone: "(555) 100-1016" },
];

// --- Component ---

export default function AdmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [showAddInquiry, setShowAddInquiry] = useState(false);

  const filtered = MOCK_APPLICANTS.filter((a) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !a.childName.toLowerCase().includes(q) &&
        !a.parentName.toLowerCase().includes(q) &&
        !a.id.toLowerCase().includes(q)
      )
        return false;
    }
    if (gradeFilter && a.grade !== gradeFilter) return false;
    if (statusFilter && a.stage !== statusFilter) return false;
    if (sourceFilter && a.source !== sourceFilter) return false;
    return true;
  });

  const totalApplicants = MOCK_APPLICANTS.length;
  const pendingReviews = MOCK_APPLICANTS.filter((a) => a.stage === "under_review").length;
  const accepted = MOCK_APPLICANTS.filter((a) => a.stage === "accepted" || a.stage === "enrolled").length;
  const acceptanceRate = totalApplicants > 0 ? Math.round((accepted / totalApplicants) * 100) : 0;
  const seatsAvailable = 12;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admissions Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage student admissions from inquiry to enrollment
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admissions/inquiry">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              Public Inquiry Form
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setShowAddInquiry(!showAddInquiry)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Inquiry
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applicants"
          value={totalApplicants}
          icon={Users}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviews}
          icon={Clock}
        />
        <StatCard
          title="Acceptance Rate"
          value={`${acceptanceRate}%`}
          icon={TrendingUp}
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="Seats Available"
          value={seatsAvailable}
          icon={GraduationCap}
        />
      </div>

      {/* Add Inquiry inline form */}
      {showAddInquiry && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Inquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Child Name</label>
                <Input placeholder="Enter child's name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Grade</label>
                <Select>
                  <option value="">Select grade</option>
                  <option value="PK">PK</option>
                  <option value="K">K</option>
                  <option value="1">1st</option>
                  <option value="2">2nd</option>
                  <option value="3">3rd</option>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Parent Name</label>
                <Input placeholder="Enter parent's name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" placeholder="parent@example.com" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
                <Input type="tel" placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Source</label>
                <Select>
                  <option value="">How did they hear about us?</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Open House">Open House</option>
                  <option value="Social Media">Social Media</option>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" size="sm">Save Inquiry</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddInquiry(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="">All Grades</option>
          <option value="PK">PK</option>
          <option value="K">K</option>
          <option value="1">1st</option>
          <option value="2">2nd</option>
          <option value="3">3rd</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STAGES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </Select>
        <Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Open House">Open House</option>
          <option value="Social Media">Social Media</option>
        </Select>
        {(gradeFilter || statusFilter || sourceFilter || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setGradeFilter("");
              setStatusFilter("");
              setSourceFilter("");
              setSearchQuery("");
            }}
          >
            <Filter className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const cards = filtered.filter((a) => a.stage === stage.key);
          return (
            <div key={stage.key} className="flex-shrink-0 w-72">
              <div className={`rounded-lg border-2 ${stage.color} p-3 min-h-[400px]`}>
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">{stage.label}</h3>
                  <Badge variant={STAGE_BADGE_VARIANT[stage.key]}>{cards.length}</Badge>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {cards.map((applicant) => (
                    <Link key={applicant.id} href={`/admissions/${applicant.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {applicant.childName}
                            </p>
                            <Badge variant="primary" className="text-[10px]">
                              {applicant.grade}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{applicant.parentName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="flex items-center text-xs text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              {applicant.date}
                            </span>
                            <Badge variant="default" className="text-[10px]">
                              {applicant.source}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                  {cards.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">
                      No applicants in this stage
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
