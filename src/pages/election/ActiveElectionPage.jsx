import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";

const ActiveElectionPage = () => {
  return (
    <div>
      <PageHeader
        title="Active Election"
        subtitle="Public API se active election details yahan dikhenge."
      />
      <SectionCard>
        <p className="text-slate-600">
          Day 4 me `/api/elections/active/one` se data fetch karenge.
        </p>
      </SectionCard>
    </div>
  );
};

export default ActiveElectionPage;
