import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useFetchTahunAjaran = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [tahunAjaran, setTahunAjaran] = useState([]);
    const [loadingTahunAjaran, setLoadingTahunAjaran] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataTahunAjaran, setTotalDataTahunAjaran] = useState(0);
    // const [allTahunAjaran, setAllTahunAjaran] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchTahunAjaran = useCallback(async () => {
        setLoadingTahunAjaran(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}data-pokok/tahun-ajaran?page=${currentPage}&per_page=${limit}`, {
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
            const data = await response.json();

            setTahunAjaran(data.data);
            setTotalPages(data.last_page || 1);
            setTotalDataTahunAjaran(data.total || 0);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setTahunAjaran([]);
        } finally {
            setLoadingTahunAjaran(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, limit, navigate, token]);

//     useEffect(() => {
//     const storedTahunAjaran = sessionStorage.getItem("allTahunAjaran");
//     if (storedTahunAjaran) {
//         setAllTahunAjaran(JSON.parse(storedTahunAjaran));
//     } else {
//         const fetchAllTahunAjaran = async () => {
//             setError(null);

//             try {
//                 // Step 1: Ambil 1 data untuk dapatkan total
//                 const firstResponse = await fetch(`${API_BASE_URL}data-pokok/tahun-ajaran?page=1&per_page=1`, {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (firstResponse.status === 401) {
//                     await Swal.fire({
//                         title: "Sesi Berakhir",
//                         text: "Sesi anda telah berakhir, silakan login kembali.",
//                         icon: "warning",
//                         confirmButtonText: "OK",
//                     });
//                     clearAuthData();
//                     navigate("/login");
//                     return;
//                 }

//                 if (!firstResponse.ok) throw new Error(`Error ${firstResponse.status}`);
//                 const firstData = await firstResponse.json();

//                 const total = firstData.total || 0;

//                 // Step 2: Ambil semua data berdasarkan total
//                 const fullResponse = await fetch(`${API_BASE_URL}data-pokok/tahun-ajaran?page=1&per_page=${total}`, {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (!fullResponse.ok) throw new Error(`Error ${fullResponse.status}`);
//                 const fullData = await fullResponse.json();

//                 const kelasList = fullData.data || [];

//                 setAllTahunAjaran(kelasList);
//                 sessionStorage.setItem("allTahunAjaran", JSON.stringify(kelasList));
//             } catch (err) {
//                 console.error("Fetch ALL error:", err);
//                 setError(err.message);
//                 setAllTahunAjaran([]);
//             }
//         };

//         fetchAllTahunAjaran(); // panggil hanya jika belum ada di session
//     }
// // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []); // ⚠️ Dependency array kosong = hanya dijalankan sekali saat mount


    useEffect(() => {
        fetchTahunAjaran();
    }, [fetchTahunAjaran]);

    // const handleToggleStatus = async (data) => {
    //     const confirmResult = await Swal.fire({
    //         title: data.status ? "Nonaktifkan Data?" : "Aktifkan Data?",
    //         text: data.status
    //             ? "Data akan dinonaktifkan."
    //             : "Data akan diaktifkan kembali.",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: data.status ? "Ya, nonaktifkan" : "Ya, aktifkan",
    //         cancelButtonText: "Batal",
    //     });

    //     if (!confirmResult.isConfirmed) return;

    //     try {
    //         Swal.fire({
    //             background: "transparent",    // tanpa bg putih box
    //             showConfirmButton: false,     // tanpa tombol
    //             allowOutsideClick: false,
    //             didOpen: () => {
    //                 Swal.showLoading();
    //             },
    //             customClass: {
    //                 popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
    //             }
    //         });

    //         const token = sessionStorage.getItem("token") || getCookie("token");
    //         const response = await fetch(
    //             `${API_BASE_URL}crud/tahun-ajaran/${data.id}${data.status ? "" : "/activate"}`,
    //             {
    //                 method: data.status ? "DELETE" : "PUT",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         Swal.close();

    //         if (response.status == 401 && !window.sessionExpiredShown) {
    //             window.sessionExpiredShown = true;
    //             await Swal.fire({
    //                 title: "Sesi Berakhir",
    //                 text: "Sesi anda telah berakhir, silakan login kembali.",
    //                 icon: "warning",
    //                 confirmButtonText: "OK",
    //             });
    //             clearAuthData();
    //             navigate("/login");
    //             return;
    //         }

    //         if (!response.ok) {
    //             let result = {};
    //             try {
    //                 result = await response.json();
    //             // eslint-disable-next-line no-empty, no-unused-vars
    //             } catch (_) { }
    //             throw new Error(result.message || "Gagal memperbarui status data.");
    //         }

    //         await Swal.fire({
    //             icon: "success",
    //             title: "Berhasil",
    //             text: data.status
    //                 ? "Data berhasil dinonaktifkan."
    //                 : "Data berhasil diaktifkan.",
    //         });

    //         fetchTahunAjaran(); // refresh data
    //     } catch (error) {
    //         console.error("Error saat mengubah status:", error);
    //         await Swal.fire({
    //             icon: "error",
    //             title: "Gagal",
    //             text: error.message || "Terjadi kesalahan saat memperbarui status data.",
    //         });
    //     }
    // };

    const handleDelete = async (id) => {
            const confirmResult = await Swal.fire({
                title: "Yakin ingin menghapus data ini?",
                text: "Data yang sudah dihapus tidak dapat dikembalikan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, hapus",
                cancelButtonText: "Batal",
            });
    
            if (!confirmResult.isConfirmed) return;
    
            try {
                Swal.fire({
                    background: "transparent",    // tanpa bg putih box
                    showConfirmButton: false,     // tanpa tombol
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    customClass: {
                        popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
                    }
                });
    
                const token = sessionStorage.getItem("token") || getCookie("token");
                const response = await fetch(`${API_BASE_URL}crud/tahun-ajaran/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                Swal.close();
    
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
    
                if (!response.ok) {
                    let result = {};
                    try {
                        result = await response.json();
                    // eslint-disable-next-line no-empty, no-unused-vars
                    } catch (_) {}
                    throw new Error(result.message || "Gagal menghapus data.");
                }
    
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Data berhasil dihapus.",
                });
    
                fetchTahunAjaran();
            } catch (error) {
                console.error("Error saat menghapus:", error);
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: error.message || "Terjadi kesalahan saat menghapus data.",
                });
            }
        };

    return {
        tahunAjaran,
        // allTahunAjaran,
        loadingTahunAjaran,
        error,
        fetchTahunAjaran,
        // handleToggleStatus, 
        handleDelete,
        limit, setLimit, totalPages, currentPage, setCurrentPage, totalDataTahunAjaran
    };
};

export default useFetchTahunAjaran;
