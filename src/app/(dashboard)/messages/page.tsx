"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Send,
  Mail,
  Smartphone,
  Bell,
  Circle,
  Paperclip,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";

type Channel = "in-app" | "email" | "sms";
type FilterTab = "all" | "unread" | "sent";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

interface Thread {
  id: string;
  recipientName: string;
  recipientRole: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  unreadCount: number;
  channel: Channel;
  messages: Message[];
}

const mockThreads: Thread[] = [
  {
    id: "1",
    recipientName: "Sarah Johnson",
    recipientRole: "Parent",
    subject: "Aiden's Math Progress",
    lastMessage: "Thank you for the update! We'll work on the practice sheets at home.",
    timestamp: "10:32 AM",
    unread: true,
    unreadCount: 2,
    channel: "in-app",
    messages: [
      { id: "m1", sender: "You", content: "Hi Sarah, I wanted to share an update on Aiden's progress in math. He's been doing really well with multiplication but could use some extra practice with division.", timestamp: "Yesterday 3:15 PM", isMe: true },
      { id: "m2", sender: "Sarah Johnson", content: "Thank you for letting me know! Are there any specific worksheets or resources you'd recommend?", timestamp: "Yesterday 5:42 PM", isMe: false },
      { id: "m3", sender: "You", content: "I've attached some practice sheets that focus on long division. Even 15 minutes a day would help a lot.", timestamp: "Today 9:10 AM", isMe: true },
      { id: "m4", sender: "Sarah Johnson", content: "Thank you for the update! We'll work on the practice sheets at home.", timestamp: "Today 10:32 AM", isMe: false },
    ],
  },
  {
    id: "2",
    recipientName: "Michael Torres",
    recipientRole: "Parent",
    subject: "Field Trip Permission",
    lastMessage: "I've signed and returned the permission slip. Let me know if you need anything else.",
    timestamp: "Yesterday",
    unread: true,
    unreadCount: 1,
    channel: "email",
    messages: [
      { id: "m5", sender: "You", content: "Hello Mr. Torres, just a reminder that the science museum field trip permission slip is due by Friday.", timestamp: "Mon 2:00 PM", isMe: true },
      { id: "m6", sender: "Michael Torres", content: "I've signed and returned the permission slip. Let me know if you need anything else.", timestamp: "Yesterday 8:15 AM", isMe: false },
    ],
  },
  {
    id: "3",
    recipientName: "Emily Chen",
    recipientRole: "Staff",
    subject: "Curriculum Planning Meeting",
    lastMessage: "Sounds good, I'll prepare the reading comprehension materials.",
    timestamp: "Mar 12",
    unread: false,
    unreadCount: 0,
    channel: "in-app",
    messages: [
      { id: "m7", sender: "You", content: "Hi Emily, can we schedule a meeting this week to discuss the updated literacy curriculum?", timestamp: "Mar 11 10:00 AM", isMe: true },
      { id: "m8", sender: "Emily Chen", content: "Sure! How about Thursday at 2 PM?", timestamp: "Mar 11 11:30 AM", isMe: false },
      { id: "m9", sender: "You", content: "Thursday at 2 works. Could you bring the reading comprehension materials?", timestamp: "Mar 12 9:00 AM", isMe: true },
      { id: "m10", sender: "Emily Chen", content: "Sounds good, I'll prepare the reading comprehension materials.", timestamp: "Mar 12 9:45 AM", isMe: false },
    ],
  },
  {
    id: "4",
    recipientName: "Dr. Rachel Kim",
    recipientRole: "Staff",
    subject: "IEP Review - Olivia Martinez",
    lastMessage: "I'll have the assessment results ready by next Monday.",
    timestamp: "Mar 10",
    unread: false,
    unreadCount: 0,
    channel: "sms",
    messages: [
      { id: "m11", sender: "You", content: "Hi Dr. Kim, Olivia's annual IEP review is coming up. Could you prepare the latest assessment results?", timestamp: "Mar 10 8:30 AM", isMe: true },
      { id: "m12", sender: "Dr. Rachel Kim", content: "I'll have the assessment results ready by next Monday.", timestamp: "Mar 10 12:00 PM", isMe: false },
    ],
  },
  {
    id: "5",
    recipientName: "David & Lisa Park",
    recipientRole: "Parent",
    subject: "Re-enrollment for Next Year",
    lastMessage: "We'd love to continue! Please send us the enrollment forms.",
    timestamp: "Mar 8",
    unread: false,
    unreadCount: 0,
    channel: "email",
    messages: [
      { id: "m13", sender: "You", content: "Hi David and Lisa, we're opening re-enrollment for the next school year. Would you like to secure Mia's spot?", timestamp: "Mar 7 3:00 PM", isMe: true },
      { id: "m14", sender: "David & Lisa Park", content: "We'd love to continue! Please send us the enrollment forms.", timestamp: "Mar 8 10:20 AM", isMe: false },
    ],
  },
];

const channelIcon: Record<Channel, typeof Mail> = {
  "in-app": Bell,
  email: Mail,
  sms: Smartphone,
};

const channelLabel: Record<Channel, string> = {
  "in-app": "In-App",
  email: "Email",
  sms: "SMS",
};

export default function MessagesPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedThread, setSelectedThread] = useState<Thread | null>(mockThreads[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ recipient: "", subject: "", message: "", channel: "in-app" as Channel });
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const filteredThreads = mockThreads.filter((thread) => {
    if (filter === "unread") return thread.unread;
    if (filter === "sent") return thread.messages[thread.messages.length - 1]?.isMe;
    return true;
  }).filter((thread) =>
    searchQuery === "" ||
    thread.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectThread = (thread: Thread) => {
    setSelectedThread(thread);
    setShowMobileDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500">Communicate with families and staff</p>
        </div>
        <Button onClick={() => setShowCompose(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="flex h-[calc(100vh-220px)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Thread List - Left Panel */}
        <div className={`w-full flex-shrink-0 border-r border-gray-200 md:w-96 ${showMobileDetail ? "hidden md:block" : "block"}`}>
          <div className="border-b border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="mt-3">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)} defaultValue="all">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                    <span className="ml-1.5 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{mockThreads.length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Unread
                    <span className="ml-1.5 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{mockThreads.filter((t) => t.unread).length}</span>
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ height: "calc(100% - 130px)" }}>
            {filteredThreads.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="h-6 w-6" />}
                title="No messages"
                description="No messages match your current filter."
              />
            ) : (
              filteredThreads.map((thread) => {
                const ChannelIcon = channelIcon[thread.channel];
                return (
                  <button
                    key={thread.id}
                    onClick={() => handleSelectThread(thread)}
                    className={`w-full border-b border-gray-100 p-4 text-left transition-colors hover:bg-gray-50 ${
                      selectedThread?.id === thread.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {thread.unread && <Circle className="h-2 w-2 flex-shrink-0 fill-blue-600 text-blue-600" />}
                          <span className={`truncate text-sm ${thread.unread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                            {thread.recipientName}
                          </span>
                        </div>
                        <p className={`mt-0.5 truncate text-sm ${thread.unread ? "font-medium text-gray-900" : "text-gray-600"}`}>
                          {thread.subject}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-400">{thread.lastMessage}</p>
                      </div>
                      <div className="flex flex-shrink-0 flex-col items-end gap-1">
                        <span className="text-xs text-gray-400">{thread.timestamp}</span>
                        <div className="flex items-center gap-1">
                          <ChannelIcon className="h-3 w-3 text-gray-400" />
                          {thread.unreadCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Detail - Right Panel */}
        <div className={`flex flex-1 flex-col ${showMobileDetail ? "block" : "hidden md:flex"}`}>
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
                <button
                  onClick={() => setShowMobileDetail(false)}
                  className="rounded-md p-1 hover:bg-gray-100 md:hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  {selectedThread.recipientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{selectedThread.recipientName}</h3>
                    <Badge variant="default">{selectedThread.recipientRole}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{selectedThread.subject}</p>
                </div>
                <Badge variant={selectedThread.channel === "email" ? "primary" : selectedThread.channel === "sms" ? "success" : "default"}>
                  {(() => { const Icon = channelIcon[selectedThread.channel]; return <Icon className="mr-1 h-3 w-3" />; })()}
                  {channelLabel[selectedThread.channel]}
                </Badge>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {selectedThread.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-lg px-4 py-3 ${
                        msg.isMe ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`mt-1 text-xs ${msg.isMe ? "text-indigo-200" : "text-gray-400"}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <button className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                  <Button onClick={() => setReplyText("")} disabled={!replyText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-8 w-8" />}
              title="Select a conversation"
              description="Choose a thread from the left to view messages."
              className="flex-1"
            />
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <Modal open={showCompose} onClose={() => setShowCompose(false)} title="New Message" size="lg">
        <div className="space-y-4">
          <div className="relative">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Recipient</label>
            <Input
              placeholder="Search for a parent, student, or staff member..."
              value={composeData.recipient}
              onChange={(e) => setComposeData({ ...composeData, recipient: e.target.value })}
            />
            {composeData.recipient.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
                {["Sarah Johnson (Parent)", "Michael Torres (Parent)", "Emily Chen (Staff)", "Dr. Rachel Kim (Staff)"]
                  .filter((name) => name.toLowerCase().includes(composeData.recipient.toLowerCase()))
                  .map((name) => (
                    <button
                      key={name}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                      onClick={() => setComposeData({ ...composeData, recipient: name })}
                    >
                      {name}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject</label>
            <Input
              placeholder="Message subject..."
              value={composeData.subject}
              onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Channel</label>
            <Select
              value={composeData.channel}
              onChange={(e) => setComposeData({ ...composeData, channel: e.target.value as Channel })}
            >
              <option value="in-app">In-App Message</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
            <textarea
              placeholder="Write your message..."
              value={composeData.message}
              onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
              rows={6}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowCompose(false)}>Cancel</Button>
            <Button onClick={() => setShowCompose(false)}>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
