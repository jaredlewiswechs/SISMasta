"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Heart,
  Headphones,
  Building,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAnalytics = {
  enrollmentFunnel: {
    inquiries: 62,
    applications: 41,
    accepted: 34,
    enrolled: 28,
    active: 25,
  },
  tuitionCollectionRate: 94.2,
  retentionRate: 91,
  reEnrollmentRate: 88,
  attendanceTrends: [
    { week: "Feb 10", present: 96, absent: 3, tardy: 1 },
    { week: "Feb 17", present: 93, absent: 5, tardy: 2 },
    { week: "Feb 24", present: 97, absent: 2, tardy: 1 },
    { week: "Mar 3", present: 95, absent: 4, tardy: 1 },
    { week: "Mar 10", present: 94, absent: 4, tardy: 2 },
  ],
  familyEngagement: {
    portalActiveRate: 78,
    eventAttendanceRate: 65,
    messageResponseRate: 92,
    formCompletionRate: 85,
  },
  supportCaseload: {
    open: 4,
    inProgress: 7,
    resolved: 23,
    avgResolutionDays: 3.2,
  },
  seatUtilization: {
    capacity: 45,
    enrolled: 38,
    percentage: 84.4,
  },
};

const funnelStages = [
  { key: "inquiries", label: "Inquiries", color: "bg-blue-200" },
  { key: "applications", label: "Applications", color: "bg-blue-300" },
  { key: "accepted", label: "Accepted", color: "bg-blue-400" },
  { key: "enrolled", label: "Enrolled", color: "bg-blue-500" },
  { key: "active", label: "Active", color: "bg-blue-600" },
] as const;

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("this-month");
  const data = mockAnalytics;

  const maxFunnel = data.enrollmentFunnel.inquiries;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-500">Key metrics for your micro school</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
        </div>

        {/* Top Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={DollarSign}
            title="Tuition Collection Rate"
            value={`${data.tuitionCollectionRate}%`}
            subtitle="$42,350 collected this month"
            color="bg-green-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Retention Rate"
            value={`${data.retentionRate}%`}
            subtitle={`${data.reEnrollmentRate}% re-enrollment`}
            color="bg-blue-500"
          />
          <StatCard
            icon={Building}
            title="Seat Utilization"
            value={`${data.seatUtilization.enrolled}/${data.seatUtilization.capacity}`}
            subtitle={`${data.seatUtilization.percentage}% capacity`}
            color="bg-purple-500"
          />
          <StatCard
            icon={Headphones}
            title="Support Caseload"
            value={data.supportCaseload.open + data.supportCaseload.inProgress}
            subtitle={`${data.supportCaseload.avgResolutionDays} day avg resolution`}
            color="bg-amber-500"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Enrollment Funnel */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Enrollment Funnel</h2>
            <div className="space-y-3">
              {funnelStages.map((stage) => {
                const value = data.enrollmentFunnel[stage.key];
                const width = (value / maxFunnel) * 100;
                return (
                  <div key={stage.key}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-gray-600">{stage.label}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                    <div className="h-8 rounded-full bg-gray-100">
                      <div
                        className={`h-8 rounded-full ${stage.color} flex items-center justify-center transition-all`}
                        style={{ width: `${width}%` }}
                      >
                        {width > 20 && (
                          <span className="text-xs font-medium text-white">
                            {Math.round(width)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              Conversion rate: {Math.round((data.enrollmentFunnel.active / data.enrollmentFunnel.inquiries) * 100)}% from inquiry to active enrollment
            </div>
          </div>

          {/* Attendance Trends */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Attendance Trends (Weekly)</h2>
            <div className="space-y-3">
              {data.attendanceTrends.map((week) => (
                <div key={week.week}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-600">{week.week}</span>
                    <span className="font-medium text-gray-900">{week.present}%</span>
                  </div>
                  <div className="flex h-6 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="bg-green-400 transition-all"
                      style={{ width: `${week.present}%` }}
                    />
                    <div
                      className="bg-red-300 transition-all"
                      style={{ width: `${week.absent}%` }}
                    />
                    <div
                      className="bg-yellow-300 transition-all"
                      style={{ width: `${week.tardy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-400" /> Present
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-red-300" /> Absent
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-yellow-300" /> Tardy
              </div>
            </div>
          </div>

          {/* Tuition Collection */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Tuition Collection</h2>
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Collection Rate</span>
                <span className="text-2xl font-bold text-gray-900">
                  {data.tuitionCollectionRate}%
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-4 rounded-full bg-green-500 transition-all"
                  style={{ width: `${data.tuitionCollectionRate}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-lg font-bold text-green-700">$42,350</p>
                <p className="text-xs text-green-600">Collected</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3">
                <p className="text-lg font-bold text-yellow-700">$1,850</p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-lg font-bold text-red-700">$750</p>
                <p className="text-xs text-red-600">Overdue</p>
              </div>
            </div>
          </div>

          {/* Family Engagement */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <h2 className="text-lg font-semibold text-gray-900">Family Engagement</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Portal Active Rate", value: data.familyEngagement.portalActiveRate, color: "bg-blue-500" },
                { label: "Event Attendance", value: data.familyEngagement.eventAttendanceRate, color: "bg-purple-500" },
                { label: "Message Response Rate", value: data.familyEngagement.messageResponseRate, color: "bg-green-500" },
                { label: "Form Completion", value: data.familyEngagement.formCompletionRate, color: "bg-amber-500" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-600">{metric.label}</span>
                    <span className="font-medium text-gray-900">{metric.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${metric.color} transition-all`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seat Utilization Gauge */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900">Seat Utilization</h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative mb-4 h-40 w-40">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={data.seatUtilization.percentage > 90 ? "#ef4444" : data.seatUtilization.percentage > 75 ? "#f59e0b" : "#22c55e"}
                    strokeWidth="12"
                    strokeDasharray={`${(data.seatUtilization.percentage / 100) * 314} 314`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {Math.round(data.seatUtilization.percentage)}%
                  </span>
                  <span className="text-xs text-gray-500">utilized</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{data.seatUtilization.enrolled}</span>{" "}
                  of {data.seatUtilization.capacity} seats filled
                </p>
                <p className="text-sm text-gray-500">
                  {data.seatUtilization.capacity - data.seatUtilization.enrolled} seats available
                </p>
              </div>
            </div>
          </div>

          {/* Support Caseload */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Headphones className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-900">Support Caseload</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-2xl font-bold text-red-700">{data.supportCaseload.open}</p>
                <p className="text-xs text-red-600">Open</p>
              </div>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                <p className="text-2xl font-bold text-yellow-700">{data.supportCaseload.inProgress}</p>
                <p className="text-xs text-yellow-600">In Progress</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{data.supportCaseload.resolved}</p>
                <p className="text-xs text-green-600">Resolved</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">{data.supportCaseload.avgResolutionDays}</p>
                <p className="text-xs text-blue-600">Avg Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
