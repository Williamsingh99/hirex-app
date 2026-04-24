// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Search,
  Mail,
  Send,
  Sparkles,
  Clock,
  MoreVertical,
  Archive,
  Trash2,
  Reply,
  User,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import MessageItem from "@/components/dashboard/inbox/MessageItem";
import { toast } from "sonner";

export default function InboxPage() {
  const [activeMessage, setActiveMessage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const mockMessages = [
    {
      id: '1',
      sender: 'Sarah Jenkins',
      company: 'Vercel',
      subject: 'Interview Invitation: Senior Frontend Engineer',
      preview: 'We were impressed with your profile and would like to invite you for a technical interview...',
      timestamp: '2h ago',
      status: 'unread',
      content: 'Hi there, we saw your application and your ATS score was incredibly high. We would love to schedule a call to discuss your experience with Next.js and distributed systems. Are you available this Thursday?',
      ai_suggestion: 'Thank Sarah for the invitation, express excitement about Vercel\'s edge network, and propose Thursday at 2 PM PST.',
    },
    {
      id: '2',
      sender: 'Michael Chen',
      company: 'Linear',
      subject: 'Application Update',
      preview: 'Thank you for your interest in Linear. We have reviewed your portfolio and...',
      timestamp: '5h ago',
      status: 'read',
      content: 'Thank you for applying to Linear. We have reviewed your portfolio and find your design sense aligns perfectly with our product philosophy. We are currently finalizing the interview slots for next week.',
      ai_suggestion: 'Acknowledge the update and mention how you admire Linear\'s focus on keyboard-centric productivity.',
    },
    {
      id: '3',
      sender: 'Recruiter',
      company: 'Stripe',
      subject: 'Follow-up regarding your application',
      preview: 'Checking in to see if you are still interested in the Software Engineer role...',
      timestamp: '1d ago',
      status: 'unread',
      content: 'Hi! Just checking in to see if you are still interested in the Software Engineer role at Stripe. We are looking to move quickly with candidates this week.',
      ai_suggestion: 'Confirm continued interest and emphasize your recent work with high-scale payment APIs.',
    },
  ];

  const filteredMessages = mockMessages.filter(m =>
    m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReply = (suggestion: string) => {
    toast.info(`AI is drafting a reply based on: "${suggestion}"`);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">Communication Hub</h1>
          <p className="text-white/40">AI-managed recruiter interactions and outreach.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
              placeholder="Search messages..."
            />
          </div>
        </div>
      </div>

      {/* Main Inbox Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">

        {/* Message List */}
        <div className="lg:col-span-4 flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Messages</span>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-white/40 font-medium">3 New</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="space-y-2 p-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredMessages.map((msg) => (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    active={activeMessage?.id === msg.id}
                    onClick={() => setActiveMessage(msg)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {activeMessage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                {/* Thread Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {activeMessage.sender[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{activeMessage.sender}</h3>
                      <p className="text-white/40 text-xs">{activeMessage.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"><Archive size={16} /></button>
                    <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"><Trash2 size={16} /></button>
                    <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </div>

                {/* Conversation Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 text-white/20 text-[10px] uppercase font-bold tracking-widest">
                      <Clock size={12} />
                      <span>{activeMessage.timestamp}</span>
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white/10 text-white text-sm leading-relaxed max-w-xl">
                      {activeMessage.content}
                    </div>
                  </div>
                </div>

                {/* AI Reply Assistant */}
                <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Sparkles size={18} />
                    <span className="text-sm font-bold uppercase tracking-widest">AI Draft Suggestion</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-white/80 text-sm italic leading-relaxed relative group">
                    {activeMessage.ai_suggestion}
                    <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => handleReply(activeMessage.ai_suggestion)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold"
                      >
                        <Send size={14} /> Use this draft
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Write a personal response..."
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-95">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="p-6 rounded-full bg-white/5 border border-white/10">
                  <Inbox size={48} className="text-white/10" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">No conversation selected</h3>
                  <p className="text-white/40 text-sm max-w-xs">Select a message from the hub to view the thread and use AI drafting assistance.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
