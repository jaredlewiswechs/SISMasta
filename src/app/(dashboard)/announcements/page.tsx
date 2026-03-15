"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Globe,
  Users,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";

type Audience = "All" | "Families" | "Staff" | "Cohort";
type AnnouncementStatus = "Draft" | "Published";

interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: Audience;
  status: AnnouncementStatus;
  date: string;
  author: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Spring Break Schedule Change",
    content: "Due to weather-related closures earlier this year, spring break has been adjusted. The new dates are March 24-28. Please plan accordingly. All families will receive a calendar update via email.",
    audience: "All",
    status: "Published",
    date: "Mar 15, 2026",
    author: "Admin",
  },
  {
    id: "2",
    title: "Science Fair - Call for Volunteers",
    content: "We are looking for parent volunteers to help judge our annual Science Fair on April 10th. If you're interested, please sign up through the parent portal or reply to this announcement. We need at least 8 volunteers.",
    audience: "Families",
    status: "Published",
    date: "Mar 14, 2026",
    author: "Ms. Chen",
  },
  {
    id: "3",
    title: "Professional Development Day - April 3rd",
    content: "Reminder: April 3rd is a professional development day. Students will not have classes. Staff should report at 8:00 AM. Topics will include differentiated instruction and SEL strategies. Lunch will be provided.",
    audience: "Staff",
    status: "Published",
    date: "Mar 13, 2026",
    author: "Admin",
  },
  {
    id: "4",
    title: "New Literacy Curriculum Preview",
    content: "We're excited to announce a new literacy curriculum starting next semester. An informational session for families will be held on April 15th at 6 PM. Details about the program, goals, and how families can support learning at home will be shared.",
    audience: "All",
    status: "Draft",
    date: "Mar 12, 2026",
    author: "Admin",
  },
  {
    id: "5",
    title: "Cohort B Field Trip Update",
    content: "Cohort B's trip to the Natural History Museum has been confirmed for April 18th. Permission slips and payment are due by April 11th. Students will need a packed lunch and comfortable walking shoes.",
    audience: "Cohort",
    status: "Draft",
    date: "Mar 11, 2026",
    author: "Mr. Torres",
  },
];

const audienceIcons: Record<Audience, typeof Globe> = {
  All: Globe,
  Families: Users,
  Staff: Briefcase,
  Cohort: GraduationCap,
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "All" as Audience,
    published: false,
  });

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      audience: announcement.audience,
      published: announcement.status === "Published",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setAnnouncements(
        announcements.map((a) =>
          a.id === editingId
            ? { ...a, title: formData.title, content: formData.content, audience: formData.audience, status: formData.published ? "Published" as const : "Draft" as const }
            : a
        )
      );
    } else {
      const newAnnouncement: Announcement = {
        id: String(Date.now()),
        title: formData.title,
        content: formData.content,
        audience: formData.audience,
        status: formData.published ? "Published" : "Draft",
        date: "Mar 15, 2026",
        author: "Admin",
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", content: "", audience: "All", published: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-500">Create and manage school-wide announcements</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Announcements List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={<Megaphone className="h-6 w-6" />}
              title="No announcements found"
              description="Create your first announcement to communicate with families and staff."
              action={
                <Button onClick={() => { resetForm(); setShowForm(true); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Announcement
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((announcement) => {
            const AudienceIcon = audienceIcons[announcement.audience];
            return (
              <Card key={announcement.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{announcement.title}</h3>
                        <Badge variant={announcement.status === "Published" ? "success" : "warning"}>
                          {announcement.status}
                        </Badge>
                        <Badge variant="default">
                          <AudienceIcon className="mr-1 h-3 w-3" />
                          {announcement.audience}
                        </Badge>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">{announcement.content}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                        <span>By {announcement.author}</span>
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1">
                      <button
                        onClick={() => {
                          setFormData({ title: announcement.title, content: announcement.content, audience: announcement.audience, published: announcement.status === "Published" });
                          setShowPreview(true);
                        }}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      <Modal open={showForm} onClose={resetForm} title={editingId ? "Edit Announcement" : "Create Announcement"} size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
            <Input
              placeholder="Announcement title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Content</label>
            <textarea
              placeholder="Write your announcement content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Audience</label>
            <Select
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value as Audience })}
            >
              <option value="All">All - Everyone</option>
              <option value="Families">Families Only</option>
              <option value="Staff">Staff Only</option>
              <option value="Cohort">Specific Cohort</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">
              {formData.published ? "Publish immediately" : "Save as draft"}
            </span>
          </div>

          {/* Preview Section */}
          {formData.title && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-medium uppercase text-gray-500">Preview</p>
              <h4 className="font-semibold text-gray-900">{formData.title}</h4>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{formData.content}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="default">{formData.audience}</Badge>
                <Badge variant={formData.published ? "success" : "warning"}>
                  {formData.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSave}>
              {editingId ? "Update" : formData.published ? "Publish" : "Save Draft"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={showPreview} onClose={() => setShowPreview(false)} title="Announcement Preview" size="lg">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{formData.title}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="default">{formData.audience}</Badge>
            <Badge variant={formData.published ? "success" : "warning"}>
              {formData.published ? "Published" : "Draft"}
            </Badge>
          </div>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {formData.content}
          </div>
        </div>
      </Modal>
    </div>
  );
}
