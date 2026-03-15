"use client";

import { useState } from "react";
import {
  FolderOpen,
  Search,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Trash2,
  Bell,
  Shield,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Modal } from "@/components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type DocType =
  | "Birth Certificate"
  | "Immunization"
  | "Handbook Ack"
  | "Photo Release"
  | "Emergency Contact"
  | "Tuition Contract"
  | "Medication Form"
  | "Accommodations Plan"
  | "Transcript"
  | "IEP";

type VerificationStatus = "Verified" | "Pending" | "Rejected";

interface Document {
  id: string;
  name: string;
  studentName: string;
  type: DocType;
  uploadDate: string;
  expiryDate: string | null;
  verified: VerificationStatus;
  uploadedBy: string;
}

const mockDocuments: Document[] = [
  { id: "1", name: "Birth Certificate - Aiden Johnson", studentName: "Aiden Johnson", type: "Birth Certificate", uploadDate: "Jan 15, 2026", expiryDate: null, verified: "Verified", uploadedBy: "Sarah Johnson" },
  { id: "2", name: "Immunization Record - Aiden Johnson", studentName: "Aiden Johnson", type: "Immunization", uploadDate: "Jan 15, 2026", expiryDate: "Aug 15, 2026", verified: "Verified", uploadedBy: "Sarah Johnson" },
  { id: "3", name: "Photo Release - Olivia Martinez", studentName: "Olivia Martinez", type: "Photo Release", uploadDate: "Feb 1, 2026", expiryDate: "Jun 30, 2026", verified: "Verified", uploadedBy: "Carlos Martinez" },
  { id: "4", name: "Emergency Contact - Mia Park", studentName: "Mia Park", type: "Emergency Contact", uploadDate: "Feb 10, 2026", expiryDate: null, verified: "Pending", uploadedBy: "Lisa Park" },
  { id: "5", name: "IEP Document - Liam Chen", studentName: "Liam Chen", type: "IEP", uploadDate: "Mar 1, 2026", expiryDate: "Mar 1, 2027", verified: "Verified", uploadedBy: "Dr. Rachel Kim" },
  { id: "6", name: "Tuition Contract - Noah Williams", studentName: "Noah Williams", type: "Tuition Contract", uploadDate: "Jan 5, 2026", expiryDate: "Jun 30, 2026", verified: "Verified", uploadedBy: "Admin" },
  { id: "7", name: "Medication Form - Emma Davis", studentName: "Emma Davis", type: "Medication Form", uploadDate: "Mar 5, 2026", expiryDate: "Jun 30, 2026", verified: "Pending", uploadedBy: "Tom Davis" },
  { id: "8", name: "Handbook Acknowledgment - Jackson Brown", studentName: "Jackson Brown", type: "Handbook Ack", uploadDate: "Jan 20, 2026", expiryDate: null, verified: "Verified", uploadedBy: "Mike Brown" },
  { id: "9", name: "Transcript - Sophia Lee", studentName: "Sophia Lee", type: "Transcript", uploadDate: "Feb 20, 2026", expiryDate: null, verified: "Pending", uploadedBy: "Admin" },
  { id: "10", name: "Accommodations Plan - Aiden Johnson", studentName: "Aiden Johnson", type: "Accommodations Plan", uploadDate: "Feb 18, 2026", expiryDate: "Feb 18, 2027", verified: "Verified", uploadedBy: "Ms. Rivera" },
  { id: "11", name: "Immunization Record - Mia Park", studentName: "Mia Park", type: "Immunization", uploadDate: "Jan 10, 2026", expiryDate: "Apr 1, 2026", verified: "Verified", uploadedBy: "Lisa Park" },
  { id: "12", name: "Emergency Contact - Liam Chen", studentName: "Liam Chen", type: "Emergency Contact", uploadDate: "Mar 10, 2026", expiryDate: null, verified: "Rejected", uploadedBy: "Wei Chen" },
];

const allDocTypes: DocType[] = [
  "Birth Certificate",
  "Immunization",
  "Handbook Ack",
  "Photo Release",
  "Emergency Contact",
  "Tuition Contract",
  "Medication Form",
  "Accommodations Plan",
  "Transcript",
  "IEP",
];

const verificationBadgeVariant: Record<VerificationStatus, "success" | "warning" | "danger"> = {
  Verified: "success",
  Pending: "warning",
  Rejected: "danger",
};

const verificationIcons: Record<VerificationStatus, typeof CheckCircle2> = {
  Verified: CheckCircle2,
  Pending: Clock,
  Rejected: XCircle,
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [studentFilter, setStudentFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    student: "",
    type: "" as string,
    expiryDate: "",
    notes: "",
  });
  const [dragActive, setDragActive] = useState(false);

  const totalDocs = mockDocuments.length;
  const verifiedDocs = mockDocuments.filter((d) => d.verified === "Verified").length;
  const pendingDocs = mockDocuments.filter((d) => d.verified === "Pending").length;
  const expiringSoon = mockDocuments.filter((d) => {
    if (!d.expiryDate) return false;
    const exp = new Date(d.expiryDate);
    const now = new Date("2026-03-15");
    const diffDays = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 30;
  }).length;

  const uniqueStudents = Array.from(new Set(mockDocuments.map((d) => d.studentName))).sort();

  const filtered = mockDocuments.filter((d) => {
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (studentFilter !== "all" && d.studentName !== studentFilter) return false;
    if (verificationFilter !== "all" && d.verified !== verificationFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!d.name.toLowerCase().includes(q) && !d.studentName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-sm text-gray-500">Manage and verify student documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Bulk Reminders
          </Button>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Documents" value={totalDocs} icon={FolderOpen} />
        <StatCard title="Verified" value={verifiedDocs} icon={CheckCircle2} />
        <StatCard title="Pending Verification" value={pendingDocs} icon={Clock} />
        <StatCard title="Expiring Soon" value={expiringSoon} icon={AlertTriangle} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full sm:w-48">
              <option value="all">All Types</option>
              {allDocTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
            <Select value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} className="w-full sm:w-44">
              <option value="all">All Students</option>
              {uniqueStudents.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
            <Select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="w-full sm:w-44">
              <option value="all">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Uploaded</TableHead>
              <TableHead className="hidden lg:table-cell">Expiry</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((doc) => {
              const VerIcon = verificationIcons[doc.verified];
              const isExpiringSoon = doc.expiryDate && (() => {
                const exp = new Date(doc.expiryDate);
                const now = new Date("2026-03-15");
                const diffDays = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                return diffDays > 0 && diffDays <= 30;
              })();

              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{doc.studentName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="default">{doc.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-gray-500 lg:table-cell">{doc.uploadDate}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {doc.expiryDate ? (
                      <span className={isExpiringSoon ? "font-medium text-orange-600" : "text-gray-500"}>
                        {isExpiringSoon && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                        {doc.expiryDate}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={verificationBadgeVariant[doc.verified]}>
                      <VerIcon className="mr-1 h-3 w-3" />
                      {doc.verified}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      {doc.verified === "Pending" && (
                        <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-600" title="Verify">
                          <Shield className="h-4 w-4" />
                        </button>
                      )}
                      <button className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="py-8 text-center text-sm text-gray-500">
                    No documents match your filters.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Document" size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Student</label>
            <Select
              value={uploadData.student}
              onChange={(e) => setUploadData({ ...uploadData, student: e.target.value })}
            >
              <option value="">Select a student...</option>
              {uniqueStudents.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Document Type</label>
            <Select
              value={uploadData.type}
              onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
            >
              <option value="">Select document type...</option>
              {allDocTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">File</label>
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                dragActive ? "border-indigo-400 bg-indigo-50" : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => setDragActive(false)}
            >
              <Upload className="mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                Drag and drop your file here, or{" "}
                <button className="text-indigo-600 hover:text-indigo-700">browse</button>
              </p>
              <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>

          <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Expiry Date (optional)</label>
            <input
              type="date"
              value={uploadData.expiryDate}
              onChange={(e) => setUploadData({ ...uploadData, expiryDate: e.target.value })}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            />
          </div>

          <Textarea
            label="Notes (optional)"
            placeholder="Any additional notes about this document..."
            value={uploadData.notes}
            onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
            <Button onClick={() => setShowUpload(false)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
