"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  PauseCircle,
  PlayCircle,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface TuitionPlan {
  id: string;
  name: string;
  amount: number;
  frequency: "Monthly" | "Quarterly" | "Annually" | "Semester";
  studentCount: number;
  siblingDiscount: number;
  status: "Active" | "Inactive";
  description: string;
  assignedStudents: { id: string; name: string; household: string }[];
}

const mockPlans: TuitionPlan[] = [
  {
    id: "plan-1",
    name: "Standard K-8",
    amount: 850,
    frequency: "Monthly",
    studentCount: 24,
    siblingDiscount: 10,
    status: "Active",
    description: "Standard tuition for kindergarten through 8th grade students.",
    assignedStudents: [
      { id: "s1", name: "Emma Johnson", household: "Johnson Family" },
      { id: "s2", name: "Liam Johnson", household: "Johnson Family" },
      { id: "s3", name: "Olivia Smith", household: "Smith Family" },
      { id: "s4", name: "Noah Williams", household: "Williams Family" },
      { id: "s5", name: "Ava Brown", household: "Brown Family" },
    ],
  },
  {
    id: "plan-2",
    name: "Pre-K Half Day",
    amount: 550,
    frequency: "Monthly",
    studentCount: 12,
    siblingDiscount: 15,
    status: "Active",
    description: "Half-day pre-kindergarten program tuition.",
    assignedStudents: [
      { id: "s6", name: "Sophia Davis", household: "Davis Family" },
      { id: "s7", name: "Mason Garcia", household: "Garcia Family" },
    ],
  },
  {
    id: "plan-3",
    name: "Pre-K Full Day",
    amount: 950,
    frequency: "Monthly",
    studentCount: 8,
    siblingDiscount: 10,
    status: "Active",
    description: "Full-day pre-kindergarten program tuition.",
    assignedStudents: [
      { id: "s8", name: "Isabella Martinez", household: "Martinez Family" },
    ],
  },
  {
    id: "plan-4",
    name: "Annual Prepay",
    amount: 9000,
    frequency: "Annually",
    studentCount: 6,
    siblingDiscount: 12,
    status: "Active",
    description: "Annual prepaid tuition with built-in discount.",
    assignedStudents: [
      { id: "s9", name: "James Wilson", household: "Wilson Family" },
      { id: "s10", name: "Charlotte Anderson", household: "Anderson Family" },
    ],
  },
  {
    id: "plan-5",
    name: "Summer Program",
    amount: 400,
    frequency: "Monthly",
    studentCount: 0,
    siblingDiscount: 5,
    status: "Inactive",
    description: "Summer enrichment program tuition.",
    assignedStudents: [],
  },
  {
    id: "plan-6",
    name: "Semester Plan",
    amount: 4200,
    frequency: "Semester",
    studentCount: 10,
    siblingDiscount: 10,
    status: "Active",
    description: "Per-semester billing option for families who prefer biannual payments.",
    assignedStudents: [
      { id: "s11", name: "Benjamin Lee", household: "Lee Family" },
      { id: "s12", name: "Mia Thompson", household: "Thompson Family" },
    ],
  },
];

const emptyForm: {
  name: string;
  amount: string;
  frequency: TuitionPlan["frequency"];
  siblingDiscount: string;
  description: string;
} = {
  name: "",
  amount: "",
  frequency: "Monthly",
  siblingDiscount: "",
  description: "",
};

export default function TuitionPlansPage() {
  const [plans, setPlans] = useState<TuitionPlan[]>(mockPlans);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TuitionPlan | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState(emptyForm);

  const activePlans = plans.filter((p) => p.status === "Active");
  const totalStudents = plans.reduce((sum, p) => sum + p.studentCount, 0);
  const avgTuition =
    activePlans.length > 0
      ? activePlans.reduce((sum, p) => sum + p.amount, 0) / activePlans.length
      : 0;

  const filteredPlans = plans.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (plan: TuitionPlan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      amount: plan.amount.toString(),
      frequency: plan.frequency,
      siblingDiscount: plan.siblingDiscount.toString(),
      description: plan.description,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: form.name,
                amount: parseFloat(form.amount) || 0,
                frequency: form.frequency,
                siblingDiscount: parseFloat(form.siblingDiscount) || 0,
                description: form.description,
              }
            : p
        )
      );
    } else {
      const newPlan: TuitionPlan = {
        id: `plan-${Date.now()}`,
        name: form.name,
        amount: parseFloat(form.amount) || 0,
        frequency: form.frequency,
        studentCount: 0,
        siblingDiscount: parseFloat(form.siblingDiscount) || 0,
        status: "Active",
        description: form.description,
        assignedStudents: [],
      };
      setPlans((prev) => [...prev, newPlan]);
    }
    setShowModal(false);
  };

  const toggleStatus = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tuition Plans</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage tuition plans and pricing for your micro school.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Plans"
          value={activePlans.length}
          icon={DollarSign}
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
        />
        <StatCard
          title="Avg. Monthly Tuition"
          value={`$${avgTuition.toFixed(0)}`}
          icon={DollarSign}
        />
        <StatCard
          title="Inactive Plans"
          value={plans.filter((p) => p.status === "Inactive").length}
          icon={PauseCircle}
        />
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Plans Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead># Students</TableHead>
              <TableHead>Sibling Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <>
                <TableRow key={plan.id}>
                  <TableCell>
                    <button
                      onClick={() =>
                        setExpandedPlan(expandedPlan === plan.id ? null : plan.id)
                      }
                      className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600"
                    >
                      {expandedPlan === plan.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {plan.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">
                    ${plan.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-600">{plan.frequency}</TableCell>
                  <TableCell className="text-gray-600">{plan.studentCount}</TableCell>
                  <TableCell className="text-gray-600">{plan.siblingDiscount}%</TableCell>
                  <TableCell>
                    <Badge variant={plan.status === "Active" ? "success" : "default"}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(plan)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(plan.id)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-orange-600"
                        title={plan.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        {plan.status === "Active" ? (
                          <PauseCircle className="w-4 h-4" />
                        ) : (
                          <PlayCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedPlan === plan.id && (
                  <tr key={`${plan.id}-detail`}>
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">{plan.description}</p>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Assigned Students ({plan.assignedStudents.length})
                          </h4>
                          {plan.assignedStudents.length === 0 ? (
                            <p className="text-sm text-gray-400">
                              No students assigned to this plan.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {plan.assignedStudents.map((student) => (
                                <div
                                  key={student.id}
                                  className="flex items-center gap-2 p-2 bg-white rounded border text-sm"
                                >
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <div>
                                    <span className="font-medium text-gray-900">
                                      {student.name}
                                    </span>
                                    <span className="text-gray-500 ml-1">
                                      - {student.household}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingPlan ? "Edit Tuition Plan" : "Add Tuition Plan"}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Plan Name</label>
            <Input
              placeholder="e.g., Standard K-8"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <Select
              value={form.frequency}
              onChange={(e) =>
                setForm({ ...form, frequency: e.target.value as TuitionPlan["frequency"] })
              }
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Semester">Semester</option>
              <option value="Annually">Annually</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Sibling Discount (%)</label>
            <Input
              type="number"
              placeholder="0"
              value={form.siblingDiscount}
              onChange={(e) => setForm({ ...form, siblingDiscount: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              placeholder="Plan description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPlan ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
