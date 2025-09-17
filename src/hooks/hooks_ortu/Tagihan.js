import { useCallback, useEffect, useState, useRef } from "react";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import { useActiveChild } from "../../components/ortu/useActiveChild";

export const useTagihanSantri = () => {
    const { clearAuthData } = useLogout();
    const { activeChild } = useActiveChild();
    const navigate = useNavigate();

    const [santri, setSantri] = useState(null);
    const [tagihanList, setTagihanList] = useState([]);
    const [statistik, setStatistik] = useState(null);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const abortControllerRef = useRef(null);
    const sessionExpiredRef = useRef(false);

    const token = sessionStorage.getItem("token") || getCookie("token");

    // Stabilkan handleSessionExpired dengan useRef untuk menghindari re-creation
    const handleSessionExpiredRef = useRef();
    handleSessionExpiredRef.current = async () => {
        if (sessionExpiredRef.current) return;
        sessionExpiredRef.current = true;

        await Swal.fire({
            title: "Sesi Berakhir",
            text: "Sesi anda telah berakhir, silakan login kembali.",
            icon: "warning",
            confirmButtonText: "OK",
        });

        clearAuthData();
        navigate("/login");
    };

    // Single fetch function dengan stabilitas maksimal
    const fetchTagihanData = useCallback(async () => {
        const currentActiveChildId = activeChild?.id;
        const currentToken = token;

        // Early return jika tidak ada data yang dibutuhkan
        
        // if (!currentActiveChildId || !currentToken) {
        //     setSantri(null);
        //     setTagihanList([]);
        //     setStatistik(null);
        //     setMeta(null);
        //     setLoading(false);
        //     return;
        // }
        // console.log('🔍 Fetching tagihan data for:', { currentActiveChildId, hasToken: !!currentToken });

        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            setLoading(true);
            setError(false);

            console.log('🚀 Fetching tagihan for santri ID:', currentActiveChildId);

            const response = await fetch(
                `${API_BASE_URL}tagihan-santri/santri/${currentActiveChildId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentToken}`,
                    },
                    signal: controller.signal,
                }
            );

            console.log('📡 Response status:', response.status);

            // Handle session expired
            if (response.status === 401) {
                await handleSessionExpiredRef.current();
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Gagal mengambil data tagihan`);
            }

            const result = await response.json();
            console.log('✅ API Response received:', result);

            // Update states hanya jika request tidak di-abort
            if (!controller.signal.aborted) {
                setSantri(result.santri || null);
                setTagihanList(Array.isArray(result.data) ? result.data : []);
                setStatistik(result.statistik || null);
                setMeta(result.meta || null);
                console.log('🎉 States berhasil diupdate!');
            }

        } catch (err) {
            if (err.name !== "AbortError" && !controller.signal.aborted) {
                console.error("❌ Error fetching tagihan data:", err);
                setError(true);
                // Reset semua state ke nilai default saat error
                setSantri(null);
                setTagihanList([]);
                setStatistik(null);
                setMeta(null);
            }
        } finally {
            // Set loading false hanya jika request tidak di-abort
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChild.id]); 

    // Effect utama - langsung menggunakan primitive values sebagai dependency
    useEffect(() => {
        console.log('🔄 useEffect triggered:', { activeChildId: activeChild?.id, hasToken: !!token });
        fetchTagihanData();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChild.id]); 

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            sessionExpiredRef.current = false;
        };
    }, []);

    // Fungsi refresh untuk dipanggil manual
    const refreshData = useCallback(() => {
        console.log('🔄 Manual refresh triggered');
        fetchTagihanData();
    }, [fetchTagihanData]);

    return {
        santri,
        tagihanList,
        statistik,
        meta,
        loading,
        error,
        refreshData,
    };
};