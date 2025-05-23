import { useEffect, useState } from "react";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";

export const useKhadam = ({ biodata_id, setSelectedKhadamData, setShowAddModal, setFeature }) => {
    const [khadamList, setKhadamList] = useState([]);
    const [loadingKhadam, setLoadingKhadam] = useState(false);
    const [loadingDetailKhadamId, setLoadingDetailKhadamId] = useState(null);
    const [loadingUpdateKhadam, setLoadingUpdateKhadam] = useState(false);

    const [selectedKhadamId, setSelectedKhadamId] = useState(null);
    const [selectedKhadamDetail, setSelectedKhadamDetail] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [keterangan, setKeterangan] = useState("");

    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const fetchKhadam = async () => {
            try {
                setLoadingKhadam(true);
                const response = await fetch(`${API_BASE_URL}formulir/${biodata_id}/khadam`);
                const result = await response.json();
                setKhadamList(result.data || []);
            } catch (error) {
                console.error("Gagal mengambil data Khadam:", error);
            } finally {
                setLoadingKhadam(false);
            }
        };
        if (biodata_id) fetchKhadam();
    }, [biodata_id]);

    const handleCardClick = async (id) => {
        try {
            setLoadingDetailKhadamId(id);
            const response = await fetch(`${API_BASE_URL}formulir/${id}/khadam/show`);
            const result = await response.json();
            setSelectedKhadamId(id);
            setSelectedKhadamDetail(result.data);
            setEndDate(result.data.tanggal_akhir || "");
            setStartDate(result.data.tanggal_mulai || "");
            setKeterangan(result.data.keterangan || "");
        } catch (error) {
            console.error("Gagal mengambil detail Khadam:", error);
        } finally {
            setLoadingDetailKhadamId(null);
        }
    };

    const handleUpdate = async () => {
        if (!selectedKhadamDetail) return;

        const payload = {
            keterangan: keterangan || null,
            tanggal_mulai: startDate,
        };

        try {
            setLoadingUpdateKhadam(true);
            const response = await fetch(
                `${API_BASE_URL}formulir/${selectedKhadamId}/khadam`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                }
            );
            const result = await response.json();
            if (response.ok) {
                alert(`Data berhasil diperbarui! : ${result.message}`);
                setSelectedKhadamDetail(result.data || payload);
            } else {
                alert("Gagal update: " + (result.message || "Terjadi kesalahan"));
            }
        } catch (error) {
            console.error("Error saat update:", error);
        } finally {
            setLoadingUpdateKhadam(false);
        }
    };

    const handleOpenAddModalWithDetail = async (id, featureNum) => {
        try {
            const response = await fetch(`${API_BASE_URL}formulir/${id}/khadam/show`);
            const result = await response.json();
            setSelectedKhadamId(id);
            setSelectedKhadamData(result.data);
            setFeature(featureNum);
            setShowAddModal(true);
        } catch (error) {
            console.error("Gagal mengambil detail Khadam:", error);
        }
    };

    return {
        khadamList,
        loadingKhadam,
        handleCardClick,
        loadingDetailKhadamId,
        selectedKhadamDetail,
        setSelectedKhadamDetail,
        selectedKhadamId,
        setSelectedKhadamId,
        startDate,
        endDate,
        keterangan,
        setStartDate,
        setEndDate,
        setKeterangan,
        handleUpdate,
        loadingUpdateKhadam,
        handleOpenAddModalWithDetail
    };
};
