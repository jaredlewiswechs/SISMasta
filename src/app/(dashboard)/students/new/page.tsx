"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

// ── Mock options data ────────────────────────────────────────────────

const households = [
  { id: "h1", name: "Rodriguez Family" },
  { id: "h2", name: "Chen Family" },
  { id: "h3", name: "Johnson Family" },
  { id: "h4", name: "Williams Family" },
];

const cohorts = [
  { id: "c1", name: "Alpha (K-2)" },
  { id: "c2", name: "Beta (3-5)" },
  { id: "c3", name: "Gamma (6-8)" },
];

const tuitionPlans = [
  { id: "tp1", name: "Full-Time Monthly - $1,200/mo" },
  { id: "tp2", name: "Hybrid Monthly - $800/mo" },
  { id: "tp3", name: "Enrichment Only - $400/mo" },
];

const gradeOptions = ["Pre-K", "K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
const enrollmentStatuses = ["INQUIRY", "APPLICANT", "ACCEPTED", "WAITLISTED", "ACTIVE"];

// ── Page Component ───────────────────────────────────────────────────

export default function NewStudentPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
          <p className="text-sm text-gray-500">
            Fill in the student information below. Fields marked with * are required.
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Student saved (demo only)");
        }}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Legal First Name *
              </label>
              <Input placeholder="First name" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Legal Last Name *
              </label>
              <Input placeholder="Last name" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Preferred Name
              </label>
              <Input placeholder="Preferred name (optional)" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <Input type="date" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <Select>
                <option value="">Select gender</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Grade *</label>
              <Select required>
                <option value="">Select grade</option>
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Enrollment Status
              </label>
              <Select defaultValue="INQUIRY">
                {enrollmentStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Photo URL
              </label>
              <Input placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        {/* Household, Cohort, Tuition Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Household *
              </label>
              <div className="flex gap-2">
                <Select required className="flex-1">
                  <option value="">Select household</option>
                  {households.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </Select>
                <Link href="/households?new=true">
                  <Button type="button" variant="outline" size="icon" title="Create new household">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Cohort</label>
              <Select>
                <option value="">Select cohort</option>
                {cohorts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Tuition Plan
              </label>
              <Select>
                <option value="">Select tuition plan</option>
                {tuitionPlans.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="font-medium text-gray-700">Scholarship Flag</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="font-medium text-gray-700">TEFA Eligible</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Health & Accommodations */}
        <Card>
          <CardHeader>
            <CardTitle>Health & Accommodations</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Health Alerts
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                placeholder="Allergies, medical conditions, medications..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Accommodations
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                placeholder="Learning accommodations, IEP notes..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="max-w-xs"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-700">
                Drag and drop files here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Birth certificate, immunization records, IEP, transcripts, etc.
              </p>
              <Button type="button" variant="outline" className="mt-4">
                Choose Files
              </Button>
            </div>
            {documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2"
                  >
                    <span className="text-sm text-gray-700">{doc}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDocuments(documents.filter((d) => d !== doc))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link href="/students">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Student
          </Button>
        </div>
      </form>
    </div>
  );
}
