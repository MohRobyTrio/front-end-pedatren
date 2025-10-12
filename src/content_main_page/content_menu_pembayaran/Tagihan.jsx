"use client"
import { OrbitProgress } from "react-loading-indicators"
import { FaEdit, FaPlus, FaTimes, FaTrash, FaUsers, FaFileInvoiceDollar, FaListAlt } from "react-icons/fa"
import { Fragment, useState } from "react"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import { hasAccess } from "../../utils/hasAccess"
import { Navigate, useNavigate } from "react-router-dom"
import useFetchTagihan from "../../hooks/hooks_menu_pembayaran/tagihan"
import Pagination from "../../components/Pagination"
import { ModalAddOrEditTagihan } from "../../components/modal/ModalFormTagihan"
import { ModalDetailTagihanSantri } from "../../components/modal/ModalFormProsesTagihan"
import { Check, ChevronsUpDown } from "lucide-react"
import { Combobox, Transition } from "@headlessui/react"
import Swal from "sweetalert2"
import { API_BASE_URL } from "../../hooks/config"
import { getCookie } from "../../utils/cookieUtils"
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri"
import useLogout from "../../hooks/Logout"

const Tagihan = () => {
    // eslint-disable-next-line no-unused-vars
    const [filters, setFilters] = useState({
        status: "",
        tipe: "",
    })
    const [formData, setFormData] = useState({
        tagihan_id: "",
        santri_ids: [],
        jenis_kelamin: "",
        all: null,
    })
    const [errors, setErrors] = useState({})
    const [openModal, setOpenModal] = useState(false)
    const [tagihanData, setTagihanData] = useState("")
    const [feature, setFeature] = useState("")
    const [openDetail, setOpenDetail] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [activeTab, setActiveTab] = useState("list")
    const [tagihanQuery, setTagihanQuery] = useState("")
    const [santriQuery, setSantriQuery] = useState("")
    const [monthInputValue, setMonthInputValue] = useState('');
    const { tagihan, loadingTagihan, error, fetchTagihan, handleDelete, totalPages, currentPage, setCurrentPage } = useFetchTagihan(filters)
    const { menuSantri } = useDropdownSantri()
    const navigate = useNavigate()
    const { clearAuthData } = useLogout()
    const mockSantri = menuSantri.slice(1)
    const mockTagihan = tagihan

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const filteredTagihan =
        tagihanQuery === ""
            ? mockTagihan
            : mockTagihan.filter(
                (tagihan) =>
                    tagihan.nama_tagihan.toLowerCase().includes(tagihanQuery.toLowerCase()) ||
                    tagihan.nominal.toLowerCase().includes(tagihanQuery.toLowerCase())
            )

    const filteredSantri =
        santriQuery === ""
            ? mockSantri
            : mockSantri.filter(
                (santri) =>
                    santri.label.toLowerCase().includes(santriQuery.toLowerCase()) ||
                    santri.nis.toLowerCase().includes(santriQuery.toLowerCase()) ||
                    santri.wilayah.toLowerCase().includes(santriQuery.toLowerCase())
            )

    const selectedTagihan = mockTagihan.find((p) => p.id == formData.tagihan_id)
    const selectedSantri = mockSantri.filter((s) => formData.santri_ids.includes(s.id))

    const validateForm = () => {
        const newErrors = {}
        if (!formData.tagihan_id) {
            newErrors.tagihan_id = "Tagihan harus dipilih"
        }
        if (formData.all == 0) {
            if (!formData.santri_ids || formData.santri_ids.length === 0) {
                newErrors.santri_ids = "Minimal satu santri harus dipilih"
            }
        }
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) {
            const pesanError = Object.values(newErrors).join("<br/>")
            Swal.fire({
                icon: "error",
                title: "Validasi Gagal",
                html: pesanError,
                confirmButtonText: "OK",
            })
            return false
        }
        return true
    }

    const resetData = () => {
        fetchTagihan()
        setFormData({
            tagihan_id: "",
            santri_ids: [],
            jenis_kelamin: "",
            all: null,
        })
        setErrors({})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        }
    }

    const onSubmit = async () => {
        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        })
        if (!confirmResult.isConfirmed) return
        try {
            Swal.fire({
                background: "transparent",
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
                customClass: {
                    popup: "p-0 shadow-none border-0 bg-transparent",
                },
            })
            const token = sessionStorage.getItem("token") || getCookie("token")
            const url = `${API_BASE_URL}tagihan-santri/generate`
            const method = "POST"
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })
            const result = await response.json()
            Swal.close()
            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                })
                clearAuthData()
                navigate("/login")
                return
            }
            if (!response.ok || !result.success) {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join("\n")
                    await Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        text: errorMessages,
                    })
                    return
                }
                throw new Error(result.message || "Terjadi kesalahan pada server.")
            }
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            })
            fetchTagihan()
            resetData()
        } catch (error) {
            console.error("Terjadi kesalahan:", error)
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.message || "Terjadi kesalahan saat mengirim data.",
            })
        }
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

    const handleSantriToggle = (santriId) => {
        setFormData((prev) => ({
            ...prev,
            santri_ids: prev.santri_ids.includes(santriId) ? prev.santri_ids.filter((id) => id !== santriId) : [...prev.santri_ids, santriId],
        }))
    }

    const formatKategori = (kategori) => {
        const map = {
            anak_pegawai: "Anak Pegawai",
            bersaudara: "Bersaudara",
            khadam: "Khadam",
            umum: "Umum",
        }
        return map[kategori] || kategori?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || kategori || "-"
    }

    if (!hasAccess("tagihan")) {
        return <Navigate to="/forbidden" replace />
    }

    return (
        <div className="p-6 mb-8">
            <ModalAddOrEditTagihan isOpen={openModal} onClose={() => setOpenModal(false)} data={tagihanData} refetchData={fetchTagihan} feature={feature} />
            <ModalDetailTagihanSantri isOpen={openDetail} onClose={() => setOpenDetail(false)} id={selectedId} />

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FaFileInvoiceDollar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Manajemen Tagihan</h1>
                            <p className="text-sm text-gray-500">Kelola dan proses tagihan santri dengan mudah.</p>
                        </div>
                    </div>
                    {activeTab === "list" && (
                        <button
                            onClick={() => {
                                setFeature(1)
                                setTagihanData(null)
                                setOpenModal(true)
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-sm transition-all active:scale-95 w-full sm:w-auto justify-center"
                        >
                            <FaPlus />
                            <span>Tambah Tagihan</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setActiveTab("list")}
                            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-t-lg text-sm font-semibold transition-all flex-1 ${activeTab === "list"
                                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <FaListAlt className="w-5 h-5" />
                            <span>Daftar Tagihan</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("form")}
                            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-t-lg text-sm font-semibold transition-all flex-1 ${activeTab === "form"
                                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <FaUsers className="w-5 h-5" />
                            <span>Proses Tagihan Santri</span>
                        </button>
                    </div>
                </div>

                {activeTab === "list" ? (
                    error ? (
                        <div className="text-center py-10">
                            <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Muat Ulang
                            </button>
                        </div>
                    ) : (
                        <>
                            <DoubleScrollbarTable>
                                <table className="w-full min-w-[640px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tagihan</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jatuh Tempo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loadingTagihan ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-10">
                                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="Memuat data..." textColor="" />
                                                </td>
                                            </tr>
                                        ) : tagihan.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-10 text-gray-500">
                                                    Tidak ada data tagihan.
                                                </td>
                                            </tr>
                                        ) : (
                                            tagihan.map((item, index) => (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedId(item.id)
                                                        setOpenDetail(true)
                                                    }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama_tagihan || "-"}</td>
                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.periode || "-"}</td> */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {item.tipe === "bulanan"
                                                            ? "Bulanan"
                                                            : item.tipe === "semester"
                                                                ? "Semester"
                                                                : item.tipe === "tahunan"
                                                                    ? "Tahunan"
                                                                    : "Sekali Bayar"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(item.nominal)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(item.jatuh_tempo)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                                        >
                                                            {item.status ? "Aktif" : "Nonaktif"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setTagihanData(item)
                                                                setFeature(2)
                                                                setOpenModal(true)
                                                            }}
                                                            className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDelete(item.id)
                                                            }}
                                                            className="p-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </DoubleScrollbarTable>
                            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />}
                        </>
                    )
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Jenis Tagihan <span className="text-red-500">*</span>
                            </label>
                            <Combobox value={formData.tagihan_id} onChange={(value) => setFormData((prev) => ({ ...prev, tagihan_id: value }))}>
                                <div className="relative">
                                    <Combobox.Input
                                        className={`w-full px-3 py-2 border ${errors?.tagihan_id ? "border-red-300" : "border-gray-200"
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`}
                                        displayValue={() => (selectedTagihan ? `${selectedTagihan.nama_tagihan} - ${formatCurrency(selectedTagihan.nominal)}` : "")}
                                        onChange={(event) => setTagihanQuery(event.target.value)}
                                        placeholder="Pilih jenis tagihan..."
                                    />
                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                                    </Combobox.Button>
                                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                                            {filteredTagihan.length === 0 ? (
                                                <div className="cursor-default select-none py-2 px-4 text-gray-500">Tidak ditemukan</div>
                                            ) : (
                                                filteredTagihan.map((option) => (
                                                    <Combobox.Option
                                                        key={option.id}
                                                        className={({ active }) =>
                                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"}`
                                                        }
                                                        value={option.id}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                                                    {option.nama_tagihan} - {formatCurrency(option.nominal)}
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
                            {selectedTagihan?.potongans?.length > 0 && (
                                <div className="mt-2 text-xs text-gray-600 border rounded-md p-3 bg-gray-50">
                                    <p className="font-medium text-gray-800 mb-1">Potongan terkait:</p>
                                    <ul className="list-disc list-inside space-y-0.5">
                                        {selectedTagihan.potongans.map((p) => (
                                            <li key={p.id}>
                                                {p.nama} ({formatKategori(p.kategori)}) - {p.jenis === "persentase" ? `${p.nilai}%` : formatCurrency(p.nilai)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="nama_tagihan" className="block text-gray-700">Periode *</label>
                            <input
                                type="month"
                                id="nama_tagihan"
                                name="nama_tagihan"
                                value={monthInputValue}
                                onChange={handlePeriodeChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Pilih Periode"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Jenis Kelamin (Opsional)</label>
                            <select
                                name="jenis_kelamin"
                                value={formData.jenis_kelamin || ""}
                                onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="">Semua Jenis Kelamin</option>
                                <option value="l">Laki-laki</option>
                                <option value="p">Perempuan</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Pilih Data Santri <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-6">
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="all"
                                        value="0"
                                        checked={formData.all == 0}
                                        onChange={(e) => setFormData({ ...formData, all: e.target.value })}
                                        required
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700">Pilih Manual</span>
                                </label>
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="all"
                                        value="1"
                                        checked={formData.all == 1}
                                        onChange={(e) => setFormData({ ...formData, all: e.target.value })}
                                        required
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Semua Santri
                                    </span>
                                </label>
                            </div>

                            {formData.all == 0 && (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={santriQuery}
                                        onChange={(e) => setSantriQuery(e.target.value)}
                                        placeholder="Cari santri berdasarkan nama atau NIS..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {selectedSantri.length > 0 && (
                                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Terpilih ({selectedSantri.length})</div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData((prev) => ({ ...prev, santri_ids: [] }))}
                                                    className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    Hapus Semua
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSantri.map((santri) => (
                                                    <span
                                                        key={santri.id}
                                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white text-blue-800 border border-blue-200 shadow-sm"
                                                    >
                                                        <span>{santri.label}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSantriToggle(santri.id)}
                                                            className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-100 transition-colors"
                                                        >
                                                            <FaTimes className="w-2 h-2" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className={`max-h-56 overflow-y-auto border rounded-lg ${errors.santri_ids ? "border-red-300" : "border-gray-200"}`}>
                                        {filteredSantri.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500">
                                                <FaUsers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                <div className="font-medium">{santriQuery ? "Tidak ada santri ditemukan" : "Tidak ada data santri"}</div>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-200">
                                                {filteredSantri.map((santri) => (
                                                    <div
                                                        key={santri.id}
                                                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                                                        onClick={() => handleSantriToggle(santri.id)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.santri_ids.includes(santri.id)}
                                                            readOnly
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <div className="ml-3 flex-1">
                                                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{santri.label}</div>
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                NIS: {santri.nis} - Wilayah {santri.wilayah}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {errors.santri_ids && <p className="text-sm text-red-600 font-medium mt-1">{errors.santri_ids}</p>}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <button
                                type="button"
                                onClick={resetData}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                            >
                                Proses Tagihan
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Tagihan