import { useState, useCallback } from "react";
import { API_BASE_URL } from "./config";
import { setTokenCookie } from "../utils/cookieUtils";
import Swal from "sweetalert2";

const useLogin = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const login = useCallback(async ({ email, password, rememberMe }) => {
        const url = `${API_BASE_URL}login`;
        setIsLoggingIn(true);
        setLoginError(null);

        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang proses.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const response = await fetch(url, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            Swal.close();

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login gagal");
            }

            const data = await response.json();
            console.log("Login berhasil:", data);

            if (data.token) {
                // const role = data.user.roles[0] || "";
                const roles = data.user.roles || [];
                console.log(roles);
                console.log(JSON.stringify(roles));
                
                if (rememberMe) {
                    setTokenCookie(data.token);
                    localStorage.setItem("name", data.user.name);
                    localStorage.setItem("roles", JSON.stringify(roles));
                } else {
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("name", data.user.name);
                    sessionStorage.setItem("roles", JSON.stringify(roles));
                }
            }

            sessionStorage.setItem("activeSession", "true");

            return data;
        } catch (error) {
            console.error("Login error:", error);
            setLoginError(error.message);
            await Swal.fire({
                title: "Login Gagal",
                text: error.message || "Terjadi kesalahan saat login",
                icon: "error",
                confirmButtonText: "OK",
            });
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
