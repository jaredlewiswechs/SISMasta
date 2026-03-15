"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Eye,
  Mail,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type InvoiceStatus = "Draft" | "Pending" | "Sent" | "Paid" | "Overdue" | "Partial";

interface Invoice {
  id: string;
  number: string;
  household: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
}

const statusVariant: Record<InvoiceStatus, "default" | "warning" | "primary" | "success" | "danger" | "orange"> = {
  Draft: "default",
  Pending: "warning",
  Sent: "primary",
  Paid: "success",
  Overdue: "danger",
  Partial: "orange",
};

const mockInvoices: Invoice[] = [
  { id: "inv-1", number: "INV-2026-001", household: "Johnson Family", amount: 1700, paidAmount: 1700, dueDate: "2026-03-01", status: "Paid", createdAt: "2026-02-15" },
  { id: "inv-2", number: "INV-2026-002", household: "Smith Family", amount: 850, paidAmount: 0, dueDate: "2026-03-01", status: "Overdue", createdAt: "2026-02-15" },
  { id: "inv-3", number: "INV-2026-003", household: "Williams Family", amount: 850, paidAmount: 425, dueDate: "2026-03-15", status: "Partial", createdAt: "2026-02-28" },
  { id: "inv-4", number: "INV-2026-004", household: "Brown Family", amount: 850, paidAmount: 0, dueDate: "2026-03-15", status: "Sent", createdAt: "2026-02-28" },
  { id: "inv-5", number: "INV-2026-005", household: "Davis Family", amount: 550, paidAmount: 0, dueDate: "2026-03-15", status: "Pending", createdAt: "2026-03-01" },
  { id: "inv-6", number: "INV-2026-006", household: "Garcia Family", amount: 550, paidAmount: 550, dueDate: "2026-03-01", status: "Paid", createdAt: "2026-02-15" },
  { id: "inv-7", number: "INV-2026-007", household: "Martinez Family", amount: 950, paidAmount: 0, dueDate: "2026-04-01", status: "Draft", createdAt: "2026-03-10" },
  { id: "inv-8", number: "INV-2026-008", household: "Wilson Family", amount: 9000, paidAmount: 9000, dueDate: "2026-01-15", status: "Paid", createdAt: "2026-01-01" },
  { id: "inv-9", number: "INV-2026-009", household: "Anderson Family", amount: 850, paidAmount: 0, dueDate: "2026-03-20", status: "Sent", createdAt: "2026-03-05" },
  { id: "inv-10", number: "INV-2026-010", household: "Lee Family", amount: 4200, paidAmount: 4200, dueDate: "2026-02-01", status: "Paid", createdAt: "2026-01-15" },
  { id: "inv-11", number: "INV-2026-011", household: "Thompson Family", amount: 850, paidAmount: 0, dueDate: "2026-02-15", status: "Overdue", createdAt: "2026-02-01" },
  { id: "inv-12", number: "INV-2026-012", household: "Taylor Family", amount: 850, paidAmount: 850, dueDate: "2026-03-01", status: "Paid", createdAt: "2026-02-15" },
];

const households = ["All Households", ...Array.from(new Set(mockInvoices.map((i) => i.household)))];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [statusFilter, setStatusFilter] = useState("All");
  const [householdFilter, setHouseholdFilter] = useState("All Households");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const totalOutstanding = invoices
    .filter((i) => ["Sent", "Pending", "Partial", "Overdue"].includes(i.status))
    .reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

  const overdueAmount = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

  const paidThisMonth = invoices
    .filter((i) => i.status === "Paid" && i.dueDate.startsWith("2026-03"))
    .reduce((sum, i) => sum + i.paidAmount, 0);

  const totalRevenue = invoices.reduce((sum, i) => sum + i.paidAmount, 0);

  const filtered = invoices.filter((inv) => {
    if (statusFilter !== "All" && inv.status !== statusFilter) return false;
    if (householdFilter !== "All Households" && inv.household !== householdFilter) return false;
    if (searchQuery && !inv.number.toLowerCase().includes(searchQuery.toLowerCase()) && !inv.household.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((i) => i.id)));
    }
  };

  const bulkSendReminders = () => {
    alert(`Reminders sent to ${selectedIds.size} invoice(s).`);
    setSelectedIds(new Set());
  };

  const bulkMarkPaid = () => {
    setInvoices((prev) =>
      prev.map((inv) =>
        selectedIds.has(inv.id) ? { ...inv, status: "Paid" as const, paidAmount: inv.amount } : inv
      )
    );
    setSelectedIds(new Set());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage billing and track payment status across all households.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Outstanding"
          value={`$${totalOutstanding.toLocaleString()}`}
          icon={Clock}
        />
        <StatCard
          title="Overdue Amount"
          value={`$${overdueAmount.toLocaleString()}`}
          icon={AlertTriangle}
        />
        <StatCard
          title="Paid This Month"
          value={`$${paidThisMonth.toLocaleString()}`}
          icon={CheckCircle}
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Partial">Partial</option>
        </Select>
        <Select
          value={householdFilter}
          onChange={(e) => setHouseholdFilter(e.target.value)}
        >
          {households.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm font-medium text-blue-700">
            {selectedIds.size} invoice(s) selected
          </span>
          <Button size="sm" variant="outline" onClick={bulkSendReminders}>
            <Send className="w-3.5 h-3.5 mr-1" />
            Send Reminders
          </Button>
          <Button size="sm" variant="outline" onClick={bulkMarkPaid}>
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Mark as Paid
          </Button>
        </div>
      )}

      {/* Invoices Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  checked={selectedIds.size === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Household</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(inv.id)}
                    onChange={() => toggleSelect(inv.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-900">{inv.number}</TableCell>
                <TableCell className="text-gray-600">{inv.household}</TableCell>
                <TableCell className="text-gray-900 font-medium">
                  ${inv.amount.toLocaleString()}
                  {inv.status === "Partial" && (
                    <span className="text-xs text-gray-500 block">
                      Paid: ${inv.paidAmount.toLocaleString()}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">{inv.dueDate}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[inv.status]}>{inv.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {inv.status !== "Paid" && (
                      <button
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                        title="Send Reminder"
                        onClick={() => alert(`Reminder sent for ${inv.number}`)}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No invoices found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
