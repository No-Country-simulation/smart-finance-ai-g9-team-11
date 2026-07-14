import { Outlet } from "react-router-dom";

import { Header } from "../components/layout/Header/Header";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}