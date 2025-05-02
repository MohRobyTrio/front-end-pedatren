import { useState, useCallback } from "react";
import { API_BASE_URL } from "./config";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const logout = useCallback(async () => {
    const url = `${API_BASE_URL}logout`;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

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
        // const errorData = await response.json();
        // throw new Error(errorData.message || "Logout gagal");
        let errorMessage = "Logout gagal";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          if (response.status === 401) {
            errorMessage = "Unauthenticated.";
          }
          console.log(jsonError);
        }
        throw new Error(errorMessage);
      }

      // const data = await response.json();
      // console.log("Logout berhasil:", data);

      if (response.status !== 204) {
        const data = await response.json();
        console.log("Logout berhasil:", data);
      } else {
        console.log("Logout berhasil (204 No Content)");
      }

      // ✅ Hapus token dari localStorage
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // return data;
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
