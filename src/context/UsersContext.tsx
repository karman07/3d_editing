import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_URL as BASE_URL } from "@/api/client";

const userService = {
  async getAllUsers() {
    const res = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  },
  async createUser(userData: { username: string; password: string; role: string }) {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  async updateUser(id: string, userData: any) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
  async deleteUser(id: string) {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  },
};

type User = {
  _id: string;
  username: string;
  role: string;
  email?: string;
  createdAt?: string;
  status?: string;
};

type UsersContextType = {
  users: User[];
  fetchUsers: () => Promise<void>;
  createUser: (username: string, password: string, role: string) => Promise<any>;
  updateUser: (id: string, data: Partial<User>) => Promise<any>;
  deleteUser: (id: string) => Promise<any>;
  loading: boolean;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (username: string, password: string, role: string) => {
    const result = await userService.createUser({ username, password, role });
    await fetchUsers();
    return result;
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    const result = await userService.updateUser(id, data);
    await fetchUsers();
    return result;
  };

  const deleteUser = async (id: string) => {
    const result = await userService.deleteUser(id);
    await fetchUsers();
    return result;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, fetchUsers, createUser, updateUser, deleteUser, loading }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
};
