import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";

export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  const location = useLocation();

  const closeMobileSidebar = (): void => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onOpenMobileSidebar={() =>
            setIsMobileSidebarOpen(true)
          }
        />

        <main
          key={location.pathname}
          className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}