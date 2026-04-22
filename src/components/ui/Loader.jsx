const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

const Loader = ({
  text = "Loading...",
  size = "md",
  fullPage = false,
  inline = false,
}) => {
  const spinnerSize = sizeMap[size] || sizeMap.md;

  if (inline) {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className={`${spinnerSize} inline-block animate-spin rounded-full border-slate-300 border-t-slate-900`}
        />
        {text ? <span>{text}</span> : null}
      </span>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm ${
        fullPage ? "flex min-h-[240px] items-center justify-center" : ""
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <span
          className={`${spinnerSize} inline-block animate-spin rounded-full border-slate-300 border-t-slate-900`}
        />
        {text ? <p className="text-slate-600">{text}</p> : null}
      </div>
    </div>
  );
};

export default Loader;
