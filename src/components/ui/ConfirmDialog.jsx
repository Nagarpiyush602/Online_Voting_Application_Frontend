/**
 * ConfirmDialog — Modal dialog for confirming destructive/important actions.
 * Supports primary and danger variants with a loading state.
 */
const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  loading = false,
  onConfirm,
  onClose,
}) => {
  if (!open) return null;

  const confirmClassName =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-300"
      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
