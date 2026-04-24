import React from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <<htmlhtml lang="en">
      <<bodybody className="bg-[#0A0A0A] text-white antialiased">
        <<ErrorBoundaryErrorBoundary>
          {children}
          <<ToasterToaster position="top-right" closeButton richColors />
        </ErrorBoundaryErrorBoundary>
      </bodybody>
    </htmlhtml>
  );
}
