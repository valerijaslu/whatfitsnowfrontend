import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ActivitiesListPage } from "@/pages/ActivitiesListPage";
import { ActivityFormPage } from "@/pages/ActivityFormPage";
import { SuggestionPage } from "@/pages/SuggestionPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<SuggestionPage />} />
        <Route path="/activities" element={<ActivitiesListPage />} />
        <Route path="/activities/new" element={<ActivityFormPage mode="create" />} />
        <Route path="/activities/:id/edit" element={<ActivityFormPage mode="edit" />} />
        <Route path="/suggest" element={<SuggestionPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

