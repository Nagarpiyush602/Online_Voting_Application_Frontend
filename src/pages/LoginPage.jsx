import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

const LoginPage = () => {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Login"
        subtitle="Firebase authentication yahan implement hoga."
      />
      <SectionCard>
        <p className="text-slate-600">
          Day 2 me email/password login aur token handling banayenge.
        </p>
      </SectionCard>
    </div>
  );
};

export default LoginPage;
