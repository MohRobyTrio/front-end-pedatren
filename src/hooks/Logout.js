import { useState, useCallback } from "react";
import { API_BASE_URL } from "./config";
import { getCookie, removeTokenCookie } from "../utils/cookieUtils";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const clearAuthData = () => {
    removeTokenCookie();
    localStorage.clear();
    sessionStorage.clear();
  };

  const logout = useCallback(async () => {
    const url = `${API_BASE_URL}logout`;
    const token = sessionStorage.getItem("token") || getCookie("token");

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

      if (response.status === 401) {
        // Langsung logout jika unauthorized
        clearAuthData();
        throw new Error("Unauthorized. Logging out.");
      }

      if (!response.ok) {
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

      if (response.status !== 204) {
        const data = await response.json();
        console.log("Logout berhasil:", data);
      } else {
        console.log("Logout berhasil (204 No Content)");
      }

      clearAuthData();
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
    clearAuthData,
    isLoggingOut,
    logoutError,
  };
};

export default useLogout;
