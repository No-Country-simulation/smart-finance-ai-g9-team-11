import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar/Sidebar";
import { Header } from "../components/layout/Header/Header";

/**
 * Layout raiz da aplicação autenticada.
 *
 * Fluxo: App -> AppRouter -> AppLayout -> Sidebar + Header + <Outlet />
 *
 * O <Outlet /> é onde o React Router injeta a página atual
 * (Dashboard, Transactions, Profile...). É por isso que Sidebar e Header
 * NUNCA se repetem — eles vivem aqui, uma vez só, e as páginas trocam
 * dentro do espaço reservado pelo Outlet.
 */
export function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-muted">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}