"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Receipt,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  number: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Due" | "Overdue" | "Pending";
  paidDate?: string;
  paymentMethod?: string;
}

const mockInvoices: Invoice[] = [
  { id: "1", number: "INV-2026-001", description: "March 2026 Tuition", amount: 1250, dueDate: "2026-03-01", status: "Paid", paidDate: "2026-02-28", paymentMethod: "ACH Transfer" },
  { id: "2", number: "INV-2026-002", description: "April 2026 Tuition", amount: 1250, dueDate: "2026-04-01", status: "Due" },
  { id: "3", number: "INV-2026-003", description: "Spring Activity Fee", amount: 150, dueDate: "2026-03-15", status: "Overdue" },
  { id: "4", number: "INV-2025-012", description: "February 2026 Tuition", amount: 1250, dueDate: "2026-02-01", status: "Paid", paidDate: "2026-01-30", paymentMethod: "Credit Card" },
  { id: "5", number: "INV-2025-011", description: "January 2026 Tuition", amount: 1250, dueDate: "2026-01-01", status: "Paid", paidDate: "2025-12-29", paymentMethod: "ACH Transfer" },
];

const mockTefaExpenses = [
  { id: "1", category: "Curriculum Materials", amount: 450, date: "2026-02-15" },
  { id: "2", category: "Technology", amount: 320, date: "2026-01-20" },
  { id: "3", category: "Educational Supplies", amount: 180, date: "2026-03-01" },
];

const statusConfig = {
  Paid: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  Due: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  Overdue: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
  Pending: { icon: Clock, color: "text-gray-600", bg: "bg-gray-50", badge: "bg-gray-100 text-gray-700" },
};

export default function InvoicesPage() {
  const [showTefa, setShowTefa] = useState(false);

  const outstanding = mockInvoices.filter((inv) => inv.status !== "Paid");
  const paid = mockInvoices.filter((inv) => inv.status === "Paid");
  const totalOutstanding = outstanding.reduce((sum, inv) => sum + inv.amount, 0);
  const tefaTotal = mockTefaExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices & Payments</h1>
          <p className="text-gray-500">Emma Johnson - 3rd Grade</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <DollarSign className="h-4 w-4" />
            Outstanding Balance
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalOutstanding.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{outstanding.length} invoice(s)</p>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <CreditCard className="h-4 w-4" />
            Next Payment Due
          </div>
          <p className="text-2xl font-bold text-gray-900">$1,250</p>
          <p className="text-sm text-gray-500">Due April 1, 2026</p>
        </div>
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Receipt className="h-4 w-4" />
            Year-to-Date Paid
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${paid.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{paid.length} payments</p>
        </div>
      </div>

      {/* Outstanding Invoices */}
      {outstanding.length > 0 && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Outstanding Invoices</h2>
          <div className="space-y-3">
            {outstanding.map((invoice) => {
              const config = statusConfig[invoice.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={invoice.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${config.bg}`}
                >
                  <div className="flex items-center gap-4">
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">{invoice.description}</p>
                      <p className="text-sm text-gray-500">
                        {invoice.number} - Due {invoice.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}>
                      {invoice.status}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </span>
                    <Button size="sm">Pay Now</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 text-xs font-medium uppercase text-gray-500">Invoice</th>
                <th className="pb-3 text-xs font-medium uppercase text-gray-500">Description</th>
                <th className="pb-3 text-xs font-medium uppercase text-gray-500">Amount</th>
                <th className="pb-3 text-xs font-medium uppercase text-gray-500">Paid Date</th>
                <th className="pb-3 text-xs font-medium uppercase text-gray-500">Method</th>
                <th className="pb-3 text-right text-xs font-medium uppercase text-gray-500">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paid.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium text-gray-900">{invoice.number}</td>
                  <td className="py-3 text-sm text-gray-600">{invoice.description}</td>
                  <td className="py-3 text-sm font-medium text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="py-3 text-sm text-gray-500">{invoice.paidDate}</td>
                  <td className="py-3 text-sm text-gray-500">{invoice.paymentMethod}</td>
                  <td className="py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TEFA Expense Summary */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <button
          className="flex w-full items-center justify-between"
          onClick={() => setShowTefa(!showTefa)}
        >
          <h2 className="text-lg font-semibold text-gray-900">TEFA Expense Summary</h2>
          {showTefa ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        {showTefa && (
          <div className="mt-4">
            <div className="mb-4 rounded-lg bg-purple-50 p-4">
              <p className="text-sm text-purple-600">Total TEFA Expenses This Year</p>
              <p className="text-2xl font-bold text-purple-700">${tefaTotal.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              {mockTefaExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{expense.category}</p>
                    <p className="text-sm text-gray-500">{expense.date}</p>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${expense.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
