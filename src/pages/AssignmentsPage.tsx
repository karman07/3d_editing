import React, { useEffect, useState } from "react";
import {
  User,
  Link2,
  Trash2,
  PlusCircle,
  Users,
  Boxes,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

export default function AssignmentsPage() {
  const {
    users,
    models,
    assignments,
    fetchUsers,
    fetchModels,
    fetchAssignments,
    assignModel,
    removeAssignment,
  } = useAdmin();

  const [uid, setUid] = useState("");
  const [mids, setMids] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchModels();
    fetchAssignments();
  }, []);

  const doAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || mids.length === 0)
      return alert("Select a user and at least one model");

    try {
      // Call API repeatedly for each selected model
      for (const mid of mids) {
        await assignModel(uid, mid);
      }
      setUid("");
      setMids([]);
      fetchAssignments();
    } catch (err: any) {
      alert(err.message || "Assign failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link2 className="w-7 h-7 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-800">Assignments</h2>
        </div>

        {/* Assign Form */}
        <form
          onSubmit={doAssign}
          className="bg-white shadow-md rounded-xl p-5 mb-8 flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Select User
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <select
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Choose user</option>
                {users.map((u) => (
                  <option key={(u as any)._id} value={(u as any)._id}>
                    {(u as any).username || (u as any).email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Select Models (multiple)
            </label>
            <div className="relative">
              <select
                multiple
                value={mids}
                onChange={(e) =>
                  setMids(Array.from(e.target.selectedOptions, (opt) => opt.value))
                }
                className="w-full pl-3 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none h-32"
              >
                {models.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Hold Ctrl (Windows) / Cmd (Mac) to select multiple models
              </p>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              Assign
            </button>
          </div>
        </form>

        {/* Assignment List */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
            <Boxes className="w-5 h-5 text-indigo-500" /> Current Assignments
          </h3>

          {assignments.length === 0 ? (
            <p className="text-slate-500 text-center py-6">
              No assignments found. Start by assigning models to a user.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((a) => (
                <div
                  key={(a as any)._id}
                  className="p-4 border rounded-xl shadow-sm bg-gradient-to-br from-slate-50 to-white hover:shadow-lg transition"
                >
                  <p className="font-medium text-slate-700 mb-1">
                    {(a.modelId as any).name ?? a.modelId}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    {(a.userId as any).username ?? a.userId}
                  </p>
                  <button
                    onClick={() =>
                      removeAssignment(
                        (a.userId as any)._id ?? a.userId,
                        (a.modelId as any)._id ?? a.modelId
                      )
                    }
                    className="mt-3 flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
