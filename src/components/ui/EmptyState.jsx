const EmptyState = ({
  title = "No data found",
  message = "Nothing to show right now.",
  action,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center sm:p-10">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
        {message}
      </p>

      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
