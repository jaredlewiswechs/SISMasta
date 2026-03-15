"use client";

import { useState } from "react";
import {
  MessageSquare,
  Send,
  Plus,
  CheckCheck,
  Check,
  ArrowLeft,
  User,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: "parent" | "school";
  senderName: string;
  timestamp: string;
  read: boolean;
}

interface Thread {
  id: string;
  subject: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  participant: string;
  participantRole: string;
  messages: Message[];
}

const mockThreads: Thread[] = [
  {
    id: "1",
    subject: "Emma's Math Progress",
    lastMessage: "Thank you for letting us know. We'll adjust the practice worksheets.",
    lastMessageTime: "2026-03-14 2:30 PM",
    unread: true,
    participant: "James Patterson",
    participantRole: "Lead Teacher",
    messages: [
      { id: "m1", content: "Hi Mr. Patterson, I wanted to ask about Emma's progress with fractions. She seems to struggle with mixed numbers at home.", sender: "parent", senderName: "Jennifer Johnson", timestamp: "2026-03-13 9:15 AM", read: true },
      { id: "m2", content: "Thank you for reaching out, Jennifer. Emma has been making good progress in class. Mixed numbers are a new concept for her, so some difficulty is expected at this stage.", sender: "school", senderName: "James Patterson", timestamp: "2026-03-13 11:30 AM", read: true },
      { id: "m3", content: "That's reassuring. Is there anything specific we can do at home to help reinforce the concepts?", sender: "parent", senderName: "Jennifer Johnson", timestamp: "2026-03-14 8:45 AM", read: true },
      { id: "m4", content: "Thank you for letting us know. We'll adjust the practice worksheets. I'll also send home some fraction manipulatives that can help make the concepts more tangible.", sender: "school", senderName: "James Patterson", timestamp: "2026-03-14 2:30 PM", read: false },
    ],
  },
  {
    id: "2",
    subject: "Spring Field Trip Permission",
    lastMessage: "The permission slip has been received. Thank you!",
    lastMessageTime: "2026-03-10 4:15 PM",
    unread: false,
    participant: "Sarah Mitchell",
    participantRole: "Director",
    messages: [
      { id: "m5", content: "Hello! I submitted Emma's field trip permission form online but wanted to confirm it was received.", sender: "parent", senderName: "Jennifer Johnson", timestamp: "2026-03-10 10:00 AM", read: true },
      { id: "m6", content: "The permission slip has been received. Thank you! Just a reminder that the trip is April 22nd and students should wear comfortable shoes.", sender: "school", senderName: "Sarah Mitchell", timestamp: "2026-03-10 4:15 PM", read: true },
    ],
  },
  {
    id: "3",
    subject: "After-School Pickup Change",
    lastMessage: "Understood, we'll have Emma ready for pickup by grandma on Thursday.",
    lastMessageTime: "2026-03-07 1:00 PM",
    unread: false,
    participant: "Sarah Mitchell",
    participantRole: "Director",
    messages: [
      { id: "m7", content: "Hi, Emma's grandmother will be picking her up this Thursday instead of me. Her name is Margaret Johnson and she's on the authorized pickup list.", sender: "parent", senderName: "Jennifer Johnson", timestamp: "2026-03-07 9:30 AM", read: true },
      { id: "m8", content: "Understood, we'll have Emma ready for pickup by grandma on Thursday. We have Margaret Johnson on file with valid ID. Thank you for the heads up!", sender: "school", senderName: "Sarah Mitchell", timestamp: "2026-03-07 1:00 PM", read: true },
    ],
  },
];

export default function MessagesPage() {
  const [threads, setThreads] = useState(mockThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ to: "", subject: "", message: "" });

  const handleSend = () => {
    if (!newMessage.trim() || !selectedThread) return;
    const msg: Message = {
      id: String(Date.now()),
      content: newMessage,
      sender: "parent",
      senderName: "Jennifer Johnson",
      timestamp: new Date().toLocaleString(),
      read: true,
    };
    const updated = threads.map((t) =>
      t.id === selectedThread.id
        ? { ...t, messages: [...t.messages, msg], lastMessage: newMessage, lastMessageTime: msg.timestamp }
        : t
    );
    setThreads(updated);
    setSelectedThread({ ...selectedThread, messages: [...selectedThread.messages, msg] });
    setNewMessage("");
  };

  const handleCompose = () => {
    if (!composeData.subject.trim() || !composeData.message.trim()) return;
    const newThread: Thread = {
      id: String(Date.now()),
      subject: composeData.subject,
      lastMessage: composeData.message,
      lastMessageTime: new Date().toLocaleString(),
      unread: false,
      participant: composeData.to || "Sarah Mitchell",
      participantRole: "Director",
      messages: [
        {
          id: String(Date.now()),
          content: composeData.message,
          sender: "parent",
          senderName: "Jennifer Johnson",
          timestamp: new Date().toLocaleString(),
          read: true,
        },
      ],
    };
    setThreads([newThread, ...threads]);
    setComposeData({ to: "", subject: "", message: "" });
    setShowCompose(false);
    setSelectedThread(newThread);
  };

  const openThread = (thread: Thread) => {
    setSelectedThread(thread);
    setThreads(threads.map((t) => (t.id === thread.id ? { ...t, unread: false } : t)));
  };

  if (showCompose) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowCompose(false)} className="rounded p-1 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">New Message</h1>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">To</label>
              <select
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={composeData.to}
                onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
              >
                <option value="">Select recipient...</option>
                <option value="Sarah Mitchell">Sarah Mitchell - Director</option>
                <option value="James Patterson">James Patterson - Lead Teacher</option>
                <option value="Maria Gonzalez">Maria Gonzalez - Teacher</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject</label>
              <input
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={composeData.subject}
                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                placeholder="Message subject"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
              <textarea
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={6}
                value={composeData.message}
                onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                placeholder="Type your message..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCompose}>
                <Send className="h-4 w-4" />
                Send Message
              </Button>
              <Button variant="ghost" onClick={() => setShowCompose(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedThread) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedThread(null)} className="rounded p-1 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{selectedThread.subject}</h1>
            <p className="text-sm text-gray-500">
              with {selectedThread.participant} ({selectedThread.participantRole})
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-sm">
          <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
            {selectedThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "parent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-3 ${
                    msg.sender === "parent"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className={`mb-1 text-xs font-medium ${msg.sender === "parent" ? "text-blue-200" : "text-gray-500"}`}>
                    {msg.senderName}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                  <div className={`mt-1 flex items-center gap-1 text-xs ${msg.sender === "parent" ? "text-blue-200" : "text-gray-400"}`}>
                    {msg.timestamp}
                    {msg.sender === "parent" && (
                      msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <button className="rounded-lg border p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-500">
              {threads.filter((t) => t.unread).length} unread message(s)
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCompose(true)}>
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        {threads.map((thread) => (
          <button
            key={thread.id}
            className={`flex w-full items-center gap-4 border-b p-4 text-left transition-colors hover:bg-gray-50 last:border-b-0 ${
              thread.unread ? "bg-blue-50" : ""
            }`}
            onClick={() => openThread(thread)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm ${thread.unread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                  {thread.participant}
                </p>
                <span className="ml-2 whitespace-nowrap text-xs text-gray-400">
                  {thread.lastMessageTime}
                </span>
              </div>
              <p className={`text-sm ${thread.unread ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                {thread.subject}
              </p>
              <p className="truncate text-sm text-gray-500">{thread.lastMessage}</p>
            </div>
            {thread.unread && (
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
        {threads.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No messages yet. Start a conversation!
          </div>
        )}
      </div>
    </div>
  );
}
