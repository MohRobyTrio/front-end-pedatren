import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export const useSantri = (biodata_id) => {
    const [santriList, setSantriList] = useState([]);
    const [selectedSantriId, setSelectedSantriId] = useState(null);
    const [selectedSantriDetail, setSelectedSantriDetail] = useState(null);
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");

    const [loadingSantri, setLoadingSantri] = useState(true);
    const [loadingDetailSantri, setLoadingDetailSantri] = useState(false);
    const [loadingUpdateSantri, setLoadingUpdateSantri] = useState(false);

    useEffect(() => {
        const fetchSantri = async () => {
            try {
                setLoadingSantri(true);
                const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/santri`);
                const result = await response.json();
                setSantriList(result.data || []);
            } catch (error) {
                console.error("Gagal mengambil data santri:", error);
            } finally {
                setLoadingSantri(false);
            }
        };

        if (biodata_id) fetchSantri();
    }, [biodata_id]);

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailSantri(true);
            const response = await fetch(`${API_BASE_URL}formulir/${id}/santri/show`);
            const result = await response.json();
            setSelectedSantriId(id);
            setSelectedSantriDetail(result.data);
            setEndDate(result.data.tanggal_keluar || "");
            setStartDate(result.data.tanggal_masuk || "");
        } catch (error) {
            console.error("Gagal mengambil detail santri:", error);
        } finally {
            setLoadingDetailSantri(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedSantriDetail) return;

        const payload = {
            nis: selectedSantriDetail.nis,
            tanggal_masuk: startDate,
            tanggal_keluar: endDate || null,
            status: selectedSantriDetail.status || null,
        };

        try {
            setLoadingUpdateSantri(true);
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedSantriId}/santri`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            const result = await response.json();
            if (response.ok) {
                alert("Data berhasil diperbarui!");
                setSelectedSantriDetail(result.data || payload);
            } else {
                alert("Gagal update: " + (result.message || "Terjadi kesalahan"));
            }
        } catch (error) {
            console.error("Error saat update:", error);
        } finally {
            setLoadingUpdateSantri(false);
        }
    };

    return {
        santriList,
        selectedSantriId,
        selectedSantriDetail,
        endDate,
        startDate,
        loadingSantri,
        loadingDetailSantri,
        loadingUpdateSantri,
        setEndDate,
        setStartDate,
        setSelectedSantriDetail,
        setSelectedSantriId,
        handleCardClick,
        handleUpdate,
    };
};
