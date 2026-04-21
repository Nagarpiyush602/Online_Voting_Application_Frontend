import { useState } from "react";

const ElectionForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
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

    if (!trimmedName || !formData.startTime || !formData.endTime) {
      return;
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      return;
    }

    const payload = {
      name: trimmedName,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    const success = await onSubmit(payload);

    if (success) {
      setFormData({
        name: "",
        startTime: "",
        endTime: "",
      });
    }
  };

  const isInvalidTime =
    formData.startTime &&
    formData.endTime &&
    new Date(formData.startTime) >= new Date(formData.endTime);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Election Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter election name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Start Time
        </label>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          End Time
        </label>
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
          disabled={loading}
          required
        />
      </div>

      {isInvalidTime && (
        <div className="md:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          End time start time se bada hona chahiye.
        </div>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={
            loading ||
            !formData.name.trim() ||
            !formData.startTime ||
            !formData.endTime ||
            isInvalidTime
          }
          className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Election"}
        </button>
      </div>
    </form>
  );
};

export default ElectionForm;
