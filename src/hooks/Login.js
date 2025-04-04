// src/hooks/useLogin.js

import { useState, useCallback } from "react";
import { API_BASE_URL } from "./config";

const useLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
//   const lastLoginRequest = useRef("");

  const login = useCallback(async ({ email, password }) => {
    const url = `${API_BASE_URL}login`;
    // const requestKey = `${url}?email=${email}`; // Optional, buat ngecek duplikat
    // if (lastLoginRequest.current === requestKey) {
    //   console.log("Skip login: Permintaan sama dengan sebelumnya");
    //   return;
    // }

    // lastLoginRequest.current = requestKey;
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login gagal");
      }

      const data = await response.json();
      console.log("Login berhasil:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log(data.token);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  return {
    login,
    isLoggingIn,
    loginError,
  };
};

export default useLogin;
