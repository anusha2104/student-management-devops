import { CheckCircle, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed right-6 top-6 z-50 animate-fade-in">
      <div
        className={`flex min-w-[320px] items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg ${
          isSuccess ? "border-emerald-200" : "border-red-200"
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-500" />
        )}

        <p className="flex-1 text-sm font-medium text-slate-700">
          {message}
        </p>

        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}