"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Mail,
  Plus,
  Search,
  Send,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Types ---

interface WaitlistEntry {
  id: string;
  position: number;
  childName: string;
  grade: string;
  parentName: string;
  email: string;
  phone: string;
  status: "waiting" | "offered" | "accepted" | "declined" | "expired";
  dateAdded: string;
}

// --- Mock Data ---

const INITIAL_WAITLIST: WaitlistEntry[] = [
  { id: "WL-001", position: 1, childName: "Jackson Rivera", grade: "K", parentName: "Ana Rivera", email: "ana.rivera@example.com", phone: "(555) 201-0001", status: "waiting", dateAdded: "2026-01-10" },
  { id: "WL-002", position: 2, childName: "Zoe Chen", grade: "K", parentName: "Wei Chen", email: "wei.chen@example.com", phone: "(555) 201-0002", status: "waiting", dateAdded: "2026-01-12" },
  { id: "WL-003", position: 3, childName: "Caleb Okafor", grade: "1", parentName: "Nkechi Okafor", email: "nkechi.okafor@example.com", phone: "(555) 201-0003", status: "offered", dateAdded: "2026-01-15" },
  { id: "WL-004", position: 4, childName: "Lily Patel", grade: "K", parentName: "Priya Patel", email: "priya.patel@example.com", phone: "(555) 201-0004", status: "waiting", dateAdded: "2026-01-18" },
  { id: "WL-005", position: 5, childName: "Owen Murphy", grade: "2", parentName: "Sean Murphy", email: "sean.murphy@example.com", phone: "(555) 201-0005", status: "declined", dateAdded: "2026-01-20" },
  { id: "WL-006", position: 6, childName: "Ava Kim", grade: "1", parentName: "Jin Kim", email: "jin.kim@example.com", phone: "(555) 201-0006", status: "waiting", dateAdded: "2026-01-22" },
  { id: "WL-007", position: 7, childName: "Leo Gonzalez", grade: "PK", parentName: "Maria Gonzalez", email: "maria.gonzalez@example.com", phone: "(555) 201-0007", status: "waiting", dateAdded: "2026-01-25" },
  { id: "WL-008", position: 8, childName: "Mila Brooks", grade: "K", parentName: "Jason Brooks", email: "jason.brooks@example.com", phone: "(555) 201-0008", status: "expired", dateAdded: "2026-01-28" },
  { id: "WL-009", position: 9, childName: "Henry Nguyen", grade: "2", parentName: "Tran Nguyen", email: "tran.nguyen@example.com", phone: "(555) 201-0009", status: "waiting", dateAdded: "2026-02-01" },
  { id: "WL-010", position: 10, childName: "Ella Foster", grade: "3", parentName: "David Foster", email: "david.foster@example.com", phone: "(555) 201-0010", status: "waiting", dateAdded: "2026-02-05" },
];

const STATUS_BADGE_VARIANT: Record<WaitlistEntry["status"], "default" | "info" | "success" | "danger" | "warning"> = {
  waiting: "default",
  offered: "info",
  accepted: "success",
  declined: "danger",
  expired: "warning",
};

// --- Component ---

export default function WaitlistPage() {
  const [waitlist, setWaitlist] = useState(INITIAL_WAITLIST);
  const [gradeFilter, setGradeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = waitlist.filter((entry) => {
    if (gradeFilter && entry.grade !== gradeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !entry.childName.toLowerCase().includes(q) &&
        !entry.parentName.toLowerCase().includes(q) &&
        !entry.email.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const moveUp = (id: string) => {
    setWaitlist((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((e) => e.id === id);
      if (idx <= 0) return prev;
      const temp = copy[idx].position;
      copy[idx] = { ...copy[idx], position: copy[idx - 1].position };
      copy[idx - 1] = { ...copy[idx - 1], position: temp };
      [copy[idx], copy[idx - 1]] = [copy[idx - 1], copy[idx]];
      return copy;
    });
  };

  const moveDown = (id: string) => {
    setWaitlist((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((e) => e.id === id);
      if (idx < 0 || idx >= copy.length - 1) return prev;
      const temp = copy[idx].position;
      copy[idx] = { ...copy[idx], position: copy[idx + 1].position };
      copy[idx + 1] = { ...copy[idx + 1], position: temp };
      [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
      return copy;
    });
  };

  const totalWaiting = waitlist.filter((e) => e.status === "waiting").length;
  const totalOffered = waitlist.filter((e) => e.status === "offered").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waitlist Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and prioritize students on the enrollment waitlist
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export Waitlist
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-1" />
            Add to Waitlist
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-100 p-2">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total on Waitlist</p>
              <p className="text-xl font-bold text-gray-900">{waitlist.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Actively Waiting</p>
              <p className="text-xl font-bold text-gray-900">{totalWaiting}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2">
              <Send className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Seats Offered</p>
              <p className="text-xl font-bold text-gray-900">{totalOffered}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Grades Represented</p>
              <p className="text-xl font-bold text-gray-900">
                {new Set(waitlist.map((e) => e.grade)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add to Waitlist Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add Student to Waitlist</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Child Name</label>
                <Input placeholder="Enter child's full name" />
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
                <Input placeholder="Enter parent's full name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" placeholder="parent@example.com" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
                <Input type="tel" placeholder="(555) 000-0000" />
              </div>
              <div className="flex items-end">
                <Button variant="primary" className="w-full">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add to Waitlist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
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
        {(gradeFilter || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setGradeFilter("");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Waitlist Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos.</TableHead>
              <TableHead>Child Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((entry, idx) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                    {entry.position}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-gray-900">{entry.childName}</TableCell>
                <TableCell>
                  <Badge variant="primary">{entry.grade}</Badge>
                </TableCell>
                <TableCell>{entry.parentName}</TableCell>
                <TableCell className="hidden md:table-cell text-gray-500">{entry.email}</TableCell>
                <TableCell className="hidden lg:table-cell text-gray-500">{entry.phone}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[entry.status]}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-gray-500">{entry.dateAdded}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveUp(entry.id)}
                      disabled={idx === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(entry.id)}
                      disabled={idx === filtered.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    {entry.status === "waiting" && (
                      <Button variant="primary" size="sm">
                        <Send className="h-3 w-3 mr-1" />
                        Offer Seat
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                  No waitlist entries match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
