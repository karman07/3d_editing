import React, { useEffect, useState } from "react";
import { useRevisions } from "../context/RevisionsContext";
import { useAuth } from "../context/AuthContext";

export default function RevisionsPage() {
  const {
    models,
    fetchModels,
    fetchRevisionsForModel,
    revisions,
    approveRevision,
    rejectRevision,
    submitRevision,
  } = useRevisions();
  const { user } = useAuth();

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    if (selectedModel) fetchRevisionsForModel(selectedModel);
  }, [selectedModel, fetchRevisionsForModel]);

  const doSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel || !file) return alert("Select model and file");
    try {
      await submitRevision(selectedModel, file);
      setFile(null);
      await fetchRevisionsForModel(selectedModel);
    } catch (err: any) {
      alert(err.message || "Submit failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">📑 Model Revisions</h2>

      {/* Submit Revision */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Submit a Revision</h3>
        <form onSubmit={doSubmit} className="flex flex-col md:flex-row gap-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="p-2 border rounded-lg flex-1"
          >
            <option value="">Select model</option>
            {models.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="flex-1 border rounded-lg p-2"
          />
          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition">
            Submit
          </button>
        </form>
      </div>

      {/* Revisions List */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Revision History
        </h3>
        {revisions.length === 0 ? (
          <p className="text-gray-500">No revisions found for this model.</p>
        ) : (
          <ul className="space-y-4">
            {revisions.map((r) => (
              <li
                key={r._id}
                className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition"
              >
                {/* Revision Info */}
                <div className="space-y-1">
                  <div>
                    <span className="font-medium">📦 Model:</span>{" "}
                    {(r.modelId as any).name ?? r.modelId}
                  </div>
                  <div>
                    <span className="font-medium">👤 By:</span>{" "}
                    {(r.userId as any).username ??
                      (r.userId as any).email ??
                      r.userId}
                  </div>
                  <div>
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      🔗 View File
                    </a>
                  </div>
                  <div className="text-sm">
                    Status:{" "}
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        r.status === "PENDING"
                          ? "bg-yellow-500"
                          : r.status === "APPROVED"
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {user?.role === "ADMIN" && r.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                      onClick={() => approveRevision(r._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                      onClick={() => rejectRevision(r._id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
