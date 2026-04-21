import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";

const AdminDashboardPage = () => {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Admin ke liye summary aur actions."
      />
      <SectionCard>
        <p className="text-slate-600">
          Day 8 me dashboard API aur admin actions connect karenge.
        </p>
      </SectionCard>
    </div>
  );
};

export default AdminDashboardPage;
