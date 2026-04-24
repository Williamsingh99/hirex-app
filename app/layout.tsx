import React from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { Toaster } from "sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] text-white antialiased">
        <ErrorBoundary>
          {children}
          <Toaster position="top-right" closeButton richColors />
        </ErrorBoundary>
      </body>
    </html>
  );
}
