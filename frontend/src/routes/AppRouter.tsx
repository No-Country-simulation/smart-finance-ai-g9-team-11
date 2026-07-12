import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DashboardPage } from "../pages/Dashboard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;