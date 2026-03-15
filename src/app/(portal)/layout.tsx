"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  TrendingUp,
  FileText,
  FolderOpen,
  MessageSquare,
  CalendarDays,
  ChevronDown,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/portal", icon: Home },
  { name: "Attendance", href: "/portal/attendance", icon: Calendar },
  { name: "Progress", href: "/portal/progress", icon: TrendingUp },
  { name: "Invoices", href: "/portal/invoices", icon: FileText },
  { name: "Documents", href: "/portal/documents", icon: FolderOpen },
  { name: "Messages", href: "/portal/messages", icon: MessageSquare },
  { name: "Calendar", href: "/portal/calendar", icon: CalendarDays },
];

const mockStudents = [
  { id: "1", name: "Emma Johnson", grade: "3rd" },
  { id: "2", name: "Liam Johnson", grade: "K" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden rounded p-1 text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Bright Horizons</h1>
              <p className="text-xs text-gray-500">Parent Portal</p>
            </div>
          </div>

          {/* Student Selector */}
          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setShowStudentDropdown(!showStudentDropdown)}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                {selectedStudent.name[0]}
              </div>
              <span className="font-medium text-gray-700">{selectedStudent.name}</span>
              <span className="text-xs text-gray-400">({selectedStudent.grade})</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {showStudentDropdown && (
              <div className="absolute right-0 mt-1 w-56 rounded-lg border bg-white py-1 shadow-lg">
                {mockStudents.map((student) => (
                  <button
                    key={student.id}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${
                      selectedStudent.id === student.id ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowStudentDropdown(false);
                    }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                      {student.name[0]}
                    </div>
                    {student.name}
                    <span className="ml-auto text-xs text-gray-400">{student.grade}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="mx-auto hidden max-w-7xl lg:block px-4">
          <div className="flex gap-1 border-t pt-1 pb-0">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-20 bg-white lg:hidden">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <hr className="my-3" />
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Page Content */}
      <main className="mx-auto max-w-7xl p-4 lg:p-6">{children}</main>
    </div>
  );
}
