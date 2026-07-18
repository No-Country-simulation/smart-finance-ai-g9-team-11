import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/pages/Dashboard";
import { ProfilePage } from "@/pages/Profile";
import { SettingsPage } from "@/pages/Settings";
import { ThemeProvider } from "@/providers/ThemeProvider";

/**
 * Componente raiz da aplicação Finance AI.
 *
 * O ThemeProvider envolve toda a aplicação para garantir que todas
 * as páginas compartilhem o mesmo tema.
 *
 * O AppLayout fornece Sidebar, Header e a área de conteúdo das páginas.
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;