import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useActiveChild } from "../../components/ortu/useActiveChild";

const useFetchTahfidzOrtu = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtering, setFiltering] = useState(false);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const lastRequest = useRef("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const token = sessionStorage.getItem("auth_token_ortu") || getCookie("token");
    const { activeChild } = useActiveChild()
    const idSantri = JSON.parse(sessionStorage.getItem("active_child") || "null");

    // Debounce searchTerm selama 400ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchData = useCallback(async (filters = {}, force = false, isFilter = false) => {
            let url = `${API_BASE_URL}view-ortu/tahfidz?santri_id=${activeChild?.id || idSantri}`;

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    url += `&${key}=${encodeURIComponent(filters[key])}`;
                }
            });
            // if (currentPage > 1) {
            //     url += `&page=${currentPage}`;
            // }
            // // Handle search
            // if (debouncedSearchTerm) {
            //     url += `&nama=${encodeURIComponent(debouncedSearchTerm)}`;
            // }

            // Skip duplicate requests
            if (!force && lastRequest.current === url) {
                console.log("Skip duplicate request");
                return;
            }
            lastRequest.current = url;
            console.log("Fetching data from:", url);

            try {
                setError(null);
                if (isFilter) {
                    setFiltering(true);   // loading khusus filter
                } else {
                    setLoading(true);     // loading utama (skeleton)
                }
                const response = await fetch(url, {
                    headers: {
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
                    navigate("/login-ortu");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();
                console.log("hasil",result);
                setData(result || []);
                setTotalData(result.total_data || 0);
                setTotalPages(result.total_pages || 1);
                setCurrentPage(result.current_page || 1);
                setError(null);
            } catch (err) {
                setError(err.message);
                setData([]);
            } finally {
                if (isFilter) {
                    setFiltering(false);
                } else {
                    setLoading(false);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentPage, limit, debouncedSearchTerm, activeChild]
    );

    // Auto fetch when dependencies change
    useEffect(() => {
        fetchData();
        console.log(activeChild.id);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChild]);

    // Reset to page 1 when limit or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [limit, searchTerm]);

    return {
        // Data states
        data,
        loading,
        filtering,
        error,

        // Pagination controls
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,

        // Search
        searchTerm,
        setSearchTerm,

        // Filter options
        // filterOptions,

        // Fetch function
        fetchData,
    };
};

export default useFetchTahfidzOrtu;
