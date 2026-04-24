import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <<divdiv className="flex min-h-screen bg-[#0A0A0A] text-white">
      <<SidebarSidebar />
      <<divdiv className="flex-1 flex flex-col transition-all duration-300 ml-0 lg:ml-[240px] lg:transition-all">
        <<TopTopBar />
        <<mainmain className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
