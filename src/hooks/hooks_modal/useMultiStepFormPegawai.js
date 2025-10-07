import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import useDropdownBerkas from "../hook_dropdown/DropdownBerkas";

const useMultiStepFormPegawai = (onClose, refetchData) => {
    const { jenisBerkasList } = useDropdownBerkas();
    const [activeTab, setActiveTab] = useState(0);
    const [unlockedTabs, setUnlockedTabs] = useState([0, 1, 2, 3, 4, 5]);
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm();

    const [selectedTinggal, setSelectedTinggal] = useState("");
    const [lainnyaValue, setLainnyaValue] = useState("");
    const isLainnya = selectedTinggal === "Lainnya";

    const watchedValues = watch();

    useEffect(() => {
        console.log("Data inputan berubah:", watchedValues);
    }, [watchedValues]);

    const nextStep = async () => {
        // const form = document.querySelector("form");
        // if (form && !form.reportValidity()) return;

        const valid = await trigger(getFieldsForTab(activeTab));
        if (!valid) return;

        const nextTab = activeTab + 1;
        if (!unlockedTabs.includes(nextTab)) {
            setUnlockedTabs([...unlockedTabs, nextTab]);
        }
        setActiveTab(nextTab);
    };

    const getFieldsForTab = (tabId) => {
        switch (tabId) {
            case 0:
                return [];
            case 1:
                return [];
            case 2:
                return [];
            case 3:
                return [];
            default:
                return [];
        }
    };

    const onValidSubmit = async (data) => {
        try {
            const confirmResult = await Swal.fire({
                title: "Yakin ingin mengirim data?",
                text: "Pastikan semua data sudah benar!",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya, kirim",
                cancelButtonText: "Batal",
            });

            if (!confirmResult.isConfirmed) return;
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

            const formData = new FormData();

            // === Append data dari modalPegawai (field utama) ===
            if (data.modalPegawai) {
                Object.entries(data.modalPegawai).forEach(([key, val]) => {
                    // Lewati mata_pelajaran karena akan diproses khusus
                    if (key === "mata_pelajaran") return;

                    if (val !== null && val !== undefined) {
                        formData.append(key, val);
                    }
                });
            }

            if (Array.isArray(data.modalPegawai.mata_pelajaran)) {
                data.modalPegawai.mata_pelajaran.forEach((mapel, index) => {
                    if (mapel.kode_mapel)
                        formData.append(
                            `mata_pelajaran[${index}][kode_mapel]`,
                            mapel.kode_mapel
                        );
                    if (mapel.nama_mapel)
                        formData.append(
                            `mata_pelajaran[${index}][nama_mapel]`,
                            mapel.nama_mapel
                        );
                });
            }

            // === Append file berkas ===
            const berkas = [];
            for (let i = 1; i <= 18; i++) {
                const fileKey = `file_${i}`;
                if (data.modalPegawai[fileKey]) {
                    berkas.push({
                        file: data.modalPegawai[fileKey],
                        jenis_berkas_id: i.toString(),
                    });
                }
            }

            berkas.forEach((b, i) => {
                formData.append(`berkas[${i}][jenis_berkas_id]`, b.jenis_berkas_id);
                formData.append(`berkas[${i}][file_path]`, b.file);
            });

            berkas.forEach((b, i) => {
                formData.append(`berkas[${i}][jenis_berkas_id]`, b.jenis_berkas_id);
                formData.append(`berkas[${i}][file_path]`, b.file);
            });

            for (var pair of formData.entries()) {
                console.log(pair[0] + ":", pair[1]);
            }

            console.log(
                "Payload yang dikirim ke API:",
                JSON.stringify(formData.mata_pelajaran, null, 2)
            );
            // === Eksekusi API ===
            const token = getCookie("token") || sessionStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}crud/pegawai`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            console.log(result);

            console.log(result);
            Swal.close();
            // === Cek response ===
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
                const errorMessages = [];

                // Tambahkan error dari `errors` jika ada
                if (result.errors) {
                    const formattedErrors = Object.entries(result.errors).map(
                        ([field, messages]) =>
                            `- ${field.replace(/_/g, " ")}: ${messages.join(", ")}`
                    );
                    errorMessages.push(...formattedErrors);
                }

                // Tambahkan error dari `error` (string tunggal)
                if (result.error) {
                    errorMessages.push(result.error);
                }

                // Tambahkan message umum
                if (result.message && errorMessages.length === 0) {
                    errorMessages.push(result.message);
                }

                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${errorMessages.join(
                        "<br>"
                    )}</div>`,
                });

                throw new Error(
                    result.message || result.error || "Gagal mengirim data"
                );
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: result.message,
            });

            const allFields = {
                ...Object.fromEntries(
                    Object.keys(data.modalPegawai || {}).map((key) => [key, ""])
                ),
                ...Object.fromEntries(
                    Array.from({ length: 18 }, (_, i) => [`file_${i + 1}`, null])
                ),
            };

            reset({ modalPegawai: allFields });
            setActiveTab(0); // kembali ke tab pertama
            setUnlockedTabs([0]);
            refetchData?.(true);
            onClose?.();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };

    const onInvalidSubmit = (errors) => {
        const fileErrors = Object.keys(errors)
            .filter((key) => key.startsWith("file_"))
            .map((key) => {
                const id = parseInt(key.split("_")[1], 10);
                const berkas = jenisBerkasList.find((item) => item.id === id);
                return `- ${berkas?.label || `Berkas ${id}`} wajib diisi`;
            });

        if (fileErrors.length > 0) {
            Swal.fire({
                icon: "warning",
                title: "Berkas wajib diunggah",
                html: `<pre style="text-align: left;">${fileErrors.join("<br>")}</pre>`,
            });
        }
    };

    const prevStep = () => {
        const prevTab = activeTab - 1;
        if (prevTab >= 0) setActiveTab(prevTab);
    };

    const resetData = () => {
        const currentModalPegawai = watch("modalPegawai") || {};
        setLainnyaValue("");
        setSelectedTinggal("");

        const allFields = {
            ...Object.fromEntries(
                Object.keys(currentModalPegawai).map((key) => [key, ""])
            ),
            ...Object.fromEntries(
                Array.from({ length: 18 }, (_, i) => [`file_${i + 1}`, null])
            ),
        };

        reset({ modalPegawai: allFields });
        setActiveTab(0); // kembali ke tab pertama
        setUnlockedTabs([0]);
    };

    return {
        register,
        handleSubmit,
        control,
        setValue,
        resetData,
        watch,
        errors,
        activeTab,
        unlockedTabs,
        setActiveTab,
        nextStep,
        prevStep,
        onValidSubmit,
        onInvalidSubmit,
        selectedTinggal,
        setSelectedTinggal,
        isLainnya,
        setLainnyaValue,
        lainnyaValue,
    };
};

export default useMultiStepFormPegawai;
