"use client";

import { useState } from "react";
import {
  Settings,
  Building2,
  Users,
  Palette,
  FileText,
  Calendar,
  Save,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockSchool = {
  name: "Bright Horizons Micro School",
  address: "1234 Learning Lane, Austin, TX 78701",
  phone: "(512) 555-0142",
  email: "admin@brighthorizons.edu",
  website: "www.brighthorizons.edu",
  academicModel: "Montessori-Inspired",
  billingFrequency: "Monthly",
  gradesServed: ["K", "1", "2", "3", "4", "5"],
  maxCapacity: 45,
  currentEnrollment: 38,
  admissionStatus: "Open" as "Open" | "Waitlist Only" | "Closed",
  charterMode: false,
  brandColor: "#2563EB",
  logoUrl: "/logo-placeholder.png",
};

const mockGradingPeriods = [
  { id: "1", name: "Fall Trimester", startDate: "2025-08-18", endDate: "2025-11-21", status: "Completed" },
  { id: "2", name: "Winter Trimester", startDate: "2025-12-01", endDate: "2026-03-06", status: "Active" },
  { id: "3", name: "Spring Trimester", startDate: "2026-03-16", endDate: "2026-06-05", status: "Upcoming" },
];

const mockRequiredForms = [
  { id: "1", name: "Enrollment Agreement", required: true, enabled: true },
  { id: "2", name: "Medical Authorization", required: true, enabled: true },
  { id: "3", name: "Photo Release", required: false, enabled: true },
  { id: "4", name: "Emergency Contact Form", required: true, enabled: true },
  { id: "5", name: "Acceptable Use Policy", required: false, enabled: false },
  { id: "6", name: "Field Trip Permission", required: false, enabled: true },
];

export default function SettingsPage() {
  const [school, setSchool] = useState(mockSchool);
  const [gradingPeriods, setGradingPeriods] = useState(mockGradingPeriods);
  const [forms, setForms] = useState(mockRequiredForms);
  const [saving, setSaving] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<string | null>(null);
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [newPeriod, setNewPeriod] = useState({ name: "", startDate: "", endDate: "" });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  const handleAddPeriod = () => {
    if (newPeriod.name && newPeriod.startDate && newPeriod.endDate) {
      setGradingPeriods([
        ...gradingPeriods,
        { id: String(Date.now()), ...newPeriod, status: "Upcoming" },
      ]);
      setNewPeriod({ name: "", startDate: "", endDate: "" });
      setShowAddPeriod(false);
    }
  };

  const handleDeletePeriod = (id: string) => {
    setGradingPeriods(gradingPeriods.filter((p) => p.id !== id));
  };

  const toggleForm = (id: string) => {
    setForms(forms.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">School Settings</h1>
            <p className="text-gray-500">Configure your micro school setup and preferences</p>
          </div>
        </div>

        {/* School Profile */}
        <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">School Profile</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="School Name"
              value={school.name}
              onChange={(e) => setSchool({ ...school, name: e.target.value })}
            />
            <Input
              label="Phone"
              value={school.phone}
              onChange={(e) => setSchool({ ...school, phone: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Input
                label="Address"
                value={school.address}
                onChange={(e) => setSchool({ ...school, address: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={school.email}
              onChange={(e) => setSchool({ ...school, email: e.target.value })}
            />
            <Input
              label="Website"
              value={school.website}
              onChange={(e) => setSchool({ ...school, website: e.target.value })}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Academic Model
              </label>
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={school.academicModel}
                onChange={(e) => setSchool({ ...school, academicModel: e.target.value })}
              >
                <option>Montessori-Inspired</option>
                <option>Classical</option>
                <option>Project-Based</option>
                <option>Hybrid / Custom</option>
                <option>Waldorf-Inspired</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Billing Frequency
              </label>
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={school.billingFrequency}
                onChange={(e) => setSchool({ ...school, billingFrequency: e.target.value })}
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Semester</option>
                <option>Annual</option>
              </select>
            </div>
            <Input
              label="Max Capacity"
              type="number"
              value={school.maxCapacity}
              onChange={(e) => setSchool({ ...school, maxCapacity: Number(e.target.value) })}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Grades Served
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {["PK", "K", "1", "2", "3", "4", "5", "6", "7", "8"].map((grade) => (
                  <button
                    key={grade}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      school.gradesServed.includes(grade)
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    onClick={() =>
                      setSchool({
                        ...school,
                        gradesServed: school.gradesServed.includes(grade)
                          ? school.gradesServed.filter((g) => g !== grade)
                          : [...school.gradesServed, grade],
                      })
                    }
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Admissions Settings */}
        <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Admissions Settings</h2>
          <div className="flex gap-3">
            {(["Open", "Waitlist Only", "Closed"] as const).map((status) => (
              <button
                key={status}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  school.admissionStatus === status
                    ? status === "Open"
                      ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                      : status === "Waitlist Only"
                      ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300"
                      : "bg-red-100 text-red-700 ring-1 ring-red-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSchool({ ...school, admissionStatus: status })}
              >
                {status}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Current enrollment: {school.currentEnrollment} / {school.maxCapacity} seats
          </p>
        </section>

        {/* Charter Mode */}
        <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Charter Mode</h2>
              <p className="text-sm text-gray-500">
                Enable charter-specific compliance fields, reporting, and TEFA tracking
              </p>
            </div>
            <button
              onClick={() => setSchool({ ...school, charterMode: !school.charterMode })}
              className="text-blue-600"
            >
              {school.charterMode ? (
                <ToggleRight className="h-10 w-10" />
              ) : (
                <ToggleLeft className="h-10 w-10 text-gray-400" />
              )}
            </button>
          </div>
        </section>

        {/* Branding */}
        <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Branding</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">School Logo</label>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
              </div>
              <p className="mt-1 text-xs text-gray-400">PNG or SVG, max 2MB</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={school.brandColor}
                  onChange={(e) => setSchool({ ...school, brandColor: e.target.value })}
                  className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                />
                <Input
                  value={school.brandColor}
                  onChange={(e) => setSchool({ ...school, brandColor: e.target.value })}
                  className="max-w-[140px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grading Periods */}
        <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Grading Periods</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAddPeriod(true)}>
              <Plus className="h-4 w-4" />
              Add Period
            </Button>
          </div>

          {showAddPeriod && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  label="Period Name"
                  value={newPeriod.name}
                  onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                  placeholder="e.g., Fall Trimester"
                />
                <Input
                  label="Start Date"
                  type="date"
                  value={newPeriod.startDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={newPeriod.endDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                />
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={handleAddPeriod}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddPeriod(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="divide-y rounded-lg border">
            {gradingPeriods.map((period) => (
              <div key={period.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium text-gray-900">{period.name}</p>
                  <p className="text-sm text-gray-500">
                    {period.startDate} - {period.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      period.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : period.status === "Completed"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {period.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleDeletePeriod(period.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Required Forms Checklist */}
        <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Required Forms Checklist</h2>
          </div>
          <div className="space-y-2">
            {forms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleForm(form.id)}>
                    {form.enabled ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <span className={form.enabled ? "text-gray-900" : "text-gray-400"}>
                    {form.name}
                  </span>
                </div>
                {form.required && (
                  <span className="text-xs font-medium text-red-500">Required</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Staff Accounts Link */}
        <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <a
            href="/staff"
            className="flex items-center justify-between text-gray-900 hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <div>
                <h2 className="text-lg font-semibold">Staff Accounts</h2>
                <p className="text-sm text-gray-500">Manage staff roles and access</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </a>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} loading={saving}>
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
