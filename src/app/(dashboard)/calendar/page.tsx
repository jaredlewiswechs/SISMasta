"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List,
  Clock,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

type EventType = "academic" | "holiday" | "meeting" | "field-trip" | "deadline" | "social" | "professional-dev";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  type: EventType;
  description?: string;
  location?: string;
}

const EVENT_COLORS: Record<EventType, { dot: string; bg: string; text: string; border: string; label: string }> = {
  academic: { dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Academic" },
  holiday: { dot: "bg-red-500", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Holiday" },
  meeting: { dot: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", label: "Meeting" },
  "field-trip": { dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Field Trip" },
  deadline: { dot: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", label: "Deadline" },
  social: { dot: "bg-pink-500", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", label: "Social" },
  "professional-dev": { dot: "bg-teal-500", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", label: "Prof. Dev" },
};

const MOCK_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "First Day of Q3", date: "2026-03-02", type: "academic", description: "Spring quarter begins" },
  { id: "e2", title: "Parent-Teacher Conferences", date: "2026-03-05", time: "3:00 PM", endTime: "7:00 PM", type: "meeting", location: "Room A", description: "Individual conferences with families" },
  { id: "e3", title: "Science Fair Prep", date: "2026-03-07", time: "10:00 AM", type: "academic", location: "Room B" },
  { id: "e4", title: "Staff Meeting", date: "2026-03-09", time: "8:00 AM", endTime: "9:00 AM", type: "meeting", location: "Conference Room" },
  { id: "e5", title: "Nature Center Field Trip", date: "2026-03-12", time: "9:00 AM", endTime: "2:00 PM", type: "field-trip", location: "City Nature Center", description: "All students, pack lunches" },
  { id: "e6", title: "Report Cards Due", date: "2026-03-14", type: "deadline", description: "Q2 report cards must be finalized" },
  { id: "e7", title: "Pi Day Celebration", date: "2026-03-14", time: "1:00 PM", type: "social", location: "Kitchen", description: "Math fun and pie!" },
  { id: "e8", title: "Professional Development Day", date: "2026-03-16", type: "professional-dev", description: "No students - Teacher training on project-based learning" },
  { id: "e9", title: "Spring Break Begins", date: "2026-03-20", type: "holiday", description: "No school March 20-27" },
  { id: "e10", title: "Spring Break Ends", date: "2026-03-27", type: "holiday" },
  { id: "e11", title: "Science Fair", date: "2026-03-30", time: "10:00 AM", endTime: "12:00 PM", type: "academic", location: "Room A & B", description: "Student science fair presentations" },
  { id: "e12", title: "Community Potluck", date: "2026-03-30", time: "5:00 PM", type: "social", location: "Outdoor Area", description: "Families welcome!" },
  { id: "e13", title: "Math Assessment", date: "2026-03-10", time: "9:00 AM", type: "academic", location: "Room A" },
  { id: "e14", title: "Art Show", date: "2026-03-19", time: "2:00 PM", endTime: "4:00 PM", type: "social", location: "Art Studio", description: "Student artwork display" },
  { id: "e15", title: "Curriculum Planning", date: "2026-03-03", time: "3:30 PM", type: "meeting", location: "Conference Room" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(2);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [filterType, setFilterType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newType, setNewType] = useState<EventType>("academic");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (filterType !== "all" && e.type !== filterType) return false;
      return true;
    });
  }, [events, filterType]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);

  const selectedDateEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  const monthEvents = useMemo(() => {
    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    return filteredEvents
      .filter((e) => e.date.startsWith(monthStr))
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || ""));
  }, [filteredEvents, currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleAddEvent = () => {
    if (!newTitle || !newDate) return;
    const event: CalendarEvent = {
      id: `e${Date.now()}`,
      title: newTitle,
      date: newDate,
      time: newTime || undefined,
      endTime: newEndTime || undefined,
      type: newType,
      description: newDescription || undefined,
      location: newLocation || undefined,
    };
    setEvents((prev) => [...prev, event]);
    setShowAddModal(false);
    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setNewEndTime("");
    setNewType("academic");
    setNewDescription("");
    setNewLocation("");
  };

  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500">School events and important dates</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-gray-300">
            <button
              onClick={() => setViewMode("month")}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm ${viewMode === "month" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
            >
              <CalendarIcon className="h-4 w-4" />
              Month
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 border-l border-gray-300 px-3 py-1.5 text-sm ${viewMode === "list" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-48">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Event Type</label>
          <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="academic">Academic</option>
            <option value="holiday">Holiday</option>
            <option value="meeting">Meeting</option>
            <option value="field-trip">Field Trip</option>
            <option value="deadline">Deadline</option>
            <option value="social">Social</option>
            <option value="professional-dev">Prof. Development</option>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(EVENT_COLORS).map(([type, config]) => (
            <span key={type} className="flex items-center gap-1 text-xs text-gray-500">
              <span className={`h-2 w-2 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          ))}
        </div>
      </div>

      {viewMode === "month" && (
        <div className="flex gap-6">
          {/* Calendar Grid */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <button onClick={prevMonth} className="rounded-md p-1 hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5 text-gray-500" />
                </button>
                <CardTitle>{MONTH_NAMES[currentMonth]} {currentYear}</CardTitle>
                <button onClick={nextMonth} className="rounded-md p-1 hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7">
                {DAY_NAMES.map((day) => (
                  <div key={day} className="border-b border-gray-200 py-2 text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {calendarCells.map((day, idx) => {
                  if (day === null) {
                    return <div key={idx} className="min-h-[80px] border-b border-r border-gray-100 bg-gray-50/50" />;
                  }
                  const dateKey = formatDateKey(currentYear, currentMonth, day);
                  const dayEvents = eventsByDate[dateKey] || [];
                  const isToday = dateKey === todayKey;
                  const isSelected = dateKey === selectedDate;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(dateKey === selectedDate ? null : dateKey)}
                      className={`min-h-[80px] border-b border-r border-gray-100 p-1 text-left transition-colors hover:bg-blue-50 ${
                        isSelected ? "bg-blue-50 ring-1 ring-blue-300" : ""
                      }`}
                    >
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                          isToday ? "bg-blue-600 font-bold text-white" : "text-gray-700"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-0.5 flex flex-wrap gap-0.5">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span key={event.id} className={`h-1.5 w-1.5 rounded-full ${EVENT_COLORS[event.type].dot}`} title={event.title} />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[9px] text-gray-400">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="mt-0.5 space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div key={event.id} className={`truncate rounded px-1 py-0.5 text-[10px] leading-tight ${EVENT_COLORS[event.type].bg} ${EVENT_COLORS[event.type].text}`}>
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="px-1 text-[10px] text-gray-400">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Events Panel */}
          <Card className="w-80 flex-shrink-0">
            <CardHeader>
              <CardTitle className="text-base">
                {selectedDate
                  ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => {
                      const colors = EVENT_COLORS[event.type];
                      return (
                        <div key={event.id} className={`rounded-lg border p-3 ${colors.bg} ${colors.border}`}>
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${colors.text}`}>{event.title}</h4>
                            <Badge className={`${colors.bg} ${colors.text} text-[10px]`}>{colors.label}</Badge>
                          </div>
                          {event.time && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {event.time}{event.endTime && ` - ${event.endTime}`}
                            </p>
                          )}
                          {event.location && (
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="mt-1 text-xs text-gray-600">{event.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No events on this date.</p>
                )
              ) : (
                <p className="text-sm text-gray-400">Click a date to view its events.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Events in {MONTH_NAMES[currentMonth]} {currentYear}</CardTitle>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="rounded-md p-1 hover:bg-gray-100">
                  <ChevronLeft className="h-4 w-4 text-gray-500" />
                </button>
                <button onClick={nextMonth} className="rounded-md p-1 hover:bg-gray-100">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {monthEvents.length === 0 ? (
              <p className="text-sm text-gray-500">No events this month.</p>
            ) : (
              <div className="space-y-3">
                {monthEvents.map((event) => {
                  const colors = EVENT_COLORS[event.type];
                  const eventDate = new Date(event.date + "T12:00:00");
                  return (
                    <div key={event.id} className="flex items-start gap-4 rounded-lg border border-gray-200 p-4">
                      <div className="flex-shrink-0 text-center">
                        <p className="text-xs font-medium text-gray-500">
                          {eventDate.toLocaleDateString("en-US", { weekday: "short" })}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">{eventDate.getDate()}</p>
                      </div>
                      <div className={`h-full w-1 self-stretch rounded-full ${colors.dot}`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border`}>{colors.label}</Badge>
                        </div>
                        {event.time && (
                          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            {event.time}{event.endTime && ` - ${event.endTime}`}
                          </p>
                        )}
                        {event.location && (
                          <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Event Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Event" size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Event Title</label>
            <Input placeholder="e.g., Science Fair, Parent Meeting" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Date</label>
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Event Type</label>
              <Select value={newType} onChange={(e) => setNewType(e.target.value as EventType)}>
                <option value="academic">Academic</option>
                <option value="holiday">Holiday</option>
                <option value="meeting">Meeting</option>
                <option value="field-trip">Field Trip</option>
                <option value="deadline">Deadline</option>
                <option value="social">Social</option>
                <option value="professional-dev">Prof. Development</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Time (optional)</label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">End Time (optional)</label>
              <Input type="time" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Location (optional)</label>
            <Input placeholder="e.g., Room A, Gym" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
              placeholder="Event details..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>
              <Plus className="mr-1 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
