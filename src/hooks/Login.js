import { useState, useCallback } from "react";
import { API_BASE_URL } from "./config";
import { setTokenCookie } from "../utils/cookieUtils";

const useLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const response = await fetch(`${API_BASE_URL}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Login gagal.");
      }

      const data = await response.json();

      if (data.token) {
        const roles = data.user.roles || [];
        if (rememberMe) {
          setTokenCookie(data.token);
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("roles", JSON.stringify(roles));
          localStorage.setItem("email", data.user.email);
        } else {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("name", data.user.name);
          sessionStorage.setItem("email", data.user.email);
          sessionStorage.setItem("roles", JSON.stringify(roles));
        }
      }
      sessionStorage.setItem("activeSession", "true");
      return data;
    } catch (error) {
      setLoginError(error.message);
      // Optional: tampilkan alert kecil native, atau tampilkan error di komponen login kamu
      alert(error.message || "Terjadi kesalahan saat login.");
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  return { login, isLoggingIn, loginError };
};

export default useLogin;
