"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AccessLevel } from "@/lib/mcp/types";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: AccessLevel;
  roleLabel: string;
}

interface AuthContextType {
  user: UserProfile;
  role: AccessLevel;
  setRole: (role: AccessLevel) => void;
}

const ROLES_MAP: Record<AccessLevel, { title: string; email: string }> = {
  public: { title: "Visitante Público", email: "visitante@learnflow.ai" },
  authenticated: { title: "Usuário Autenticado", email: "usuario@learnflow.ai" },
  student: { title: "Aluno (Student)", email: "guilherme.aluno@learnflow.ai" },
  teacher: { title: "Instrutor (Teacher)", email: "guilherme.prof@learnflow.ai" },
  admin: { title: "Administrador (Admin)", email: "admin@learnflow.ai" },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<AccessLevel>("student");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("learnflow_user_role");
      if (saved && (saved === "student" || saved === "teacher" || saved === "admin")) {
        setRoleState(saved as AccessLevel);
      }
    } catch {
      // ignore
    }
  }, []);

  const setRole = (newRole: AccessLevel) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("learnflow_user_role", newRole);
    } catch {
      // ignore
    }
  };

  const user: UserProfile = {
    name: "Guilherme Rodovalho",
    email: ROLES_MAP[role].email,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role,
    roleLabel: ROLES_MAP[role].title,
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
