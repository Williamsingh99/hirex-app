"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

interface ApplicationChartProps {
  data: any[];
}

export default function ApplicationChart({ data }: ApplicationChartProps) {
  return (
    <<divdiv className="h-[300px] w-full p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
      <<divdiv className="flex items-center justify-between mb-6">
        <<hh3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Application Velocity</h3>
        <<spanspan className="text-[10px] text-white/30 font-medium">LAST 30 DAYS</span>
      </div>
      <<ResponsiveContainer width="100%" height="100%">
        <<AreaChartAreaChart data={data}>
          <<defsdefs>
            <<linearGradientlinearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
              <<stopstop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <<stopstop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <<CartesianGridCartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <<XAxisXAxis dataKey="date" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
          <<YAxisYAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
          <<TooltipTooltip
            contentStyle={{ backgroundColor: '#111', borderColor: '#ffffff20', color: '#fff', fontSize: '12px' }}
            itemStyle={{ color: '#3B82F6' }}
          />
          <<AreaArea
            type="monotone"
            dataKey="apps"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorApps)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
