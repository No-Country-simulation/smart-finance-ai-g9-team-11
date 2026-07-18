import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  const location = useLocation();

  const openMobileSidebar = (): void => {
    setIsMobileSidebarOpen(true);
  };

  const closeMobileSidebar = (): void => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div
      className={cn(
        "app-shell relative isolate min-h-dvh",
        "overflow-x-hidden bg-background text-text",
      )}
    >
      <div
        className="app-shell__ambient"
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative z-10 flex min-h-dvh min-w-0",
          "md:gap-2 md:p-2",
          "xl:gap-3 xl:p-3",
        )}
      >
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />

        <div
          className={cn(
            "flex min-h-dvh min-w-0 flex-1 flex-col",
            "overflow-hidden bg-background/70",
            "md:min-h-[calc(100dvh-1rem)]",
            "md:rounded-[20px] md:border md:border-border",
            "md:shadow-card",
            "xl:min-h-[calc(100dvh-1.5rem)]",
          )}
        >
          <Header
            onOpenMobileSidebar={openMobileSidebar}
          />

          <main
            key={location.pathname}
            className={cn(
              "relative min-w-0 flex-1 overflow-x-hidden",
              "px-4 pb-6 pt-4",
              "sm:px-5 sm:pb-7 sm:pt-5",
              "lg:px-6 lg:pb-8 lg:pt-5",
              "2xl:px-7",
            )}
          >
            <div className="mx-auto min-w-0 max-w-[1920px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}