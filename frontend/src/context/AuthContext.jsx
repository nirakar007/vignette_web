import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  // check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/auth/getMe", {
          withCredentials: true, // ensures cookies are sent
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Not logged in", error);
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { username, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error("Login Failed", error.response.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:5000/api/v1/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
