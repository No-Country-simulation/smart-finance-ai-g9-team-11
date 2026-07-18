import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { AnalysisPage } from "@/pages/Analysis";
import { DashboardPage } from "@/pages/Dashboard";
import { ProfilePage } from "@/pages/Profile";
import { SettingsPage } from "@/pages/Settings";
import { ThemeProvider } from "@/providers/ThemeProvider";

/**
 * Componente raiz de rotas do Finance AI.
 *
 * O ThemeProvider envolve toda a aplicação para que páginas internas
 * e futuras páginas externas ao AppLayout compartilhem o mesmo tema.
 *
 * O AppLayout funciona como a estrutura principal das páginas privadas,
 * renderizando Header, Sidebar e o conteúdo das rotas através do Outlet.
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />

            <Route
              path="/analysis"
              element={<AnalysisPage />}
            />

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