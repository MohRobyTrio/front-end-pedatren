import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

export function useMultiStepFormPesertaDidik(onClose, jenisBerkasList, refetchData) {
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

    const [inputLainnyaAyah, setInputLainnyaAyah] = useState("");
    const [dropdownValueAyah, setDropdownValueAyah] = useState("");

    
    const [inputLainnyaIbu, setInputLainnyaIbu] = useState("");
    const [dropdownValueIbu, setDropdownValueIbu] = useState("");
    
    
    const [inputLainnyaWali, setInputLainnyaWali] = useState("");
    const [dropdownValueWali, setDropdownValueWali] = useState("");

    const watchedValues = watch();

    useEffect(() => {
        console.log("Data inputan berubah:", watchedValues);
    }, [watchedValues]);

    const nextStep = async () => {
        const form = document.querySelector("form");
        if (form && !form.reportValidity()) return;

        const valid = await trigger(getFieldsForTab(activeTab));
        if (!valid) return;

        if (activeTab === 1) {
            const nikAyah = watch("modalPeserta.nik_ayah");
            const nikIbu = watch("modalPeserta.nik_ibu");
            

            if (nikAyah && nikIbu && nikAyah === nikIbu) {
                Swal.fire({
                    icon: 'warning',
                    title: 'NIK Ayah dan Ibu Sama',
                    text: 'Silakan periksa kembali, NIK Ayah dan Ibu tidak boleh sama.',
                    confirmButtonText: 'Oke'
                });
                return; // hentikan jika validasi gagal
            }
        }

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
        const missingFiles = jenisBerkasList
            .filter(jb => jb.required)
            .filter(jb => !data.modalPeserta?.[`file_${jb.id}`]);

        if (missingFiles.length > 0) {
            Swal.fire({
            icon: "warning",
            title: "Berkas wajib diunggah",
            html: missingFiles.map(f => `- ${f.label}`).join("<br>")
            });
            return;
        }

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

            const formData = new FormData();
            // Append all form data (singkat)
            if (data.modalPeserta) {
                Object.entries(data.modalPeserta).forEach(([key, val]) => {
                if (!key.startsWith("file_")) {
                    formData.append(key, val);
                }
                });
            }

            const berkas = [];
            for (let i = 1; i <= 18; i++) {
                const fileKey = `file_${i}`;
                if (data.modalPeserta[fileKey]) {
                    berkas.push({ file: data.modalPeserta[fileKey], jenis_berkas_id: i.toString() });
                }
            }

            berkas.forEach((b, i) => {
                console.log(`berkas[${i}][jenis_berkas_id]:`, b.jenis_berkas_id);
                console.log(`berkas[${i}][file_path]:`, b.file);
            });

            berkas.forEach((b, i) => {
                formData.append(`berkas[${i}][jenis_berkas_id]`, b.jenis_berkas_id);
                formData.append(`berkas[${i}][file_path]`, b.file);
            });

            for (var pair of formData.entries()) {
                console.log(pair[0]+ ':', pair[1]);
            }

            const token = getCookie("token") || sessionStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}crud/pesertadidik`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
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
                : result.error
                    ? [`- ${result.error}`]
                        : [result.message || "Gagal mengirim data"];

                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${errorMessages.join(
                        "<br>"
                    )}</div>`,
                });

                throw new Error(result.message);
            }            
            

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            const allFields = {
                ...Object.fromEntries(Object.keys(data.modalPeserta || {}).map(key => [key, ""])),
                ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [`file_${i + 1}`, null]))
            };

            reset({ modalPeserta: allFields });

            refetchData?.(true);
            onClose?.();
            resetData();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    };

    const onInvalidSubmit = (errors) => {
        console.log(errors);
        
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

    const resetData = () => {
        const currentModalPeserta = watch("modalPeserta") || {};
        setLainnyaValue('')
        setSelectedTinggal('')
        setDropdownValueAyah('')
        setDropdownValueIbu('')
        setDropdownValueWali('')
        setInputLainnyaAyah('')
        setInputLainnyaIbu('')
        setInputLainnyaWali('')

        const allFields = {
            ...Object.fromEntries(Object.keys(currentModalPeserta).map(key => [key, ""])),
            ...Object.fromEntries(Array.from({ length: 18 }, (_, i) => [`file_${i + 1}`, null]))
        };

        reset({ modalPeserta: allFields });
        setActiveTab(0);               // kembali ke tab pertama
        setUnlockedTabs([0]);  
    }

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
        dropdownValue: {
            ayah: dropdownValueAyah,
            ibu: dropdownValueIbu,
            wali: dropdownValueWali
        },
        setDropdownValue: {
            ayah: setDropdownValueAyah,
            ibu: setDropdownValueIbu,
            wali: setDropdownValueWali
        },
        inputLainnya: {
            ayah: inputLainnyaAyah,
            ibu: inputLainnyaIbu,
            wali: inputLainnyaWali
        },
        setInputLainnya: {
            ayah: setInputLainnyaAyah,
            ibu: setInputLainnyaIbu,
            wali: setInputLainnyaWali
        }
    };
}
