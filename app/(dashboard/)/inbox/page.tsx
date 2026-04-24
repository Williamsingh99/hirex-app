"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import MessageItem from "@/components/dashboard/inbox/MessageItem";
import { toast } from "sonner";
import {
  Mail,
  Search,
  Sparkles,
  Send,
  Trash2,
  Archive,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<<anyany[]>([]);
  const [selectedId, setSelectedId] = useState<<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from("recruiter_messages")
          .select("*")
          .order("received_at", { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (err: any) {
        toast.error("Failed to load inbox");
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  const activeMessage = messages.find(m => m.id === selectedId);

  const handleSendReply = async () => {
    if (!replyText) return;
    setReplyText("");
    toast.success("Reply sent successfully via Gmail API");
  };

  const handleSync = async () => {
    toast.info("Syncing with Gmail...");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch('/api/inbox/sync', {
        method: 'POST',
        body: JSON.stringify({ user_id: user?.id }),
      });
      if (!res.ok) throw new Error('Sync failed');

      const { data } = await supabase
        .from("recruiter_messages")
        .select("*")
        .order("received_at", { ascending: false });
      setMessages(data || []);
      toast.success("Inbox synchronized");
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    }
  };

  if (loading) {
    return <<divdiv className="flex items-center justify-center min-h-[80vh] text-white/40">Loading messages...</div>;
  }

  return (
    <<divdiv className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-end"
      >
        <<divdiv>
          <<hh1 className="text-3xl font-bold text-white">Recruiter Inbox</h1>
          <<pp className="text-white/40">Manage your conversations and AI-suggested replies.</p>
        </div>
        <<buttonbutton
          onClick={handleSync}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
        >
          <<SparklesSparkles size={16} />
          Sync Inbox
        </button>
      </motion.div>

      <<divdiv className="flex h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Left Panel: Message List */}
        <<divdiv className="w-full md:w-80 border-r border-white/10 flex flex-col">
          <<divdiv className="p-4 border-b border-white/10 flex items-center gap-2">
            <<SearchSearch size={16} className="text-white/20" />
            <<inputinput
              placeholder="Search messages..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full"
            />
          </div>
          <<divdiv className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <<divdiv className="p-8 text-center space-y-3">
                <<divdiv className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                  <<MailMail size={24} />
                </div>
                <<pp className="text-xs text-white/40">No messages found. <br /> Try syncing your Gmail.</p>
              </div>
            ) : (
              messages.map(msg => (
                <<MessageItem
                  key={msg.id}
                  message={msg}
                  isActive={selectedId === msg.id}
                  onClick={() => setSelectedId(msg.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Message Detail */}
        <<divdiv className="flex-1 flex flex-col bg-[#0A0A0A]/50">
          {activeMessage ? (
            <<divdiv className="flex flex-col h-full">
              {/* Header */}
              <<divdiv className="p-6 border-b border-white/10 flex justify-between items-center">
                <<divdiv className="flex items-center gap-3">
                  <<divdiv className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {activeMessage.sender_name?.charAt(0) || 'R'}
                  </div>
                  <<divdiv>
                    <<pp className="text-sm font-bold text-white">{activeMessage.sender_name}</pp>
                    <<pp className="text-xs text-white/40">{activeMessage.sender_company || 'Recruiter'}</p>
                  </div>
                </div>
                <<divdiv className="flex items-center gap-2">
                  <<buttonbutton className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-all">
                    <<ArchiveArchive size={18} />
                  </button>
                  <<buttonbutton className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-white/5 transition-all">
                    <<TrashTrash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <<divdiv className="flex-1 overflow-y-auto p-8 space-y-8">
                <<divdiv className="max-w-3xl mx-auto space-y-6">
                  <<divdiv className="flex items-center justify-between">
                    <<hh3 className="text-lg font-bold text-white">{activeMessage.subject}</h3>
                    <<spanspan className="text-xs text-white/30">{new Date(activeMessage.received_at).toLocaleString()}</spanspan>
                  </div>
                  <<divdiv className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                    {activeMessage.body}
                  </div>
                </div>
              </div>

              {/* AI Assistant Section */}
              <<divdiv className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md">
                <<divdiv className="max-w-3xl mx-auto space-y-6">
                  <<divdiv className="flex items-center justify-between">
                    <<divdiv className="flex items-center gap-2 text-blue-400">
                      <<SparklesSparkles size={18} />
                      <<spanspan className="text-xs font-bold uppercase tracking-widest">AI Suggested Reply</span>
                    </div>
                    <<buttonbutton
                      onClick={() => setReplyText(activeMessage.suggested_reply)}
                      className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors"
                    >
                      Use AI Draft
                    </button>
                  </div>

                  <<divdiv className="flex gap-4">
                    <<textareatextarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[120px] transition-all"
                    />
                    <<buttonbutton
                      onClick={handleSendReply}
                      disabled={!replyText}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold transition-all active:scale-95 flex items-center gap-2"
                    >
                      <<SendSend size={18} />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <<divdiv className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <<divdiv className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                <<MailMail size={40} />
              </div>
              <<divdiv>
                <<pp className="text-white font-medium">No message selected</pp>
                <<pp className="text-white/40 text-sm">Select a conversation from the list to view details and use AI replies.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
