const StatCard = ({ title, value, extra = "" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-800">
        {value ?? "N/A"}
      </h3>
      {extra && <p className="mt-2 text-sm text-slate-500">{extra}</p>}
    </div>
  );
};

export default StatCard;
