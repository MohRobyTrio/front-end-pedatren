"use client"

import Swal from "sweetalert2"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Listbox, Transition } from "@headlessui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import useLogout from "../../hooks/Logout"
import { getCookie } from "../../utils/cookieUtils"
import { API_BASE_URL } from "../../hooks/config"
import { OrbitProgress } from "react-loading-indicators"
import { ChevronsUpDown } from "lucide-react"
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri"

export const ModalAddOrEditPotongan = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout()
    const navigate = useNavigate()
    const id = data?.id

    const [formData, setFormData] = useState({
        nama: "",
        kategori: 'umum',
        jenis: 'persentase',
        nilai: "",
        status: true,
        keterangan: "",
        tagihan_ids: [],
        santri_ids: [],
    })

    const [tagihan, setTagihan] = useState([])
    const [loadingTagihan, setLoadingTagihan] = useState(false)

    const { menuSantri } = useDropdownSantri()
    const [santriQuery, setSantriQuery] = useState('')

    const JENIS_OPTIONS = [
        { value: 'persentase', label: 'Persentase (%)' },
        { value: 'nominal', label: 'Nominal (Rp)' }
    ];
    const selectedJenis = JENIS_OPTIONS.find(option => option.value === formData.jenis);

    const KATEGORI_OPTIONS = [
        { value: 'anak_pegawai', label: 'Anak Pegawai' },
        { value: 'bersaudara', label: 'Bersaudara' },
        { value: 'khadam', label: 'Khadam' },
        { value: 'umum', label: 'Umum' }
    ];
    const selectedKategori = KATEGORI_OPTIONS.find(option => option.value === formData.kategori);

    // [DIUBAH] Filter dan data santri terpilih
    const mockSantri = menuSantri.slice(1); // Menghapus elemen pertama jika itu placeholder
    const filteredSantri = santriQuery === ''
        ? mockSantri
        : mockSantri.filter((santri) =>
            santri.label.toLowerCase().includes(santriQuery.toLowerCase()) ||
            (santri.nis && santri.nis.toLowerCase().includes(santriQuery.toLowerCase())) ||
            (santri.wilayah && santri.wilayah.toLowerCase().includes(santriQuery.toLowerCase()))
        );
    const selectedSantri = mockSantri.filter(s => formData.santri_ids.includes(s.id));

    const fetchTagihan = async () => {
        setLoadingTagihan(true)
        try {
            const token = sessionStorage.getItem("token") || getCookie("token")
            const response = await fetch(`${API_BASE_URL}tagihan`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            })
            if (response.ok) {
                const result = await response.json()
                setTagihan(result.data.data || [])
            }
        } catch (error) {
            console.error("Error fetching tagihan:", error)
        } finally {
            setLoadingTagihan(false)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchTagihan()
            // [DIHAPUS] fetchSantri() lokal dihapus karena sudah ditangani hook

            if (feature === 2 && data) {
                setFormData({
                    nama: data.nama || "",
                    kategori: data.kategori || "umum",
                    jenis: data.jenis || "persentase",
                    nilai: data.nilai || "",
                    keterangan: data.keterangan || "",
                    status: data.status === 1,
                    tagihan_ids: data.tagihans ? data.tagihans.map(item => item.id) : [],
                    santri_ids: data.kategori === 'umum' && data.santris ? data.santris.map(item => item.id) : [],
                })
            } else {
                setFormData({
                    nama: "",
                    kategori: 'umum',
                    jenis: 'persentase',
                    nilai: "",
                    status: true,
                    keterangan: "",
                    tagihan_ids: [],
                    santri_ids: [],
                })
            }
        }
    }, [isOpen, feature, data])

    const handleTagihanChange = (tagihanId) => {
        setFormData((prev) => ({
            ...prev,
            tagihan_ids: prev.tagihan_ids.includes(tagihanId)
                ? prev.tagihan_ids.filter((id) => id !== tagihanId)
                : [...prev.tagihan_ids, tagihanId],
        }))
    }

    // [DIUBAH] Nama handler disamakan untuk konsistensi
    const handleSantriToggle = (santriId) => {
        setFormData((prev) => ({
            ...prev,
            santri_ids: prev.santri_ids.includes(santriId)
                ? prev.santri_ids.filter((id) => id !== santriId)
                : [...prev.santri_ids, santriId],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.tagihan_ids.length === 0) {
            await Swal.fire({ icon: "error", title: "Validasi Gagal", text: "Minimal pilih satu kategori tagihan." });
            return;
        }

        if (formData.kategori === 'umum' && formData.santri_ids.length === 0) {
            await Swal.fire({ icon: "error", title: "Validasi Gagal", text: "Untuk kategori 'Umum', minimal pilih satu santri." });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?", text: "Pastikan semua data sudah benar!", icon: "question",
            showCancelButton: true, confirmButtonText: "Ya, kirim", cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        try {
            Swal.fire({
                background: "transparent", showConfirmButton: false, allowOutsideClick: false,
                didOpen: () => { Swal.showLoading() },
                customClass: { popup: "p-0 shadow-none border-0 bg-transparent" },
            });

            const token = sessionStorage.getItem("token") || getCookie("token");
            const isEdit = feature === 2;
            const url = isEdit ? `${API_BASE_URL}potongan/${id}` : `${API_BASE_URL}potongan`;
            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            Swal.close();

            if (response.status === 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({ title: "Sesi Berakhir", text: "Sesi anda telah berakhir, silakan login kembali.", icon: "warning", confirmButtonText: "OK" });
                clearAuthData();
                navigate("/login");
                return;
            }

            if (response.status === 422 && result.errors) {
                const errorMessages = Object.values(result.errors).flat().join("\n");
                await Swal.fire({ icon: "error", title: "Validasi Gagal", text: errorMessages });
                return;
            }

            if (!response.ok || result.success === false) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({ icon: "success", title: "Berhasil!", text: "Data berhasil dikirim." });

            refetchData?.();
            onClose?.();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            Swal.close();
            await Swal.fire({ icon: "error", title: "Oops!", text: error.message || "Terjadi kesalahan saat mengirim data." });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <Transition.Child as={Fragment} enter="transition-opacity duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>
                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child as={Fragment} enter="transition-transform duration-300 ease-out" enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100" leave="transition-transform duration-200 ease-in" leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0">
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-md sm:max-w-2xl sm:align-middle">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-center mb-8">
                                        {feature === 1 ? "Tambah Data Baru" : "Edit Data Potongan"}
                                    </Dialog.Title>
                                    <div className="space-y-4">
                                        {/* Nama Potongan */}
                                        <div>
                                            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">Nama Potongan <span className="text-error-500">*</span></label>
                                            <input type="text" id="nama" value={formData.nama} onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Masukkan nama potongan" required />
                                        </div>

                                        {/* Kategori */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori <span className="text-error-500">*</span></label>
                                            <Listbox value={formData.kategori} onChange={(value) => { setFormData(prev => ({ ...prev, kategori: value, santri_ids: value !== 'umum' ? [] : prev.santri_ids })); }}>
                                                <div className="relative">
                                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                                        <span className="block truncate">{selectedKategori?.label}</span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" /></span>
                                                    </Listbox.Button>
                                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                        <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                            {KATEGORI_OPTIONS.map((option) => (<Listbox.Option key={option.value} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'}`} value={option.value}>{({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>{selected && (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"><FontAwesomeIcon icon={faCheck} className="h-5 w-5" /></span>)}</>)}</Listbox.Option>))}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </Listbox>
                                        </div>

                                        {/* [DIUBAH] Conditional Santri List dengan Pencarian */}
                                        {formData.kategori === 'umum' && (
                                            <div className="space-y-3">
                                                <label className="block text-sm font-semibold text-gray-800">Pilih Santri <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <input type="text" value={santriQuery} onChange={(e) => setSantriQuery(e.target.value)} placeholder="Cari santri berdasarkan nama, NIS, atau wilayah..." className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors" />
                                                </div>

                                                {selectedSantri.length > 0 && (
                                                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Santri Terpilih ({selectedSantri.length})</div>
                                                            <button type="button" onClick={() => setFormData((prev) => ({ ...prev, santri_ids: [] }))} className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors">Hapus Semua</button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedSantri.map((santri) => (
                                                                <span key={santri.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-white text-blue-800 border border-blue-200 shadow-sm">
                                                                    <span>{santri.label}</span>
                                                                    <button type="button" onClick={() => handleSantriToggle(santri.id)} className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-100 transition-colors">
                                                                        <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={`max-h-56 overflow-y-auto border-2 rounded-xl bg-gray-50 border-gray-200`}>
                                                    {filteredSantri.length === 0 ? (
                                                        <div className="p-6 text-center text-gray-500"><p className="font-medium">{santriQuery ? "Tidak ada santri ditemukan" : "Tidak ada data santri"}</p></div>
                                                    ) : (
                                                        <div className="divide-y divide-gray-200">
                                                            {filteredSantri.map((santri) => (
                                                                <div key={santri.id} className="flex items-center p-4 hover:bg-white cursor-pointer transition-all duration-200 group" onClick={() => handleSantriToggle(santri.id)}>
                                                                    <input type="checkbox" checked={formData.santri_ids.includes(santri.id)} readOnly className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded-md transition-colors" />
                                                                    <div className="ml-4 flex-1">
                                                                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{santri.label}</div>
                                                                        <div className="text-xs text-gray-500 mt-1">NIS: {santri.nis} - Wilayah {santri.wilayah}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Jenis Potongan */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Potongan <span className="text-error-500">*</span></label>
                                            <Listbox value={formData.jenis} onChange={(value) => setFormData(prev => ({ ...prev, jenis: value, nilai: "" }))}>
                                                <div className="relative">
                                                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
                                                        <span className="block truncate">{selectedJenis?.label}</span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" /></span>
                                                    </Listbox.Button>
                                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                            {JENIS_OPTIONS.map((option) => (<Listbox.Option key={option.value} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'}`} value={option.value}>{({ selected }) => (<><span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>{selected && (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"><FontAwesomeIcon icon={faCheck} className="h-5 w-5" /></span>)}</>)}</Listbox.Option>))}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </Listbox>
                                        </div>

                                        {/* Nilai Potongan */}
                                        <div>
                                            <label htmlFor="nilai" className="block text-sm font-medium text-gray-700 mb-2">Nilai {formData.jenis === 'persentase' ? 'Persentase' : 'Nominal'} <span className="text-error-500">*</span></label>
                                            <div className="relative"><input id="nilai" type="text" inputMode="numeric" onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, "") }} value={formData.jenis === "nominal" ? (formData.nilai ? new Intl.NumberFormat("id-ID").format(formData.nilai) : "") : formData.nilai} onChange={(e) => { const rawValue = e.target.value.replace(/\./g, ""); const val = rawValue === "" ? "" : parseInt(rawValue, 10); if (formData.jenis === "persentase") { if (val === "" || (val >= 0 && val <= 100)) { setFormData((prev) => ({ ...prev, nilai: val.toString() })) } } else { setFormData((prev) => ({ ...prev, nilai: val || "" })) } }} className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${formData.jenis === "nominal" ? "pl-10" : "pr-8"}`} placeholder={formData.jenis === "persentase" ? "0-100" : "0"} required />{formData.jenis === 'nominal' && (<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 text-sm">Rp</span></div>)}{formData.jenis === 'persentase' && (<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-gray-500 text-sm">%</span></div>)}</div>
                                        </div>

                                        {/* Keterangan */}
                                        <div>
                                            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                            <textarea id="keterangan" value={formData.keterangan} onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Masukkan keterangan (opsional)" />
                                        </div>

                                        {/* Berlaku Untuk Tagihan */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Berlaku Untuk Tagihan <span className="text-error-500">*</span></label>
                                            {loadingTagihan ? (<div className="flex justify-center py-4"><OrbitProgress variant="disc" color="#2a6999" size="small" /></div>) : (<div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">{tagihan.length > 0 ? (<div className="space-y-2">{tagihan.map((item) => (<label key={item.id} className="flex items-center cursor-pointer"><input type="checkbox" checked={formData.tagihan_ids.includes(item.id)} onChange={() => handleTagihanChange(item.id)} className="form-checkbox text-blue-600 rounded" /><span className="ml-2 text-sm text-gray-700">{item.nama_tagihan}</span></label>))}</div>) : (<p className="text-gray-500 text-sm">Tidak ada tagihan tersedia</p>)}</div>)}
                                            {formData.tagihan_ids.length === 0 && !loadingTagihan && <p className="text-red-500 text-xs mt-1">Minimal pilih satu tagihan</p>}
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" /><span className="text-sm font-medium text-gray-700">Aktifkan Potongan</span></label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                                    <button type="button" onClick={onClose} className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Batal</button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}


export const ModalDetailPotongan = ({ isOpen, onClose, id }) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && id) {
            setLoading(true)
            const token = sessionStorage.getItem("token") || getCookie("token")
            fetch(`${API_BASE_URL}potongan/${id}`, {
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

    // const formatDate = (dateString) => {
    //     if (!dateString) return "-";
    //     return new Date(dateString).toLocaleString("id-ID", {
    //         year: "numeric", month: "long", day: "numeric",
    //         hour: "2-digit", minute: "2-digit", timeZone: "UTC"
    //     });
    // };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(
            amount,
        )
    }

    // Helper untuk format Kategori
    const formatKategori = (kategori) => {
        const map = {
            anak_pegawai: "Anak Pegawai",
            bersaudara: "Bersaudara",
            khadam: "Khadam",
            umum: "Umum",
        }
        return map[kategori] || kategori?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "-"
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
                        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative max-h-[90vh] flex flex-col">
                            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                            <div className="pt-6 px-6">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Detail Potongan</Dialog.Title>
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 pt-4 text-left">
                                {loading ? (
                                    <div className="flex h-24 justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" />
                                    </div>
                                ) : data ? (
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-md font-semibold text-gray-800 mb-3">Informasi Potongan</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {[
                                                    [
                                                        ["Nama Potongan", data.data.nama],
                                                        ["Kategori", formatKategori(data.data.kategori)],
                                                        ["Status", data.data.status === 1 ? "Aktif" : "Nonaktif"],
                                                        [
                                                            "Nilai",
                                                            data.data.jenis === "persentase"
                                                                ? `${data.data.nilai}%`
                                                                : formatCurrency(data.data.nilai),
                                                        ],
                                                        ["Keterangan", data.data.keterangan],
                                                        // ["Tanggal Dibuat", formatDate(data.data.created_at)],
                                                        // ["Tanggal Diperbarui", formatDate(data.data.updated_at)],
                                                    ],
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
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="text-md font-semibold text-gray-800 mb-3">Tagihan Terkait</h3>
                                            {data.data.tagihans && data.data.tagihans.length > 0 ? (
                                                <div className="space-y-3">
                                                    {data.data.tagihans.map((tagihan) => (
                                                        <div key={tagihan.id} className="bg-white p-3 rounded border border-blue-200">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-medium text-gray-800">{tagihan.nama_tagihan}</h4>
                                                                {/* <span className={`px-2 py-1 text-xs rounded-full ${tagihan.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                                    {tagihan.status === 1 ? "Aktif" : "Nonaktif"}
                                                                </span> */}
                                                            </div>
                                                            {/* <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                                                <div className="capitalize"><span className="font-medium">Tipe:</span> {tagihan.tipe}</div>
                                                                <div><span className="font-medium">Nominal:</span> {formatCurrency(tagihan.nominal)}</div>
                                                                <div><span className="font-medium">Jatuh Tempo:</span> {new Date(tagihan.jatuh_tempo).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</div>
                                                                <div><span className="font-medium">Dibuat:</span> {formatDate(tagihan.created_at)}</div>
                                                            </div> */}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm">Tidak ada tagihan terkait</p>
                                            )}
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h3 className="text-md font-semibold text-gray-800 mb-3">Santri Terkait</h3>
                                            {data.data.santris && data.data.santris.length > 0 ? (
                                                <div className="space-y-3">
                                                    {data.data.santris.map((santri) => (
                                                        <div key={santri.id} className="bg-white p-3 rounded border border-green-200">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-medium text-gray-800">{santri.nama}</h4>
                                                                    <p className="text-xs text-gray-600 mt-1">
                                                                        <span className="font-medium">NIS:</span> {santri.nis}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm">Tidak ada santri terkait</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-red-500">Gagal memuat data potongan.</p>
                                )}
                            </div>
                            <div className="mt-auto pt-4 text-right space-x-2 bg-gray-100 px-6 py-3 rounded-b-lg border-t border-gray-200">
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
