"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit2,
  UserX,
  UserCheck,
  X,
  Mail,
  Shield,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type StaffRole = "OWNER" | "ADMIN" | "TEACHER" | "AIDE" | "FINANCE" | "READONLY";
type StaffStatus = "Active" | "Inactive";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole;
  title: string;
  status: StaffStatus;
  cohorts: string[];
}

const mockStaff: StaffMember[] = [
  { id: "1", firstName: "Sarah", lastName: "Mitchell", email: "sarah@brighthorizons.edu", role: "OWNER", title: "Director", status: "Active", cohorts: [] },
  { id: "2", firstName: "James", lastName: "Patterson", email: "james@brighthorizons.edu", role: "TEACHER", title: "Lead Teacher - Lower Elementary", status: "Active", cohorts: ["Explorers (K-2)"] },
  { id: "3", firstName: "Maria", lastName: "Gonzalez", email: "maria@brighthorizons.edu", role: "TEACHER", title: "Lead Teacher - Upper Elementary", status: "Active", cohorts: ["Innovators (3-5)"] },
  { id: "4", firstName: "David", lastName: "Kim", email: "david@brighthorizons.edu", role: "AIDE", title: "Teaching Aide", status: "Active", cohorts: ["Explorers (K-2)", "Innovators (3-5)"] },
  { id: "5", firstName: "Laura", lastName: "Chen", email: "laura@brighthorizons.edu", role: "FINANCE", title: "Business Manager", status: "Active", cohorts: [] },
  { id: "6", firstName: "Robert", lastName: "Williams", email: "robert@brighthorizons.edu", role: "TEACHER", title: "Art & Music Teacher", status: "Inactive", cohorts: [] },
];

const roleColors: Record<StaffRole, string> = {
  OWNER: "bg-purple-100 text-purple-700",
  ADMIN: "bg-blue-100 text-blue-700",
  TEACHER: "bg-green-100 text-green-700",
  AIDE: "bg-teal-100 text-teal-700",
  FINANCE: "bg-amber-100 text-amber-700",
  READONLY: "bg-gray-100 text-gray-600",
};

const availableCohorts = ["Explorers (K-2)", "Innovators (3-5)", "Pioneers (6-8)"];

export default function StaffPage() {
  const [staff, setStaff] = useState(mockStaff);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "TEACHER" as StaffRole,
    title: "",
    cohorts: [] as string[],
  });

  const filtered = staff.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "", role: "TEACHER", title: "", cohorts: [] });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    const newMember: StaffMember = {
      id: String(Date.now()),
      ...formData,
      status: "Active",
    };
    setStaff([...staff, newMember]);
    resetForm();
  };

  const handleEdit = (member: StaffMember) => {
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      title: member.title,
      cohorts: member.cohorts,
    });
    setEditingId(member.id);
    setShowAddForm(true);
  };

  const handleUpdate = () => {
    setStaff(
      staff.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
    );
    resetForm();
  };

  const toggleStatus = (id: string) => {
    setStaff(
      staff.map((s) =>
        s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
      )
    );
  };

  const toggleCohort = (cohort: string) => {
    setFormData({
      ...formData,
      cohorts: formData.cohorts.includes(cohort)
        ? formData.cohorts.filter((c) => c !== cohort)
        : [...formData.cohorts, cohort],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-500">
                {staff.filter((s) => s.status === "Active").length} active staff members
              </p>
            </div>
          </div>
          <Button onClick={() => { resetForm(); setShowAddForm(true); }}>
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>

        {/* Add / Edit Form */}
        {showAddForm && (
          <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Staff Member" : "Add Staff Member"}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="First name"
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Last name"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@school.edu"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
                <select
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as StaffRole })}
                >
                  <option value="OWNER">Owner</option>
                  <option value="ADMIN">Admin</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="AIDE">Aide</option>
                  <option value="FINANCE">Finance</option>
                  <option value="READONLY">Read Only</option>
                </select>
              </div>
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Lead Teacher"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Cohort Assignments
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {availableCohorts.map((cohort) => (
                    <button
                      key={cohort}
                      onClick={() => toggleCohort(cohort)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        formData.cohorts.includes(cohort)
                          ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {cohort}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleAdd}>
                {editingId ? "Update" : "Add Staff Member"}
              </Button>
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Cohorts
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </div>
                      <span className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {member.email}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[member.role]}`}
                    >
                      <Shield className="h-3 w-3" />
                      {member.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      {member.title}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {member.cohorts.length > 0
                        ? member.cohorts.map((c) => (
                            <span
                              key={c}
                              className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600"
                            >
                              {c}
                            </span>
                          ))
                        : <span className="text-xs text-gray-400">--</span>}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="Edit"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        className={`rounded p-1 ${
                          member.status === "Active"
                            ? "text-gray-400 hover:bg-red-50 hover:text-red-500"
                            : "text-gray-400 hover:bg-green-50 hover:text-green-600"
                        }`}
                        title={member.status === "Active" ? "Deactivate" : "Reactivate"}
                        onClick={() => toggleStatus(member.id)}
                      >
                        {member.status === "Active" ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">
              No staff members found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
