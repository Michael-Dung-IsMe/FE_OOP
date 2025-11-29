import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Budget from "./features/budget";
import Expense from "./features/expense";
import Reports from "./features/reports";
import Settings from "./features/settings";
import Overview from "./features/overview";
import Error from "./pages/Error";

import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import ResetPasswordPage from "./auth/ResetPasswordPage";

const router = createHashRouter(
  createRoutesFromElements(
    <>
      {/* <Route path="/" element={<LoginPage />} errorElement={<Error />} /> */}

      <Route path="/login" element={<LoginPage />} errorElement={<Error />} />
      <Route path="/register" element={<RegisterPage />} errorElement={<Error />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} errorElement={<Error />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} errorElement={<Error />} />

      <Route path="/" element={<Dashboard />} errorElement={<Error />}>
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);