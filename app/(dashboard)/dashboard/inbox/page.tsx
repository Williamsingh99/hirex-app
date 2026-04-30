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
import { createClient } from "@/lib/supabase/client";
import { MessageRecord } from "@/types/database";

export default function InboxPage() {
  const [activeMessage, setActiveMessage] = useState<<MessageMessageRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<<MessageMessageRecord[]>([]);
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

  async function handleReply(messageId: string, currentSuggestion: string) {
    try {
      const msg = messages.find(m => m.id === messageId);
      if (!msg) return;

      const response = await fetch('/api/smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg.body,
          context: `Job Application via ${msg.portal_name}`
        }),
      });

      if (!response.ok) throw new Error('AI failed to generate reply');

      const data = await response.json();
      toast.success(`AI generated ${data.drafts.length} professional drafts!`);
      // For now, we log the drafts; in the next iteration, we'll implement a draft picker UI
      console.log('AI Drafts:', data.drafts);
    } catch (err: any) {
      toast.error(`AI Drafting failed: ${err.message}`);
    }
  }

  const filteredMessages = messages.filter(m =>
    m.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <<divdiv className="h-full flex flex-col space-y-6">
      {/* Header */}
      <<divdiv className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <<divdiv className="space-y-1">
          <<hh1 className="text-3xl font-bold text-white tracking-tight">Communication Hub</h1>
          <<pp className="text-white/40">AI-managed recruiter interactions and outreach.</p>
        </div>

        <<divdiv className="flex items-center gap-3">
          <<divdiv className="relative flex-1 sm:flex-none min-w-[250px]">
            <<SearchSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <<inputinput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-white/20"
              placeholder="Search messages..."
            />
          </div>
        </div>
      </div>

      {/* Main Inbox Interface */}
      <<divdiv className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">

        {/* Message List */}
        <<divdiv className="lg:col-span-4 flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
          <<divdiv className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <<spanspan className="text-xs font-bold text-white/40 uppercase tracking-widest">Messages</span>
            <<divdiv className="flex items-center gap-2">
              <<spanspan className="flex h-2 w-2 rounded-full bg-blue-500" />
              <<spanspan className="text-[10px] text-white/40 font-medium">{messages.filter(m => !m.is_read).length} New</span>
            </div>
          </div>

          <<divdiv className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <<divdiv className="space-y-2 p-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <<divdiv key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <<divdiv className="flex flex-col">
                {filteredMessages.map((msg) => (
                  <<MessageMessageItem
                    key={msg.id}
                    message={msg}
                    isActive={activeMessage?.id === msg.id}
                    onClick={() => setActiveMessage(msg)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <<divdiv className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm overflow-hidden flex flex-col">
          <<AnAnimatePresence mode="wait">
            {activeMessage ? (
              <<motionmotion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                {/* Thread Header */}
                <<divdiv className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <<divdiv className="flex items-center gap-4">
                    <<divdiv className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {activeMessage.sender_name?.[0]}
                    </div>
                    <div>
                      <<hh3 className="text-white font-bold">{activeMessage.sender_name}</h3>
                      <<pp className="text-white/40 text-xs">{activeMessage.sender_company || activeMessage.portal_name}</p>
                    </div>
                  </div>
                  <<divdiv className="flex items-center gap-2">
                    <<buttonbutton className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"><<ArchiveArchive size={16} /></button>
                    <<buttonbutton className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"><<TrashTrash2 size={16} /></button>
                    <<buttonbutton className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"><<MoreMoreVertical size={16} /></button>
                  </div>
                </div>

                {/* Conversation Area */}
                <<divdiv className="flex-1 p-6 overflow-y-auto space-y-6">
                  <<divdiv className="flex flex-col items-start gap-2">
                    <<divdiv className="flex items-center gap-2 text-white/20 text-[10px] uppercase font-bold tracking-widest">
                      <<ClockClock size={12} />
                      <span>{new Date(activeMessage.received_at).toLocaleDateString()}</span>
                    </div>
                    <<divdiv className="p-4 rounded-2xl rounded-tl-none bg-white/10 text-white text-sm leading-relaxed max-w-xl">
                      {activeMessage.body}
                    </div>
                  </div>
                </div>

                {/* AI Reply Assistant */}
                <<divdiv className="p-6 border-t border-white/10 bg-white/[0.02] space-y-4">
                  <<divdiv className="flex items-center gap-2 text-blue-400 mb-2">
                    <<SparkSparkles size={18} />
                    <<spanspan className="text-sm font-bold uppercase tracking-widest">AI Draft Suggestion</span>
                  </div>

                  <<divdiv className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-white/80 text-sm italic leading-relaxed relative group">
                    {activeMessage.suggested_reply || "No AI suggestion available. Try clicking 'Use this draft' to generate professional replies."}
                    <<divdiv className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all">
                      <<buttonbutton
                        onClick={() => handleReply(activeMessage.id, activeMessage.suggested_reply || "")}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold"
                      >
                        <<SendSend size={14} /> Use this draft
                      </button>
                    </div>
                  </div>

                  <<divdiv className="flex items-center gap-4">
                    <<divdiv className="relative flex-1">
                      <<inputinput
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder="Write a personal response..."
                      />
                      <<buttonbutton className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all active:scale-95">
                        <<SendSend size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <<divdiv className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                <<divdiv className="p-6 rounded-full bg-white/5 border border-white/10">
                  <<InboxInbox size={48} className="text-white/10" />
                </div>
                <div>
                  <<hh3 className="text-xl font-semibold text-white">No conversation selected</h3>
                  <<pp className="text-white/40 text-sm max-w-xs">Select a message from the hub to view the thread and use AI drafting assistance.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
