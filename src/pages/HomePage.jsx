import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";

const HomePage = () => {
  return (
    <div>
      <PageHeader
        title="Online Voting Application"
        subtitle="React + Tailwind frontend connected with your Spring Boot backend."
      />

      <SectionCard>
        <p className="text-slate-700 leading-7">
          Is frontend me voter registration, Firebase login, active election,
          candidate listing, vote casting, result viewing, aur admin dashboard
          sab backend ke current APIs ke hisab se banega.
        </p>
      </SectionCard>
    </div>
  );
};

export default HomePage;
