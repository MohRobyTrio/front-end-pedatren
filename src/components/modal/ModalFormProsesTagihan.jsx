import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Combobox } from '@headlessui/react';
import { FaTimes, FaUsers } from 'react-icons/fa';
import useDropdownSantri from '../../hooks/hook_dropdown/DropdownSantri';
import Swal from 'sweetalert2';
import { getCookie } from '../../utils/cookieUtils';
import { API_BASE_URL } from '../../hooks/config';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/Logout';
import { Check, ChevronsUpDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import useFetchTagihan from '../../hooks/hooks_menu_pembayaran/tagihan';
import { OrbitProgress } from 'react-loading-indicators';

export const ModalAddOrEditTagihanSantri = ({ isOpen, onClose, refetchData }) => {
    const [formData, setFormData] = useState({
        tagihan_id: '',
        santri_ids: [],
        periode: '',
        jenis_kelamin: '',
        all: null,
    });

    const navigate = useNavigate();
    const { clearAuthData } = useLogout()
    const { menuSantri } = useDropdownSantri()
    const { tagihan, fetchTagihan } = useFetchTagihan()
    const [errors, setErrors] = useState({});
    const [tagihanQuery, setTagihanQuery] = useState('');
    const [santriQuery, setSantriQuery] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [activeTab, setActiveTab] = useState('otomatis'); // 'tahfidz' or 'nadhoman'
    const [monthInputValue, setMonthInputValue] = useState('');

    const mockSantri = menuSantri.slice(1);
    const mockTagihan = tagihan

    useEffect(() => {
        if (isOpen) {
            fetchTagihan()
            setFormData({
                tagihan_id: '',
                santri_ids: [],
                periode: '',
                jenis_kelamin: '',
                all: null
            });
            setErrors({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Filter tagihan based on search query
    const filteredTagihan = tagihanQuery === ''
        ? mockTagihan
        : mockTagihan.filter((tagihan) =>
            tagihan.nama_tagihan.toLowerCase().includes(tagihanQuery.toLowerCase()) ||
            tagihan.nominal.toLowerCase().includes(tagihanQuery.toLowerCase())
        );

    // Filter santri based on search query
    const filteredSantri = santriQuery === ''
        ? mockSantri
        : mockSantri.filter((santri) =>
            santri.label.toLowerCase().includes(santriQuery.toLowerCase()) ||
            santri.nis.toLowerCase().includes(santriQuery.toLowerCase()) ||
            santri.wilayah.toLowerCase().includes(santriQuery.toLowerCase())
        );

    const selectedTagihan = mockTagihan.find(p => p.id == formData.tagihan_id);
    const selectedSantri = mockSantri.filter(s => formData.santri_ids.includes(s.id));

    useEffect(() => {
        console.log("data santri", selectedTagihan);

    }, [selectedTagihan])

    const validateForm = () => {
        const newErrors = {};

        // Tagihan wajib dipilih
        if (!formData.tagihan_id) {
            newErrors.tagihan_id = "Tagihan harus dipilih";
        }

        if (!formData.periode) {
            newErrors.periode = "Periode harus diisi";
        } else if (formData.periode.length > 20) {
            newErrors.periode = "Periode tidak boleh lebih dari 20 karakter";
        }

        if (formData.all == 0) {
            // Manual → minimal pilih 1 santri
            if (!formData.santri_ids || formData.santri_ids.length === 0) {
                newErrors.santri_ids = "Minimal satu santri harus dipilih";
            }
        }
        // } else if (activeTab === "otomatis") {
        // Otomatis → periode & jenis kelamin wajib
        // if (!formData.jenis_kelamin) {
        //     newErrors.jenis_kelamin = "Jenis kelamin harus dipilih";
        // }
        // }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            // gabungkan semua pesan error biar rapih
            const pesanError = Object.values(newErrors).join("<br/>");
            Swal.fire({
                icon: "error",
                title: "Validasi Gagal",
                html: pesanError, // pakai html biar bisa line break
                confirmButtonText: "OK"
            });
            return false;
        }

        return true;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
            // onClose();
        }
    };

    const onSubmit = async () => {
        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
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

            // Tentukan URL dan method berdasarkan feature
            const url = activeTab == "otomatis" ? `${API_BASE_URL}tagihan-santri/generate` : `${API_BASE_URL}tagihan-santri/generate-manual`;

            const method = "POST";

            // Tentukan data yang dikirim
            const payload = {
                tagihan_id: formData.tagihan_id,
                periode: formData.periode,
                ...(activeTab === 'otomatis' ? { jenis_kelamin: formData.jenis_kelamin, } : { santri_ids: formData.santri_ids, })
            };
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            Swal.close();
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
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join("\n");

                    await Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        text: errorMessages,
                    });

                    return;
                }

                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            refetchData?.();
            onClose?.();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Terjadi kesalahan saat mengirim data.",
            });
        }
    };

    const handleSantriToggle = (santriId) => {
        setFormData(prev => ({
            ...prev,
            santri_ids: prev.santri_ids.includes(santriId)
                ? prev.santri_ids.filter(id => id !== santriId)
                : [...prev.santri_ids, santriId]
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // const CardHeader = ({ children }) => <div className="px-6 py-4 border-b border-gray-200">{children}</div>

    // function Button({ children, variant = "default", onClick, className = "" }) {
    //     const variants = {
    //         default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    //         ghost: "bg-transparent text-gray-600 hover:bg-gray-200",
    //     }

    //     return (
    //         <button
    //             onClick={onClick}
    //             className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${variants[variant]} ${className}`}
    //         >
    //             {children}
    //         </button>
    //     )
    // }

    const formatKategori = (kategori) => {
        const map = {
            anak_pegawai: "Anak Pegawai",
            bersaudara: "Bersaudara",
            khadam: "Khadam",
            umum: "Umum",
        }
        return map[kategori] || kategori?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || kategori || "-"
    }

    const handlePeriodeChange = (e) => {
        const inputValue = e.target.value; // Nilainya adalah "YYYY-MM"
        setMonthInputValue(inputValue);

        if (inputValue) {
            const [year, month] = inputValue.split('-');
            const dateObject = new Date(year, month - 1, 1);
            const formattedPeriode = dateObject.toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric'
            }).toUpperCase();

            // Simpan format yang sudah benar ke state utama
            setFormData(prevData => ({
                ...prevData,
                periode: formattedPeriode
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                periode: ''
            }));
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
                        leave="transition-transform duration-200 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block w-full max-w-2xl sm:align-middle bg-white rounded-lg shadow-xl text-left transform transition-all overflow-hidden">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes className="text-lg" />
                            </button>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
                                {/* Header */}
                                <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-semibold text-gray-900 text-center"
                                    >
                                        {"Tambah Tagihan Santri"}
                                    </Dialog.Title>
                                </div>

                                {/* <CardHeader className="pb-4">
                                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                                        <Button
                                            variant={activeTab === "otomatis" ? "default" : "ghost"}
                                            onClick={() => setActiveTab("otomatis")}
                                            className="flex-1 rounded-md"
                                        >
                                            <Filter className="h-4 w-4 mr-2" />
                                            Otomatis
                                        </Button>
                                        <Button
                                            variant={activeTab === "manual" ? "default" : "ghost"}
                                            onClick={() => setActiveTab("manual")}
                                            className="flex-1 rounded-md"
                                        >
                                            <Users className="h-4 w-4 mr-2" />
                                            Manual
                                        </Button>
                                    </div>
                                </CardHeader> */}

                                {/* Isi Form (scrollable) */}
                                <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Jenis Tagihan <span className="text-red-500">*</span>
                                        </label>

                                        <Combobox
                                            value={formData.tagihan_id}
                                            onChange={(value) =>
                                                setFormData((prev) => ({ ...prev, tagihan_id: value }))
                                            }
                                        >
                                            <div className="relative">
                                                {/* Input */}
                                                <Combobox.Input
                                                    className={`w-full rounded-md border ${errors?.tagihan_id
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        } bg-white py-2 px-3 text-sm text-gray-900 focus:outline-none transition-all duration-200`}
                                                    displayValue={() =>
                                                        selectedTagihan
                                                            ? `${selectedTagihan.nama_tagihan} - ${formatCurrency(
                                                                selectedTagihan.nominal
                                                            )}`
                                                            : ""
                                                    }
                                                    onChange={(event) => setTagihanQuery(event.target.value)}
                                                    placeholder="Pilih jenis tagihan..."
                                                />

                                                {/* Tombol dropdown */}
                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                                                </Combobox.Button>

                                                {/* Dropdown options */}
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                        {filteredTagihan.length === 0 ? (
                                                            <div className="cursor-default select-none py-2 px-4 text-gray-500">
                                                                Tidak ditemukan
                                                            </div>
                                                        ) : (
                                                            filteredTagihan.map((option) => (
                                                                <Combobox.Option
                                                                    key={option.id}
                                                                    className={({ active }) =>
                                                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                                        }`
                                                                    }
                                                                    value={option.id}
                                                                >
                                                                    {({ selected }) => (
                                                                        <>
                                                                            <span
                                                                                className={`block truncate ${selected ? "font-medium" : "font-normal"
                                                                                    }`}
                                                                            >
                                                                                {option.nama_tagihan} -{" "}
                                                                                {formatCurrency(option.nominal)}
                                                                            </span>
                                                                            {selected && (
                                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                                    <Check className="h-5 w-5" />
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </Combobox.Option>
                                                            ))
                                                        )}
                                                    </Combobox.Options>
                                                </Transition>
                                            </div>
                                        </Combobox>

                                        {/* Tambahan keterangan potongan */}
                                        {selectedTagihan?.potongans?.length > 0 && (
                                            <div className="mt-1 text-xs text-gray-600 border rounded-md p-2 bg-gray-50">
                                                <p className="font-medium text-gray-800 mb-1">Potongan terkait:</p>
                                                <ul className="list-disc list-inside space-y-0.5">
                                                    {selectedTagihan.potongans.map((p) => (
                                                        <li key={p.id}>
                                                            {p.nama} ({formatKategori(p.kategori)}) -{" "}
                                                            {p.jenis === "persentase"
                                                                ? `${p.nilai}%`
                                                                : formatCurrency(p.nilai)}
                                                            {/* {p.keterangan && ` | ${p.keterangan}`} */}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>


                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Periode <span className="text-red-500">*</span>
                                        </label>

                                        {/* Search input */}
                                        {/* <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.periode}
                                                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                                                placeholder="Masukkan periode"
                                                maxLength={20}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div> */}
                                        <div className="relative">
                                            <input
                                                type="month" // Ubah tipe input menjadi "month"
                                                value={monthInputValue}
                                                onChange={handlePeriodeChange}
                                                // Gunakan class yang sama untuk styling kotak inputnya
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* {activeTab === "manual" ? (
                                        // Santri Multi-Select
                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-800">
                                                Pilih Santri <span className="text-red-500">*</span>
                                            </label>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={santriQuery}
                                                    onChange={(e) => setSantriQuery(e.target.value)}
                                                    placeholder="Cari santri berdasarkan nama atau NIS..."
                                                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                                />
                                            </div>

                                            {selectedSantri.length > 0 && (
                                                <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">
                                                            Santri Terpilih ({selectedSantri.length})
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setFormData((prev) => ({ ...prev, santri_ids: [] }))
                                                            }
                                                            className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                                                        >
                                                            Hapus Semua
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedSantri.map((santri) => (
                                                            <span
                                                                key={santri.id}
                                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white text-indigo-800 border border-indigo-200 shadow-sm"
                                                            >
                                                                <span>{santri.label}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSantriToggle(santri.id)}
                                                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    <FaTimes className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div
                                                className={`max-h-56 overflow-y-auto border-2 rounded-xl ${errors.santri_ids ? "border-red-300" : "border-gray-200"
                                                    } bg-gray-50`}
                                            >
                                                {filteredSantri.length === 0 ? (
                                                    <div className="p-6 text-center text-gray-500">
                                                        <FaUsers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                        <div className="font-medium">
                                                            {santriQuery
                                                                ? "Tidak ada santri ditemukan"
                                                                : "Tidak ada data santri"}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-gray-200">
                                                        {filteredSantri.map((santri) => (
                                                            <div
                                                                key={santri.id}
                                                                className="flex items-center p-4 hover:bg-white cursor-pointer transition-all duration-200 group"
                                                                onClick={() => handleSantriToggle(santri.id)}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.santri_ids.includes(santri.id)}
                                                                    readOnly
                                                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-md transition-colors"
                                                                />
                                                                <div className="ml-4 flex-1">
                                                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                                        {santri.label}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        NIS: {santri.nis} - Wilayah {santri.wilayah}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {errors.santri_ids && (
                                                <p className="text-sm text-red-600 font-medium">
                                                    {errors.santri_ids}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <> */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Jenis Kelamin
                                        </label>

                                        <select
                                            name="jenis_kelamin"
                                            value={formData.jenis_kelamin || ""}
                                            onChange={(e) =>
                                                setFormData({ ...formData, jenis_kelamin: e.target.value })
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            <option value="">Semua Jenis Kelamin</option>
                                            <option value="l">Laki-laki</option>
                                            <option value="p">Perempuan</option>
                                        </select>

                                        {errors.jenis_kelamin && (
                                            <p className="text-sm text-red-600 font-medium">
                                                {errors.jenis_kelamin}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Pilih Data Santri <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex items-center gap-6">
                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="all"
                                                    value="0"
                                                    checked={formData.all == 0}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, all: e.target.value })
                                                    }
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="text-sm text-gray-700">Pilih Santri</span>
                                            </label>

                                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="all"
                                                    value="1"
                                                    checked={formData.all == 1}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, all: e.target.value })
                                                    }
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="text-sm text-gray-700"><span className="text-gray-900">Semua Santri</span></span>
                                            </label>
                                        </div>
                                        {/* </div>
                                            <div className="space-y-3"> */}
                                        {/* <label className="block text-sm font-semibold text-gray-800">
                                                Pilih Santri <span className="text-red-500">*</span>
                                            </label> */}

                                        {formData.all == 0 && (
                                            <>
                                                {/* Search input */}
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={santriQuery}
                                                        onChange={(e) => setSantriQuery(e.target.value)}
                                                        placeholder="Cari santri berdasarkan nama atau NIS..."
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>

                                                {/* Selected santri display */}
                                                {selectedSantri.length > 0 && (
                                                    <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">
                                                                Santri Terpilih ({selectedSantri.length})
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setFormData((prev) => ({ ...prev, santri_ids: [] }))
                                                                }
                                                                className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                                                            >
                                                                Hapus Semua
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedSantri.map((santri) => (
                                                                <span
                                                                    key={santri.id}
                                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white text-indigo-800 border border-indigo-200 shadow-sm"
                                                                >
                                                                    <span>{santri.label}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSantriToggle(santri.id)}
                                                                        className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-indigo-100 transition-colors"
                                                                    >
                                                                        <FaTimes className="w-3 h-3" />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Santri list */}
                                                <div
                                                    className={`max-h-56 overflow-y-auto border-2 rounded-xl ${errors.santri_ids ? "border-red-300" : "border-gray-200"
                                                        } bg-gray-50`}
                                                >
                                                    {filteredSantri.length === 0 ? (
                                                        <div className="p-6 text-center text-gray-500">
                                                            <FaUsers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                            <div className="font-medium">
                                                                {santriQuery
                                                                    ? "Tidak ada santri ditemukan"
                                                                    : "Tidak ada data santri"}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="divide-y divide-gray-200">
                                                            {filteredSantri.map((santri) => (
                                                                <div
                                                                    key={santri.id}
                                                                    className="flex items-center p-4 hover:bg-white cursor-pointer transition-all duration-200 group"
                                                                    onClick={() => handleSantriToggle(santri.id)}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={formData.santri_ids.includes(santri.id)}
                                                                        readOnly
                                                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-md transition-colors"
                                                                    />
                                                                    <div className="ml-4 flex-1">
                                                                        <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                                            {santri.label}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            NIS: {santri.nis} - Wilayah {santri.wilayah}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {errors.santri_ids && (
                                                    <p className="text-sm text-red-600 font-medium">
                                                        {errors.santri_ids}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {/* </>
                                    )} */}

                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="cursor-pointer inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition >
    );
}

export const ModalDetailTagihanSantri = ({ isOpen, onClose, id }) => {
    console.log(id)

    const [data, setData] = useState(null)
    const [dataSantri, setDataSantri] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingSantri, setLoadingSantri] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 25, // Default item per halaman
        lastPage: 1,
        total: 0,
    });

    const [filter, setFilter] = useState({
        search: "",
        status: "", // "" berarti semua status
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filter.search);

    useEffect(() => {
        // Set timer 500ms
        const handler = setTimeout(() => {
            setDebouncedSearch(filter.search);
            // Reset ke halaman pertama setiap kali ada pencarian baru
            setPagination(prev => ({ ...prev, currentPage: 1 }));
        }, 500);

        // Bersihkan timer setiap kali filter.search berubah (pengguna mengetik lagi)
        return () => {
            clearTimeout(handler);
        };
    }, [filter.search]);

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true)
            const token = sessionStorage.getItem("token") || getCookie("token")
            fetch(`${API_BASE_URL}tagihan/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal mengambil data")
                    return res.json()
                })
                .then((json) => setData(json))
                .catch((err) => {
                    console.error(err)
                    setData(null)
                })
                .finally(() => setLoading(false))
        }
    }, [isOpen, id])

    useEffect(() => {
        if (isOpen && id) {
            setLoadingSantri(true);
            const token = sessionStorage.getItem("token") || getCookie("token");

            // 4. Bangun URL dengan parameter dinamis
            const params = new URLSearchParams({
                page: pagination.currentPage,
                per_page: pagination.perPage,
            });

            // Tambahkan parameter search jika ada isinya
            if (debouncedSearch) {
                params.append('search', debouncedSearch);
            }
            // Anda juga bisa menambahkan parameter status di sini jika diperlukan
            if (filter.status) {
                params.append('status', filter.status);
            }

            const url = `${API_BASE_URL}tagihan-santri/${id}?${params.toString()}`;

            fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal mengambil data santri");
                    return res.json();
                })
                .then((json) => {
                    setDataSantri(json);
                    setPagination(prev => ({
                        ...prev,
                        lastPage: json.last_page,
                        total: json.total,
                    }));
                })
                .catch((err) => {
                    console.error(err);
                    setDataSantri(null);
                })
                .finally(() => setLoadingSantri(false));
        }
        // Tambahkan `debouncedSearch` sebagai dependency
    }, [isOpen, id, pagination.currentPage, pagination.perPage, debouncedSearch, filter.status, refreshKey]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.lastPage) {
            setPagination(prev => ({
                ...prev,
                currentPage: newPage,
            }));
        }
    };

    const handleCancel = (tagihanSantriId) => {
        Swal.fire({
            title: 'Anda Yakin?',
            text: "Transaksi yang dibatalkan tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, batalkan!',
            cancelButtonText: 'Tidak'
        }).then(async (result) => {
            if (result.isConfirmed) {
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
                try {
                    const token = sessionStorage.getItem("token") || getCookie("token");

                    // Ganti URL ini dengan endpoint API pembatalan Anda
                    const response = await fetch(`${API_BASE_URL}tagihan-santri/batal`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        // ID sekarang diletakkan di dalam body request
                        body: JSON.stringify({
                            tagihan_santri_id: tagihanSantriId
                        })
                    });

                    Swal.close();

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => null);
                        throw new Error(errorData?.error || 'Gagal membatalkan transaksi.');
                    }

                    Swal.fire(
                        'Dibatalkan!',
                        'Transaksi telah berhasil dibatalkan.',
                        'success'
                    );

                    // Memicu useEffect untuk fetch ulang data
                    setRefreshKey(prevKey => prevKey + 1);

                } catch (error) {
                    console.error('Error saat membatalkan:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal!',
                        text: error.message || 'Terjadi kesalahan pada server.',
                    });
                } 
            }
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString);
        const hasTime = dateString.includes('T');

        // Siapkan opsi dasar untuk tanggal
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "numeric",
            timeZone: "UTC", // Tetap pakai UTC agar tanggal tidak bergeser
        };

        // Jika ada 'T', tambahkan opsi untuk waktu
        if (hasTime) {
            options.hour = "2-digit";
            options.minute = "2-digit";
        }

        // Gunakan toLocaleString yang akan otomatis menampilkan waktu jika opsinya ada
        return date.toLocaleString("id-ID", options);
    };

    const formatCurrency = (amount) => {
        if (!amount) return "-"
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(Number.parseFloat(amount))
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
            lunas: { label: "Lunas", class: "bg-green-100 text-green-800" },
            batal: { label: "Dibatalkan", class: "bg-red-100 text-red-800" },
        }
        const config = statusConfig[status] || { label: status, class: "bg-gray-100 text-gray-800" }
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>{config.label}</span>
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
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
                        leave="transition-transform duration-200 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="bg-white rounded-xl shadow-2xl max-w-4xl w-full relative max-h-[90vh] flex flex-col">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <div className="pt-6 px-6">
                                <Dialog.Title className="text-xl font-bold text-gray-900">Detail Tagihan Santri</Dialog.Title>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 pt-4 text-left">
                                {loading ? (
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                                            <div className="space-y-3">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : data ? (
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                                <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                                                Informasi Tagihan
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    ["Nama Tagihan", data.data.nama_tagihan],
                                                    ["Tipe", data.data.tipe?.charAt(0).toUpperCase() + data.data.tipe?.slice(1).replace(/_/g, " ")],
                                                    ["Nominal", formatCurrency(data.data.nominal)],
                                                    ["Jatuh Tempo", formatDate(data.data.jatuh_tempo)],
                                                    ["Status", data.data.status == 1 ? "Aktif" : "Nonaktif"],
                                                    ["Tanggal Dibuat", formatDate(data.data.created_at)],
                                                ].map(([label, value]) => (
                                                    <div key={label} className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-600">{label}</span>
                                                        <span className="text-base text-gray-900 mt-1 font-medium">{value || "-"}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 mb-2">
                                            <div className="flex flex-col md:flex-row justify-between items-left mb-4 gap-4">
                                                <h3 className="text-lg font-bold text-gray-800 flex items-left">
                                                    <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                                                    Detail Tagihan Santri ({pagination.total || 0} santri)
                                                </h3>
                                                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                                    {/* Filter Status */}
                                                    <select
                                                        value={filter.status}
                                                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                                                        className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                                    >
                                                        <option value="">Semua Status</option>
                                                        <option value="lunas">Lunas</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="batal">Batal</option>
                                                        {/* Tambahkan opsi lain jika perlu */}
                                                    </select>

                                                    {/* Input Pencarian */}
                                                    <div className="relative w-full sm:w-64 bg-white">
                                                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Cari nama atau NIS..."
                                                            value={filter.search}
                                                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Wrapper untuk membuat tabel responsif di layar kecil */}
                                            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                                                <table className="w-full text-sm text-left text-gray-700">
                                                    {/* Table Header */}
                                                    <thead className="bg-gray-100 text-xs text-gray-800 uppercase">
                                                        <tr>
                                                            <th scope="col" className="px-4 py-3 font-semibold">No.</th>
                                                            <th scope="col" className="px-4 py-3 font-semibold">Nama Santri</th>
                                                            <th scope="col" className="px-4 py-3 font-semibold">NIS</th>
                                                            <th scope="col" className="px-4 py-3 font-semibold text-center">Total Tagihan</th>
                                                            <th scope="col" className="px-4 py-3 font-semibold text-center">Status</th>
                                                            <th scope="col" className="px-4 py-3 font-semibold">Tanggal Bayar</th>
                                                            <th scope="col" className="px-4 py-3 font-semibold">Keterangan</th>
                                                            <th scope="col" className="px-4 py-3 font-semibold text-center">Aksi</th>
                                                        </tr>
                                                    </thead>

                                                    {/* Table Body */}
                                                    <tbody>
                                                        {/* Kondisi jika tidak ada data */}
                                                        {loadingSantri ? (
                                                            <tr>
                                                                <td colSpan="8" className="text-center py-6">
                                                                    <div className="flex flex-col items-center">
                                                                        <OrbitProgress />
                                                                        <span className="mt-2 text-sm text-gray-500">Memuat data santri...</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ) : (!dataSantri?.data || dataSantri?.data?.length == 0) ? (
                                                            <tr>
                                                                <td colSpan="8" className="text-center py-6 text-gray-500">
                                                                    Tidak ada data untuk ditampilkan.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            /* Mapping data ke setiap baris tabel */
                                                            dataSantri.data.map((item, index) => (
                                                                <tr key={item.id} className="bg-white border-b border-gray-300 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                                                                    <td className="px-4 py-3 font-medium text-gray-900">{(pagination.currentPage - 1) * pagination.perPage + index + 1}</td>
                                                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{item.nama_santri || "-"}</td>
                                                                    <td className="px-4 py-3">{item.nis || "-"}</td>
                                                                    <td className="px-4 py-3 text-right font-mono font-semibold">{formatCurrency(item.total_tagihan)}</td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        {getStatusBadge(item.status)}
                                                                    </td>
                                                                    <td className="px-4 py-3">{formatDate(item.tanggal_bayar)}</td>
                                                                    <td className="px-4 py-3">{item.keterangan || "-"}</td>
                                                                    {/* <td className="px-4 py-3 text-center">
                                                                        <button className="font-medium text-blue-600 hover:underline">
                                                                            Detail
                                                                        </button>
                                                                    </td> */}
                                                                    <td className="px-4 py-3 text-center">
                                                                        {/* Hanya tampilkan tombol batal jika statusnya belum 'Dibatalkan' */}
                                                                        {item.status != 'batal' && (
                                                                            <button
                                                                                onClick={() => handleCancel(item.id)}
                                                                                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                                            >
                                                                                Batal
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {dataSantri && pagination.total > pagination.perPage && (
                                                <div className="flex items-center justify-between pt-4">
                                                    <span className="text-sm text-gray-600">
                                                        Halaman <span className="font-semibold">{pagination.currentPage}</span> dari <span className="font-semibold">{pagination.lastPage}</span>
                                                    </span>
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                            disabled={pagination.currentPage === 1}
                                                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Sebelumnya
                                                        </button>
                                                        <button
                                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                            disabled={pagination.currentPage === pagination.lastPage}
                                                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Berikutnya
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                            <FontAwesomeIcon icon={faTimes} className="text-red-500 text-xl" />
                                        </div>
                                        <p className="text-red-600 font-medium">Gagal memuat data tagihan</p>
                                        <p className="text-gray-500 text-sm mt-1">Silakan coba lagi nanti</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 text-right bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Tutup
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}
