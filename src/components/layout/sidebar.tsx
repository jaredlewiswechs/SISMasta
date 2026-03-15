"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  UserPlus,
  ClipboardList,
  ListOrdered,
  CalendarCheck,
  BookOpen,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  MessageSquare,
  Megaphone,
  HeartHandshake,
  FileEdit,
  FolderLock,
  Settings,
  UserCog,
  Landmark,
  BarChart3,
  LogOut,
  ChevronLeft,
  GraduationCap,
  X,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: Home }],
  },
  {
    title: "Students",
    items: [
      { label: "Students", href: "/dashboard/students", icon: Users },
      {
        label: "Families / Households",
        href: "/dashboard/families",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Admissions",
    items: [
      {
        label: "Applications",
        href: "/dashboard/applications",
        icon: ClipboardList,
      },
      { label: "Waitlist", href: "/dashboard/waitlist", icon: ListOrdered },
    ],
  },
  {
    title: "Academics",
    items: [
      {
        label: "Attendance",
        href: "/dashboard/attendance",
        icon: CalendarCheck,
      },
      { label: "Gradebook", href: "/dashboard/gradebook", icon: BookOpen },
      { label: "Schedule", href: "/dashboard/schedule", icon: Clock },
      { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Tuition Plans",
        href: "/dashboard/tuition-plans",
        icon: DollarSign,
      },
      { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
      { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
      {
        label: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Interventions",
        href: "/dashboard/interventions",
        icon: HeartHandshake,
      },
    ],
  },
  {
    title: "Documents",
    items: [
      { label: "Forms", href: "/dashboard/forms", icon: FileEdit },
      {
        label: "Document Vault",
        href: "/dashboard/documents",
        icon: FolderLock,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "School Setup", href: "/dashboard/settings", icon: Settings },
      { label: "Staff", href: "/dashboard/staff", icon: UserCog },
    ],
  },
  {
    items: [
      { label: "TEFA Center", href: "/dashboard/tefa", icon: Landmark },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo / School Name */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-indigo-600"
          >
            <GraduationCap className="h-7 w-7" />
            <span className="text-lg">
              {(session?.user as any)?.schoolName ?? "Micro School OS"}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.title && (
                <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-indigo-600" : "text-gray-400"
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User info + Logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {session?.user?.name
                ? session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "?"}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-gray-900">
                {session?.user?.name ?? "User"}
              </p>
              <p className="truncate text-xs text-gray-500">
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
