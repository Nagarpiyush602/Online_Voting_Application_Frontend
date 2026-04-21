import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";

const VotePage = () => {
  return (
    <div>
      <PageHeader
        title="Cast Vote"
        subtitle="Voter yahan se vote cast karega."
      />
      <SectionCard>
        <p className="text-slate-600">
          Day 6 me vote check aur vote cast dono APIs connect karenge.
        </p>
      </SectionCard>
    </div>
  );
};

export default VotePage;
