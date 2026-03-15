"use client";

import { useState } from "react";
import {
  Search,
  DollarSign,
  Clock,
  XCircle,
  RotateCcw,
  Download,
  Plus,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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

type PaymentStatus = "Completed" | "Pending" | "Failed" | "Refunded";

interface PaymentRecord {
  id: string;
  date: string;
  invoiceNumber: string;
  invoiceId: string;
  household: string;
  amount: number;
  method: string;
  payerType: string;
  status: PaymentStatus;
  reference: string;
}

const statusVariant: Record<PaymentStatus, "success" | "warning" | "danger" | "orange"> = {
  Completed: "success",
  Pending: "warning",
  Failed: "danger",
  Refunded: "orange",
};

const mockPayments: PaymentRecord[] = [
  { id: "p-1", date: "2026-03-12", invoiceNumber: "INV-2026-001", invoiceId: "inv-1", household: "Johnson Family", amount: 1700, method: "Bank Transfer", payerType: "Parent", status: "Completed", reference: "TXN-001" },
  { id: "p-2", date: "2026-03-10", invoiceNumber: "INV-2026-006", invoiceId: "inv-6", household: "Garcia Family", amount: 550, method: "Credit Card", payerType: "Parent", status: "Completed", reference: "TXN-002" },
  { id: "p-3", date: "2026-03-08", invoiceNumber: "INV-2026-010", invoiceId: "inv-10", household: "Lee Family", amount: 4200, method: "TEFA/ESA", payerType: "TEFA/ESA", status: "Completed", reference: "TXN-003" },
  { id: "p-4", date: "2026-03-05", invoiceNumber: "INV-2026-003", invoiceId: "inv-3", household: "Williams Family", amount: 425, method: "Bank Transfer", payerType: "Parent", status: "Completed", reference: "TXN-004" },
  { id: "p-5", date: "2026-03-04", invoiceNumber: "INV-2026-012", invoiceId: "inv-12", household: "Taylor Family", amount: 850, method: "Check", payerType: "Parent", status: "Completed", reference: "TXN-005" },
  { id: "p-6", date: "2026-03-03", invoiceNumber: "INV-2026-008", invoiceId: "inv-8", household: "Wilson Family", amount: 9000, method: "TEFA/ESA", payerType: "TEFA/ESA", status: "Completed", reference: "TXN-006" },
  { id: "p-7", date: "2026-03-01", invoiceNumber: "INV-2026-005", invoiceId: "inv-5", household: "Davis Family", amount: 550, method: "Credit Card", payerType: "Parent", status: "Pending", reference: "TXN-007" },
  { id: "p-8", date: "2026-02-28", invoiceNumber: "INV-2026-004", invoiceId: "inv-4", household: "Brown Family", amount: 850, method: "Bank Transfer", payerType: "Parent", status: "Failed", reference: "TXN-008" },
  { id: "p-9", date: "2026-02-15", invoiceNumber: "INV-2026-002", invoiceId: "inv-2", household: "Smith Family", amount: 850, method: "Credit Card", payerType: "Scholarship", status: "Refunded", reference: "TXN-009" },
];

export default function PaymentsPage() {
  const [payments] = useState<PaymentRecord[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [payerFilter, setPayerFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    invoiceNumber: "",
    household: "",
    amount: "",
    method: "Bank Transfer",
    payerType: "Parent",
  });

  const totalCollected = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = payments
    .filter((p) => p.status === "Failed")
    .reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = payments
    .filter((p) => p.status === "Refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  const filtered = payments.filter((p) => {
    if (methodFilter !== "All" && p.method !== methodFilter) return false;
    if (payerFilter !== "All" && p.payerType !== payerFilter) return false;
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (
      searchQuery &&
      !p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.household.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.reference.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleRecordManual = () => {
    alert(`Manual payment recorded: $${manualForm.amount} for ${manualForm.household}`);
    setShowManualModal(false);
    setManualForm({ invoiceNumber: "", household: "", amount: "", method: "Bank Transfer", payerType: "Parent" });
  };

  const handleExport = () => {
    alert("Exporting payments data as CSV...");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all payments received and their processing status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowManualModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Record Manual Payment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Collected" value={`$${totalCollected.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Pending" value={`$${pendingAmount.toLocaleString()}`} icon={Clock} />
        <StatCard title="Failed" value={`$${failedAmount.toLocaleString()}`} icon={XCircle} />
        <StatCard title="Refunded" value={`$${refundedAmount.toLocaleString()}`} icon={RotateCcw} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
          <option value="All">All Methods</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Check">Check</option>
          <option value="Cash">Cash</option>
          <option value="TEFA/ESA">TEFA/ESA</option>
        </Select>
        <Select value={payerFilter} onChange={(e) => setPayerFilter(e.target.value)}>
          <option value="All">All Payer Types</option>
          <option value="Parent">Parent</option>
          <option value="TEFA/ESA">TEFA/ESA</option>
          <option value="Scholarship">Scholarship</option>
          <option value="Third Party">Third Party</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </Select>
      </div>

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Household</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Payer Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="text-gray-600">{payment.date}</TableCell>
                <TableCell>
                  <a
                    href={`/invoices/${payment.invoiceId}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {payment.invoiceNumber}
                  </a>
                </TableCell>
                <TableCell className="text-gray-900">{payment.household}</TableCell>
                <TableCell className="font-medium text-gray-900">
                  ${payment.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <CreditCard className="w-3.5 h-3.5" />
                    {payment.method}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="primary">{payment.payerType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[payment.status]}>{payment.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No payments found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Manual Payment Modal */}
      <Modal
        open={showManualModal}
        onClose={() => setShowManualModal(false)}
        title="Record Manual Payment"
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <Input
              placeholder="INV-2026-XXX"
              value={manualForm.invoiceNumber}
              onChange={(e) => setManualForm({ ...manualForm, invoiceNumber: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Household</label>
            <Select
              value={manualForm.household}
              onChange={(e) => setManualForm({ ...manualForm, household: e.target.value })}
            >
              <option value="">Select Household...</option>
              <option value="Johnson Family">Johnson Family</option>
              <option value="Smith Family">Smith Family</option>
              <option value="Williams Family">Williams Family</option>
              <option value="Brown Family">Brown Family</option>
              <option value="Davis Family">Davis Family</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={manualForm.amount}
              onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <Select
              value={manualForm.method}
              onChange={(e) => setManualForm({ ...manualForm, method: e.target.value })}
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="TEFA/ESA">TEFA/ESA</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Payer Type</label>
            <Select
              value={manualForm.payerType}
              onChange={(e) => setManualForm({ ...manualForm, payerType: e.target.value })}
            >
              <option value="Parent">Parent</option>
              <option value="TEFA/ESA">TEFA/ESA</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Third Party">Third Party</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowManualModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordManual}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
