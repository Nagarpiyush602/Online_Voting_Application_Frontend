const statusClasses = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  UPCOMING: "bg-amber-100 text-amber-700 border border-amber-200",
  COMPLETED: "bg-slate-200 text-slate-700 border border-slate-300",
};

const StatusBadge = ({ status }) => {
  const className =
    statusClasses[status] ||
    "bg-slate-100 text-slate-600 border border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status || "N/A"}
    </span>
  );
};

export default StatusBadge;
