"use client";

import {
  Calendar,
  DollarSign,
  MessageSquare,
  Megaphone,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAnnouncements = [
  {
    id: "1",
    title: "Spring Break Schedule",
    content: "School will be closed March 23-27 for spring break. Classes resume March 30.",
    date: "2026-03-10",
    priority: "normal" as const,
  },
  {
    id: "2",
    title: "Science Fair Registration Open",
    content: "Sign up for the annual science fair by March 20. Projects due April 10.",
    date: "2026-03-08",
    priority: "normal" as const,
  },
  {
    id: "3",
    title: "Updated Pick-Up Procedure",
    content: "Starting next week, afternoon pick-up will use the north entrance. Please review the updated map.",
    date: "2026-03-05",
    priority: "important" as const,
  },
];

const mockEvents = [
  { id: "1", title: "Parent-Teacher Conferences", date: "2026-03-18", time: "3:00 PM - 7:00 PM" },
  { id: "2", title: "Science Fair", date: "2026-04-10", time: "10:00 AM - 2:00 PM" },
  { id: "3", title: "Spring Concert", date: "2026-04-15", time: "6:00 PM" },
  { id: "4", title: "Field Day", date: "2026-04-22", time: "9:00 AM - 12:00 PM" },
];

const quickStats = {
  attendanceThisMonth: { present: 10, total: 11, percentage: 91 },
  nextPayment: { amount: 1250, dueDate: "2026-04-01" },
  unreadMessages: 2,
};

const reEnrollmentStatus = {
  status: "Action Required" as const,
  deadline: "2026-04-15",
  message: "Please complete the re-enrollment form for the 2026-2027 school year.",
};

export default function PortalHomePage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Jennifer!</h1>
        <p className="mt-1 text-gray-600">
          Here is a quick overview of what is happening with Emma at Bright Horizons.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Attendance This Month
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {quickStats.attendanceThisMonth.percentage}%
          </p>
          <p className="text-sm text-gray-500">
            {quickStats.attendanceThisMonth.present} of {quickStats.attendanceThisMonth.total} days
          </p>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <DollarSign className="h-4 w-4" />
            Next Payment Due
          </div>
          <p className="text-2xl font-bold text-gray-900">${quickStats.nextPayment.amount}</p>
          <p className="text-sm text-gray-500">Due {quickStats.nextPayment.dueDate}</p>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <MessageSquare className="h-4 w-4" />
            Unread Messages
          </div>
          <p className="text-2xl font-bold text-gray-900">{quickStats.unreadMessages}</p>
          <a href="/portal/messages" className="text-sm text-blue-600 hover:underline">
            View messages
          </a>
        </div>
      </div>

      {/* Re-enrollment Status */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <RefreshCw className="mt-0.5 h-5 w-5 text-amber-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-amber-800">Re-Enrollment: {reEnrollmentStatus.status}</h2>
              <span className="text-sm text-amber-600">Deadline: {reEnrollmentStatus.deadline}</span>
            </div>
            <p className="mt-1 text-sm text-amber-700">{reEnrollmentStatus.message}</p>
            <Button size="sm" className="mt-3">
              Complete Re-Enrollment
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Announcements */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Announcements</h2>
          </div>
          <div className="space-y-4">
            {mockAnnouncements.map((announcement) => (
              <div key={announcement.id} className="border-l-2 border-blue-200 pl-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900">
                    {announcement.priority === "important" && (
                      <AlertCircle className="mr-1 inline h-4 w-4 text-amber-500" />
                    )}
                    {announcement.title}
                  </h3>
                  <span className="ml-2 whitespace-nowrap text-xs text-gray-400">
                    {announcement.date}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          </div>
          <div className="space-y-3">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 rounded-lg border p-3 hover:bg-gray-50"
              >
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                  <span className="text-xs font-medium">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
