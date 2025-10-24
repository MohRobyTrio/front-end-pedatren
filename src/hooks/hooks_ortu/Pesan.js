import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useActiveChild } from "../../components/ortu/useActiveChild";
import { toast } from "sonner";

const useFetchPesanOrtu = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
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
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState(null);

    // Debounce searchTerm selama 400ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchData = useCallback(async (force = false) => {
        let url = `${API_BASE_URL}view-ortu/ReadMessage?santri_id=${activeChild?.id || idSantri}`;

        // Skip duplicate requests
        if (!force && lastRequest.current == url) {
            console.log("Skip duplicate request");
            return;
        }
        lastRequest.current = url;
        console.log("Fetching data from:", url);

        try {
            setLoading(true);
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
            console.log("hasil", result);
            setData(result.data || []);
            setTotalData(result.total_data || 0);
            setTotalPages(result.total_pages || 1);
            setCurrentPage(result.current_page || 1);
        } catch (err) {
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentPage, limit, debouncedSearchTerm, activeChild]
    );

    const kirimPesan = useCallback(async (pesan) => {
        const currentSantriId = activeChild?.id || idSantri;

        // --- 1. Validasi Frontend ---
        if (!pesan || pesan.length < 5) {
            const errorMsg = "Pesan harus memiliki minimal 5 karakter.";
            setSendError(errorMsg);
            toast.error(errorMsg); // Notifikasi toast instan
            return false;
        }
        if (!currentSantriId) {
            const errorMsg = "Tidak ada santri aktif yang dipilih.";
            setSendError(errorMsg);
            toast.error(errorMsg); // Notifikasi toast instan
            return false;
        }

        // --- 2. Atur State & Tampilkan Toast Loading ---
        setIsSending(true);
        setSendError(null);
        const toastId = toast.loading('Mengirim pesan...'); // Tampilkan toast loading dan simpan ID-nya

        const url = `${API_BASE_URL}view-ortu/SendMessage`;

        try {
            // --- 3. Definisikan Logika Promise (INI TIDAK BERUBAH) ---
            // (Kita tidak perlu membungkusnya dalam fungsi 'promiseLogic' terpisah lagi)
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    santri_id: currentSantriId,
                    pesan: pesan
                })
            });

            // --- 4. Handle 401 (Kasus Khusus) ---
            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                toast.dismiss(toastId); // Tutup toast loading
                await Swal.fire({ /* ... (logika Swal Anda) ... */ });
                clearAuthData();
                navigate("/login-ortu");
                throw new Error("Sesi Anda telah berakhir."); // Lemparkan error
            }

            const result = await response.json();

            // --- 5. Handle Error Validasi (422) atau Error Server (500) ---
            if (!response.ok) {
                if (result.error) {
                    const errorMessages = Object.values(result.error).flat().join("\n");
                    throw new Error(errorMessages);
                }
                throw new Error(result.message || `Gagal mengirim pesan.`);
            }

            // --- 6. Handle Sukses ---
            // 'await' di atas sudah selesai, kita sekarang di blok sukses
            await fetchData(true); // Refresh daftar pesan

            // Perbarui toast loading menjadi toast success
            toast.success(result.message || "Pesan Anda telah terkirim.", { id: toastId });

            setIsSending(false); // Matikan loading form
            return true; // Kembalikan true (sukses)

        } catch (err) {
            // --- 7. Handle Gagal (dari 'throw new Error' manapun) ---
            console.error("Gagal mengirim pesan (catch utama):", err);

            // Perbarui toast loading menjadi toast error
            toast.error(err.message, { id: toastId });

            setSendError(err.message); // Set error untuk form
            setIsSending(false); // Matikan loading form
            return false; // Kembalikan false (gagal)
        }

    }, [activeChild, idSantri, token, clearAuthData, navigate, fetchData]);

    // Auto fetch when dependencies change
    useEffect(() => {
        fetchData();
        console.log(activeChild.id);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset to page 1 when limit or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [limit, searchTerm]);

    // Filter options (tidak digunakan)
    const filterOptions = useMemo(() => {
        const options = {
            alasan_izin: [],
            status: [],
            jenis_izin: [],
        };

        data.forEach((item) => {
            Object.keys(options).forEach((key) => {
                if (item[key] && !options[key].includes(item[key])) {
                    options[key].push(item[key]);
                }
            });
        });

        return options;
    }, [data]);

    return {
        // Data states
        data,
        loading,
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
        filterOptions,

        // Fetch function
        fetchData,

        kirimPesan,
        isSending,
        sendError,
    };
};

export default useFetchPesanOrtu;
