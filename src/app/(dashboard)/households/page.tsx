"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Home } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// ── Mock Data ────────────────────────────────────────────────────────

interface HouseholdRow {
  id: string;
  name: string;
  guardians: string[];
  students: string[];
  balance: number;
  communicationPref: "EMAIL" | "SMS" | "BOTH" | "IN_APP";
}

const mockHouseholds: HouseholdRow[] = [
  {
    id: "h1",
    name: "Rodriguez Family",
    guardians: ["Maria Rodriguez", "Carlos Rodriguez"],
    students: ["Emma Rodriguez"],
    balance: 0,
    communicationPref: "EMAIL",
  },
  {
    id: "h2",
    name: "Chen Family",
    guardians: ["Wei Chen", "Lily Chen"],
    students: ["Liam Chen", "Sophie Chen"],
    balance: 0,
    communicationPref: "BOTH",
  },
  {
    id: "h3",
    name: "Johnson Family",
    guardians: ["Tamika Johnson"],
    students: ["Mia Johnson"],
    balance: 1200,
    communicationPref: "SMS",
  },
  {
    id: "h4",
    name: "Williams Family",
    guardians: ["David Williams", "Sarah Williams"],
    students: ["Noah Williams"],
    balance: 0,
    communicationPref: "EMAIL",
  },
  {
    id: "h5",
    name: "Martinez Family",
    guardians: ["Ana Martinez"],
    students: ["Ava Martinez", "Diego Martinez"],
    balance: 2400,
    communicationPref: "IN_APP",
  },
  {
    id: "h6",
    name: "Brown Family",
    guardians: ["James Brown", "Lisa Brown"],
    students: ["Ethan Brown"],
    balance: 0,
    communicationPref: "EMAIL",
  },
  {
    id: "h7",
    name: "Davis Family",
    guardians: ["Michael Davis", "Jennifer Davis"],
    students: ["Sophia Davis"],
    balance: 400,
    communicationPref: "BOTH",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────

function commPrefLabel(pref: string) {
  switch (pref) {
    case "EMAIL":
      return "Email";
    case "SMS":
      return "SMS";
    case "BOTH":
      return "Email + SMS";
    case "IN_APP":
      return "In-App";
    default:
      return pref;
  }
}

// ── Page Component ───────────────────────────────────────────────────

export default function HouseholdsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockHouseholds.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.guardians.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Households</h1>
          <p className="text-sm text-gray-500">
            Manage family households, guardians, and billing.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Household
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by family name or guardian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Households table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-gray-500" />
            {filtered.length} Household{filtered.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family Name</TableHead>
                <TableHead>Guardians</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Communication</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((household) => (
                <TableRow key={household.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/households/${household.id}`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {household.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      {household.guardians.map((g, i) => (
                        <p key={i} className="text-sm text-gray-700">
                          {g}
                        </p>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {household.students.map((s, i) => (
                        <Badge key={i} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {household.balance > 0 ? (
                      <span className="font-medium text-red-600">
                        ${household.balance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-green-600">$0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {commPrefLabel(household.communicationPref)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">
                      No households found matching your search.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
