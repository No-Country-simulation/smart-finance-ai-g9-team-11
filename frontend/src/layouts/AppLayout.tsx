import {
  useEffect,
  useState,
} from "react";
import {
  Outlet,
  useLocation,
} from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import {
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from "@/components/layout/Sidebar/Sidebar.constants";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = useState(false);

  const [
    sidebarWidth,
    setSidebarWidth,
  ] = useState(
    SIDEBAR_MIN_WIDTH,
  );

  const location = useLocation();

  const openMobileSidebar = (): void => {
    setIsMobileSidebarOpen(true);
  };

  const closeMobileSidebar = (): void => {
    setIsMobileSidebarOpen(false);
  };

  const handleOpenSidebar = (): void => {
    const isMobile = window.matchMedia(
      "(max-width: 767px)",
    ).matches;

    if (isMobile) {
      openMobileSidebar();
      return;
    }

    setSidebarWidth(SIDEBAR_MAX_WIDTH);
  };

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "app-shell relative isolate",
        "min-h-dvh w-full",
        "overflow-x-hidden",
        "bg-background text-text",
      )}
    >
      <div
        className="app-shell__ambient"
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative z-10",
          "flex min-h-dvh w-full min-w-0",
          "md:gap-2 md:p-2",
          "xl:gap-3 xl:p-3",
        )}
      >
        <Sidebar
          isMobileOpen={
            isMobileSidebarOpen
          }
          onCloseMobile={
            closeMobileSidebar
          }
          width={sidebarWidth}
          onWidthChange={
            setSidebarWidth
          }
        />

        <div
          className={cn(
            "flex min-h-dvh",
            "w-full min-w-0 flex-1",
            "flex-col",
            "bg-background/70",
            "md:min-h-[calc(100dvh-1rem)]",
            "md:overflow-hidden",
            "md:rounded-[20px]",
            "md:border md:border-border",
            "md:shadow-card",
            "xl:min-h-[calc(100dvh-1.5rem)]",
          )}
        >
          <Header
            onOpenMobileSidebar={
              openMobileSidebar
            }
            onOpenSidebar={
              handleOpenSidebar
            }
          />

          <main
            key={location.pathname}
            className={cn(
              "relative flex-1",
              "w-full min-w-0",
              "overflow-x-hidden",
              "px-4 pb-6 pt-4",
              "sm:px-5 sm:pb-7 sm:pt-5",
              "lg:px-6 lg:pb-8",
              "lg:pt-5",
              "2xl:px-7",
            )}
          >
            <div
              className={cn(
                "mx-auto",
                "w-full min-w-0",
                "max-w-[1920px]",
              )}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}