"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface LineItem {
  id: string;
  description: string;
  amount: number;
  category: string;
}

const planAmounts: Record<string, { amount: number; description: string }> = {
  "plan-1": { amount: 850, description: "Standard K-8 Monthly Tuition" },
  "plan-2": { amount: 550, description: "Pre-K Half Day Monthly Tuition" },
  "plan-3": { amount: 950, description: "Pre-K Full Day Monthly Tuition" },
  "plan-4": { amount: 9000, description: "Annual Prepay Tuition" },
  "plan-6": { amount: 4200, description: "Semester Tuition Plan" },
};

export default function CreateInvoicePage() {
  const [household, setHousehold] = useState("");
  const [tuitionPlan, setTuitionPlan] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "li-1", description: "", amount: 0, category: "tuition" },
  ]);
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [dueDate, setDueDate] = useState("2026-04-01");
  const [tefaEligible, setTefaEligible] = useState(false);
  const [notes, setNotes] = useState("");

  const handlePlanChange = (planValue: string) => {
    setTuitionPlan(planValue);
    if (planValue && planAmounts[planValue]) {
      const plan = planAmounts[planValue];
      setLineItems([
        {
          id: "li-1",
          description: plan.description,
          amount: plan.amount,
          category: "tuition",
        },
      ]);
    }
  };

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: `li-${Date.now()}`, description: "", amount: 0, category: "other" },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((li) => li.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) =>
      prev.map((li) => (li.id === id ? { ...li, [field]: value } : li))
    );
  };

  const subtotal = lineItems.reduce((sum, li) => sum + (Number(li.amount) || 0), 0);
  const discountAmount = parseFloat(discount) || 0;
  const taxAmount = parseFloat(tax) || 0;
  const total = subtotal - discountAmount + taxAmount;

  const handleSaveDraft = () => {
    alert("Invoice saved as draft.");
  };

  const handleSend = () => {
    alert("Invoice created and sent.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/invoices"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create a new invoice for a household.
          </p>
        </div>
      </div>

      {/* Household & Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Household</label>
              <Select value={household} onChange={(e) => setHousehold(e.target.value)}>
                <option value="">Select Household...</option>
                <option value="hh-1">Johnson Family (2 students)</option>
                <option value="hh-2">Smith Family (1 student)</option>
                <option value="hh-3">Williams Family (1 student)</option>
                <option value="hh-4">Brown Family (1 student)</option>
                <option value="hh-5">Davis Family (1 student)</option>
                <option value="hh-6">Garcia Family (1 student)</option>
                <option value="hh-7">Martinez Family (1 student)</option>
                <option value="hh-8">Wilson Family (1 student)</option>
                <option value="hh-9">Anderson Family (1 student)</option>
                <option value="hh-10">Lee Family (1 student)</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Tuition Plan (auto-fills line items)</label>
              <Select value={tuitionPlan} onChange={(e) => handlePlanChange(e.target.value)}>
                <option value="">Select Plan...</option>
                <option value="plan-1">Standard K-8 - $850/mo</option>
                <option value="plan-2">Pre-K Half Day - $550/mo</option>
                <option value="plan-3">Pre-K Full Day - $950/mo</option>
                <option value="plan-4">Annual Prepay - $9,000/yr</option>
                <option value="plan-6">Semester Plan - $4,200/sem</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Expense Category</label>
              <Select
                value={lineItems[0]?.category || "tuition"}
                onChange={(e) => {
                  if (lineItems[0]) updateLineItem(lineItems[0].id, "category", e.target.value);
                }}
              >
                <option value="tuition">Tuition</option>
                <option value="materials">Instructional Materials</option>
                <option value="services">Services</option>
                <option value="fees">Fees</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button size="sm" variant="outline" onClick={addLineItem}>
              <Plus className="w-4 h-4 mr-1" />
              Add Line Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-500 uppercase">
              <div className="col-span-5">Description</div>
              <div className="col-span-3">Category</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-1"></div>
            </div>

            {lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-5">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <Select
                    value={item.category}
                    onChange={(e) => updateLineItem(item.id, "category", e.target.value)}
                  >
                    <option value="tuition">Tuition</option>
                    <option value="materials">Instructional Materials</option>
                    <option value="services">Services</option>
                    <option value="fees">Fees</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
                <div className="col-span-3">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.amount || ""}
                      onChange={(e) =>
                        updateLineItem(item.id, "amount", parseFloat(e.target.value) || 0)
                      }
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length <= 1}
                    className="p-2 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals & Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Options */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">TEFA Eligible</p>
                  <p className="text-xs text-gray-500">
                    Mark this invoice as eligible for TEFA/ESA reimbursement
                  </p>
                </div>
                <button
                  onClick={() => setTefaEligible(!tefaEligible)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    tefaEligible ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                      tefaEligible ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {tefaEligible && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    This invoice will appear in the TEFA Workflow Center and be
                    included in expense packets for reimbursement tracking.
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional notes for this invoice..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Discount ($)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-red-600">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Tax ($)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>
              {taxAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">+${taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Link href="/invoices">
          <Button variant="ghost">Cancel</Button>
        </Link>
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={handleSend}>
          <Send className="w-4 h-4 mr-2" />
          Send Invoice
        </Button>
      </div>
    </div>
  );
}
