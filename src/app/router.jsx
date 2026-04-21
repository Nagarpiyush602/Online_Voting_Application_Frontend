import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ActiveElectionPage from "../pages/election/ActiveElectionPage";
import ActiveCandidatesPage from "../pages/candidate/ActiveCandidatesPage";
import VotePage from "../pages/voting/VotePage";
import ResultPage from "../pages/result/ResultPage";
import MyProfilePage from "../pages/voter/MyProfilePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import VoterDashboardPage from "../pages/voter/VoterDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <AppLayout>
        <RegisterPage />
      </AppLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <AppLayout>
        <LoginPage />
      </AppLayout>
    ),
  },
  {
    path: "/active-election",
    element: (
      <AppLayout>
        <ActiveElectionPage />
      </AppLayout>
    ),
  },
  {
    path: "/candidates",
    element: (
      <AppLayout>
        <ProtectedRoute allowedRoles={["VOTER"]}>
          <ActiveCandidatesPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/vote",
    element: (
      <AppLayout>
        <ProtectedRoute allowedRoles={["VOTER"]}>
          <VotePage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/result",
    element: (
      <AppLayout>
        <ResultPage />
      </AppLayout>
    ),
  },
  {
    path: "/my-profile",
    element: (
      <AppLayout>
        <ProtectedRoute allowedRoles={["VOTER"]}>
          <MyProfilePage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/voter/dashboard",
    element: (
      <AppLayout>
        <ProtectedRoute allowedRoles={["VOTER"]}>
          <VoterDashboardPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <AppLayout>
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboardPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
]);
