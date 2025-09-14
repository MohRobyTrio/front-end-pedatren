import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchProsesTagihan = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [prosesTagihan, setProsesTagihan] = useState([]);
    const [loadingProsesTagihan, setLoadingProsesTagihan] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchProsesTagihan = useCallback(async () => {
        setLoadingProsesTagihan(true);
        setError(null);

        let url = `${API_BASE_URL}tagihan-santri`;

        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const result = await response.json();

            setProsesTagihan(Array.isArray(result) ? result : []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setProsesTagihan([]);
        } finally {
            setLoadingProsesTagihan(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, debouncedSearchTerm, currentPage]);

    useEffect(() => {
        fetchProsesTagihan();
    }, [fetchProsesTagihan]);

    return {
        prosesTagihan,
        loadingProsesTagihan,
        error,
        fetchProsesTagihan,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
    };
};

export default useFetchProsesTagihan;