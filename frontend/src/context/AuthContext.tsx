import {
  createContext,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {
  user: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: Props) => {
  const [user, setUser] =
    useState<string | null>(
      localStorage.getItem("token")
    );

  const login = (token: string) => {
    localStorage.setItem(
      "token",
      token
    );

    setUser(token);
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};