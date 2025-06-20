import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../hooks/config";
import { getCookie } from "../../../utils/cookieUtils";
import DropdownNegara from "../../../hooks/hook_dropdown/DropdownNegara";
import useLogout from "../../../hooks/Logout";
import { useNavigate } from "react-router-dom";

const initialFormData = {
    // Alamat
    negara: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    jalan: "",
    kode_pos: "",

    // Biodata
    nama: "",
    no_passport: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    nik: "",
    no_telepon: "",
    no_telepon_2: "",
    email: "",
    jenjang_pendidikan_terakhir: "",
    nama_pendidikan_terakhir: "",
    anak_keberapa: "",
    dari_saudara: "",
    wafat: "0", // Default value

    // Keluarga
    no_kk: "",

    // Orangtua
    id_hubungan_keluarga: "",
    wali: false, // Default value
    pekerjaan: "",
    penghasilan: ""
};

export const ModalAddOrangtuaFormulir = ({ isOpen, onClose, refetchData }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();

    const [formData, setFormData] = useState(initialFormData);
    const [hubunganKeluargaOptions, setHubunganKeluargaOptions] = useState([]);

    // Fetch hubungan keluarga
    useEffect(() => {
        const fetchHubunganKeluarga = async () => {
            try {
                const token = sessionStorage.getItem("token") || getCookie("token");
                const response = await fetch(`${API_BASE_URL}dropdown/hubungan`, {
                    headers: {
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
                if (response.ok) {
                    const data = await response.json();
                    setHubunganKeluargaOptions(data.map(item => ({
                        value: item.id,
                        label: item.nama_status
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch hubungan keluarga:", error);
            }
        };

        if (isOpen) {
            fetchHubunganKeluarga();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Update formData untuk alamat ketika selectedNegara berubah
    useEffect(() => {
        // (selectedNegara mungkin di-update oleh handleClose yang juga mereset formData)
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                negara: selectedNegara.negara || "",
                provinsi: selectedNegara.provinsi || "",
                kabupaten: selectedNegara.kabupaten || "",
                kecamatan: selectedNegara.kecamatan || ""
            }));
        }
    }, [selectedNegara, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            'negara', 'jalan',
            'nama', 'tanggal_lahir', 'jenis_kelamin', 'tempat_lahir', 'email',
            'id_hubungan_keluarga', 'wafat'
        ];
        const isEmpty = requiredFields.some(field => !formData[field]);
        if (isEmpty) {
            await Swal.fire({
                icon: "error",
                title: "Data tidak lengkap",
                text: "Harap isi semua field yang wajib diisi.",
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            await Swal.fire({
                icon: "error",
                title: "Email tidak valid",
                text: "Harap masukkan email yang valid.",
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin menambahkan data orangtua?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Tambah",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}formulir/orangtua`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            //debugging logs
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);
            console.log("payload:", JSON.stringify(formData, null, 2));
            console.log("formdata:", formData);





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

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data orangtua berhasil ditambahkan.",
            });

            setFormData(initialFormData); // Reset form setelah berhasil submit
            handleFilterChangeNegara({ // Reset dropdown negara juga
                negara: "",
                provinsi: "",
                kabupaten: "",
                kecamatan: ""
            });
            refetchData?.();
            onClose?.(); // Tutup modal
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Terjadi kesalahan saat mengirim data.",
            });
        }
    };

    // Fungsi untuk menangani penutupan modal dan mereset form
    const handleClose = () => {
        setFormData(initialFormData); // Reset formData
        handleFilterChangeNegara({
            negara: "",
            provinsi: "",
            kabupaten: "",
            kecamatan: ""
        });
        // Panggil fungsi onClose asli dari props untuk menutup modal
        if (onClose) {
            onClose();
        }
    };


    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const updatedFilterNegara = {
        negara: updateFirstOptionLabel(filterNegara.negara, "Pilih Negara"),
        provinsi: updateFirstOptionLabel(filterNegara.provinsi, "Pilih Provinsi"),
        kabupaten: updateFirstOptionLabel(filterNegara.kabupaten, "Pilih Kabupaten"),
        kecamatan: updateFirstOptionLabel(filterNegara.kecamatan, "Pilih Kecamatan")
    };

    const Filters = ({ filterOptions, onChange, selectedFilters }) => {
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        return (
            <div className="space-y-2">
                {Object.entries(filterOptions).map(([label, options], index) => (
                    <div
                        key={`${label}-${index}`}
                        className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4"
                    >
                        <label htmlFor={label} className="md:w-1/4 text-black">
                            {capitalize(label)} *
                        </label>
                        <div className="md:w-full md:max-w-md max-w-none">
                            <div
                                className={`flex items-center rounded-md shadow-md border border-gray-300 border-gray-500 ${options.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                    }`}
                            >
                                <select
                                    id={label}
                                    name={label}
                                    required
                                    disabled={options.length <= 1}
                                    className={`w-full py-1.5 pr-3 pl-1 text-base focus:outline-none sm:text-sm ${options.length <= 1 ? "text-gray-500" : ""
                                        }`}
                                    value={selectedFilters[label] || ""}
                                    onChange={(e) => onChange({ [label]: e.target.value })}
                                >
                                    {options.map((option, idx) => (
                                        <option key={idx} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            {/* Ganti onClose dengan handleClose */}
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-300 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-2xl sm:align-middle max-h-[90vh]">
                            <button
                                onClick={handleClose} // Ganti onClose dengan handleClose
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                            >
                                                Tambah Data Orangtua
                                            </Dialog.Title>

                                            <div className="space-y-4">
                                                {/* Biodata Section */}
                                                <div>
                                                    <h4 className="text-md font-semibold mb-2">Biodata Orangtua</h4>
                                                    <div className="space-y-4 pl-4">
                                                        {/* ... (input fields lainnya tetap sama) ... */}
                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="no_passport" className="md:w-1/4 text-black">
                                                                Nomor Passport
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="no_passport"
                                                                        name="no_passport"
                                                                        type="text"
                                                                        value={formData.no_passport}
                                                                        onChange={handleChange}
                                                                        maxLength={16}
                                                                        placeholder="Masukkan No.Passport"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="no_kk" className="md:w-1/4 text-black">
                                                                Nomor KK
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="no_kk"
                                                                        name="no_kk"
                                                                        type="text"
                                                                        value={formData.no_kk}
                                                                        onChange={handleChange}
                                                                        maxLength={16}
                                                                        placeholder="Masukkan No.KK"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="nik" className="md:w-1/4 text-black">
                                                                NIK
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="nik"
                                                                        name="nik"
                                                                        type="text"
                                                                        value={formData.nik}
                                                                        onChange={handleChange}
                                                                        maxLength={16}
                                                                        placeholder="Masukkan NIK"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="nama" className="md:w-1/4 text-black">
                                                                Nama Lengkap *
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="nama"
                                                                        name="nama"
                                                                        type="text"
                                                                        value={formData.nama}
                                                                        onChange={handleChange}
                                                                        placeholder="Masukkan Nama Lengkap"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label className="md:w-1/4 text-black">
                                                                Jenis Kelamin *
                                                            </label>
                                                            <div className="flex space-x-4">
                                                                <label className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="jenis_kelamin"
                                                                        value="l"
                                                                        checked={formData.jenis_kelamin === 'l'}
                                                                        onChange={handleChange}
                                                                        className="w-4 h-4"
                                                                        required
                                                                    />
                                                                    <span>Laki-laki</span>
                                                                </label>
                                                                <label className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="jenis_kelamin"
                                                                        value="p"
                                                                        checked={formData.jenis_kelamin === 'p'}
                                                                        onChange={handleChange}
                                                                        className="w-4 h-4"
                                                                        required
                                                                    />
                                                                    <span>Perempuan</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="tempat_lahir" className="md:w-1/4 text-black">
                                                                Tempat Lahir *
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="tempat_lahir"
                                                                        name="tempat_lahir"
                                                                        type="text"
                                                                        value={formData.tempat_lahir}
                                                                        onChange={handleChange}
                                                                        placeholder="Masukkan Tempat Lahir"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="tanggal_lahir" className="md:w-1/4 text-black">
                                                                Tanggal Lahir *
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        type="date"
                                                                        id="tanggal_lahir"
                                                                        name="tanggal_lahir"
                                                                        value={formData.tanggal_lahir}
                                                                        onChange={handleChange}
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Anak Ke */}
                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="anak_keberapa" className="md:w-1/4 text-black">
                                                                Anak Ke *
                                                            </label>
                                                            <div className="flex space-x-4">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="anak_keberapa"
                                                                        name="anak_keberapa"
                                                                        type="number"
                                                                        min="1"
                                                                        value={formData.anak_keberapa}
                                                                        onChange={handleChange}
                                                                        className="w-13 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                        required
                                                                    />
                                                                </div>
                                                                <span>Dari</span>
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="dari_saudara"
                                                                        name="dari_saudara"
                                                                        type="number"
                                                                        min="1"
                                                                        value={formData.dari_saudara}
                                                                        onChange={handleChange}
                                                                        className="w-13 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="email" className="md:w-1/4 text-black">
                                                                Email *
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="email"
                                                                        name="email"
                                                                        type="email"
                                                                        value={formData.email}
                                                                        onChange={handleChange}
                                                                        placeholder="Masukkan Email"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="no_telepon" className="md:w-1/4 text-black">
                                                                No Telepon 1
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="no_telepon"
                                                                        name="no_telepon"
                                                                        type="tel"
                                                                        value={formData.no_telepon}
                                                                        onChange={handleChange}
                                                                        maxLength={20}
                                                                        placeholder="Masukkan No Telepon"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="no_telepon_2" className="md:w-1/4 text-black">
                                                                No Telepon 2
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="no_telepon_2"
                                                                        name="no_telepon_2"
                                                                        type="tel"
                                                                        value={formData.no_telepon_2}
                                                                        onChange={handleChange}
                                                                        maxLength={20}
                                                                        placeholder="Masukkan No Telepon 2"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="jenjang_pendidikan_terakhir" className="md:w-1/4 text-black">
                                                                Jenjang Pendidikan Terakhir
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <select
                                                                        id="jenjang_pendidikan_terakhir"
                                                                        name="jenjang_pendidikan_terakhir"
                                                                        value={formData.jenjang_pendidikan_terakhir}
                                                                        onChange={handleChange}
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                                                    >
                                                                        <option value="">Pilih</option>
                                                                        <option value="paud">Paud</option>
                                                                        <option value="sd/mi">SD/MI</option>
                                                                        <option value="smp/mts">SMP/MTS</option>
                                                                        <option value="sma/smk/ma">SMA/SMK/MA</option>
                                                                        <option value="d3">D3</option>
                                                                        <option value="d4">D4</option>
                                                                        <option value="s1">S1</option>
                                                                        <option value="s2">S2</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="nama_pendidikan_terakhir" className="md:w-1/4 text-black">
                                                                Nama Pendidikan Terakhir
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="nama_pendidikan_terakhir"
                                                                        name="nama_pendidikan_terakhir"
                                                                        type="text"
                                                                        value={formData.nama_pendidikan_terakhir}
                                                                        onChange={handleChange}
                                                                        placeholder="Masukkan Nama Pendidikan Terakhir"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr className="border-t border-gray-300 my-4" />

                                                {/* Orangtua Section */}
                                                <div>
                                                    <h4 className="text-md font-semibold mb-2">Data Orangtua</h4>
                                                    <div className="space-y-4 pl-4">
                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="id_hubungan_keluarga" className="md:w-1/4 text-black">
                                                                Hubungan Keluarga *
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <select
                                                                        id="id_hubungan_keluarga"
                                                                        name="id_hubungan_keluarga"
                                                                        value={formData.id_hubungan_keluarga}
                                                                        onChange={handleChange}
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                                                                    >
                                                                        <option value="">Pilih Hubungan</option>
                                                                        {hubunganKeluargaOptions.map((option, index) => (
                                                                            <option key={index} value={option.value}>
                                                                                {option.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="wali" className="md:w-1/4 text-black">
                                                                Wali
                                                            </label>
                                                            <div className="flex items-center">
                                                                <input
                                                                    id="wali"
                                                                    name="wali"
                                                                    type="checkbox"
                                                                    checked={formData.wali}
                                                                    onChange={handleChange}
                                                                    className="w-4 h-4"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="pekerjaan" className="md:w-1/4 text-black">
                                                                Pekerjaan
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="pekerjaan"
                                                                        name="pekerjaan"
                                                                        type="text"
                                                                        value={formData.pekerjaan}
                                                                        onChange={handleChange}
                                                                        placeholder="Masukkan Pekerjaan"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="penghasilan" className="md:w-1/4 text-black">
                                                                Penghasilan
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="penghasilan"
                                                                        name="penghasilan"
                                                                        type="text"
                                                                        value={formData.penghasilan}
                                                                        onChange={handleChange}
                                                                        placeholder="Masukkan Penghasilan"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <hr className="border-t border-gray-300 my-4" />

                                                {/* Alamat Section */}
                                                <div>
                                                    <h4 className="text-md font-semibold mb-2">Alamat</h4>
                                                    <div className="space-y-4 pl-4">
                                                        <Filters
                                                            filterOptions={updatedFilterNegara}
                                                            onChange={handleFilterChangeNegara}
                                                            selectedFilters={selectedNegara}
                                                        />

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="jalan" className="md:w-1/4 text-black">
                                                                Jalan *
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="jalan"
                                                                        name="jalan"
                                                                        type="text"
                                                                        value={formData.jalan}
                                                                        onChange={handleChange}
                                                                        placeholder="Masukkan Nama Jalan"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                        required
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label htmlFor="kode_pos" className="md:w-1/4 text-black">
                                                                Kode Pos
                                                            </label>
                                                            <div className="md:w-full md:max-w-md max-w-none">
                                                                <div className="flex items-center rounded-md shadow-md bg-white pl-1 border border-gray-300 border-gray-500">
                                                                    <input
                                                                        id="kode_pos"
                                                                        name="kode_pos"
                                                                        type="text"
                                                                        value={formData.kode_pos}
                                                                        onChange={handleChange}
                                                                        maxLength={10}
                                                                        placeholder="Masukkan Kode Pos"
                                                                        className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                                            <label className="md:w-1/4 text-black">
                                                                Wafat *
                                                            </label>
                                                            <div className="flex space-x-4">
                                                                <label className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="wafat"
                                                                        value="0"
                                                                        checked={formData.wafat === "0"}
                                                                        onChange={handleChange}
                                                                        className="w-4 h-4"
                                                                        required
                                                                    />
                                                                    <span>Tidak</span>
                                                                </label>
                                                                <label className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        name="wafat"
                                                                        value="1"
                                                                        checked={formData.wafat === "1"}
                                                                        onChange={handleChange}
                                                                        className="w-4 h-4"
                                                                        required
                                                                    />
                                                                    <span>Ya</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Tambah Data
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClose} // Ganti onClose dengan handleClose
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export const ModalFormPindahKeluarga = ({
    isOpen,
    onClose,
    id,
    refetchData
}) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        no_kk: ""
    });

    const validateKK = (kk) => {
        // Validasi: 16 digit angka
        const kkRegex = /^\d{16}$/;
        return kkRegex.test(kk);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi format KK
        if (!validateKK(formData.no_kk)) {
            await Swal.fire({
                icon: "error",
                title: "Format KK Tidak Valid",
                text: "Nomor KK harus terdiri dari 16 digit angka",
            });
            return;
        }

        // Verifikasi pertama
        const confirmResult1 = await Swal.fire({
            title: "Anda yakin dengan nomor KK baru?",
            text: `Nomor KK baru: ${formData.no_kk}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, lanjutkan",
            cancelButtonText: "Periksa kembali",
        });

        if (!confirmResult1.isConfirmed) return;

        // Verifikasi kedua
        const confirmResult2 = await Swal.fire({
            title: "Konfirmasi Terakhir",
            html: `<div style="text-align: left;">
                     <p>Anda akan memindahkan keluarga ke KK baru:</p>
                     <p><strong>${formData.no_kk}</strong></p>
                     <p>Pastikan data sudah benar!</p>
                   </div>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, saya yakin",
            cancelButtonText: "Batal",
        });

        if (!confirmResult2.isConfirmed) return;

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
            const response = await fetch(`${API_BASE_URL}formulir/${id}/keluarga/pindah`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
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
            Swal.close();

            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return;
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Keluarga berhasil dipindahkan ke KK ${formData.no_kk}`,
            });

            refetchData?.();
            onClose?.();
            setFormData({ no_kk: "" }); // Reset form
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: `Terjadi kesalahan saat memproses data. ${error.message}`,
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                {/* Background overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal content wrapper */}
                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-300 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                            >
                                                Pindah Keluarga ke KK Baru
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="no_kk" className="block text-gray-700">
                                                        Nomor KK Baru *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="no_kk"
                                                        name="no_kk"
                                                        value={formData.no_kk}
                                                        onChange={(e) => setFormData({ ...formData, no_kk: e.target.value })}
                                                        required
                                                        placeholder="Masukkan 16 digit nomor KK"
                                                        maxLength={16}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Harus terdiri dari 16 digit angka
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Proses Pemindahan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};