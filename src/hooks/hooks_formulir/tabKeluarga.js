import { useCallback, useEffect, useState } from "react";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";
import Swal from "sweetalert2";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

export const useTabKeluarga = ({ biodata_id, setShowAddModal, setFeature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [nokk, setNokk] = useState([]);
    const [keluargaList, setKeluargaList] = useState([]);
    const [id1, setId1] = useState([]);
    const [loadingKeluarga, setLoadingKeluarga] = useState(false);
    const [loadingDetailKeluargaId, setLoadingDetailKeluargaId] = useState(null);
    // const [santriId, setSantriId] = useState(null);

    const [selectedKeluargaId, setSelectedKeluargaId] = useState(null);
    const [selectedKeluargaDetail, setSelectedKeluargaDetail] = useState("");
    const [biodataKeluargaId, setBiodataKeluargaId] = useState("");
    const [nomorkk, setNomorkk] = useState("");
    const [hubungan, setHubungan] = useState("");
    const [error, setError] = useState(false);

    const token = sessionStorage.getItem("token") || getCookie("token");

    const fetchKeluargaList = useCallback(async () => {
        try {
            setLoadingKeluarga(true);
            setError(false);

            const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/keluarga`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setNokk(result.data.no_kk || []);
            setKeluargaList(result.data.relasi_keluarga || []);
            setId1(result.data.relasi_keluarga[0].id_keluarga || []);
        } catch (error) {
            console.error("Gagal memuat data keluarga:", error);
            setError(true);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal memuat data keluarga',
            });
        } finally {
            setLoadingKeluarga(false);
        }
        
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [biodata_id, token]);
    
    //debunging
    // console.log("Keluarga List:", keluargaList);
    // console.log("keluarga:", nokk);
    // console.log("ID1:", id1);

    useEffect(() => {
        fetchKeluargaList();
    }, [fetchKeluargaList]);

    const handleCardClick = useCallback(async (keluargaId) => {
        setLoadingDetailKeluargaId(keluargaId);

        try {
            const response = await fetch(`${API_BASE_URL}formulir/${keluargaId}/keluarga/show`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
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

            const result = await response.json();

            setSelectedKeluargaId(keluargaId);
            setSelectedKeluargaDetail(result.data);
            setBiodataKeluargaId(result.data.biodata_id);
            setNomorkk(result.data.no_kk);
            setHubungan(result.data.hubungan);
        } catch (error) {
            console.error("Gagal memuat detail keluarga:", error);
            setError(true);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gagal memuat detail keluarga',
            });
        } finally {
            setLoadingDetailKeluargaId(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleUpdate = useCallback(async () => {
        if (!selectedKeluargaDetail || !selectedKeluargaId) {
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Data keluarga tidak valid atau belum dipilih',
            });
            return;
        }

        // Tampilkan loading indicator
        Swal.fire({
          background: "transparent", // tanpa bg putih box
          showConfirmButton: false, // tanpa tombol
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          customClass: {
            popup: "p-0 shadow-none border-0 bg-transparent", // hilangkan padding, shadow, border, bg
          },
        });

        try {
            const payload = {
                biodata_id: biodataKeluargaId,
                nama: selectedKeluargaDetail.nama,
                no_kk: nomorkk,
                hubungan: hubungan
            };

            const response = await fetch(`${API_BASE_URL}formulir/${selectedKeluargaId}/keluarga`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            Swal.close();
            // Handle unauthorized (401)
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

            const result = await response.json();

            // Tutup loading indicator

            if (response.ok && result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data keluarga berhasil diperbarui!',
                    timer: 2000,
                    showConfirmButton: false,
                });
                // Refresh data keluarga
                fetchKeluargaList();
            } else {
                throw new Error(result.message || "Gagal memperbarui data keluarga");
            }
        } catch (error) {
            console.error("Gagal memperbarui data keluarga:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Terjadi kesalahan saat memperbarui data keluarga',
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeluargaDetail, selectedKeluargaId, biodataKeluargaId, nomorkk, hubungan, token, fetchKeluargaList]);
    
    return {
        error,
        nokk,
        keluargaList,
        id1,
        loadingKeluarga,
        selectedKeluargaId,
        selectedKeluargaDetail,
        loadingDetailKeluargaId,
        biodataKeluargaId,
        nomorkk,
        hubungan,
        setNokk,
        setSelectedKeluargaId,
        setSelectedKeluargaDetail,
        setBiodataKeluargaId,
        setNomorkk,
        setHubungan,
        fetchKeluargaList,
        handleCardClick,
        handleUpdate,
        setShowAddModal,
        setFeature
    };
};


