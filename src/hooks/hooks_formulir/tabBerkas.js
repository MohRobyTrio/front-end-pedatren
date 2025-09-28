import { useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useLogout from "../Logout";

export function useBerkas(bioId) {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [berkasList, setBerkasList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("token") || getCookie("token");

    // Ambil daftar berkas
    async function fetchBerkas() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}formulir/${bioId}/berkas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status == 401 && !window.sessionExpiredShown) {
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
            if (!res.ok) throw new Error("Gagal memuat data berkas");
            const data = await res.json();
            console.log(data);

            setBerkasList(data.data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    // Ambil detail 1 berkas by id
    async function fetchBerkasDetail(id) {
        const res = await fetch(`${API_BASE_URL}formulir/${id}/berkas/show`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.status == 401 && !window.sessionExpiredShown) {
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
        if (!res.ok) throw new Error("Gagal memuat detail berkas");
        return await res.json();
    }

    // Tambah berkas baru
    async function createBerkas(id, formData) {
        console.log("Payload yang dikirim ke API:", JSON.stringify(formData, null, 2));
        const res = await fetch(`${API_BASE_URL}formulir/${id}/berkas`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (res.status == 401 && !window.sessionExpiredShown) {
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

        if (!res.ok) {
            let result;
            try {
                result = await res.json();
            } catch {
                throw new Error("Gagal menambah berkas");
            }

            if (res.status === 422 && result.errors) {
                throw { type: "validation", data: result.errors };
            }

            throw new Error(result.message || "Gagal menambah berkas");
        }

        return await res.json();
    }

    // Update berkas
    async function updateBerkas(id, formData) {
        formData.append('_method', 'PUT');
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }
        const res = await fetch(`${API_BASE_URL}formulir/${id}/berkas`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (res.status == 401 && !window.sessionExpiredShown) {
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

        const result = await res.json();
        console.log(result);
        if (!res.ok) {
            // kalau error validasi 422 → lempar object khusus
            if (res.status === 422 && result.errors) {
                throw { type: "validation", data: result.errors };
            }
            // selain itu → lempar string biasa
            throw new Error(result.message || "Gagal mengupdate berkas");
        }
        return result;
    }

    return {
        berkasList,
        loading,
        error,
        fetchBerkas,
        fetchBerkasDetail,
        createBerkas,
        updateBerkas,
    };
}
