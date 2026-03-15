"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  GripVertical,
  X,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

type FieldType = "text" | "textarea" | "select" | "checkbox" | "date" | "file" | "signature";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  required: boolean;
  eSignature: boolean;
  submissions: number;
  status: "Active" | "Draft" | "Archived";
  fields: FormField[];
}

const mockTemplates: FormTemplate[] = [
  { id: "1", name: "Enrollment Application", description: "New student enrollment form", required: true, eSignature: true, submissions: 45, status: "Active", fields: [] },
  { id: "2", name: "Photo/Video Release", description: "Permission to use student photos and videos", required: true, eSignature: true, submissions: 42, status: "Active", fields: [] },
  { id: "3", name: "Emergency Contact Form", description: "Student emergency contacts and medical information", required: true, eSignature: false, submissions: 44, status: "Active", fields: [] },
  { id: "4", name: "Field Trip Permission", description: "Permission slip for off-campus activities", required: false, eSignature: true, submissions: 28, status: "Active", fields: [] },
  { id: "5", name: "Medication Authorization", description: "Authorization for medication administration at school", required: false, eSignature: true, submissions: 12, status: "Active", fields: [] },
  { id: "6", name: "Technology Use Agreement", description: "Student technology acceptable use policy", required: true, eSignature: true, submissions: 40, status: "Active", fields: [] },
  { id: "7", name: "Volunteer Application", description: "Parent/guardian volunteer background check form", required: false, eSignature: false, submissions: 15, status: "Active", fields: [] },
  { id: "8", name: "Transportation Request", description: "Request for bus or carpool arrangements", required: false, eSignature: false, submissions: 8, status: "Draft", fields: [] },
  { id: "9", name: "Summer Program Interest", description: "Interest form for summer learning programs", required: false, eSignature: false, submissions: 0, status: "Draft", fields: [] },
];

const fieldTypeLabels: Record<FieldType, string> = {
  text: "Text Input",
  textarea: "Text Area",
  select: "Dropdown Select",
  checkbox: "Checkbox",
  date: "Date Picker",
  file: "File Upload",
  signature: "Signature",
};

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    required: false,
    eSignature: false,
  });
  const [fields, setFields] = useState<FormField[]>([]);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [newField, setNewField] = useState<FormField>({
    id: "",
    label: "",
    type: "text",
    required: false,
    options: "",
  });

  const filtered = mockTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (template: FormTemplate) => {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      description: template.description,
      required: template.required,
      eSignature: template.eSignature,
    });
    setFields(template.fields);
    setShowBuilder(true);
  };

  const addField = () => {
    if (!newField.label.trim()) return;
    setFields([...fields, { ...newField, id: String(Date.now()) }]);
    setNewField({ id: "", label: "", type: "text", required: false, options: "" });
    setShowFieldForm(false);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const resetBuilder = () => {
    setShowBuilder(false);
    setEditingId(null);
    setFormData({ name: "", description: "", required: false, eSignature: false });
    setFields([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms Management</h1>
          <p className="text-sm text-gray-500">Create and manage form templates for families</p>
        </div>
        <Button onClick={() => { resetBuilder(); setShowBuilder(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Form Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Name</TableHead>
              <TableHead className="hidden md:table-cell">Required</TableHead>
              <TableHead className="hidden md:table-cell">E-Signature</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((template) => (
              <TableRow key={template.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-500">{template.description}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {template.required ? (
                    <Badge variant="danger">Required</Badge>
                  ) : (
                    <span className="text-sm text-gray-400">Optional</span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {template.eSignature ? (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <PenTool className="h-3.5 w-3.5" />
                      Yes
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-gray-900">{template.submissions}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={template.status === "Active" ? "success" : template.status === "Draft" ? "warning" : "default"}>
                    {template.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(template)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    icon={<FileText className="h-6 w-6" />}
                    title="No forms found"
                    description="Create a new form template to get started."
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Form Builder Modal */}
      <Modal open={showBuilder} onClose={resetBuilder} title={editingId ? "Edit Form Template" : "Create Form Template"} size="xl">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Form Name</label>
              <Input
                placeholder="e.g., Field Trip Permission Slip"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <Textarea
              label="Description"
              placeholder="Brief description of this form's purpose..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Required form</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.eSignature}
                  onChange={(e) => setFormData({ ...formData, eSignature: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Require e-signature</span>
              </label>
            </div>
          </div>

          {/* Fields */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Form Fields</h3>
              <Button size="sm" variant="outline" onClick={() => setShowFieldForm(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Add Field
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No fields added yet. Click &quot;Add Field&quot; to start building your form.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{field.label}</span>
                        {field.required && <Badge variant="danger">Required</Badge>}
                      </div>
                      <span className="text-xs text-gray-500">{fieldTypeLabels[field.type]}</span>
                    </div>
                    <button
                      onClick={() => removeField(field.id)}
                      className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Field Inline Form */}
          {showFieldForm && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">New Field</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Field Label</label>
                    <Input
                      placeholder="e.g., Parent Name"
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Field Type</label>
                    <Select
                      value={newField.type}
                      onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
                    >
                      <option value="text">Text Input</option>
                      <option value="textarea">Text Area</option>
                      <option value="select">Dropdown Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="date">Date Picker</option>
                      <option value="file">File Upload</option>
                      <option value="signature">Signature</option>
                    </Select>
                  </div>
                </div>
                {newField.type === "select" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Options (comma-separated)</label>
                    <Input
                      placeholder="Option 1, Option 2, Option 3"
                      value={newField.options}
                      onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                    />
                  </div>
                )}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Required field</span>
                </label>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addField}>Add Field</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowFieldForm(false)}>Cancel</Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <Button variant="outline" onClick={resetBuilder}>Cancel</Button>
            <Button onClick={resetBuilder}>
              {editingId ? "Update Template" : "Create Template"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
