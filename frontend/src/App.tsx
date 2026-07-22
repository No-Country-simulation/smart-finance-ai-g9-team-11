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