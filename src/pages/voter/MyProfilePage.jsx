import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";

const MyProfilePage = () => {
  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Logged-in voter ka profile yahan dikhega."
      />
      <SectionCard>
        <p className="text-slate-600">
          Day 3 me `/api/voters/me` aur update profile integrate karenge.
        </p>
      </SectionCard>
    </div>
  );
};

export default MyProfilePage;
