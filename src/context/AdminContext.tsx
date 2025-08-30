import React, { createContext, useContext, useState } from 'react';
import { api } from '../api/client';

export type UserItem = { _id: string; username?: string; email?: string; role?: 'ADMIN' | 'USER' };
export type ModelItem = { _id: string; name: string; description?: string; fileUrl: string; createdAt?: string };
export type AssignmentItem = { _id: string; userId: string | UserItem; modelId: string | ModelItem; canEdit?: boolean };
export type RevisionItem = { _id: string; userId: string | UserItem; modelId: string | ModelItem; fileUrl: string; status: 'PENDING' | 'APPROVED' | 'REJECTED' };

type AdminContextType = {
  users: UserItem[];
  models: ModelItem[];
  assignments: AssignmentItem[];
  revisions: RevisionItem[];

  fetchUsers: () => Promise<void>;
  createUser: (username: string, password: string, role?: 'ADMIN' | 'USER') => Promise<UserItem>;
  fetchModels: () => Promise<void>;
  uploadModel: (file: File, name: string, description?: string) => Promise<ModelItem>;
  fetchAssignments: () => Promise<void>;
  assignModel: (userId: string, modelId: string, canEdit?: boolean) => Promise<AssignmentItem>;
  removeAssignment: (userId: string, modelId: string) => Promise<any>;
  fetchRevisionsForModel: (modelId: string) => Promise<void>;
  submitRevision: (modelId: string, file: File) => Promise<RevisionItem>;
  approveRevision: (revisionId: string) => Promise<RevisionItem>;
  rejectRevision: (revisionId: string) => Promise<RevisionItem>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);

  // USERS
  const fetchUsers = async () => {
    const data = await api.get('/users');
    setUsers(data);
  };
  const createUser = async (username: string, password: string, role: 'ADMIN' | 'USER' = 'USER') => {
    const user = await api.post('/users', { username, password, role });
    await fetchUsers();
    return user;
  };

  // MODELS
  const fetchModels = async () => {
    const data = await api.get('/models');
    setModels(data);
  };
  const uploadModel = async (file: File, name: string, description?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', name);
    if (description) fd.append('description', description);
    const model = await api.postForm('/models/upload', fd);
    await fetchModels();
    return model;
  };

  const fetchAssignments = async () => {
  
    const data = await api.get('/assignments'); 
    setAssignments(data);
  };
  const assignModel = async (userId: string, modelId: string, canEdit = true) => {
    const a = await api.post('/assignments', { userId, modelId, canEdit });
    await fetchAssignments();
    return a;
  };
  const removeAssignment = async (userId: string, modelId: string) => {
    const res = await api.del('/assignments', { userId, modelId });
    await fetchAssignments();
    return res;
  };

  const fetchRevisionsForModel = async (modelId: string) => {
    const data = await api.get(`/revisions/model/${modelId}`);
    setRevisions(data);
  };
  const submitRevision = async (modelId: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('modelId', modelId);
   
    const rev = await api.postForm('/revisions', fd);
    return rev;
  };
  const approveRevision = async (revisionId: string) => {
    const r = await api.post(`/revisions/approve/${revisionId}`);
    // refresh model revisions & models & assignments
    await fetchModels();
    await fetchAssignments();
    return r;
  };
  const rejectRevision = async (revisionId: string) => {
    const r = await api.post(`/revisions/reject/${revisionId}`);
    return r;
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        models,
        assignments,
        revisions,
        fetchUsers,
        createUser,
        fetchModels,
        uploadModel,
        fetchAssignments,
        assignModel,
        removeAssignment,
        fetchRevisionsForModel,
        submitRevision,
        approveRevision,
        rejectRevision,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
};
