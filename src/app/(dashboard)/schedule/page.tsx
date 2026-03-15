"use client";

import { useState } from "react";
import {
  Plus,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

type BlockType = "class" | "recess" | "lunch" | "enrichment" | "assembly" | "planning" | "field-trip";
type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

interface ScheduleBlock {
  id: string;
  name: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  type: BlockType;
  room: string;
  cohort: string;
}

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
];

const TIME_SLOTS = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
];

const BLOCK_COLORS: Record<BlockType, { bg: string; border: string; text: string }> = {
  class: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  recess: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  lunch: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  enrichment: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  assembly: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
  planning: { bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-700" },
  "field-trip": { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
};

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  class: "Class",
  recess: "Recess",
  lunch: "Lunch",
  enrichment: "Enrichment",
  assembly: "Assembly",
  planning: "Planning",
  "field-trip": "Field Trip",
};

const MOCK_BLOCKS: ScheduleBlock[] = [
  { id: "b1", name: "Morning Circle", day: "monday", startTime: "8:00 AM", endTime: "8:30 AM", type: "class", room: "Room A", cohort: "morning-mwf" },
  { id: "b2", name: "Mathematics", day: "monday", startTime: "8:30 AM", endTime: "10:00 AM", type: "class", room: "Room A", cohort: "morning-mwf" },
  { id: "b3", name: "Recess", day: "monday", startTime: "10:00 AM", endTime: "10:30 AM", type: "recess", room: "Outdoor Area", cohort: "all" },
  { id: "b4", name: "English Language Arts", day: "monday", startTime: "10:30 AM", endTime: "12:00 PM", type: "class", room: "Room A", cohort: "morning-mwf" },
  { id: "b5", name: "Lunch", day: "monday", startTime: "12:00 PM", endTime: "12:30 PM", type: "lunch", room: "Kitchen", cohort: "all" },
  { id: "b6", name: "Science Lab", day: "monday", startTime: "12:30 PM", endTime: "2:00 PM", type: "class", room: "Room B", cohort: "afternoon" },
  { id: "b7", name: "Art Enrichment", day: "monday", startTime: "2:00 PM", endTime: "3:00 PM", type: "enrichment", room: "Art Studio", cohort: "afternoon" },
  { id: "b8", name: "Free Play", day: "monday", startTime: "3:00 PM", endTime: "3:30 PM", type: "recess", room: "Outdoor Area", cohort: "all" },

  { id: "b9", name: "Morning Circle", day: "tuesday", startTime: "8:00 AM", endTime: "8:30 AM", type: "class", room: "Room A", cohort: "morning-tth" },
  { id: "b10", name: "Project-Based Learning", day: "tuesday", startTime: "8:30 AM", endTime: "10:30 AM", type: "class", room: "Room A", cohort: "morning-tth" },
  { id: "b11", name: "Recess", day: "tuesday", startTime: "10:30 AM", endTime: "11:00 AM", type: "recess", room: "Outdoor Area", cohort: "all" },
  { id: "b12", name: "Reading Workshop", day: "tuesday", startTime: "11:00 AM", endTime: "12:00 PM", type: "class", room: "Library", cohort: "morning-tth" },
  { id: "b13", name: "Lunch", day: "tuesday", startTime: "12:00 PM", endTime: "12:30 PM", type: "lunch", room: "Kitchen", cohort: "all" },
  { id: "b14", name: "PE / Movement", day: "tuesday", startTime: "12:30 PM", endTime: "1:30 PM", type: "enrichment", room: "Gym", cohort: "afternoon" },
  { id: "b15", name: "Social Studies", day: "tuesday", startTime: "1:30 PM", endTime: "3:00 PM", type: "class", room: "Room B", cohort: "afternoon" },

  { id: "b16", name: "Morning Circle", day: "wednesday", startTime: "8:00 AM", endTime: "8:30 AM", type: "class", room: "Room A", cohort: "morning-mwf" },
  { id: "b17", name: "Mathematics", day: "wednesday", startTime: "8:30 AM", endTime: "10:00 AM", type: "class", room: "Room A", cohort: "morning-mwf" },
  { id: "b18", name: "Recess", day: "wednesday", startTime: "10:00 AM", endTime: "10:30 AM", type: "recess", room: "Outdoor Area", cohort: "all" },
  { id: "b19", name: "Writer's Workshop", day: "wednesday", startTime: "10:30 AM", endTime: "12:00 PM", type: "class", room: "Room A", cohort: "morning-mwf" },
  { id: "b20", name: "Lunch", day: "wednesday", startTime: "12:00 PM", endTime: "12:30 PM", type: "lunch", room: "Kitchen", cohort: "all" },
  { id: "b21", name: "Assembly", day: "wednesday", startTime: "12:30 PM", endTime: "1:30 PM", type: "assembly", room: "Room A", cohort: "all" },
  { id: "b22", name: "Music Enrichment", day: "wednesday", startTime: "1:30 PM", endTime: "2:30 PM", type: "enrichment", room: "Room B", cohort: "afternoon" },

  { id: "b23", name: "Morning Circle", day: "thursday", startTime: "8:00 AM", endTime: "8:30 AM", type: "class", room: "Room A", cohort: "morning-tth" },
  { id: "b24", name: "STEM Lab", day: "thursday", startTime: "8:30 AM", endTime: "10:30 AM", type: "class", room: "Room B", cohort: "morning-tth" },
  { id: "b25", name: "Recess", day: "thursday", startTime: "10:30 AM", endTime: "11:00 AM", type: "recess", room: "Outdoor Area", cohort: "all" },
  { id: "b26", name: "Spanish", day: "thursday", startTime: "11:00 AM", endTime: "12:00 PM", type: "enrichment", room: "Room A", cohort: "morning-tth" },
  { id: "b27", name: "Lunch", day: "thursday", startTime: "12:00 PM", endTime: "12:30 PM", type: "lunch", room: "Kitchen", cohort: "all" },
  { id: "b28", name: "Science", day: "thursday", startTime: "12:30 PM", endTime: "2:00 PM", type: "class", room: "Room B", cohort: "afternoon" },

  { id: "b29", name: "Morning Circle", day: "friday", startTime: "8:00 AM", endTime: "8:30 AM", type: "class", room: "Room A", cohort: "morning-mwf" },
  { id: "b30", name: "Mathematics", day: "friday", startTime: "8:30 AM", endTime: "10:00 AM", type: "class", room: "Room A", cohort: "morning-mwf" },
  { id: "b31", name: "Recess", day: "friday", startTime: "10:00 AM", endTime: "10:30 AM", type: "recess", room: "Outdoor Area", cohort: "all" },
  { id: "b32", name: "Field Trip", day: "friday", startTime: "10:30 AM", endTime: "2:00 PM", type: "field-trip", room: "Off-site", cohort: "full-day" },
  { id: "b33", name: "Reflection Circle", day: "friday", startTime: "2:00 PM", endTime: "3:00 PM", type: "class", room: "Room A", cohort: "all" },
];

function timeToMinutes(time: string): number {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3];
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function getBlockStyle(block: ScheduleBlock) {
  const startMin = timeToMinutes(block.startTime) - timeToMinutes("8:00 AM");
  const endMin = timeToMinutes(block.endTime) - timeToMinutes("8:00 AM");
  const totalMin = timeToMinutes("4:00 PM") - timeToMinutes("8:00 AM");
  return {
    top: `${(startMin / totalMin) * 100}%`,
    height: `${((endMin - startMin) / totalMin) * 100}%`,
  };
}

export default function SchedulePage() {
  const [blocks, setBlocks] = useState(MOCK_BLOCKS);
  const [selectedCohort, setSelectedCohort] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [hybridModel, setHybridModel] = useState<"5-day" | "3-day" | "2-day">("5-day");

  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockDay, setNewBlockDay] = useState<DayOfWeek>("monday");
  const [newBlockStart, setNewBlockStart] = useState("8:00 AM");
  const [newBlockEnd, setNewBlockEnd] = useState("9:00 AM");
  const [newBlockType, setNewBlockType] = useState<BlockType>("class");
  const [newBlockRoom, setNewBlockRoom] = useState("Room A");
  const [newBlockCohort, setNewBlockCohort] = useState("all");

  const visibleDays = hybridModel === "2-day"
    ? DAYS.filter((d) => ["tuesday", "thursday"].includes(d.value))
    : hybridModel === "3-day"
    ? DAYS.filter((d) => ["monday", "wednesday", "friday"].includes(d.value))
    : DAYS;

  const filteredBlocks = blocks.filter((b) => {
    if (selectedCohort !== "all" && b.cohort !== "all" && b.cohort !== selectedCohort) return false;
    if (hybridModel === "2-day" && !["tuesday", "thursday"].includes(b.day)) return false;
    if (hybridModel === "3-day" && !["monday", "wednesday", "friday"].includes(b.day)) return false;
    return true;
  });

  const handleAddBlock = () => {
    if (!newBlockName) return;
    const block: ScheduleBlock = {
      id: `b${Date.now()}`,
      name: newBlockName,
      day: newBlockDay,
      startTime: newBlockStart,
      endTime: newBlockEnd,
      type: newBlockType,
      room: newBlockRoom,
      cohort: newBlockCohort,
    };
    setBlocks((prev) => [...prev, block]);
    setShowAddModal(false);
    setNewBlockName("");
    setNewBlockDay("monday");
    setNewBlockStart("8:00 AM");
    setNewBlockEnd("9:00 AM");
    setNewBlockType("class");
    setNewBlockRoom("Room A");
    setNewBlockCohort("all");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500">Weekly class schedule and time blocks</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add Block
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-52">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Cohort</label>
          <Select value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)}>
            <option value="all">All Cohorts</option>
            <option value="morning-mwf">Morning Cohort (MWF)</option>
            <option value="morning-tth">Morning Cohort (TTh)</option>
            <option value="afternoon">Afternoon Cohort</option>
            <option value="full-day">Full Day</option>
          </Select>
        </div>
        <div className="w-44">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Schedule Model</label>
          <Select value={hybridModel} onChange={(e) => setHybridModel(e.target.value as "5-day" | "3-day" | "2-day")}>
            <option value="5-day">5-Day (Full Week)</option>
            <option value="3-day">3-Day (MWF)</option>
            <option value="2-day">2-Day (TTh)</option>
          </Select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(BLOCK_COLORS) as BlockType[]).map((type) => {
          const colors = BLOCK_COLORS[type];
          return (
            <span
              key={type}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.border} ${colors.text}`}
            >
              {BLOCK_TYPE_LABELS[type]}
            </span>
          );
        })}
      </div>

      {/* Weekly Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="flex">
            {/* Time Column */}
            <div className="w-20 flex-shrink-0 border-r border-gray-200">
              <div className="h-12 border-b border-gray-200" />
              <div className="relative" style={{ height: "640px" }}>
                {TIME_SLOTS.map((time, idx) => (
                  <div
                    key={time}
                    className="absolute left-0 right-0 border-t border-gray-100 px-2 text-[10px] text-gray-400"
                    style={{ top: `${(idx / (TIME_SLOTS.length - 1)) * 100}%` }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Day Columns */}
            {visibleDays.map((day) => {
              const dayBlocks = filteredBlocks.filter((b) => b.day === day.value);
              return (
                <div key={day.value} className="flex-1 border-r border-gray-200 last:border-r-0">
                  <div className="flex h-12 items-center justify-center border-b border-gray-200 bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">{day.short}</span>
                  </div>
                  <div className="relative" style={{ height: "640px" }}>
                    {TIME_SLOTS.map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute left-0 right-0 border-t border-gray-50"
                        style={{ top: `${(idx / (TIME_SLOTS.length - 1)) * 100}%` }}
                      />
                    ))}
                    {dayBlocks.map((block) => {
                      const style = getBlockStyle(block);
                      const colors = BLOCK_COLORS[block.type];
                      return (
                        <div
                          key={block.id}
                          className={`absolute inset-x-1 overflow-hidden rounded-md border p-1.5 ${colors.bg} ${colors.border}`}
                          style={style}
                        >
                          <p className={`text-xs font-medium leading-tight ${colors.text}`}>{block.name}</p>
                          <p className="mt-0.5 text-[10px] text-gray-500">{block.startTime} - {block.endTime}</p>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-400">
                            <MapPin className="h-2.5 w-2.5" />
                            {block.room}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Block Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Schedule Block" size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Block Name</label>
            <Input placeholder="e.g., Mathematics, Lunch Break" value={newBlockName} onChange={(e) => setNewBlockName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Day</label>
              <Select value={newBlockDay} onChange={(e) => setNewBlockDay(e.target.value as DayOfWeek)}>
                {DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Type</label>
              <Select value={newBlockType} onChange={(e) => setNewBlockType(e.target.value as BlockType)}>
                {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((t) => (
                  <option key={t} value={t}>{BLOCK_TYPE_LABELS[t]}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Time</label>
              <Select value={newBlockStart} onChange={(e) => setNewBlockStart(e.target.value)}>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">End Time</label>
              <Select value={newBlockEnd} onChange={(e) => setNewBlockEnd(e.target.value)}>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Room / Location</label>
              <Select value={newBlockRoom} onChange={(e) => setNewBlockRoom(e.target.value)}>
                <option value="Room A">Room A</option>
                <option value="Room B">Room B</option>
                <option value="Art Studio">Art Studio</option>
                <option value="Gym">Gym</option>
                <option value="Outdoor Area">Outdoor Area</option>
                <option value="Library">Library</option>
                <option value="Kitchen">Kitchen</option>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Cohort</label>
              <Select value={newBlockCohort} onChange={(e) => setNewBlockCohort(e.target.value)}>
                <option value="all">All Cohorts</option>
                <option value="morning-mwf">Morning Cohort (MWF)</option>
                <option value="morning-tth">Morning Cohort (TTh)</option>
                <option value="afternoon">Afternoon Cohort</option>
                <option value="full-day">Full Day</option>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddBlock}>
              <Plus className="mr-1 h-4 w-4" />
              Add Block
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
