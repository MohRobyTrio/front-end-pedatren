import { useState, useCallback } from "react";
import { API_BASE_URL } from "./config";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const logout = useCallback(async () => {
    const url = `${API_BASE_URL}logout`;
    const token = localStorage.getItem("token");

    if (!token) {
      setLogoutError("Token tidak ditemukan");
      return;
    }

    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout gagal");
      }

      const data = await response.json();
      console.log("Logout berhasil:", data);

      // ✅ Hapus token dari localStorage
      localStorage.removeItem("token");

      return data;
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutError(error.message);
      throw error;
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  return {
    logout,
    isLoggingOut,
    logoutError,
  };
};

export default useLogout;
