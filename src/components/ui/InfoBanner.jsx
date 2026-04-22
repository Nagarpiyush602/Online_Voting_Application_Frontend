/**
 * InfoBanner — Contextual alert/notification banner.
 * Variants: info (blue), success (green), warning (amber), error (red).
 */
const variantConfig = {
  info: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    title: "text-indigo-800",
    message: "text-indigo-700",
    icon: "ℹ️",
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "text-emerald-800",
    message: "text-emerald-700",
    icon: "✅",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    title: "text-amber-800",
    message: "text-amber-700",
    icon: "⚠️",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    title: "text-red-800",
    message: "text-red-700",
    icon: "❌",
  },
};

const InfoBanner = ({ variant = "info", title, message }) => {
  const config = variantConfig[variant] || variantConfig.info;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${config.bg} ${config.border}`}
    >
      <span className="mt-0.5 text-base">{config.icon}</span>
      <div>
        {title && (
          <p className={`text-sm font-semibold ${config.title}`}>{title}</p>
        )}
        {message && (
          <p className={`mt-0.5 text-sm ${config.message}`}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default InfoBanner;
