"use client";

import { useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  Mail,
  Calendar,
  MessageSquare,
  MapPin,
  User,
  Baby,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

// --- Component ---

export default function InquiryFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [requestTour, setRequestTour] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="py-12 px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-4">
              Your inquiry has been submitted successfully. Our admissions team will
              review your information and reach out within 2 business days.
            </p>
            {requestTour && (
              <div className="p-3 bg-blue-50 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  You requested a campus tour. We will contact you shortly to schedule a convenient time.
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">
              A confirmation email has been sent to the email address you provided.
            </p>
            <Button variant="primary" onClick={() => { setSubmitted(false); setRequestTour(false); }}>
              Submit Another Inquiry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 mb-4">
          <GraduationCap className="h-7 w-7 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Admissions Inquiry</h1>
        <p className="text-sm text-gray-500 mt-2">
          Interested in our micro school? Fill out the form below and our admissions
          team will get in touch with you.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Parent Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-gray-400" />
              Parent / Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <Input placeholder="Your full name" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                <Input type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone Number</label>
                <Input type="tel" placeholder="(555) 000-0000" required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Child Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Baby className="h-5 w-5 text-gray-400" />
              Child Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Child&apos;s Full Name</label>
                <Input placeholder="Child's full name" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Date of Birth</label>
                <Input type="date" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Current / Entering Grade</label>
                <Select required>
                  <option value="">Select grade</option>
                  <option value="PK">Pre-K</option>
                  <option value="K">Kindergarten</option>
                  <option value="1">1st Grade</option>
                  <option value="2">2nd Grade</option>
                  <option value="3">3rd Grade</option>
                  <option value="4">4th Grade</option>
                  <option value="5">5th Grade</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interest & Source */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              Tell Us More
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Interest Level</label>
                <Select required>
                  <option value="">How interested are you?</option>
                  <option value="low">Just Exploring</option>
                  <option value="medium">Considering for Next Year</option>
                  <option value="high">Actively Looking</option>
                  <option value="very_high">Ready to Apply</option>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">How Did You Hear About Us?</label>
                <Select required>
                  <option value="">Select one</option>
                  <option value="google">Google Search</option>
                  <option value="social_media">Social Media (Facebook, Instagram)</option>
                  <option value="referral">Friend or Family Referral</option>
                  <option value="event">Community Event</option>
                  <option value="open_house">School Open House</option>
                  <option value="print">Flyer or Mailer</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </div>

            {/* Tour request */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestTour}
                  onChange={(e) => setRequestTour(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    I would like to schedule a campus tour
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Our admissions team will reach out to schedule a tour at a time
                    that works for your family.
                  </p>
                </div>
              </label>
            </div>

            {/* Additional comments */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Comments (Optional)
              </label>
              <textarea
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 min-h-[80px]"
                placeholder="Anything else you'd like us to know about your family or child..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex flex-col items-center gap-3">
          <Button variant="primary" size="lg" type="submit" className="w-full md:w-auto min-w-[200px]">
            <Mail className="h-4 w-4 mr-2" />
            Submit Inquiry
          </Button>
          <p className="text-xs text-gray-400 text-center">
            By submitting this form, you agree to be contacted by our admissions team
            regarding enrollment opportunities.
          </p>
        </div>
      </form>
    </div>
  );
}
