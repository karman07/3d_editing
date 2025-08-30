import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@/api/client"; // ✅ central API base

// Axios instance with token from localStorage
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Model {
  _id: string;
  name: string;
}

interface Revision {
  _id: string;
  modelId: string | { _id: string; name: string };
  userId: string | { _id: string; username?: string; email?: string };
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface RevisionsContextType {
  models: Model[];
  revisions: Revision[];
  fetchModels: () => Promise<void>;
  fetchRevisionsForModel: (modelId: string) => Promise<void>;
  submitRevision: (modelId: string, file: File) => Promise<void>;
  approveRevision: (revisionId: string) => Promise<void>;
  rejectRevision: (revisionId: string) => Promise<void>;
}

const RevisionsContext = createContext<RevisionsContextType | undefined>(
  undefined
);

export const RevisionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);

  // ✅ Fetch all models
  const fetchModels = useCallback(async () => {
    try {
      const res = await api.get("/models");
      setModels(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching models", err);
      setModels([]);
    }
  }, []);

  // ✅ Fetch revisions for one model
  const fetchRevisionsForModel = useCallback(async (modelId: string) => {
    try {
      const res = await api.get(`/revisions/model/${modelId}`);
      setRevisions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching revisions", err);
      setRevisions([]);
    }
  }, []);

  // ✅ Submit revision
  const submitRevision = useCallback(async (modelId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("modelId", modelId);

    try {
      await api.post("/revisions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("Error submitting revision", err);
    }
  }, []);

  // ✅ Approve revision
  const approveRevision = useCallback(async (revisionId: string) => {
    try {
      await api.post(`/revisions/approve/${revisionId}`);
      setRevisions((prev) =>
        prev.map((r) =>
          r._id === revisionId ? { ...r, status: "APPROVED" } : r
        )
      );
    } catch (err) {
      console.error("Error approving revision", err);
    }
  }, []);

  // ✅ Reject revision
  const rejectRevision = useCallback(async (revisionId: string) => {
    try {
      await api.post(`/revisions/reject/${revisionId}`);
      setRevisions((prev) =>
        prev.map((r) =>
          r._id === revisionId ? { ...r, status: "REJECTED" } : r
        )
      );
    } catch (err) {
      console.error("Error rejecting revision", err);
    }
  }, []);

  return (
    <RevisionsContext.Provider
      value={{
        models,
        revisions,
        fetchModels,
        fetchRevisionsForModel,
        submitRevision,
        approveRevision,
        rejectRevision,
      }}
    >
      {children}
    </RevisionsContext.Provider>
  );
};

export const useRevisions = () => {
  const ctx = useContext(RevisionsContext);
  if (!ctx) throw new Error("useRevisions must be used inside RevisionsProvider");
  return ctx;
};
