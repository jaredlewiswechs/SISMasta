"use client";

import Link from "next/link";
import {
  Users,
  UserX,
  FileWarning,
  FileX,
  MapPin,
  Armchair,
  UserPlus,
  ClipboardCheck,
  MessageSquare,
  Receipt,
  AlertTriangle,
  Clock,
  Mail,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Mock Data ────────────────────────────────────────────────────────

const stats = [
  { title: "Total Students", value: 42, icon: Users, trend: { value: 5, positive: true } },
  { title: "Today's Absences", value: 3, icon: UserX, description: "2 excused, 1 unexcused" },
  { title: "Overdue Invoices", value: 7, icon: FileWarning, trend: { value: 12, positive: false } },
  { title: "Missing Documents", value: 5, icon: FileX, description: "3 immunization, 2 contracts" },
  { title: "Upcoming Tours", value: 4, icon: MapPin, description: "Next: Mar 18" },
  { title: "Seats Remaining", value: 8, icon: Armchair, description: "of 50 total capacity" },
];

const recentActivity = [
  { id: "1", message: "Emma Rodriguez marked present", time: "8:15 AM", type: "attendance" },
  { id: "2", message: "Invoice #1042 paid by Garcia family", time: "Yesterday", type: "billing" },
  { id: "3", message: "New inquiry from Sarah Thompson", time: "Yesterday", type: "admissions" },
  { id: "4", message: "IEP document uploaded for Liam Chen", time: "2 days ago", type: "document" },
  { id: "5", message: "Attendance alert: Mia Johnson 3 absences this month", time: "2 days ago", type: "alert" },
  { id: "6", message: "Cohort Alpha schedule updated", time: "3 days ago", type: "schedule" },
];

const quickActions = [
  { label: "Add Student", icon: UserPlus, href: "/students/new", color: "bg-indigo-600 hover:bg-indigo-700" },
  { label: "Mark Attendance", icon: ClipboardCheck, href: "/attendance", color: "bg-green-600 hover:bg-green-700" },
  { label: "Send Message", icon: MessageSquare, href: "/messages", color: "bg-blue-600 hover:bg-blue-700" },
  { label: "Create Invoice", icon: Receipt, href: "/billing", color: "bg-amber-600 hover:bg-amber-700" },
];

const atRiskStudents = [
  {
    id: "s1",
    name: "Mia Johnson",
    grade: "3rd",
    reason: "3 unexcused absences this month",
    severity: "high" as const,
  },
  {
    id: "s2",
    name: "Noah Williams",
    grade: "5th",
    reason: "Declining math scores - below grade level",
    severity: "medium" as const,
  },
  {
    id: "s3",
    name: "Ava Martinez",
    grade: "2nd",
    reason: "Behavioral intervention active",
    severity: "medium" as const,
  },
  {
    id: "s4",
    name: "Ethan Brown",
    grade: "4th",
    reason: "Overdue tuition - 2 months",
    severity: "low" as const,
  },
];

const unreadMessages = 12;

// ── Helpers ──────────────────────────────────────────────────────────

function severityVariant(severity: "high" | "medium" | "low") {
  switch (severity) {
    case "high":
      return "destructive" as const;
    case "medium":
      return "warning" as const;
    case "low":
      return "info" as const;
  }
}

function activityIcon(type: string) {
  switch (type) {
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "billing":
      return <Receipt className="h-4 w-4 text-amber-500" />;
    case "admissions":
      return <UserPlus className="h-4 w-4 text-blue-500" />;
    case "attendance":
      return <ClipboardCheck className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

// ── Page Component ───────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back. Here is what is happening at your school today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Button className={action.color}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout: Activity feed + At-risk students */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Activity</CardTitle>
            <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-0.5">{activityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* At-risk students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              At-Risk Students
            </CardTitle>
            <Badge variant="destructive">{atRiskStudents.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atRiskStudents.map((student) => (
                <Link
                  key={student.id}
                  href={`/students/${student.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {student.name}
                      </p>
                      <Badge variant="secondary">{student.grade}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{student.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={severityVariant(student.severity)}>
                      {student.severity}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unread messages banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                You have {unreadMessages} unread parent messages
              </p>
              <p className="text-xs text-blue-700">
                3 require a response within 24 hours
              </p>
            </div>
          </div>
          <Link href="/messages">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              View Messages
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
