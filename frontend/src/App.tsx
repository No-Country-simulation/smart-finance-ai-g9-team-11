import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/pages/Dashboard";
import { AnalysisPage } from "@/pages/Analysis";
import { ProfilePage } from "@/pages/Profile";

/**
 * ThemeProvider precisa envolver TUDO (inclusive fora do Router), porque
 * ele aplica a classe `.dark` em <html> — se algum dia tiver rota fora
 * do AppLayout (ex: uma tela de login), ela também precisa herdar o tema.
 */
function AppRouter() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* /settings entra quando SettingsPage existir
                (src/pages/Settings hoje só tem index.ts) */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default AppRouter;
