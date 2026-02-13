import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL ;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  /* ======================================
     Restore session + socket join
  ====================================== */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (!socket.connected) {
          socket.connect();
        }
        socket.emit("join", parsedUser._id);
      } catch (err) {
        console.error("Auth restore failed", err);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    return () => {
      socket.off("notification");
    };
  }, [token]);

  /* ======================================
     LOGIN (🔥 FIXED)
  ====================================== */
  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });

    const actualUser = data.user; // 🔥 important

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(actualUser));

    setToken(data.token);
    setUser(actualUser);

    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    if (!socket.connected) socket.connect();
    socket.emit("join", actualUser._id);

    return data;
  };

  /* ======================================
     SIGNUP (🔥 FIXED)
  ====================================== */
  const signup = async (payload) => {
    const { data } = await axios.post(`${API_URL}/api/auth/signup`, payload);

    const actualUser = data.user; // 🔥 important

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(actualUser));

    setToken(data.token);
    setUser(actualUser);

    axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    if (!socket.connected) socket.connect();
    socket.emit("join", actualUser._id);

    return data;
  };

  /* ======================================
     🔥 UPDATE USER (FOR AVATAR)
  ====================================== */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /* ======================================
     LOGOUT (UNCHANGED)
  ====================================== */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);

    delete axios.defaults.headers.common.Authorization;

    if (socket.connected) {
      socket.disconnect();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, updateUser, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
