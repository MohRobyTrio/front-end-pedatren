"use client"

import { useEffect, useMemo, useState } from "react"
import SearchBar from "../../components/SearchBar"
import Filters from "../../components/Filters"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { OrbitProgress } from "react-loading-indicators"
import Pagination from "../../components/Pagination"
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara"
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah"
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga"
import ModalDetail from "../../components/modal/ModalDetail"
import { FaChartLine, FaPlus, FaBook, FaScroll, FaArrowLeft } from "react-icons/fa"
import MultiStepModal from "../../components/modal/ModalFormNadhoman"
import { useMultiStepFormNadhoman } from "../../hooks/hooks_modal/useMultiStepFormNadhoman"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"
import { ModalExport } from "../../components/modal/ModalExport"
import ModalImport from "../../components/modal/ModalImport"
import NadhomanForm from "../../components/NadhomanForm"
import useFetchNadhoman from "../../hooks/hooks_menu_data_pokok/Nadhoman"
import NadhomanItem from "../../components/NadhomanItem"
import useFetchTahunAjaran from "../../hooks/hooks_menu_akademik/TahunAjaran"
import { Navigate } from "react-router-dom"
import { hasAccess } from "../../utils/hasAccess"
import blankProfile from "../../assets/blank_profile.png"

export const Nadhoman = ({ nadhoman }) => {
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("tambah")
    const [selectedStudent, setSelectedStudent] = useState(nadhoman)
    const [showStudentModal, setShowStudentModal] = useState(false)

    const { allTahunAjaran } = useFetchTahunAjaran();

    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
        if (allTahunAjaran.length > 0 && !selectedYear) {
            const aktif = allTahunAjaran.find((tahun) => tahun.status == true);
            if (aktif) {
                setSelectedYear(aktif.id);
            }
        }
    }, [allTahunAjaran, selectedYear]);

    // eslint-disable-next-line no-unused-vars
    const openModal = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedItem(null)
        setIsModalOpen(false)
    }

    const {
        dataNadhoman,
        loadingNadhoman,
        error,
        limit,
        currentPage,
        fetchData,
        detailNadhoman,
        loadingDetail,
        fetchNadhomanDetail,
    } = useFetchNadhoman({})
    const [viewMode, setViewMode] = useState("table")

    useEffect(() => {
        console.log("student:", nadhoman);
        if (nadhoman) {
            console.log("Fetching detail for nadhoman ID:", nadhoman.santri_id);
            fetchNadhomanDetail(nadhoman.santri_id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nadhoman, nadhoman.santri_id]);

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode")
        if (savedViewMode) {
            setViewMode(savedViewMode)
        }
    }, [])

    const [showFormModal, setShowFormModal] = useState(false)
    const formState = useMultiStepFormNadhoman(() => setShowFormModal(false), fetchData)

    // Mock data untuk demo
    const mockStudents = [
        { nis: "097556282828838", nama: "Ari Surahman", unit: "PONDOKPA", kelas: "2 ULA" },
        { nis: "1717", nama: "Erwanto E. Yusuf", unit: "PONDOKPA", kelas: "2 ULA" },
        { nis: "34534543", nama: "Udin", unit: "PONDOKPA", kelas: "2 ULA" },
        { nis: "123456", nama: "Syamsuri", unit: "PONDOKPA", kelas: "KELAS 1" },
    ]

    const handleSelectStudent = (student) => {
        setSelectedStudent(student)
        setShowStudentModal(false)
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="mb-10 overflow-x-auto">
                {!selectedStudent ? (
                    <div className="text-center py-8">
                        <FaScroll className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">Pilih Tahun Ajaran & Santri</h3>
                        <p className="text-gray-500 mb-4">Silakan pilih tahun ajaran lalu pilih santri untuk menambahkan data nadhoman</p>

                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 m-4"
                        >
                            {allTahunAjaran.map((tahun) => (
                                <option key={tahun.id} value={tahun.id}>
                                    {tahun.tahun_ajaran}
                                </option>
                            ))}
                        </select>

                        {/* Pilih Santri */}
                        <button
                            onClick={() => setShowStudentModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                        >
                            Pilih Santri
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-shrink-0 flex justify-center lg:justify-start">
                                <div className="relative">
                                    <img
                                        src="src\assets\blank_profile.png"
                                        alt={`Foto ${selectedStudent.nama}`}
                                        className="w-24 h-30 md:w-36 md:h-44 rounded-xl object-cover border-3 border-white shadow-lg"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = blankProfile;
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                    NIS
                                                </span>
                                                <span className="text-lg font-semibold text-gray-800">{selectedStudent.nis}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                    Nama Lengkap
                                                </span>
                                                <span className="text-lg font-semibold text-gray-800">{selectedStudent.nama_santri}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                    Kitab
                                                </span>
                                                <span className="text-lg font-semibold text-gray-800">{selectedStudent.nama_kitab}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                                    Bait
                                                </span>
                                                <span className="text-lg font-semibold text-gray-800">{selectedStudent.total_bait} ({selectedStudent.persentase_selesai}%)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-b border-gray-200 mb-6 mt-4">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab("tambah")}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "tambah"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <FaPlus className="inline mr-2" />
                                    Tambah Hafalan
                                </button>
                                <button
                                    onClick={() => setActiveTab("laporan")}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "laporan"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <FaBook className="inline mr-2" />
                                    Laporan Nadhoman
                                </button>
                                <button
                                    onClick={() => setActiveTab("rekap")}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "rekap"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <FaChartLine className="inline mr-2" />
                                    Rekap Laporan
                                </button>
                            </nav>
                        </div>

                        {activeTab === "tambah" && (
                            <NadhomanForm student={selectedStudent} onSuccess={fetchData} refetchDetail={fetchNadhomanDetail} />
                        )}

                        {/* Tab Content */}
                        {activeTab === "laporan" && (
                            <div>
                                {error ? (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                        role="alert"
                                    >
                                        <strong className="font-bold">Error!</strong>
                                        <span className="block sm:inline"> {error}</span>
                                    </div>
                                ) : viewMode === "list" ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {loadingNadhoman ? (
                                            <div className="col-span-3 flex justify-center items-center">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </div>
                                        ) : dataNadhoman.length === 0 ? (
                                            <p className="text-center col-span-3">Tidak ada data</p>
                                        ) : (
                                            dataNadhoman.map((item, index) => (
                                                <NadhomanItem key={index} data={item} title="Data Nadhoman" menu={1} />
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <DoubleScrollbarTable>
                                            <table className="min-w-full text-sm text-left">
                                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                                    <tr>
                                                        <th className="px-3 py-2 border-b w-16">#</th>
                                                        <th className="px-3 py-2 border-b">Tahun Ajaran</th>
                                                        <th className="px-3 py-2 border-b">Tanggal</th>
                                                        <th className="px-3 py-2 border-b">Nama Siswa</th>
                                                        <th className="px-3 py-2 border-b">Nama Kitab</th>
                                                        <th className="px-3 py-2 border-b">Jenis Storan</th>
                                                        <th className="px-3 py-2 border-b">Bait</th>
                                                        <th className="px-3 py-2 border-b">Nilai</th>
                                                        <th className="px-3 py-2 border-b">Catatan</th>
                                                        <th className="px-3 py-2 border-b">Status</th>
                                                        <th className="px-3 py-2 border-b">Pencatat</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-gray-800">
                                                    {loadingDetail ? (
                                                        <tr>
                                                            <td colSpan="9" className="text-center py-6">
                                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                            </td>
                                                        </tr>
                                                    ) : detailNadhoman.data.nadhoman.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="9" className="text-center py-6">
                                                                Tidak ada data
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        detailNadhoman.data.nadhoman.map((item, index) => (
                                                            <tr
                                                                key={item.id || index}
                                                                className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left"
                                                            >
                                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                                <td className="px-3 py-2 border-b">{item.tahun_ajaran || "-"}</td>
                                                                <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
                                                                <td className="px-3 py-2 border-b">{item.santri_nama || "-"}</td>
                                                                <td className="px-3 py-2 border-b">{item.nama_kitab || "-"}</td>
                                                                <td className="px-3 py-2 border-b capitalize">{item.jenis_setoran || "-"}</td>
                                                                <td className="px-3 py-2 border-b">{item.bait || "-"}</td>
                                                                <td className="px-3 py-2 border-b capitalize">{item.nilai || "-"}</td>
                                                                <td className="px-3 py-2 border-b capitalize">{item.catatan || "-"}</td>
                                                                <td className="px-3 py-2 border-b capitalize">{item.status || "-"}</td>
                                                                <td className="px-3 py-2 border-b">{item.pencatat || "-"}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </DoubleScrollbarTable>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === "rekap" && (
                            <div>
                                <DoubleScrollbarTable>
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                            <tr>
                                                <th className="px-3 py-2 border-b w-16">#</th>
                                                <th className="px-3 py-2 border-b">Tahun Ajaran</th>
                                                <th className="px-3 py-2 border-b">NIS</th>
                                                <th className="px-3 py-2 border-b">Nama Santri</th>
                                                <th className="px-3 py-2 border-b">Nama Kitab</th>
                                                <th className="px-3 py-2 border-b">Total Bait</th>
                                                <th className="px-3 py-2 border-b">Progress (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-800">
                                            {loadingDetail ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-6">
                                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                    </td>
                                                </tr>
                                            ) : (
                                                detailNadhoman.data.rekap_nadhoman.map((student, index) => (
                                                    <tr key={student.nis} className="hover:bg-gray-50">
                                                        <td className="px-3 py-2 border-b">{index + 1}</td>
                                                        <td className="px-3 py-2 border-b">{student.tahun_ajaran}</td>
                                                        <td className="px-3 py-2 border-b">{student.nis}</td>
                                                        <td className="px-3 py-2 border-b">{student.santri_nama}</td>
                                                        <td className="px-3 py-2 border-b">{student.nama_kitab}</td>
                                                        <td className="px-3 py-2 border-b">{student.total_bait}</td>
                                                        <td className="px-3 py-2 border-b">
                                                            <div className="flex items-center">
                                                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                                    <div
                                                                        className="bg-green-600 h-2 rounded-full"
                                                                        style={{ width: `${student.persentase_selesai}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-gray-600">{student.persentase_selesai}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </DoubleScrollbarTable>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showStudentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Pilih Data Siswa</h3>
                            <button onClick={() => setShowStudentModal(false)} className="text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 text-left">No</th>
                                        <th className="px-3 py-2 text-left">NIS</th>
                                        <th className="px-3 py-2 text-left">Nama</th>
                                        <th className="px-3 py-2 text-left">Unit Sekolah</th>
                                        <th className="px-3 py-2 text-left">Kelas</th>
                                        <th className="px-3 py-2 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockStudents.map((student, index) => (
                                        <tr key={student.nis} className="hover:bg-gray-50">
                                            <td className="px-3 py-2">{index + 1}</td>
                                            <td className="px-3 py-2">{student.nis}</td>
                                            <td className="px-3 py-2">{student.nama}</td>
                                            <td className="px-3 py-2">{student.unit}</td>
                                            <td className="px-3 py-2">{student.kelas}</td>
                                            <td className="px-3 py-2 text-center">
                                                <button
                                                    onClick={() => handleSelectStudent(student)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    Pilih
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && <ModalDetail title="Data Nadhoman" menu={1} item={selectedItem} onClose={closeModal} />}

            {showFormModal && (
                <MultiStepModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
            )}
        </div>
    )
}

export const NadhomanAllData = () => {
    const [openModalExport, setOpenModalExport] = useState(false)
    const [openModalImport, setOpenModalImport] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [currentView, setCurrentView] = useState(() => {
        return sessionStorage.getItem("nadhoman_view_state") || "rekap";
    });
    const [selectedStudentForTahfidz, setSelectedStudentForTahfidz] = useState(() => {
        const saved = sessionStorage.getItem("nadhoman_selected_student");
        return saved ? JSON.parse(saved) : null;
    });

    // Saat klik Pilih
    const handleSelectStudent = (student) => {
        setSelectedStudentForTahfidz(student);
        setCurrentView("nadhoman");

        sessionStorage.setItem("nadhoman_selected_student", JSON.stringify(student));
        sessionStorage.setItem("nadhoman_view_state", "nadhoman");
    };

    const openModal = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedItem(null)
        setIsModalOpen(false)
    }

    const [filters, setFilters] = useState({
        tahunAjaran: "",
        status: "",
        jenisKelamin: "",
        kitab: "",
        urutBerdasarkan: "",
        urutSecara: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wilayah: "",
        blok: "",
        kamar: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
    })

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara()
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah()
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga()

    const negaraTerpilih = filterNegara.negara.find((n) => n.value == selectedNegara.negara)?.label || ""
    const provinsiTerpilih = filterNegara.provinsi.find((p) => p.value == selectedNegara.provinsi)?.label || ""
    const kabupatenTerpilih = filterNegara.kabupaten.find((k) => k.value == selectedNegara.kabupaten)?.label || ""
    const kecamatanTerpilih = filterNegara.kecamatan.find((kec) => kec.value == selectedNegara.kecamatan)?.label || ""

    const wilayahTerpilih = filterWilayah.wilayah.find((n) => n.value == selectedWilayah.wilayah)?.nama || ""
    const blokTerpilih = filterWilayah.blok.find((p) => p.value == selectedWilayah.blok)?.label || ""
    const kamarTerpilih = filterWilayah.kamar.find((k) => k.value == selectedWilayah.kamar)?.label || ""

    const lembagaTerpilih = filterLembaga.lembaga.find((n) => n.value == selectedLembaga.lembaga)?.label || ""
    const jurusanTerpilih = filterLembaga.jurusan.find((n) => n.value == selectedLembaga.jurusan)?.label || ""
    const kelasTerpilih = filterLembaga.kelas.find((n) => n.value == selectedLembaga.kelas)?.label || ""
    const rombelTerpilih = filterLembaga.rombel.find((n) => n.value == selectedLembaga.rombel)?.label || ""

    // Gabungkan filter tambahan sebelum dipakai
    const updatedFilters = useMemo(
        () => ({
            ...filters,
            negara: negaraTerpilih,
            provinsi: provinsiTerpilih,
            kabupaten: kabupatenTerpilih,
            kecamatan: kecamatanTerpilih,
            wilayah: wilayahTerpilih,
            blok: blokTerpilih,
            kamar: kamarTerpilih,
            lembaga: lembagaTerpilih,
            jurusan: jurusanTerpilih,
            kelas: kelasTerpilih,
            rombel: rombelTerpilih,
        }),
        [
            blokTerpilih,
            filters,
            jurusanTerpilih,
            kabupatenTerpilih,
            kamarTerpilih,
            kecamatanTerpilih,
            kelasTerpilih,
            lembagaTerpilih,
            negaraTerpilih,
            provinsiTerpilih,
            rombelTerpilih,
            wilayahTerpilih,
        ],
    )

    const {
        dataNadhoman,
        loadingNadhoman,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        fetchData,
    } = useFetchNadhoman(updatedFilters)
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState("table")

    const handleBackToRekap = () => {
        setCurrentView("rekap");
        setSelectedStudentForTahfidz(null);
        fetchData(true);

        sessionStorage.setItem("nadhoman_view_state", "rekap");
        sessionStorage.removeItem("nadhoman_selected_student");
    };

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode")
        if (savedViewMode) {
            setViewMode(savedViewMode)
        }
    }, [])

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const filter4 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" },
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIUP", value: "niup" },
            { label: "Jenis Kelamin", value: "jenis_kelamin" },
        ],
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" },
        ]
    }

    const fieldsExports = [
        { label: "NIS", value: "nis" },
        { label: "Nama Siswa", value: "nama_siswa" },
        { label: "Kelas", value: "kelas" },
        { label: "Kitab", value: "kitab" },
        { label: "Jumlah Hafalan Baru", value: "hafalan_baru" },
        { label: "Keterangan Hafalan", value: "keterangan_hafalan" },
        { label: "Tanggal", value: "tanggal" },
    ]

    const handleImportSuccess = () => {
        fetchData()
    }

    if (!hasAccess("nadhoman")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            {currentView === "nadhoman" ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-4 justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Informasi Santri Terpilih
                        </h3>
                        <button
                            onClick={handleBackToRekap}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                        >
                            <FaArrowLeft className="w-4 h-4" />
                            Kembali
                        </button>
                    </div>
                    <Nadhoman nadhoman={selectedStudentForTahfidz} />
                </div>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                            Data Nadhoman Santri
                        </h1>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                        <div>
                            {error ? (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                    role="alert"
                                >
                                    <strong className="font-bold">Error!</strong>
                                    <span className="block sm:inline"> {error}</span>
                                </div>
                            ) : viewMode === "list" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {loadingNadhoman ? (
                                        <div className="col-span-3 flex justify-center items-center">
                                            <OrbitProgress variant="disc" color="#d97706" size="small" text="" textColor="" />
                                        </div>
                                    ) : dataNadhoman.length === 0 ? (
                                        <p className="text-center col-span-3">Tidak ada data</p>
                                    ) : (
                                        dataNadhoman.map((item, index) => (
                                            <NadhomanItem key={index} data={item} title="Data Nadhoman" menu={1} />
                                        ))
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div
                                        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full ${showFilters ? "mb-4" : ""}`}
                                    >
                                        <Filters
                                            showFilters={showFilters}
                                            filterOptions={filterNegara}
                                            onChange={handleFilterChangeNegara}
                                            selectedFilters={selectedNegara}
                                        />
                                        <Filters
                                            showFilters={showFilters}
                                            filterOptions={filterWilayah}
                                            onChange={handleFilterChangeWilayah}
                                            selectedFilters={selectedWilayah}
                                        />
                                        <Filters
                                            showFilters={showFilters}
                                            filterOptions={filterLembaga}
                                            onChange={handleFilterChangeLembaga}
                                            selectedFilters={selectedLembaga}
                                        />
                                        <Filters
                                            showFilters={showFilters}
                                            filterOptions={filter4}
                                            onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                                            selectedFilters={filters}
                                        />
                                    </div>

                                    <SearchBar
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        totalData={totalData}
                                        limit={limit}
                                        toggleLimit={(e) => setLimit(Number(e.target.value))}
                                        toggleFilters={() => setShowFilters(!showFilters)}
                                        toggleView={setViewMode}
                                        onRefresh={() => fetchData(true)}
                                        loadingRefresh={loadingNadhoman}
                                    />

                                    <DoubleScrollbarTable>
                                        <table className="min-w-full text-sm text-left">
                                            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                                <tr>
                                                    <th className="px-3 py-2 border-b w-16">#</th>
                                                    <th className="px-3 py-2 border-b">Nama Siswa</th>
                                                    <th className="px-3 py-2 border-b">NIS</th>
                                                    <th className="px-3 py-2 border-b">Kitab</th>
                                                    <th className="px-3 py-2 border-b">Total Bait</th>
                                                    <th className="px-3 py-2 border-b">Progress (%)</th>
                                                    <th className="px-3 py-2 border-b text-center w-24">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-800">
                                                {loadingNadhoman ? (
                                                    <tr>
                                                        <td colSpan="14" className="text-center py-6">
                                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                        </td>
                                                    </tr>
                                                ) : dataNadhoman.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="14" className="text-center py-6">
                                                            Tidak ada data
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    dataNadhoman.map((item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                                                            onClick={() => {
                                                                openModal(item)
                                                            }}
                                                        >
                                                            <td className="px-3 py-2 border-b text-center">{(currentPage - 1) * limit + index + 1}</td>
                                                            <td className="px-3 py-2 border-b">{item.nama_santri || "-"}</td>
                                                            <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
                                                            <td className="px-3 py-2 border-b">{item.nama_kitab || "-"}</td>
                                                            <td className="px-3 py-2 border-b">{item.total_bait || "-"}</td>
                                                            {/* <td className="px-3 py-2 border-b capitalize">{item.nilai || "-"}</td> */}
                                                            <td className="px-3 py-2 border-b">
                                                                <div className="flex items-center">
                                                                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                                        <div
                                                                            className="bg-green-600 h-2 rounded-full"
                                                                            style={{ width: `${item.persentase_selesai}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-gray-600">{item.persentase_selesai}%</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2 border-b text-center">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleSelectStudent(item)
                                                                    }}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center gap-1 mx-auto"
                                                                >
                                                                    <FaPlus className="w-3 h-3" />
                                                                    Setoran
                                                                </button>
                                                            </td>
                                                            {/* <td className="px-3 py-2 border-b text-center">
                                                            <div className="flex items-center justify-center space-x-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        // Handle edit action
                                                                    }}
                                                                    className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        // Handle delete action
                                                                    }}
                                                                    className="p-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded cursor-pointer"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td> */}
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </DoubleScrollbarTable>

                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        handlePageChange={handlePageChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <ModalExport
                        isOpen={openModalExport}
                        onClose={() => setOpenModalExport(false)}
                        filters={updatedFilters}
                        searchTerm={searchTerm}
                        limit={limit}
                        currentPage={currentPage}
                        fields={fieldsExports}
                        endpoint="export/nadhoman"
                    />

                    <ModalImport
                        isOpen={openModalImport}
                        onClose={() => setOpenModalImport(false)}
                        onSuccess={handleImportSuccess}
                        title="Import Data Nadhoman"
                        endpoint="import/nadhoman"
                        templateUrl="/template/nadhoman_import_template.xlsx"
                        templateName="template_nadhoman.xlsx"
                        instructions={[
                            "Download template terlebih dahulu",
                            "Isi data sesuai format template (header di baris 2)",
                            "Jangan mengubah nama kolom/header",
                            "Pastikan format tanggal menggunakan YYYY-MM-DD",
                            "Upload file yang sudah diisi dan klik 'Import Data'",
                        ]}
                    />

                    {isModalOpen && <ModalDetail title="Data Nadhoman" menu={25} item={selectedItem} onClose={closeModal} handleSelect={handleSelectStudent} />}

                    {/* {showFormModal && (
                <MultiStepModal isOpen={showFormModal} onClose={() => setShowFormModal(false)} formState={formState} />
            )} */}
                </>
            )}
        </div>
    )
}
