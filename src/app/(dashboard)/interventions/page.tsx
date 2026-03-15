"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Modal } from "@/components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type InterventionType = "Academic" | "Behavioral" | "Attendance" | "Social-Emotional" | "Health";
type InterventionStatus = "Open" | "In Progress" | "Monitoring" | "Resolved" | "Closed";

interface InterventionCase {
  id: string;
  studentName: string;
  type: InterventionType;
  concernSummary: string;
  status: InterventionStatus;
  startDate: string;
  followUpDate: string;
}

const mockCases: InterventionCase[] = [
  { id: "1", studentName: "Aiden Johnson", type: "Academic", concernSummary: "Falling behind in reading comprehension; scoring below grade level on assessments", status: "In Progress", startDate: "Feb 15, 2026", followUpDate: "Mar 20, 2026" },
  { id: "2", studentName: "Olivia Martinez", type: "Behavioral", concernSummary: "Frequent disruptions during group activities; difficulty following classroom expectations", status: "Open", startDate: "Mar 5, 2026", followUpDate: "Mar 19, 2026" },
  { id: "3", studentName: "Mia Park", type: "Attendance", concernSummary: "Missed 8 days in the last month; pattern of Monday/Friday absences", status: "Monitoring", startDate: "Jan 20, 2026", followUpDate: "Mar 25, 2026" },
  { id: "4", studentName: "Liam Chen", type: "Social-Emotional", concernSummary: "Withdrawn from peers; showing signs of anxiety during transitions", status: "In Progress", startDate: "Feb 28, 2026", followUpDate: "Mar 22, 2026" },
  { id: "5", studentName: "Noah Williams", type: "Academic", concernSummary: "Struggling with math concepts; needs additional support with fractions", status: "Resolved", startDate: "Jan 10, 2026", followUpDate: "Mar 10, 2026" },
  { id: "6", studentName: "Emma Davis", type: "Health", concernSummary: "Recurring headaches affecting classroom participation; parent notified", status: "Monitoring", startDate: "Mar 1, 2026", followUpDate: "Mar 28, 2026" },
  { id: "7", studentName: "Jackson Brown", type: "Behavioral", concernSummary: "Physical altercation on playground; second incident this month", status: "Open", startDate: "Mar 12, 2026", followUpDate: "Mar 18, 2026" },
  { id: "8", studentName: "Sophia Lee", type: "Attendance", concernSummary: "Chronic tardiness; arriving 20-30 minutes late 3-4 times per week", status: "In Progress", startDate: "Feb 10, 2026", followUpDate: "Mar 21, 2026" },
];

const statusBadgeVariant: Record<InterventionStatus, "danger" | "warning" | "primary" | "success" | "default"> = {
  Open: "danger",
  "In Progress": "warning",
  Monitoring: "primary",
  Resolved: "success",
  Closed: "default",
};

const typeBadgeVariant: Record<InterventionType, "danger" | "orange" | "warning" | "purple" | "cyan"> = {
  Academic: "danger",
  Behavioral: "orange",
  Attendance: "warning",
  "Social-Emotional": "purple",
  Health: "cyan",
};

export default function InterventionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewCase, setShowNewCase] = useState(false);
  const [newCase, setNewCase] = useState({ student: "", type: "Academic" as InterventionType, concern: "" });

  const filtered = mockCases.filter((c) => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (searchQuery && !c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) && !c.concernSummary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openCount = mockCases.filter((c) => c.status === "Open").length;
  const inProgressCount = mockCases.filter((c) => c.status === "In Progress").length;
  const monitoringCount = mockCases.filter((c) => c.status === "Monitoring").length;
  const resolvedCount = mockCases.filter((c) => c.status === "Resolved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Support &amp; Interventions</h1>
          <p className="text-sm text-gray-500">Track and manage student intervention cases</p>
        </div>
        <Button onClick={() => setShowNewCase(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Case
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Open Cases" value={openCount} icon={AlertTriangle} />
        <StatCard title="In Progress" value={inProgressCount} icon={Clock} />
        <StatCard title="Monitoring" value={monitoringCount} icon={Activity} />
        <StatCard title="Resolved This Month" value={resolvedCount} icon={CheckCircle2} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search students or concerns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full sm:w-44">
              <option value="all">All Types</option>
              <option value="Academic">Academic</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Attendance">Attendance</option>
              <option value="Social-Emotional">Social-Emotional</option>
              <option value="Health">Health</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-44">
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Concern Summary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Start Date</TableHead>
              <TableHead className="hidden lg:table-cell">Follow-up</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium text-gray-900">{c.studentName}</TableCell>
                <TableCell>
                  <Badge variant={typeBadgeVariant[c.type]}>{c.type}</Badge>
                </TableCell>
                <TableCell className="hidden max-w-xs truncate text-gray-600 md:table-cell">{c.concernSummary}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[c.status]}>{c.status}</Badge>
                </TableCell>
                <TableCell className="hidden text-gray-500 lg:table-cell">{c.startDate}</TableCell>
                <TableCell className="hidden text-gray-500 lg:table-cell">{c.followUpDate}</TableCell>
                <TableCell>
                  <Link
                    href={`/interventions/${c.id}`}
                    className="inline-flex rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="py-8 text-center text-sm text-gray-500">
                    No intervention cases match your filters.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* New Case Modal */}
      <Modal open={showNewCase} onClose={() => setShowNewCase(false)} title="New Intervention Case" size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Student</label>
            <Select
              value={newCase.student}
              onChange={(e) => setNewCase({ ...newCase, student: e.target.value })}
            >
              <option value="">Select a student...</option>
              <option value="aiden">Aiden Johnson</option>
              <option value="olivia">Olivia Martinez</option>
              <option value="mia">Mia Park</option>
              <option value="liam">Liam Chen</option>
              <option value="noah">Noah Williams</option>
              <option value="emma">Emma Davis</option>
              <option value="jackson">Jackson Brown</option>
              <option value="sophia">Sophia Lee</option>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Intervention Type</label>
            <Select
              value={newCase.type}
              onChange={(e) => setNewCase({ ...newCase, type: e.target.value as InterventionType })}
            >
              <option value="Academic">Academic</option>
              <option value="Behavioral">Behavioral</option>
              <option value="Attendance">Attendance</option>
              <option value="Social-Emotional">Social-Emotional</option>
              <option value="Health">Health</option>
            </Select>
          </div>
          <Textarea
            label="Concern Summary"
            placeholder="Describe the concern..."
            value={newCase.concern}
            onChange={(e) => setNewCase({ ...newCase, concern: e.target.value })}
            rows={4}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowNewCase(false)}>Cancel</Button>
            <Button onClick={() => setShowNewCase(false)}>Create Case</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
