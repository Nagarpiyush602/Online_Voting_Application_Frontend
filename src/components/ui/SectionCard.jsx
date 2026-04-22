const SectionCard = ({ children, className = "", title, subtitle, action }) => {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            {title ? (
              <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            ) : null}
          </div>

          {action ? <div className="w-full md:w-auto">{action}</div> : null}
        </div>
      )}

      {children}
    </section>
  );
};

export default SectionCard;
