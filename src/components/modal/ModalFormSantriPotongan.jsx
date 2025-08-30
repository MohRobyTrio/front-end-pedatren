import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Combobox } from '@headlessui/react';
import { FaCheck, FaChevronDown, FaTimes, FaUsers } from 'react-icons/fa';
import useDropdownSantri from '../../hooks/hook_dropdown/DropdownSantri';
import Swal from 'sweetalert2';
import { getCookie } from '../../utils/cookieUtils';
import { API_BASE_URL } from '../../hooks/config';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/Logout';

// Mock data - in real app, this would come from API
const mockPotongan = [
    { id: '1', nama: 'Potongan SPP', jenis: 'bulanan', nominal: 50000 },
    { id: '2', nama: 'Potongan Makan', jenis: 'bulanan', nominal: 100000 },
    { id: '3', nama: 'Potongan Seragam', jenis: 'sekali', nominal: 150000 },
    { id: '4', nama: 'Potongan Kegiatan', jenis: 'bulanan', nominal: 25000 },
];

// const mockSantri = [
//     { id: '1', nama: 'Ahmad Fauzi', kelas: 'XII IPA 1', status: 'aktif' },
//     { id: '2', nama: 'Siti Nurhaliza', kelas: 'XII IPA 2', status: 'aktif' },
//     { id: '3', nama: 'Muhammad Rizki', kelas: 'XI IPS 1', status: 'aktif' },
//     { id: '4', nama: 'Fatimah Az-Zahra', kelas: 'XI IPS 2', status: 'aktif' },
//     { id: '5', nama: 'Ali Hassan', kelas: 'X A', status: 'aktif' },
//     { id: '6', nama: 'Khadijah Binti Omar', kelas: 'X B', status: 'aktif' },
// ];

export const ModalAddOrEditSantriPotongan = ({ isOpen, onClose, initialData = {}, title = "Tambah Potongan Santri", refetchData}) => {
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
    const [errors, setErrors] = useState({});
    const [potonganQuery, setPotonganQuery] = useState('');
    const [santriQuery, setSantriQuery] = useState('');

    const mockSantri = menuSantri.slice(1);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                potongan_id: '',
                santri_ids: [],
                keterangan: '',
                status: true,
                berlaku_dari: '',
                berlaku_sampai: '',
                ...initialData
            });
            setErrors({});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

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
            onClose();
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

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
                : `${API_BASE_URL}potongan`;

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
                body: JSON.stringify(payload),
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

                            {/* Header */}
                            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-semibold text-gray-900 text-center"
                                >
                                    {title}
                                </Dialog.Title>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                                {/* Potongan Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Jenis Potongan <span className="text-red-500">*</span>
                                    </label>
                                    <Combobox value={formData.potongan_id} onChange={(value) => setFormData(prev => ({ ...prev, potongan_id: value }))}>
                                        <div className="relative">
                                            <Combobox.Input
                                                className={`w-full rounded-md border ${errors.potongan_id
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                    } bg-white py-2 px-3 text-sm text-gray-900 focus:outline-none transition-all duration-200`}
                                                displayValue={() => selectedPotongan?.nama || ''}
                                                onChange={(event) => setPotonganQuery(event.target.value)}
                                                placeholder="Pilih jenis potongan..."
                                            />
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <FaChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </Combobox.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                            afterLeave={() => setPotonganQuery('')}
                                        >
                                            <Combobox.Options className="absolute z-10 mt-2 max-h-60 min-w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {filteredPotongan.length === 0 && potonganQuery !== '' ? (
                                                    <div className="relative cursor-default select-none py-3 px-4 text-gray-700">
                                                        Tidak ada hasil ditemukan.
                                                    </div>
                                                ) : (
                                                    filteredPotongan.map((potongan) => (
                                                        <Combobox.Option
                                                            key={potongan.id}
                                                            className={({ active }) =>
                                                                `relative cursor-pointer select-none py-3 pl-4 transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                                }`
                                                            }
                                                            value={potongan.id}
                                                        >
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <div className="flex flex-col">
                                                                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-medium'}`}>
                                                                            {potongan.nama}
                                                                        </span>
                                                                        <span className={`text-xs ${active ? 'text-indigo-200' : 'text-gray-500'}`}>
                                                                            {potongan.jenis} - Rp {potongan.nominal.toLocaleString('id-ID')}
                                                                        </span>
                                                                    </div>
                                                                    {selected ? (
                                                                        <span className={`absolute inset-y-0 left-0 flex items-center pl-4 ${active ? 'text-white' : 'text-indigo-600'
                                                                            }`}>
                                                                            <FaCheck className="h-5 w-5" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Combobox.Option>
                                                    ))
                                                )}
                                            </Combobox.Options>
                                        </Transition>
                                    </Combobox>
                                    {errors.potongan_id && (
                                        <p className="text-sm text-red-600 font-medium">{errors.potongan_id}</p>
                                    )}
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
                                            placeholder="Cari santri berdasarkan nama atau kelas..."
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
                            </form>

                            {/* Action buttons */}
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
                                    form="potonganForm"
                                    className="cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Simpan
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}