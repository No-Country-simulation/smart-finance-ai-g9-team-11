import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";

import { AppLayout } from "@/layouts/AppLayout";

import { AnalysisPage } from "@/pages/Analysis";
import { DashboardPage } from "@/pages/Dashboard";
import { LandingPage } from "@/pages/Landing";
import { LoginPage } from "@/pages/Login";
import { ProfilePage } from "@/pages/Profile";
import { RegisterPage } from "@/pages/Register";
import { SettingsPage } from "@/pages/Settings";
import { TransactionsPage } from "@/pages/Transactions";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="transactions"
            element={<TransactionsPage />}
          />

          <Route
            path="analysis"
            element={<AnalysisPage />}
          />

          <Route
            path="profile"
            element={<ProfilePage />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}