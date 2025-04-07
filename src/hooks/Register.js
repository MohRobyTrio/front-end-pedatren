import { useState, useCallback } from "react";
import { API_BASE_URL } from "./config";

const useRegister = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const register = useCallback(async ({ name, email, password, passwordConfirmation }) => {
    const url = `${API_BASE_URL}register`;
    setIsRegistering(true);
    setRegisterError(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();const message =
        errorData.message ||
        Object.values(errorData.errors || {}).flat().join(" ") || 
        "Registrasi gagal";
      throw new Error(message);
      }

      const data = await response.json();
      console.log("Registrasi berhasil:", data);

      // Simpan token dan nama user ke localStorage sebagai contoh
    //   if (data.token) {
    //     localStorage.setItem("token", data.token);
    //     localStorage.setItem("name", data.user.name);
    //   }

      return data;
    } catch (error) {
      console.error("Register error:", error);
      setRegisterError(error.message);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  return {
    register,
    isRegistering,
    registerError,
  };
};

export default useRegister;
