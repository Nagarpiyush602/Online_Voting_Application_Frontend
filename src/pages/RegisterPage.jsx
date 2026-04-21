import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

const RegisterPage = () => {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Voter Registration"
        subtitle="Yahan se public voter registration hoga."
      />
      <SectionCard>
        <p className="text-slate-600">
          Day 3 me yahan proper registration form backend se connect karenge.
        </p>
      </SectionCard>
    </div>
  );
};

export default RegisterPage;
