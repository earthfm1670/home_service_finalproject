"use client";
import React, { useState, useEffect, useContext, createContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { setCookie, removeCookie } from "@/utils/cookies";
//define user structure
interface UserMetadata {
  address: string;
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
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  isAuthLoading: boolean;
  isLoggedIn: boolean;
}
//defined authState
interface AuthState {
  userId: string | null;
  userEmail: string | null;
  user: UserPayload | null;
  userRole: string | null;
  token: string | null;
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthState>({
    userId: null,
    userEmail: null,
    user: null,
    userRole: null,
    token: null,
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  //function to validate role
  const roleValidation = (userRole: string): void => {
    if (userRole === "customer") {
      //console.log("welcom customer");
      setIsAdmin(false);
      setIsStaff(false);
    } else if (userRole === "admin") {
      //console.log("welcom admin");
      setIsAdmin(true);
      setIsStaff(false);
    } else if (userRole === "staff") {
      //console.log("welcom staff");
      setIsStaff(true);
      setIsAdmin(false);
    }
  };

  //function to set authstate, set loggedIn
  const handleSessionLogin = (
    savedToken: string,
    savedUser: UserPayload,
    userRole: string
  ): void => {
    setAuthState({
      userId: savedUser.sub,
      userEmail: savedUser.email,
      user: savedUser,
      userRole: savedUser.user_metadata.role,
      token: savedToken,
    });
    roleValidation(userRole);
    setIsLoggedIn(true);
  };

  //check localstorage for token/ if have one, set user state base on token payload
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser: UserPayload = savedToken
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
    if (savedToken && savedUser) {
      const userRole = savedUser.user_metadata.role;
      handleSessionLogin(savedToken, savedUser, userRole);

      setIsAuthLoading(false);
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  //define login function which will use to store userdata and token.
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("api/auth/login", { email, password });
      //access token
      const authToken = response.data.access_token;
      //access userInfo
      const userInfo: UserPayload = jwtDecode(authToken);
      // NOT USE const userId = getUserId.userId.user_id;
      //store user info as string in local& store token
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("token", authToken);
      setCookie("authToken", authToken);
      //setauth state to store user / token
      const userRole = userInfo.user_metadata.role;
      handleSessionLogin(authToken, userInfo, userRole);
      return true;
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      console.error("Invalid email or password");
      return false;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("api/admin/login", { email, password });
      //access token
      const authToken = response.data.access_token;
      //access userInfo
      const userInfo: UserPayload = jwtDecode(authToken);
      //store user info as string in local& store token
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("token", authToken);
      setCookie("authToken", authToken);
      //setauth state to store user / token
      // if (userInfo.user_metadata.role === "admin"){} << แก้ type
      const userRole = userInfo.user_metadata.role;
      handleSessionLogin(authToken, userInfo, userRole);
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
      console.error("Invalid email or password");
    }
  };
  //define logout function which will remove user and token
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    removeCookie("authToken");
    setAuthState({
      userId: null,
      userEmail: null,
      user: null,
      userRole: null,
      token: null,
    });
    setIsAdmin(false);
    setIsStaff(false);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsStaff(false);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        isLoggedIn,
        isAdmin,
        isStaff,
        isAuthLoading,
        adminLogin,
      }}>
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

//ใน context นี้จะเป็นการ provide user data และ token ให้ทั้งเว็บ
//ส่วนสำคัญคือ ฟังก์ชั่น login , useEffect เพื่อเช็ค token และ logout
/**
 * 1.login มีขั้นตอนดังนี้
 * - axios post ส่ง credential
 * - เก็บ token
 * - decode user info
 * - ตั้ง user ลง local ในรูปแบบ string
 * - เซฟ user ลง state ในรูปแบบ json
 *
 * 2.useEffect เอาไว้เช็ค localstorage ว่ามี token ไหม
 * - ถ้ามี token และ user ใน store
 * - ดึง token ออกมาเก็บใน state
 * - ดึง user ออกมา เปลี่ยนเป็น json แล้วเก็บใน state
 */
