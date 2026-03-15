"use client";

import { useState } from "react";
import {
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  FileText,
  Download,
  Search,
  Receipt,
  BookOpen,
  Briefcase,
  Eye,
  ChevronDown,
  ChevronUp,
  Package,
  ClipboardList,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface TEFAFamily {
  id: string;
  household: string;
  students: string[];
  totalTefaAmount: number;
  pendingClaims: number;
  approvedExpenses: number;
  status: "Active" | "Pending Verification" | "Approved";
  lastActivity: string;
}

interface ExpenseRecord {
  id: string;
  date: string;
  household: string;
  category: "Tuition" | "Materials" | "Services";
  description: string;
  amount: number;
  status: "Pending" | "Approved" | "Submitted" | "Reimbursed";
  invoiceNumber: string;
}

interface ReceiptRecord {
  id: string;
  household: string;
  fileName: string;
  category: string;
  uploadDate: string;
  amount: number;
  status: "Pending Review" | "Verified" | "Rejected";
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  household: string;
}

const mockFamilies: TEFAFamily[] = [
  { id: "tf-1", household: "Williams Family", students: ["Noah Williams"], totalTefaAmount: 10200, pendingClaims: 850, approvedExpenses: 6800, status: "Active", lastActivity: "2026-03-12" },
  { id: "tf-2", household: "Wilson Family", students: ["James Wilson"], totalTefaAmount: 9000, pendingClaims: 0, approvedExpenses: 9000, status: "Approved", lastActivity: "2026-03-08" },
  { id: "tf-3", household: "Lee Family", students: ["Benjamin Lee"], totalTefaAmount: 8400, pendingClaims: 4200, approvedExpenses: 4200, status: "Active", lastActivity: "2026-03-10" },
  { id: "tf-4", household: "Anderson Family", students: ["Charlotte Anderson"], totalTefaAmount: 10200, pendingClaims: 1700, approvedExpenses: 5100, status: "Active", lastActivity: "2026-03-05" },
  { id: "tf-5", household: "Martinez Family", students: ["Isabella Martinez"], totalTefaAmount: 11400, pendingClaims: 950, approvedExpenses: 7600, status: "Pending Verification", lastActivity: "2026-03-01" },
];

const mockExpenses: ExpenseRecord[] = [
  { id: "exp-1", date: "2026-03-12", household: "Williams Family", category: "Tuition", description: "March 2026 K-8 Tuition", amount: 850, status: "Pending", invoiceNumber: "INV-2026-003" },
  { id: "exp-2", date: "2026-03-10", household: "Lee Family", category: "Tuition", description: "Spring 2026 Semester Tuition", amount: 4200, status: "Submitted", invoiceNumber: "INV-2026-010" },
  { id: "exp-3", date: "2026-03-08", household: "Wilson Family", category: "Tuition", description: "Annual Prepay Tuition", amount: 9000, status: "Reimbursed", invoiceNumber: "INV-2026-008" },
  { id: "exp-4", date: "2026-03-05", household: "Anderson Family", category: "Materials", description: "Textbooks and workbooks - Q2", amount: 320, status: "Approved", invoiceNumber: "INV-2026-020" },
  { id: "exp-5", date: "2026-03-04", household: "Williams Family", category: "Services", description: "Speech therapy services - Feb", amount: 450, status: "Approved", invoiceNumber: "INV-2026-018" },
  { id: "exp-6", date: "2026-03-03", household: "Martinez Family", category: "Tuition", description: "March 2026 Pre-K Full Day", amount: 950, status: "Pending", invoiceNumber: "INV-2026-007" },
  { id: "exp-7", date: "2026-03-01", household: "Anderson Family", category: "Materials", description: "Science lab supplies", amount: 185, status: "Pending", invoiceNumber: "INV-2026-022" },
  { id: "exp-8", date: "2026-02-28", household: "Lee Family", category: "Services", description: "Tutoring services - Feb", amount: 280, status: "Reimbursed", invoiceNumber: "INV-2026-015" },
];

const mockReceipts: ReceiptRecord[] = [
  { id: "r-1", household: "Williams Family", fileName: "tuition_receipt_mar2026.pdf", category: "Tuition", uploadDate: "2026-03-12", amount: 850, status: "Pending Review" },
  { id: "r-2", household: "Wilson Family", fileName: "annual_prepay_receipt.pdf", category: "Tuition", uploadDate: "2026-03-08", amount: 9000, status: "Verified" },
  { id: "r-3", household: "Lee Family", fileName: "semester_receipt_spring.pdf", category: "Tuition", uploadDate: "2026-03-10", amount: 4200, status: "Verified" },
  { id: "r-4", household: "Anderson Family", fileName: "textbooks_q2_receipt.pdf", category: "Materials", uploadDate: "2026-03-05", amount: 320, status: "Verified" },
  { id: "r-5", household: "Williams Family", fileName: "speech_therapy_feb.pdf", category: "Services", uploadDate: "2026-03-04", amount: 450, status: "Verified" },
  { id: "r-6", household: "Martinez Family", fileName: "tuition_receipt_mar.pdf", category: "Tuition", uploadDate: "2026-03-03", amount: 950, status: "Pending Review" },
  { id: "r-7", household: "Anderson Family", fileName: "lab_supplies_receipt.jpg", category: "Materials", uploadDate: "2026-03-01", amount: 185, status: "Rejected" },
];

const mockAuditLog: AuditEntry[] = [
  { id: "a-1", timestamp: "2026-03-12 14:30", action: "Expense Submitted", user: "Admin", details: "Submitted March tuition expense for Williams Family", household: "Williams Family" },
  { id: "a-2", timestamp: "2026-03-10 11:15", action: "Receipt Uploaded", user: "Admin", details: "Uploaded semester receipt for Lee Family", household: "Lee Family" },
  { id: "a-3", timestamp: "2026-03-08 09:45", action: "Reimbursement Received", user: "System", details: "TEFA reimbursement $9,000 received for Wilson Family annual prepay", household: "Wilson Family" },
  { id: "a-4", timestamp: "2026-03-05 16:20", action: "Expense Approved", user: "Admin", details: "Approved textbook expense for Anderson Family", household: "Anderson Family" },
  { id: "a-5", timestamp: "2026-03-04 10:00", action: "Receipt Verified", user: "Admin", details: "Verified speech therapy receipt for Williams Family", household: "Williams Family" },
  { id: "a-6", timestamp: "2026-03-03 13:45", action: "Family Enrolled", user: "Admin", details: "Martinez Family flagged as TEFA-eligible", household: "Martinez Family" },
  { id: "a-7", timestamp: "2026-03-01 08:30", action: "Receipt Rejected", user: "Admin", details: "Rejected lab supplies receipt - missing vendor info", household: "Anderson Family" },
  { id: "a-8", timestamp: "2026-02-28 15:10", action: "Expense Packet Generated", user: "Admin", details: "Generated Q1 expense packet for Lee Family", household: "Lee Family" },
];

const expenseStatusVariant: Record<string, "warning" | "success" | "primary" | "purple"> = {
  Pending: "warning",
  Approved: "success",
  Submitted: "primary",
  Reimbursed: "purple",
};

const receiptStatusVariant: Record<string, "warning" | "success" | "danger"> = {
  "Pending Review": "warning",
  Verified: "success",
  Rejected: "danger",
};

const familyStatusVariant: Record<string, "success" | "warning" | "primary"> = {
  Active: "success",
  "Pending Verification": "warning",
  Approved: "primary",
};

export default function TEFAPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const totalTefaFamilies = mockFamilies.length;
  const totalTefaRevenue = mockFamilies.reduce((sum, f) => sum + f.approvedExpenses, 0);
  const totalPendingClaims = mockFamilies.reduce((sum, f) => sum + f.pendingClaims, 0);
  const totalApprovedExpenses = mockExpenses
    .filter((e) => e.status === "Approved" || e.status === "Reimbursed")
    .reduce((sum, e) => sum + e.amount, 0);

  const tuitionTotal = mockExpenses.filter((e) => e.category === "Tuition").reduce((sum, e) => sum + e.amount, 0);
  const materialsTotal = mockExpenses.filter((e) => e.category === "Materials").reduce((sum, e) => sum + e.amount, 0);
  const servicesTotal = mockExpenses.filter((e) => e.category === "Services").reduce((sum, e) => sum + e.amount, 0);
  const expensesGrandTotal = tuitionTotal + materialsTotal + servicesTotal;

  const filteredFamilies = mockFamilies.filter((f) =>
    f.household.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExpenses = mockExpenses.filter((e) => {
    if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">TEFA/ESA Workflow Center</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage TEFA-eligible families, expense tracking, receipts, and reimbursement workflows.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="TEFA Families" value={totalTefaFamilies} icon={Users} />
        <StatCard title="Total TEFA Revenue" value={`$${totalTefaRevenue.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Pending Claims" value={`$${totalPendingClaims.toLocaleString()}`} icon={Clock} />
        <StatCard title="Approved Expenses" value={`$${totalApprovedExpenses.toLocaleString()}`} icon={CheckCircle} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="families">
        <TabsList>
          <TabsTrigger value="families">Families</TabsTrigger>
          <TabsTrigger value="expenses">Expense Ledger</TabsTrigger>
          <TabsTrigger value="receipts">Receipt Vault</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* Families Tab */}
        <TabsContent value="families">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search families..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Total TEFA Amount</TableHead>
                    <TableHead>Pending Claims</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFamilies.map((family) => (
                    <>
                      <TableRow key={family.id}>
                        <TableCell>
                          <button
                            onClick={() => setExpandedFamily(expandedFamily === family.id ? null : family.id)}
                            className="flex items-center gap-2 font-medium text-gray-900 hover:text-indigo-600"
                          >
                            {expandedFamily === family.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                            {family.household}
                          </button>
                        </TableCell>
                        <TableCell className="text-gray-600">{family.students.join(", ")}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          ${family.totalTefaAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {family.pendingClaims > 0 ? (
                            <span className="font-medium text-yellow-700">
                              ${family.pendingClaims.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-gray-400">$0</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-green-700">
                          ${family.approvedExpenses.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={familyStatusVariant[family.status]}>{family.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert(`Generating expense packet for ${family.household}...`)}
                          >
                            <Package className="w-3.5 h-3.5 mr-1" />
                            Generate Packet
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedFamily === family.id && (
                        <tr key={`${family.id}-detail`}>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              {/* Invoice split billing */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  Invoice Split Billing
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="p-3 bg-white rounded-lg border">
                                    <p className="text-xs text-gray-500">TEFA-Covered</p>
                                    <p className="text-lg font-bold text-purple-700">
                                      ${family.approvedExpenses.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="p-3 bg-white rounded-lg border">
                                    <p className="text-xs text-gray-500">Pending TEFA</p>
                                    <p className="text-lg font-bold text-yellow-700">
                                      ${family.pendingClaims.toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="p-3 bg-white rounded-lg border">
                                    <p className="text-xs text-gray-500">Family Responsibility</p>
                                    <p className="text-lg font-bold text-gray-700">
                                      ${(family.totalTefaAmount - family.approvedExpenses - family.pendingClaims).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* Related expenses */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Expenses</h4>
                                <div className="space-y-2">
                                  {mockExpenses
                                    .filter((e) => e.household === family.household)
                                    .slice(0, 3)
                                    .map((expense) => (
                                      <div
                                        key={expense.id}
                                        className="flex items-center justify-between p-2 bg-white rounded border text-sm"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Badge variant={expenseStatusVariant[expense.status]}>
                                            {expense.status}
                                          </Badge>
                                          <span className="text-gray-700">{expense.description}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                          ${expense.amount.toLocaleString()}
                                        </span>
                                      </div>
                                    ))}
                                </div>
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
          </div>
        </TabsContent>

        {/* Expense Ledger Tab */}
        <TabsContent value="expenses">
          <div className="space-y-4">
            {/* Category Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tuition</p>
                      <p className="text-lg font-bold text-gray-900">${tuitionTotal.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">
                        {expensesGrandTotal > 0 ? ((tuitionTotal / expensesGrandTotal) * 100).toFixed(0) : 0}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Instructional Materials</p>
                      <p className="text-lg font-bold text-gray-900">${materialsTotal.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">
                        {expensesGrandTotal > 0 ? ((materialsTotal / expensesGrandTotal) * 100).toFixed(0) : 0}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Services</p>
                      <p className="text-lg font-bold text-gray-900">${servicesTotal.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">
                        {expensesGrandTotal > 0 ? ((servicesTotal / expensesGrandTotal) * 100).toFixed(0) : 0}% of total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3">
              <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Tuition">Tuition</option>
                <option value="Materials">Materials</option>
                <option value="Services">Services</option>
              </Select>
            </div>

            {/* Ledger */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reimbursement-Ready Ledger</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => alert("Exporting ledger data...")}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Household</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="text-gray-600">{expense.date}</TableCell>
                      <TableCell className="text-gray-900 font-medium">{expense.household}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            expense.category === "Tuition"
                              ? "primary"
                              : expense.category === "Materials"
                              ? "success"
                              : "orange"
                          }
                        >
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-[200px] truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell>
                        <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm">
                          {expense.invoiceNumber}
                        </a>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        ${expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={expenseStatusVariant[expense.status]}>{expense.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>

        {/* Receipt Vault Tab */}
        <TabsContent value="receipts">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Receipt Vault</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => alert("Upload receipt placeholder...")}>
                    <Plus className="w-4 h-4 mr-1" />
                    Upload Receipt
                  </Button>
                </div>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Household</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="text-gray-900 font-medium">{receipt.household}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Receipt className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{receipt.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="primary">{receipt.category}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{receipt.uploadDate}</TableCell>
                      <TableCell className="font-medium text-gray-900">
                        ${receipt.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={receiptStatusVariant[receipt.status]}>{receipt.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
                          title="View Receipt"
                          onClick={() => alert(`Viewing ${receipt.fileName}...`)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Audit Trail</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => alert("Exporting audit log...")}>
                    <Download className="w-4 h-4 mr-1" />
                    Export Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {mockAuditLog.map((entry) => (
                    <div key={entry.id} className="px-6 py-3 flex items-start gap-3">
                      <div className="mt-0.5">
                        <ClipboardList className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{entry.action}</span>
                          <Badge variant="default">{entry.household}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{entry.details}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {entry.timestamp} &middot; by {entry.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
