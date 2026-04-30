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
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import MessageItem from "@/components/dashboard/inbox/MessageItem";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { MessageRecord } from "@/types/database";

const TONE_LABELS = ["Professional", "Enthusiastic", "Strategic"];

export default function InboxPage() {
  const [activeMessage, setActiveMessage] = useState<MessageRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [drafts, setDrafts] = useState<string[]>([]);
  const [replyText, setReplyText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('received_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      toast.error(`Failed to load messages: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateDrafts() {
    if (!activeMessage) return;
    try {
      setAiLoading(true);
      setDrafts([]);
      const response = await fetch('/api/smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: activeMessage.body,
          context: `Job Application via ${activeMessage.portal_name}`
        }),
      });

      if (!response.ok) throw new Error('AI failed to generate reply');

      const data = await response.json();
      setDrafts(data.drafts || []);
      toast.success(`AI generated ${data.drafts?.length || 0} professional drafts!`);
    } catch (err: any) {
      toast.error(`AI Drafting failed: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  }

  const filteredMessages = messages.filter(m =>
    m.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <span className="text-[10px] text-white/40 font-medium">{messages.filter(m => !m.is_read).length} New</span>
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
                    isActive={activeMessage?.id === msg.id}
                    onClick={() => { setActiveMessage(msg); setDrafts([]); setReplyText(""); }}
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
                key={activeMessage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                {/* Thread Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {activeMessage.sender_name?.[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{activeMessage.sender_name}</h3>
                      <p className="text-white/40 text-xs">{activeMessage.sender_company || activeMessage.portal_name}</p>
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
                      <span>{new Date(activeMessage.received_at).toLocaleDateString()}</span>
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white/10 text-white text-sm leading-relaxed max-w-xl">
                      {activeMessage.body}
                    </div>
                  </div>
                </div>

                {/* AI Reply Assistant */}
                <div className="p-6 border-t border-white/10 bg-white/[0.02] space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Sparkles size={18} />
                      <span className="text-sm font-bold uppercase tracking-widest">AI Draft Suggestions</span>
                    </div>
                    <button
                      onClick={handleGenerateDrafts}
                      disabled={aiLoading}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                      {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {aiLoading ? "Generating..." : "Generate Drafts"}
                    </button>
                  </div>

                  {/* Draft Cards */}
                  {drafts.length > 0 && (
                    <div className="grid grid-cols-1 gap-3">
                      {drafts.map((draft, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{TONE_LABELS[i] || `Draft ${i + 1}`}</span>
                            <button
                              onClick={() => { setReplyText(draft); toast.success("Draft copied to reply box!"); }}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all active:scale-95"
                            >
                              <Send size={12} /> Use this reply
                            </button>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed italic">{draft}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
                        placeholder="Write a personal response or select an AI draft..."
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
