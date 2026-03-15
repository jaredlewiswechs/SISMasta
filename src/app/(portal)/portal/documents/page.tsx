"use client";

import { useState } from "react";
import {
  FolderOpen,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Eye,
  X,
  File,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DocStatus = "Completed" | "Missing" | "Pending Review" | "Expired";

interface RequiredDocument {
  id: string;
  name: string;
  status: DocStatus;
  dueDate?: string;
  submittedDate?: string;
  notes?: string;
}

interface SignedForm {
  id: string;
  name: string;
  signedDate: string;
  signedBy: string;
}

const mockRequired: RequiredDocument[] = [
  { id: "1", name: "Enrollment Agreement", status: "Completed", submittedDate: "2025-08-01" },
  { id: "2", name: "Medical Authorization Form", status: "Completed", submittedDate: "2025-08-01" },
  { id: "3", name: "Immunization Records", status: "Expired", submittedDate: "2025-08-01", notes: "Records expired. Please upload updated immunization documentation." },
  { id: "4", name: "Emergency Contact Form", status: "Completed", submittedDate: "2025-08-05" },
  { id: "5", name: "Photo Release Form", status: "Completed", submittedDate: "2025-08-01" },
  { id: "6", name: "Technology Acceptable Use Policy", status: "Missing", dueDate: "2026-03-20" },
  { id: "7", name: "Field Trip Permission (Spring)", status: "Pending Review", submittedDate: "2026-03-10" },
  { id: "8", name: "Re-Enrollment Agreement 2026-2027", status: "Missing", dueDate: "2026-04-15" },
];

const mockSignedForms: SignedForm[] = [
  { id: "1", name: "Enrollment Agreement 2025-2026", signedDate: "2025-08-01", signedBy: "Jennifer Johnson" },
  { id: "2", name: "Medical Authorization", signedDate: "2025-08-01", signedBy: "Jennifer Johnson" },
  { id: "3", name: "Photo Release Consent", signedDate: "2025-08-01", signedBy: "Jennifer Johnson" },
  { id: "4", name: "Emergency Contact Authorization", signedDate: "2025-08-05", signedBy: "Jennifer Johnson" },
  { id: "5", name: "Handbook Acknowledgment", signedDate: "2025-08-10", signedBy: "Jennifer Johnson" },
];

const statusConfig: Record<DocStatus, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
  Completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  Missing: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
  "Pending Review": { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-700" },
  Expired: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
};

export default function DocumentsPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const missing = mockRequired.filter((d) => d.status === "Missing" || d.status === "Expired");
  const completionRate = Math.round(
    (mockRequired.filter((d) => d.status === "Completed").length / mockRequired.length) * 100
  );

  const openUpload = (docId?: string) => {
    setUploadTarget(docId || null);
    setShowUpload(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-500">Emma Johnson - 3rd Grade</p>
          </div>
        </div>
        <Button onClick={() => openUpload()}>
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Missing Document Alerts */}
      {missing.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="font-semibold text-red-800">
              {missing.length} Document(s) Need Attention
            </h2>
          </div>
          <div className="space-y-2">
            {missing.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg bg-white p-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  {doc.dueDate && (
                    <p className="text-sm text-red-600">Due by {doc.dueDate}</p>
                  )}
                  {doc.notes && (
                    <p className="text-sm text-gray-500">{doc.notes}</p>
                  )}
                </div>
                <Button size="sm" onClick={() => openUpload(doc.id)}>
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Upload Document</h3>
            <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center">
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your file here, or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-400">PDF, JPG, or PNG up to 10MB</p>
            <Button variant="outline" size="sm" className="mt-4">
              Choose File
            </Button>
          </div>
          {uploadTarget && (
            <p className="mt-2 text-sm text-blue-600">
              Uploading for: {mockRequired.find((d) => d.id === uploadTarget)?.name}
            </p>
          )}
        </div>
      )}

      {/* Required Documents Checklist */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Required Documents</h2>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">{completionRate}% complete</span>
          </div>
        </div>
        <div className="space-y-2">
          {mockRequired.map((doc) => {
            const config = statusConfig[doc.status];
            const StatusIcon = config.icon;
            return (
              <div
                key={doc.id}
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  doc.status === "Missing" || doc.status === "Expired" ? config.bg : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    {doc.submittedDate && (
                      <p className="text-xs text-gray-500">Submitted {doc.submittedDate}</p>
                    )}
                    {doc.notes && (
                      <p className="text-xs text-orange-600">{doc.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}>
                    {doc.status}
                  </span>
                  {(doc.status === "Missing" || doc.status === "Expired") && (
                    <Button size="sm" variant="outline" onClick={() => openUpload(doc.id)}>
                      Upload
                    </Button>
                  )}
                  {doc.status === "Completed" && (
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signed Forms */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Signed Forms</h2>
        <div className="space-y-2">
          {mockSignedForms.map((form) => (
            <div
              key={form.id}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{form.name}</p>
                  <p className="text-xs text-gray-500">
                    Signed by {form.signedBy} on {form.signedDate}
                  </p>
                </div>
              </div>
              <button className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
