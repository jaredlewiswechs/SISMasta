"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Download,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  FileText,
  User,
  Home,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type InvoiceStatus = "Draft" | "Pending" | "Sent" | "Paid" | "Overdue" | "Partial";

const statusVariant: Record<InvoiceStatus, "default" | "warning" | "primary" | "success" | "danger" | "orange"> = {
  Draft: "default",
  Pending: "warning",
  Sent: "primary",
  Paid: "success",
  Overdue: "danger",
  Partial: "orange",
};

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  payerType: string;
  reference: string;
}

const mockInvoice = {
  id: "inv-3",
  number: "INV-2026-003",
  status: "Partial" as InvoiceStatus,
  createdAt: "2026-02-28",
  dueDate: "2026-03-15",
  sentAt: "2026-03-01",
  household: "Williams Family",
  primaryContact: "Robert Williams",
  email: "rwilliams@email.com",
  phone: "(555) 234-5678",
  address: "456 Oak Avenue, Springfield, AZ 85001",
  tefaEligible: true,
  tefaCategory: "Tuition",
  notes: "Partial payment received. Remainder due by end of month.",
  lineItems: [
    { id: "li-1", description: "Standard K-8 Monthly Tuition - March 2026", amount: 850, category: "Tuition" },
  ],
  discount: 0,
  tax: 0,
  subtotal: 850,
  total: 850,
  paidAmount: 425,
  balanceDue: 425,
};

const mockPayments: Payment[] = [
  {
    id: "pay-1",
    date: "2026-03-05",
    amount: 425,
    method: "Bank Transfer",
    payerType: "Parent",
    reference: "TXN-20260305-001",
  },
];

export default function InvoiceDetailPage() {
  const [invoice, setInvoice] = useState(mockInvoice);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "Bank Transfer",
    payerType: "Parent",
  });

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentForm.amount) || 0;
    if (amount <= 0) return;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      amount,
      method: paymentForm.method,
      payerType: paymentForm.payerType,
      reference: `TXN-${Date.now()}`,
    };

    const newPaidAmount = invoice.paidAmount + amount;
    const newBalance = invoice.total - newPaidAmount;

    setPayments((prev) => [...prev, newPayment]);
    setInvoice((prev) => ({
      ...prev,
      paidAmount: newPaidAmount,
      balanceDue: newBalance,
      status: newBalance <= 0 ? ("Paid" as InvoiceStatus) : ("Partial" as InvoiceStatus),
    }));
    setShowPaymentModal(false);
    setPaymentForm({ amount: "", method: "Bank Transfer", payerType: "Parent" });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/invoices"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{invoice.number}</h1>
              <Badge variant={statusVariant[invoice.status]}>{invoice.status}</Badge>
              {invoice.tefaEligible && <Badge variant="purple">TEFA Eligible</Badge>}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Created {invoice.createdAt} &middot; Due {invoice.dueDate}
              {invoice.sentAt && ` · Sent ${invoice.sentAt}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status !== "Paid" && (
            <Button
              variant="outline"
              onClick={() => alert("Reminder sent to " + invoice.email)}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => alert("Receipt download placeholder")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          {invoice.status !== "Paid" && (
            <Button onClick={() => setShowPaymentModal(true)}>
              <DollarSign className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-gray-900">{item.description}</TableCell>
                      <TableCell className="text-gray-600">{item.category}</TableCell>
                      <TableCell className="text-right font-medium text-gray-900">
                        ${item.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="px-6 py-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-red-600">-${invoice.discount.toFixed(2)}</span>
                  </div>
                )}
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paid</span>
                  <span className="font-medium text-green-600">${invoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-indigo-700 border-t pt-2">
                  <span>Balance Due</span>
                  <span>${invoice.balanceDue.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No payments recorded yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Payer Type</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-gray-600">{payment.date}</TableCell>
                        <TableCell className="font-medium text-green-700">
                          ${payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-600">{payment.method}</TableCell>
                        <TableCell>
                          <Badge variant="primary">{payment.payerType}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-xs font-mono">
                          {payment.reference}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Household Info */}
          <Card>
            <CardHeader>
              <CardTitle>Household / Payer Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{invoice.household}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{invoice.primaryContact}</span>
                </div>
                <div className="text-sm text-gray-600 pl-6">{invoice.email}</div>
                <div className="text-sm text-gray-600 pl-6">{invoice.phone}</div>
                <div className="text-sm text-gray-600 pl-6">{invoice.address}</div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">{invoice.createdAt}</span>
                </div>
                {invoice.sentAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Send className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Sent:</span>
                    <span className="text-gray-900">{invoice.sentAt}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Due:</span>
                  <span className="text-gray-900">{invoice.dueDate}</span>
                </div>
                {payments.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-500">Last Payment:</span>
                    <span className="text-gray-900">{payments[payments.length - 1].date}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* TEFA Info */}
          {invoice.tefaEligible && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    TEFA/ESA Information
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Eligible</span>
                    <Badge variant="success">Yes</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="text-gray-900">{invoice.tefaCategory}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Reimbursable Amount</span>
                    <span className="font-medium text-gray-900">${invoice.total.toFixed(2)}</span>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-700">
                      This invoice is flagged as TEFA-eligible and will be included in
                      expense packet generation for the Williams Family.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
      >
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Balance Due</span>
              <span className="font-bold text-gray-900">${invoice.balanceDue.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Payment Amount ($)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <Select
              value={paymentForm.method}
              onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
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
              value={paymentForm.payerType}
              onChange={(e) => setPaymentForm({ ...paymentForm, payerType: e.target.value })}
            >
              <option value="Parent">Parent</option>
              <option value="TEFA/ESA">TEFA/ESA</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Third Party">Third Party</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
