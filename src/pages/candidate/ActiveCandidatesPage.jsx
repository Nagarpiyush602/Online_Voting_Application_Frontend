import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";

const ActiveCandidatesPage = () => {
  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle="Active election ke candidates yahan dikhenge."
      />
      <SectionCard>
        <p className="text-slate-600">
          Day 5 me protected API `/api/candidates/active-election` connect
          karenge.
        </p>
      </SectionCard>
    </div>
  );
};

export default ActiveCandidatesPage;
