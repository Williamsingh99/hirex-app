import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let user = null;
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  }

  // Provide a fallback if user is null (either bypassed by middleware missing env vars, or error)
  const userData = user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
    email: user.email || "No Email",
  } : {
    name: "Guest User",
    email: "guest@example.com",
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      <Sidebar user={userData} />
      <div className="flex-1 flex flex-col transition-all duration-300 ml-0 lg:ml-[240px] lg:transition-all">
        <TopBar user={userData} />
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
