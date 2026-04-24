"use client";

import React, { Component } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export default class ErrorBoundary extends Component<Props> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm text-center space-y-6"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
              <p className="text-white/40 text-sm">
                The AI agent encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold transition-all hover:bg-white/90 active:scale-95"
            >
              <RefreshCcw size={18} />
              Try again
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
