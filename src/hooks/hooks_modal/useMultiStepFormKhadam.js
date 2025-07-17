import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

export function useMultiStepFormKhadam(onClose, refetchData) {
    const [activeTab, setActiveTab] = useState(0);
    const [unlockedTabs, setUnlockedTabs] = useState([0]);
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

    const [selectedTinggal, setSelectedTinggal] = useState('');
    const [lainnyaValue, setLainnyaValue] = useState('');
    const isLainnya = selectedTinggal === 'Lainnya';

    const watchedValues = watch();

    useEffect(() => {
        console.log("Data inputan berubah:", watchedValues);
    }, [watchedValues]);

    const nextStep = async () => {
        const form = document.querySelector("form");
        if (form && !form.reportValidity()) return;

        const valid = await trigger(getFieldsForTab(activeTab));
        if (!valid) return;

        const nextTab = activeTab + 1;
        if (!unlockedTabs.includes(nextTab)) {
            setUnlockedTabs([...unlockedTabs, nextTab]);
        }
        setActiveTab(nextTab);
    };

    const prevStep = () => {
        const prevTab = activeTab - 1;
        if (prevTab >= 0) setActiveTab(prevTab);
    };

    const getFieldsForTab = (tabId) => {
        switch (tabId) {
            case 0:
            case 1:
            case 2:
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

            const token = getCookie("token") || sessionStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}crud/khadam`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data.modalKhadam),
            });

            Swal.close();
            const result = await response.json();
            console.log(result);
            

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
                const errorMessages = result.errors
                    ? Object.entries(result.errors).map(
                        ([field, messages]) =>
                            `- ${field.replace(/_/g, " ")}: ${messages.join(", ")}`
                    )
                    : [result.message ?? "Gagal mengirim data"];
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${errorMessages.join("<br>")}</div>`,
                });
                throw new Error(result.message);
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            reset({ modalKhadam: {} });
            setActiveTab(0);
            setUnlockedTabs([0]);
            refetchData?.(true);
            onClose?.();

        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };

    const onInvalidSubmit = (errors) => {
        console.log("Form tidak valid:", errors);
        Swal.fire({
            icon: "warning",
            title: "Validasi Gagal",
            text: "Periksa kembali data yang diisi.",
        });
    };

    const resetData = () => {
        reset({ modalKhadam: {} });
        setLainnyaValue('')
        setSelectedTinggal('')
        setActiveTab(0);
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
        lainnyaValue
    };
}
