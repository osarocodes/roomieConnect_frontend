// src/pages/admin/Settings.jsx
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminStore } from "@/stores/useAdminStore";

export default function Settings() {
  const {
    platformSettings,
    isLoadingSettings,
    isSavingSettings,
    fetchPlatformSettings,
    savePlatformSettings,
  } = useAdminStore();
  const [matching, setMatching] = useState({
    resultLimit: 20,
    minimumCompatibility: 0,
    requireVerifiedStudents: false,
  });

  useEffect(() => {
    fetchPlatformSettings();
  }, [fetchPlatformSettings]);

  useEffect(() => {
    if (platformSettings?.matching) setMatching(platformSettings.matching);
  }, [platformSettings]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await savePlatformSettings(matching);
  };

  return (
    <main className="mx-auto max-w-3xl">
      <div className="flex items-center gap-5 border-b border-base-300 pb-4">
          <Link to="/admin/dashboard" aria-label="Back to dashboard" className="btn btn-ghost btn-sm">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Platform Settings</h1>
            <p className="mt-1 text-sm text-base-content/60">Configure who appears in roommate recommendations.</p>
          </div>
      </div>

      {isLoadingSettings ? (
        <p className="py-10 text-center text-base-content/60">Loading settings...</p>
      ) : (
        <form onSubmit={handleSubmit} className="divide-y divide-base-300">
          <section className="py-6">
            <h2 className="font-semibold">Matching policy</h2>
            <p className="mt-1 text-sm text-base-content/60">These rules apply to new match searches.</p>

            <label htmlFor="resultLimit" className="mt-6 block">
              <span className="flex items-center justify-between gap-4">
                <span className="font-medium">Maximum recommendations</span>
                <output htmlFor="resultLimit" className="tabular-nums">{matching.resultLimit}</output>
              </span>
              <input
                id="resultLimit"
                type="range"
                min="1"
                max="50"
                step="1"
                value={matching.resultLimit}
                onChange={(event) => setMatching((current) => ({ ...current, resultLimit: Number(event.target.value) }))}
                className="range range-primary mt-2"
              />
              <span className="mt-1 flex justify-between text-xs text-base-content/50"><span>1</span><span>50</span></span>
            </label>

            <label htmlFor="minimumCompatibility" className="mt-6 block">
              <span className="flex items-center justify-between gap-4">
                <span className="font-medium">Minimum compatibility</span>
                <output htmlFor="minimumCompatibility" className="tabular-nums">{matching.minimumCompatibility}%</output>
              </span>
              <input
                id="minimumCompatibility"
                type="range"
                min="0"
                max="100"
                step="5"
                value={matching.minimumCompatibility}
                onChange={(event) => setMatching((current) => ({ ...current, minimumCompatibility: Number(event.target.value) }))}
                className="range range-primary mt-2"
              />
              <span className="mt-1 flex justify-between text-xs text-base-content/50"><span>0%</span><span>100%</span></span>
            </label>

            <label className="mt-6 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={matching.requireVerifiedStudents}
                onChange={(event) => setMatching((current) => ({ ...current, requireVerifiedStudents: event.target.checked }))}
                className="checkbox checkbox-primary"
              />
              <span>
                <span className="block font-medium">Only include verified students</span>
                <span className="mt-1 block text-sm text-base-content/60">Unverified accounts will be excluded from recommendations.</span>
              </span>
            </label>
          </section>

          <div className="flex justify-end py-5">
            <button type="submit" disabled={isSavingSettings} className="btn btn-primary">
              {isSavingSettings ? "Saving..." : "Save settings"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}