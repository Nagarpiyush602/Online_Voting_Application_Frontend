import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";
import InfoBanner from "../../components/ui/InfoBanner";
import {
  getCurrentUserEmail,
  getSessionInfo,
  getUserRole,
} from "../../utils/auth";
import { logoutUser } from "../../firebase/authService";

const MyProfilePage = () => {
  const navigate = useNavigate();

  const role = getUserRole();
  const email = getCurrentUserEmail();
  const sessionInfo = getSessionInfo();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Logged-in user ki basic profile aur session details yahan clean production-like card layout me show hoti hain."
      />

      <SectionCard
        title="Profile Overview"
        subtitle="Current logged-in user ki basic identity information"
        action={
          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600 md:w-auto"
          >
            Logout
          </button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-1 break-all text-base font-semibold text-slate-800 sm:text-lg">
              {email}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-1 text-base font-semibold text-slate-800 sm:text-lg">
              {role}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2 xl:col-span-1">
            <p className="text-sm text-slate-500">Token Available</p>
            <p className="mt-1 text-base font-semibold text-slate-800 sm:text-lg">
              {sessionInfo.hasToken ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Session Information"
        subtitle="Basic frontend session visibility for debugging and interview explanation"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Token Length</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {sessionInfo.tokenLength}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Session Purpose</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              Frontend auth state ko visible rakhne ke liye basic token metadata
              show kiya gaya hai.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Token Preview</p>
          <p className="mt-2 break-all font-mono text-xs leading-6 text-slate-800 sm:text-sm">
            {sessionInfo.tokenPreview}
          </p>
        </div>
      </SectionCard>

      <InfoBanner
        variant="info"
        title="Interview Note"
        message="Production app me profile data backend endpoint se aata, lekin is version me role aur session info frontend auth storage se show ki ja rahi hai."
      />
    </div>
  );
};

export default MyProfilePage;
