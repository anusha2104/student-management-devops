import { useState } from "react";
import {
  Settings as SettingsIcon,
  Server,
  Database,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

export default function Settings() {
  const [apiUrl, setApiUrl] = useState(
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // The actual API URL is controlled through the VITE_API_URL
    // environment variable. This button is only for the UI.
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-cyan-600">Configuration</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Configure the connection between the frontend and backend.
        </p>
      </div>

      {/* API Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
              <Server className="h-5 w-5 text-cyan-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Backend API
              </h2>

              <p className="text-sm text-slate-500">
                Flask REST API connection
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              API Base URL
            </label>

            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              placeholder="http://localhost:5000/api"
            />

            <p className="mt-2 text-xs text-slate-400">
              Configure this using the VITE_API_URL environment variable.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {saved ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Database Architecture */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Database className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Database
              </h2>

              <p className="text-sm text-slate-500">
                MySQL database architecture
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">
              Database
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              MySQL
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">
              Backend
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              Flask REST API
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">
              Deployment
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              Docker + AWS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}