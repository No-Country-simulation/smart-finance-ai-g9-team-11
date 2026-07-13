import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { DashboardPage } from "../pages/Dashboard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota "casca": sem path, só existe para montar o layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          {/* Próximas páginas entram AQUI DENTRO, como filhas: */}
          {/* <Route path="/transactions" element={<TransactionsPage />} /> */}
          {/* <Route path="/analysis" element={<AnalysisPage />} /> */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;