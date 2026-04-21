import PageHeader from "../../components/ui/PageHeader";
import SectionCard from "../../components/ui/SectionCard";

const ResultPage = () => {
  return (
    <div>
      <PageHeader
        title="Election Result"
        subtitle="Election result yahan show hoga."
      />
      <SectionCard>
        <p className="text-slate-600">Day 7 me result API integrate karenge.</p>
      </SectionCard>
    </div>
  );
};

export default ResultPage;
