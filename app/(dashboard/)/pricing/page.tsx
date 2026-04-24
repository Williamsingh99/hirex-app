"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, ShieldCheck, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  onSelect: () => void;
}

function PlanCard({ plan }: PlanProps) {
  return (
    <<motionmotion.div
      whileHover={{ y: -5 }}
      className={cn(
        "p-8 rounded-3xl border transition-all backdrop-blur-sm flex flex-col h-full",
        plan.highlighted
          ? "bg-blue-600/10 border-blue-500 ring-1 ring-blue-500"
          : "bg-white/5 border-white/10 hover:border-white/20"
      )}
    >
      <<divdiv className="mb-8">
        <<divdiv className="flex items-center gap-2 mb-2">
          {plan.name === "Pro" && <<CrownCrown size={18} className="text-blue-500" />}
          {plan.name === "Free" && <<ShieldCheckShieldCheck size={18} className="text-white/40" />}
          {plan.name === "Enterprise" && <<ZapZap size={18} className="text-purple-500" />}
          <<spanspan className={cn(
            "text-sm font-bold uppercase tracking-widest",
            plan.highlighted ? "text-blue-400" : "text-white/40"
          )}>
            {plan.name} Plan
          </spanspan>
        </div>
        <<hh3 className="text-3xl font-bold text-white mb-2">{plan.price}</h3>
        <<pp className="text-white/40 text-sm">{plan.description}</pp>
      </div>

      <<divdiv className="space-y-4 mb-8 flex-1">
        {plan.features.map((feature, i) => (
          <<divdiv key={i} className="flex items-start gap-3">
            <<divdiv className="mt-1">
              <<CheckCheck size={14} className={plan.highlighted ? "text-blue-500" : "text-white/20"} />
            </div>
            <<spanspan className="text-sm text-white/60">{feature}</span>
          </div>
        ))}
      </div>

      <<buttonbutton
        onClick={plan.onSelect}
        className={cn(
          "w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95",
          plan.highlighted
            ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
            : "bg-white/10 text-white hover:bg-white/20"
        )}
      >
        {plan.buttonText}
      </button>
    </motionmotion.div>
  );
}

export default function PricingPage() {
  const handleUpgrade = async (priceId: string) => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Upgrade error", err);
    }
  };

  return (
    <<divdiv className="max-w-6xl mx-auto px-4">
      <<motionmotion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4"
      >
        <<hh1 className="text-5xl font-bold text-white tracking-tighter">Simple, Transparent Pricing</h1>
        <<pp className="text-white/40 text-lg max-w-2xl mx-auto">
          Scale your job search from a few applications to a full-scale AI automation engine.
        </pp>
      </motionmotion.div>

      <<divdiv className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <<PlanCardPlanCard
          name="Free"
          price="₹0 / month"
          description="Perfect for a casual job search."
          features={[
            "1 portal connected",
            "5 applications per day (manual)",
            "Basic ATS score check",
            "5 AI bullet rewrites / month",
            "No auto-apply",
            "1 resume upload"
          ]}
          buttonText="Current Plan"
          onSelect={() => {}}
        />
        <<PlanCardPlanCard
          name="Pro"
          price="₹999 / month"
          description="For serious job seekers wanting results."
          highlighted
          features={[
            "All 3 portals connected",
            "Unlimited daily auto-apply (up to 50)",
            "Full AI ATS optimization",
            "AI cover letter per application",
            "Gmail inbox sync & AI replies",
            "Priority job matching",
            "Unlimited resumes"
          ]}
          buttonText="Upgrade to Pro"
          onSelect={() => handleUpgrade('price_pro_id')}
        />
        <<PlanCardPlanCard
          name="Enterprise"
          price="₹4,999 / month"
          description="For executive placement and scale."
          features={[
            "Everything in Pro",
            "Dedicated job search agent",
            "LinkedIn profile optimization",
            "Mock interview AI prep",
            "Direct recruiter templates",
            "Dedicated account support"
          ]}
          buttonText="Contact Sales"
          onSelect={() => {}}
        />
      </div>
    </div>
  );
}
