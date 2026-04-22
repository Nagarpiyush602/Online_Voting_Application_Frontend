const PageHeader = ({ title, subtitle, align = "left" }) => {
  const alignmentClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-6 sm:mb-8 ${alignmentClass}`}>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

export default PageHeader;
