import { useState } from "react";

const CandidateForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    party: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedParty = formData.party.trim();

    if (!trimmedName) {
      return;
    }

    const success = await onSubmit({
      name: trimmedName,
      party: trimmedParty,
    });

    if (success) {
      setFormData({
        name: "",
        party: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-1">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Candidate Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter candidate name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          disabled={loading}
          required
        />
      </div>

      <div className="md:col-span-1">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Party
        </label>
        <input
          type="text"
          name="party"
          value={formData.party}
          onChange={handleChange}
          placeholder="Enter party name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          disabled={loading}
        />
      </div>

      <div className="flex items-end md:col-span-1">
        <button
          type="submit"
          disabled={loading || !formData.name.trim()}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Candidate"}
        </button>
      </div>
    </form>
  );
};

export default CandidateForm;
