import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ActiveElectionPage from "../pages/election/ActiveElectionPage";
import ActiveCandidatesPage from "../pages/candidate/ActiveCandidatesPage";
import VotePage from "../pages/voting/VotePage";
import ResultPage from "../pages/result/ResultPage";
import MyProfilePage from "../pages/voter/MyProfilePage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

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
        <ActiveCandidatesPage />
      </AppLayout>
    ),
  },
  {
    path: "/vote",
    element: (
      <AppLayout>
        <VotePage />
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
        <MyProfilePage />
      </AppLayout>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <AppLayout>
        <AdminDashboardPage />
      </AppLayout>
    ),
  },
]);
