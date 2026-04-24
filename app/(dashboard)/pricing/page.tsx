"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  Zap,
  ShieldCheck,
  Crown,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "Perfect for those just starting their job search journey.",
      features: [
        "5 AI Job Matches / day",
        "Basic ATS Optimizer",
        "1 Resume Version",
        "Standard Support",
        "Community Access",
      ],
      buttonText: "Get Started",
      highlighted: false,
      icon: <Zap size={20} />,
    },
    {
      name: "Professional",
      price: "29",
      description: "Advanced tools for serious candidates aiming for Tier-1 companies.",
      features: [
        "Unlimited AI Job Matches",
        "Advanced ATS Optimization",
        "5 Resume Versions",
        "Priority AI Support",
        "Recruiter Inbox AI-Drafts",
        "Priority Application Queue",
      ],
      buttonText: "Upgrade to Pro",
      highlighted: true,
      icon: <Crown size={20} />,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for high-volume professional transitions.",
      features: [
        "Dedicated AI Agent",
        "White-glove Resume Optimization",
        "Unlimited Versions",
        "24/7 Priority Support",
        "Custom Integration",
        "Strategic Career Coaching",
      ],
      buttonText: "Contact Sales",
      highlighted: false,
      icon: <ShieldCheck size={20} />,
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Simple, <span className="text-blue-500">Transparent</span> Pricing
        </h1>
        <p className="text-white/40 text-lg">
          Scale your job search with AI-powered precision. Start for free, upgrade as you grow.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "relative p-8 rounded-3xl border transition-all duration-500 group",
              plan.highlighted
                ? "bg-blue-600/10 border-blue-500 shadow-2xl shadow-blue-600/20 scale-105 z-10"
                : "bg-white/5 border-white/10 hover:border-white/20"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl transition-colors",
                  plan.highlighted ? "bg-blue-500 text-white" : "bg-white/10 text-white/40 group-hover:text-white"
                )}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-white/40 text-xs">{plan.description}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-white/40 text-sm">/month</span>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-px bg-white/10" />
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-white/60">
                      <Check size={16} className={cn(plan.highlighted ? "text-blue-400" : "text-white/20")} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2",
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                )}
              >
                {plan.buttonText}
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-white/40">Everything you need to know about the HireX platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "Can I change my plan later?", a: "Yes, you can upgrade or downgrade your plan at any time from the settings menu. Prorated credits will be applied." },
            { q: "How does the AI Agent work?", a: "The agent uses stealth browser technology and GPT-4o to identify roles that match your skill set and apply autonomously." },
            { q: "Is my data secure?", a: "We use AES-256 encryption and OAuth 2.0 to ensure your credentials and personal data are never exposed." },
            { q: "Do you offer a free trial for Pro?", a: "Yes, all new users get a 7-day trial of the Professional plan to experience the full power of the AI Agent." },
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center gap-3 text-white font-semibold">
                <HelpCircle size={18} className="text-blue-400" />
                {faq.q}
              </div>
              <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
