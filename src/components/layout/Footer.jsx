/**
 * Footer — Minimal, elegant footer shown on every page.
 */
const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-indigo-600">Votezy</span>. All
            rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built with React + Tailwind CSS + Spring Boot
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
