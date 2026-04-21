const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <p className="text-slate-600">{text}</p>
    </div>
  );
};

export default Loader;
