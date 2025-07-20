"use client";

import React from "react";
import { Navigation } from "./Navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole,
}) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Checkered Background */}
      <div
        className="animate-pulse"
        style={{
          position: "absolute",
          inset: "-40% -10% -10% -10%",
          transform: "rotateX(30deg) scale(1.4)",
          transformOrigin: "center bottom",
          animation: "subtle-float 8s ease-in-out infinite alternate",
        }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-100"
          style={{ fill: "#007AFF1A", stroke: "#007AFF1A" }}
        >
          <defs>
            <pattern id="checkered-pattern" width="45" height="45" patternUnits="userSpaceOnUse" x="-1" y="-1">
              <path d="M.5 45V.5H45" fill="none" strokeDasharray="0"></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#checkered-pattern)"></rect>
          <svg x="-1" y="-1" className="overflow-visible"></svg>
        </svg>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top Left Corner Shapes */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500 rounded-full opacity-80"></div>
        <div className="absolute top-0 left-20 w-24 h-24 bg-orange-400 rounded-full opacity-70"></div>
        <div className="absolute top-10 left-0 w-16 h-16 bg-pink-400 rounded-full opacity-60"></div>

        {/* Top Right Corner Shapes */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-500 rounded-full opacity-70"></div>
        <div className="absolute top-20 right-10 w-20 h-20 bg-blue-400 rounded-full opacity-60"></div>

        {/* Bottom Left Decorative Elements */}
        <div className="absolute bottom-40 left-10 w-6 h-6 bg-blue-500 rounded-full opacity-50"></div>
        <div className="absolute bottom-60 left-32 w-4 h-4 bg-orange-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-80 left-20 w-3 h-3 bg-pink-400 rounded-full opacity-70"></div>

        {/* Bottom Right Decorative Elements */}
        <div className="absolute bottom-32 right-20 w-5 h-5 bg-blue-400 rounded-full opacity-50"></div>
        <div className="absolute bottom-52 right-40 w-4 h-4 bg-pink-500 rounded-full opacity-60"></div>

        {/* Paper Airplane Shapes */}
        <div className="absolute top-32 left-1/4 transform rotate-45">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-blue-500 opacity-60"></div>
        </div>
        <div className="absolute top-1/3 right-1/4 transform -rotate-12">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-pink-400 opacity-50"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/3 transform rotate-180">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-orange-400 opacity-60"></div>
        </div>

        {/* Dotted Lines */}
        <div className="absolute top-40 left-16 w-24 h-px border-t-2 border-dotted border-blue-300 opacity-40 transform rotate-12"></div>
        <div className="absolute bottom-1/2 right-24 w-32 h-px border-t-2 border-dotted border-pink-300 opacity-40 transform -rotate-45"></div>
      </div>

      {/* Navigation Header */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}; 