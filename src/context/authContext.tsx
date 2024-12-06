"use client";
import React, { useState, useEffect, useContext, createContext } from "react";
//define user structure
interface UserMetadata {
  email: string;
  email_verified: boolean;
  name: string;
  phone: string;
  phone_verified: boolean;
  role: string;
  sub: string;
}

interface AppMetadata {
  provider: string;
  providers: string[];
}
interface AMR {
  method: string;
  timestamp: number;
}
interface UserPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  role: string;
  aal: string;
  amr: AMR[];
  session_id: string;
  is_anonymous: boolean;
}
//define context interface
interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  isAdmin: boolean;
  login: (user: UserPayload, token: string) => void;
  logout: () => void;
  contextTest: boolean;
}
interface AuthProviderProps {
  children: React.ReactNode;
}
/** How to create context step-by-step
 * --> authContext.ts-------
 * 1.assign AuthContext = createContext();
 * 2.now we can use <AuthContext.Provider value={userData}> which we want to share userData to all pages
 * 3.export AuthContext
 *
 * --> src/pages/_app.tsx-------
 * 4.import AuthProvider into _app.tsx and wrapp around <Component{...pageProps}>
 *
 * -->target component
 * 5.import AuthContext into target component (navbar&profile)
 * 6.declare new variable and pass useAuth to get value inside context
 * 7.shuld look like this >>> const userInfo = useAuth();
 */

// create context which will be main context provider.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//creat provider which will be render as **WRAPPER for whole app.
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [contextTest, setTest] = useState<boolean>(false);

  //check localstorage for token
  //FIXME double check the savedUser process, JSON.parse? getItem('user') from where?
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = savedToken
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    if (savedUser.user_metadata.role === "admin") {
      setIsAdmin(true);
    }
    setTest(true);
  }, []);

  //define login function which will use to store userdata and token.
  const login = (userInfo: UserPayload, authToken: string) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("token", authToken);
    setUser(userInfo);
    setToken(authToken);
  };
  //define logout function which will remove user and token
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAdmin, login, logout, contextTest }}>
      {children}
    </AuthContext.Provider>
  );
};

//to access the value inside context => create custom hook which will be call in target component.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth() must be used within an AuthProvider");
  }
  return context;
};
