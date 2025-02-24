import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/users/getMe",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("User Data:", response.data);
        setUser(response.data.data); // Ensure user state gets updated
      } catch (error) {
        console.error("Not logged in", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/users/login",
        { username, password },
        { withCredentials: true } // Still important for cookie if refresh token or other session related info in cookie
      );
      setUser(res.data.user);
      // Assuming login endpoint returns a token in res.data.token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      console.error("Logout successful", error);
      return res.data;
    } catch (error) {
      console.error("Login Failed", error.response.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/users/logout", {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  // Add token refresh mechanism
  const refreshToken = async () => {
    try {
      const response = await axios.post("/api/v1/auth/refresh-token", {
        refreshToken: localStorage.getItem("refreshToken"),
      });

      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      return response.data.accessToken;
    } catch (error) {
      localStorage.clear();
      window.location.href = "/sign-in";
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
