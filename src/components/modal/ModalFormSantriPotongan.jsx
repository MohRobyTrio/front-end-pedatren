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
import useFetchPotongan from '../../hooks/hooks_menu_pembayaran/Potongan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { OrbitProgress } from 'react-loading-indicators';

export const ModalAddOrEditSantriPotongan = ({ isOpen, onClose, initialData = {}, refetchData }) => {
    const [formData, setFormData] = useState({
        potongan_id: '',
        santri_ids: [],
        keterangan: '',
        status: true,
        berlaku_dari: '',
        berlaku_sampai: '',
        ...initialData
    });

    const navigate = useNavigate();
    const { clearAuthData } = useLogout()
    const { menuSantri } = useDropdownSantri()
    const { potongan, fetchPotongan } = useFetchPotongan()
    const [errors, setErrors] = useState({});
    const [potonganQuery, setPotonganQuery] = useState('');
    const [santriQuery, setSantriQuery] = useState('');

    const mockSantri = menuSantri.slice(1);
    const mockPotongan = potongan

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            fetchPotongan()
            setFormData({
                potongan_id: initialData?.potongan_id || '',
                santri_ids: initialData?.santri_id ? [initialData.santri_id] : [],
                keterangan: initialData?.keterangan || '',
                status: initialData?.status === 1, // pastikan boolean
                berlaku_dari: initialData?.berlaku_dari || '',
                berlaku_sampai: initialData?.berlaku_sampai || ''
            });
            setErrors({});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialData]);

    // Filter potongan based on search query
    const filteredPotongan = potonganQuery === ''
        ? mockPotongan
        : mockPotongan.filter((potongan) =>
            potongan.nama.toLowerCase().includes(potonganQuery.toLowerCase()) ||
            potongan.jenis.toLowerCase().includes(potonganQuery.toLowerCase())
        );

    // Filter santri based on search query
    const filteredSantri = santriQuery === ''
        ? mockSantri
        : mockSantri.filter((santri) =>
            santri.label.toLowerCase().includes(santriQuery.toLowerCase()) ||
            santri.nis.toLowerCase().includes(santriQuery.toLowerCase()) ||
            santri.wilayah.toLowerCase().includes(santriQuery.toLowerCase())
        );

    const selectedPotongan = mockPotongan.find(p => p.id === formData.potongan_id);
    const selectedSantri = mockSantri.filter(s => formData.santri_ids.includes(s.id));

    const validateForm = () => {
        const newErrors = {};

        if (!formData.potongan_id) {
            newErrors.potongan_id = 'Potongan harus dipilih';
        }

        if (formData.santri_ids.length === 0) {
            newErrors.santri_ids = 'Minimal satu santri harus dipilih';
        }

        if (formData.keterangan && formData.keterangan.length > 255) {
            newErrors.keterangan = 'Keterangan tidak boleh lebih dari 255 karakter';
        }

        if (formData.berlaku_dari && formData.berlaku_sampai) {
            const dari = new Date(formData.berlaku_dari);
            const sampai = new Date(formData.berlaku_sampai);
            if (sampai < dari) {
                newErrors.berlaku_sampai = 'Tanggal berlaku sampai harus >= tanggal berlaku dari';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            const isEdit = initialData === 2;
            const url = isEdit
                ? `${API_BASE_URL}sholat/${initialData.id}`
                : `${API_BASE_URL}santri-potongan`;

            const method = isEdit ? "PUT" : "POST";

            // Tentukan data yang dikirim
            const payload = {
                nama_sholat: formData.nama_sholat,
                urutan: formData.urutan,
                aktif: formData.aktif,
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
                text: error.message || "Terjadi kesalahan saat mengirim data.",
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
                                        {initialData ? "Edit Potongan Santri" : "Tambah Potongan Santri"}
                                    </Dialog.Title>
                                </div>

                                {/* Isi Form (scrollable) */}
                                <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Jenis Potongan <span className="text-red-500">*</span>
                                        </label>
                                        <Combobox
                                            value={formData.potongan_id}
                                            onChange={(value) =>
                                                setFormData((prev) => ({ ...prev, potongan_id: value }))
                                            }
                                        >
                                            <div className="relative">
                                                {/* Input */}
                                                <Combobox.Input
                                                    className={`w-full rounded-md border ${errors?.potongan_id
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        } bg-white py-2 px-3 text-sm text-gray-900 focus:outline-none transition-all duration-200`}
                                                    displayValue={() =>
                                                        selectedPotongan
                                                            ? `${selectedPotongan.nama} - ${selectedPotongan.jenis === "persentase"
                                                                ? `${parseFloat(selectedPotongan.nilai)}%`
                                                                : formatCurrency(selectedPotongan.nilai)
                                                            }`
                                                            : ""
                                                    }
                                                    onChange={(event) => setPotonganQuery(event.target.value)}
                                                    placeholder="Pilih jenis potongan..."
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
                                                        {filteredPotongan.length === 0 ? (
                                                            <div className="cursor-default select-none py-2 px-4 text-gray-500">
                                                                Tidak ditemukan
                                                            </div>
                                                        ) : (
                                                            filteredPotongan.map((option) => (
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
                                                                                {option.nama} - {option.jenis === "persentase"
                                                                                    ? `${parseFloat(option.nilai)} %`
                                                                                    : formatCurrency(option.nilai)}
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
                                    </div>

                                    {/* Santri Multi-Select */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Pilih Santri <span className="text-red-500">*</span>
                                        </label>

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
                                                        onClick={() => setFormData(prev => ({ ...prev, santri_ids: [] }))}
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
                                        <div className={`max-h-56 overflow-y-auto border-2 rounded-xl ${errors.santri_ids ? 'border-red-300' : 'border-gray-200'} bg-gray-50`}>
                                            {filteredSantri.length === 0 ? (
                                                <div className="p-6 text-center text-gray-500">
                                                    <FaUsers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                    <div className="font-medium">
                                                        {santriQuery ? 'Tidak ada santri ditemukan' : 'Tidak ada data santri'}
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
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        santri_ids: checked
                                                                            ? [...prev.santri_ids, santri.id]
                                                                            : prev.santri_ids.filter(id => id !== santri.id)
                                                                    }));
                                                                }}
                                                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-md transition-colors"
                                                            />
                                                            <div className="ml-4 flex-1">
                                                                <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                                    {santri.label}
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1">NIS: {santri.nis} - Wilayah {santri.wilayah}</div>
                                                            </div>
                                                            {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                            {santri.status}
                                                        </span> */}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {errors.santri_ids && (
                                            <p className="text-sm text-red-600 font-medium">{errors.santri_ids}</p>
                                        )}
                                    </div>

                                    {/* Date Range */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-800">
                                                Berlaku Dari
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={formData.berlaku_dari}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, berlaku_dari: e.target.value }))}
                                                    className={`w-full rounded-md ${errors.berlaku_dari ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''} mt-1 block border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}

                                                />
                                            </div>
                                            {errors.berlaku_dari && (
                                                <p className="text-sm text-red-600 font-medium">{errors.berlaku_dari}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-gray-800">
                                                Berlaku Sampai
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={formData.berlaku_sampai}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, berlaku_sampai: e.target.value }))}
                                                    className={`w-full rounded-md ${errors.berlaku_sampai ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''} mt-1 block border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                                />
                                            </div>
                                            {errors.berlaku_sampai && (
                                                <p className="text-sm text-red-600 font-medium">{errors.berlaku_sampai}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Keterangan */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Keterangan
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                value={formData.keterangan}
                                                onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                                                placeholder="Tambahkan keterangan tambahan (opsional)..."
                                                rows={4}
                                                maxLength={255}
                                                className={`w-full rounded-md ${errors.keterangan ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''} mt-1 block border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            {errors.keterangan && (
                                                <p className="text-sm text-red-600 font-medium">{errors.keterangan}</p>
                                            )}
                                            {/* <p className="text-xs text-gray-500 ml-auto">
                                            {formData.keterangan.length}/255
                                        </p> */}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Status Potongan
                                        </label>
                                        <div>
                                            <div className="flex space-x-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value="Aktif"
                                                        checked={formData.status == true}
                                                        onChange={() => setFormData({ ...formData, status: true })}
                                                        className="form-radio text-blue-500 focus:ring-blue-500"
                                                        required
                                                    />
                                                    <span className="ml-2 text-gray-700">Aktif</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value="Tidak Aktif"
                                                        checked={formData.status == false}
                                                        onChange={() => setFormData({ ...formData, status: false })}
                                                        className="form-radio text-blue-500 focus:ring-blue-500"
                                                        required
                                                    />
                                                    <span className="ml-2 text-gray-700">Nonaktif</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
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
        </Transition>
    );
}

export const ModalDetailSantriPotongan = ({ isOpen, onClose, id }) => {
    console.log(id)

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true)
            const token = sessionStorage.getItem("token") || getCookie("token")
            fetch(`${API_BASE_URL}santri-potongan/${id}`, {
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

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
        })
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
                        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-full relative max-h-[90vh] flex flex-col">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <div className="pt-6 px-6">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail Potongan Khusus</Dialog.Title>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 pt-4 text-left">
                                {loading ? (
                                    <div className="flex h-24 justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : data ? (
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-md font-semibold text-gray-800 mb-3">Informasi Potongan</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {[
                                                    ["Nama Santri", data.data.nama_santri],
                                                    ["Nama Potongan", data.data.nama_potongan],
                                                    ["Status", data.data.status == 1 ? "Aktif" : "Nonaktif"],
                                                    ["Berlaku", `${data.data.berlaku_dari} s.d. ${data.data.berlaku_sampai}`],
                                                    ["Tanggal Dibuat", formatDate(data.data.created_at)],
                                                    ["Tanggal Diperbarui", formatDate(data.data.updated_at)],
                                                    ["Keterangan", data.data.keterangan],
                                                ].map(([label, value]) => (
                                                    <div key={label} className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-600">{label}</span>
                                                        <span className="text-sm text-gray-900 mt-1 break-words whitespace-pre-line">
                                                            {value || "-"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-red-500">Gagal memuat data potongan.</p>
                                )}
                            </div>

                            <div className="mt-4 pt-4 text-right space-x-2 bg-gray-100 px-6 py-3 rounded-b-lg border-t border-gray-300">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
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