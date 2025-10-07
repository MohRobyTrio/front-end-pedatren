"use client"

import { useEffect, useState } from "react"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    RotateCcw,
    X,
    SlidersHorizontal,
    Loader2,
} from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"
import useFetchTransaksiOrtu from "../../hooks/hooks_ortu/Transaksi"
import { FaClipboardList } from "react-icons/fa"

export const KeuanganPage = () => {
    const { activeChild: selectedChild } = useActiveChild()
    const [transferFilter, setTransferFilter] = useState("semua")
    const [showFilter, setShowFilter] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [dateRange, setDateRange] = useState({ start: "", end: "" })
    // eslint-disable-next-line no-unused-vars
    const [activeTab, setActiveTab] = useState("transaksi")
    // const [searchTerm, setSearchTerm] = useState("")

    const { data, loading, filtering, error, fetchData, searchTerm, setSearchTerm, currentPage, setCurrentPage, totalPages, totalData } = useFetchTransaksiOrtu()
    // const { menuOutlet } = DropdownOutlet()

    const [filters, setFilters] = useState({
        outlet_id: "",
        kategori_id: "",
        date_from: "",
        date_to: "",
        q: ""
    })

    // const { menuKategori } = DropdownKategori(filters.outlet_id)
    const toggleFilter = () => setShowFilter((prev) => !prev);

    useEffect(() => {
        fetchData(filters, true, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])

    // Mock data - replace with actual API calls
    // const mockSaldo = 250000

    // const mockTransaksiData = data

    // const mockTransaksiData = [
    //     {
    //         id: 1,
    //         tanggal: "2025-01-15T14:30:00",
    //         jenis: "pembelian",
    //         deskripsi: "Kantin - Makan siang",
    //         nominal: -15000,
    //         saldoAkhir: 250000,
    //         kategori: "makanan",
    //         outlet: { nama_outlet: "Kantin Utama" },
    //     },
    //     {
    //         id: 2,
    //         tanggal: "2025-01-15T10:15:00",
    //         jenis: "pembelian",
    //         deskripsi: "Koperasi - Alat tulis",
    //         nominal: -25000,
    //         saldoAkhir: 265000,
    //         kategori: "alat_tulis",
    //         outlet: { nama_outlet: "Koperasi Santri" },
    //     },
    //     {
    //         id: 3,
    //         tanggal: "2025-01-14T16:00:00",
    //         jenis: "top_up",
    //         deskripsi: "Transfer dari orang tua",
    //         nominal: 200000,
    //         saldoAkhir: 290000,
    //         kategori: "transfer",
    //         outlet: { nama_outlet: "Transfer" },
    //     },
    //     {
    //         id: 4,
    //         tanggal: "2025-01-12T12:45:00",
    //         jenis: "pembelian",
    //         deskripsi: "Kantin - Snack",
    //         nominal: -8000,
    //         saldoAkhir: 90000,
    //         kategori: "makanan",
    //         outlet: { nama_outlet: "Kantin Utama" },
    //     },
    //     {
    //         id: 5,
    //         tanggal: "2025-01-10T09:30:00",
    //         jenis: "pembelian",
    //         deskripsi: "Laundry",
    //         nominal: -12000,
    //         saldoAkhir: 98000,
    //         kategori: "laundry",
    //         outlet: { nama_outlet: "Laundry Santri" },
    //     },
    // ]

    const mockTransferData = [
        {
            id: 1,
            tanggal: "2025-01-14T16:00:00",
            jenis: "masuk",
            nominal: 200000,
            pengirim: "Ahmad Wijaya (Ayah)",
            status: "berhasil",
            keterangan: "Top up bulanan",
        },
        {
            id: 2,
            tanggal: "2025-01-01T08:00:00",
            jenis: "masuk",
            nominal: 150000,
            pengirim: "Ahmad Wijaya (Ayah)",
            status: "berhasil",
            keterangan: "Uang saku awal bulan",
        },
        {
            id: 3,
            tanggal: "2024-12-28T14:30:00",
            jenis: "keluar",
            nominal: -50000,
            penerima: "Rekening Bank - 1234567890",
            status: "berhasil",
            keterangan: "Penarikan tunai",
        },
    ]

    const mockTagihanData = [
        {
            id: 1,
            nama: "SPP Bulanan",
            periode: "Januari 2025",
            jatuhTempo: "2025-01-25",
            jumlah: 500000,
            terbayar: 0,
            sisa: 500000,
            status: "belum_lunas",
            kategori: "spp",
        },
        {
            id: 2,
            nama: "Biaya Makan",
            periode: "Januari 2025",
            jatuhTempo: "2025-01-20",
            jumlah: 300000,
            terbayar: 300000,
            sisa: 0,
            status: "lunas",
            kategori: "makan",
        },
        {
            id: 3,
            nama: "Biaya Asrama",
            periode: "Semester Genap 2024/2025",
            jatuhTempo: "2025-02-01",
            jumlah: 1000000,
            terbayar: 500000,
            sisa: 500000,
            status: "cicilan",
            kategori: "asrama",
        },
    ]

    // useEffect(() => {
    //     setLoading(true)
    //     // const activeChild = sessionStorage.getItem("active_child")
    //     // if (activeChild) {
    //     //     setSelectedChild(JSON.parse(activeChild))
    //     // }

    //     // Simulate loading
    //     setTimeout(() => setLoading(false), 1500)
    // }, [selectedChild])

    // Utility functions
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatTanggal = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    // const formatTanggalWaktu = (dateString) => {
    //     return new Date(dateString).toLocaleString("id-ID", {
    //         day: "2-digit",
    //         month: "2-digit",
    //         year: "numeric",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //     })
    // }

    const formatTanggalWaktu = (dateString) => {
        if (!dateString) return "-";
        const [date, time] = dateString.split("T");
        const [year, month, day] = date.split("-");
        const [hour, minute] = time.split(":");
        return `${day}/${month}/${year} ${hour}:${minute}`;
    };


    const getStatusColor = (status) => {
        switch (status) {
            case "berhasil":
            case "lunas":
                return "bg-emerald-100 text-emerald-800"
            case "pending":
            case "cicilan":
                return "bg-amber-100 text-amber-800"
            case "gagal":
            case "belum_lunas":
            case "terlambat":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Custom components
    const Card = ({ children, className = "" }) => (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
    )

    const CardHeader = ({ children, className = "" }) => (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
    )

    const CardContent = ({ children, className = "" }) => <div className={`px-6 py-4 ${className}`}>{children}</div>

    const CardTitle = ({ children, className = "" }) => (
        <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
    )

    const Badge = ({ children, className = "" }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
            {children}
        </span>
    )

    const Button = ({ children, onClick, variant = "default", className = "", ...props }) => {
        const baseClasses =
            "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        const variants = {
            default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
            outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
            ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        }

        return (
            <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
                {children}
            </button>
        )
    }

    const Select = ({ value, onValueChange, children, className = "", disabled = false }) => {
        return (
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                disabled={disabled} // ✅ disable kalau tidak ada data
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
            >
                {children}
            </select>
        )
    }

    const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

    const DataTable = ({ data, columns, pageSize }) => {
        const startIndex = (currentPage - 1) * pageSize

        return (
            <div>
                {filtering ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Memuat Data...
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Mohon tunggu sebentar, data sedang diproses.
                        </p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Terjadi Kesalahan
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {error || "Gagal mengambil data perizinan"}
                        </p>
                        <button
                            onClick={() => fetchData(true)}
                            className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : data.length == 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaClipboardList className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Tidak Ada Data
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm">
                            Belum ada data yang tersedia.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.key}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {column.render ? column.render(row[column.key], row) : row[column.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {startIndex + 1} - {Math.min(startIndex + pageSize, totalData)} dari{" "}
                            {totalData} data
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-2 text-sm text-gray-700">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="space-y-6 animate-pulse">
            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div> */}

            <div className="py-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    // Filter functions
    // const filteredTransactions = mockTransaksiData.filter((item) => {
    //     const typeMatch = transactionFilter === "semua" || item.jenis === transactionFilter
    //     const dateMatch =
    //         (!dateRange.start || item.tanggal >= dateRange.start) && (!dateRange.end || item.tanggal <= dateRange.end)
    //     return typeMatch && dateMatch
    // })

    const filteredTransfers = mockTransferData.filter((item) => {
        const typeMatch = transferFilter === "semua" || item.jenis === transferFilter
        const dateMatch =
            (!dateRange.start || item.tanggal >= dateRange.start) && (!dateRange.end || item.tanggal <= dateRange.end)
        return typeMatch && dateMatch
    })

    // const exportToCSV = (data, filename) => {
    //     const headers = Object.keys(data[0]).join(",")
    //     const csvContent = [
    //         headers,
    //         ...data.map((row) =>
    //             Object.values(row)
    //                 .map((value) => (typeof value === "string" && value.includes(",") ? `"${value}"` : value))
    //                 .join(","),
    //         ),
    //     ].join("\n")

    //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    //     const url = URL.createObjectURL(blob)
    //     const link = document.createElement("a")
    //     link.setAttribute("href", url)
    //     link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
    //     link.style.visibility = "hidden"
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    //     URL.revokeObjectURL(url)
    // }

    // const stats = {
    //     saldo: mockSaldo,
    //     totalPengeluaran: mockTransaksiData.filter((t) => t.nominal < 0).reduce((sum, t) => sum + Math.abs(t.nominal), 0),
    //     totalTopUp: mockTransaksiData.filter((t) => t.nominal > 0).reduce((sum, t) => sum + t.nominal, 0),
    //     tagihanAktif: mockTagihanData.filter((t) => t.status !== "lunas").length,
    //     totalTagihan: mockTagihanData.filter((t) => t.status !== "lunas").reduce((sum, t) => sum + t.sisa, 0),
    // }

    const formatTanggalWaktuWIB = (dateString) => {
        if (!dateString) return "-";

        // 1. Buat objek Date. JavaScript akan otomatis mengonversi dari UTC ke lokal.
        const date = new Date(dateString);

        // 2. Format tanggal sesuai keinginan menggunakan Intl.DateTimeFormat (lebih modern)
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // Gunakan format 24 jam (menampilkan 16:55 bukan 04:55 PM)
        }).format(date);
    };

    const transactionColumns = [
        {
            key: "tanggal",
            label: "Waktu Transaksi",
            render: (value) => formatTanggalWaktuWIB(value),
        },
        {
            key: "outlet",
            label: "Outlet & Kategori", // Label diubah
            render: (value, row) => (
                <div>
                    <div className="font-semibold text-gray-800">{value?.nama_outlet || "-"}</div>
                    <div className="text-xs text-gray-500">{row.kategori?.nama_kategori || "-"}</div>
                </div>
            ),
        },
        {
            key: "tipe",
            label: "Tipe",
            render: (value) => (
                <Badge className={
                    value === 'topup' ? "bg-emerald-100 text-emerald-800" :
                        value === 'debit' ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                }>
                    {value}
                </Badge>
            ),
        },
        {
            key: "total_bayar",
            label: "Nominal",
            render: (value, row) => (
                <span className={`font-semibold font-mono ${row.tipe === 'topup' ? "text-emerald-600" : "text-red-600"}`}>
                    {row.tipe === 'topup' ? '+' : '-'}
                    {formatRupiah(value)}
                </span>
            ),
        },
        {
            key: "keterangan",
            label: "Keterangan",
            render: (value) => (
                <div className="whitespace-normal">{value || "-"}</div>
            )
        },
    ];

    const transferColumns = [
        {
            key: "tanggal",
            label: "Tanggal",
            sortable: true,
            render: (value) => formatTanggalWaktu(value),
        },
        {
            key: "jenis",
            label: "Jenis",
            sortable: true,
            render: (value) => (
                <div className="flex items-center">
                    {value === "masuk" ? (
                        <ArrowDownLeft className="h-4 w-4 text-emerald-600 mr-2" />
                    ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600 mr-2" />
                    )}
                    <Badge className={value === "masuk" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                        {value === "masuk" ? "Masuk" : "Keluar"}
                    </Badge>
                </div>
            ),
        },
        {
            key: "nominal",
            label: "Nominal",
            sortable: true,
            render: (value) => (
                <span className={`font-semibold ${value > 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {formatRupiah(Math.abs(value))}
                </span>
            ),
        },
        {
            key: "pengirim",
            label: "Pengirim/Penerima",
            sortable: false,
            render: (value, row) => row.pengirim || row.penerima || "-",
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <Badge className={getStatusColor(value)}>
                    {value === "berhasil" ? "Berhasil" : value === "pending" ? "Pending" : value === "gagal" ? "Gagal" : value}
                </Badge>
            ),
        },
    ]

    const tagihanColumns = [
        {
            key: "nama",
            label: "Nama Tagihan",
            sortable: true,
        },
        {
            key: "periode",
            label: "Periode",
            sortable: true,
        },
        {
            key: "jatuhTempo",
            label: "Jatuh Tempo",
            sortable: true,
            render: (value) => {
                const isOverdue = new Date(value) < new Date()
                return <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-900"}>{formatTanggal(value)}</span>
            },
        },
        {
            key: "jumlah",
            label: "Jumlah",
            sortable: true,
            render: (value) => formatRupiah(value),
        },
        {
            key: "sisa",
            label: "Sisa",
            sortable: true,
            render: (value) => (
                <span className={`font-semibold ${value > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {formatRupiah(value)}
                </span>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <Badge className={getStatusColor(value)}>
                    {value === "lunas"
                        ? "Lunas"
                        : value === "belum_lunas"
                            ? "Belum Lunas"
                            : value === "cicilan"
                                ? "Cicilan"
                                : value === "terlambat"
                                    ? "Terlambat"
                                    : value}
                </Badge>
            ),
        },
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <LoadingSkeleton />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Wallet className="mr-3 h-6 w-6 text-purple-600" />
                        Transaksi
                    </h1>
                    <p className="text-gray-600 mt-1">Kelola transaksi {selectedChild?.nama || "santri"}</p>
                </div>

                {/* Tabs */}
                <div className="space-y-6">
                    {/* Tambahkan bagian ini di dalam return JSX, di atas Card Riwayat Transaksi */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card className="text-center">
                            <CardContent>
                                <p className="text-sm text-gray-500">Total Top Up</p>
                                <p className="text-xl font-bold text-emerald-600">{formatRupiah(data?.rekap?.total_topup || 0)}</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent>
                                <p className="text-sm text-gray-500">Total Debit</p>
                                <p className="text-xl font-bold text-red-600">{formatRupiah(data?.rekap?.total_debit || 0)}</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent>
                                <p className="text-sm text-gray-500">Total Kredit</p>
                                <p className="text-xl font-bold text-blue-600">{formatRupiah(data?.rekap?.total_kredit || 0)}</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent>
                                <p className="text-sm text-gray-500">Total Refund</p>
                                <p className="text-xl font-bold text-amber-600">{formatRupiah(data?.rekap?.total_refund || 0)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {activeTab === "transaksi" && (
                        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm`}>
                            <CardHeader>
                                <div className="flex flex-row items-center justify-between gap-4">
                                    <CardTitle>Riwayat Transaksi</CardTitle>
                                    <button
                                        onClick={toggleFilter}
                                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${showFilter ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700" : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"}`}
                                    >
                                        {showFilter ? (
                                            <>
                                                <X className="w-4 h-4" />
                                                Tutup Filter
                                            </>
                                        ) : (
                                            <>
                                                <SlidersHorizontal className="w-4 h-4" />
                                                Filter
                                            </>
                                        )}
                                    </button>
                                </div>
                            </CardHeader>

                            <div className="px-6 py-4">
                                {showFilter && (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Filter className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">Filter Data</span>

                                            <button
                                                // onClick={resetFilters}
                                                className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors duration-200"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                Reset
                                            </button>

                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Outlet */}
                                            {/* <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Outlet</label>
                                                <Select
                                                    value={filters.outlet_id}
                                                    onValueChange={(value) =>
                                                        setFilters((prev) => ({ ...prev, outlet_id: value }))
                                                    }
                                                    disabled={menuOutlet.length == 0} // ✅ disable kalau tidak ada data
                                                    className={`text-sm ${menuOutlet.length == 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                >
                                                    <SelectItem value="">Semua Outlet</SelectItem>
                                                    {menuOutlet.map((outlet, i) => (
                                                        <SelectItem key={i} value={outlet.id}>
                                                            {outlet.nama_outlet}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                {menuOutlet.length === 0 && (
                                                    <p className="text-xs text-gray-400 mt-1">Tidak ada outlet tersedia</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Kategori</label>
                                                <Select
                                                    value={filters.kategori_id}
                                                    onValueChange={(value) =>
                                                        setFilters((prev) => ({ ...prev, kategori_id: value }))
                                                    }
                                                    disabled={menuKategori.length == 0} // ✅ disable kalau tidak ada data
                                                    className={`text-sm ${menuKategori.length == 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                >
                                                    <SelectItem value="">Semua Kategori</SelectItem>
                                                    {menuKategori.map((kategori, i) => (
                                                        <SelectItem key={i} value={kategori.value}>
                                                            {kategori.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>

                                                {menuKategori.length === 0 && (
                                                    <p className="text-xs text-gray-400 mt-1">Tidak ada kategori tersedia</p>
                                                )}
                                            </div> */}


                                            {/* Date From */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Dari Tanggal</label>
                                                <input
                                                    type="date"
                                                    value={filters.date_from}
                                                    onChange={(e) =>
                                                        setFilters((prev) => ({ ...prev, date_from: e.target.value }))
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            {/* Date To */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                                                <input
                                                    type="date"
                                                    value={filters.date_to}
                                                    onChange={(e) =>
                                                        setFilters((prev) => ({ ...prev, date_to: e.target.value }))
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                )}
                                {/* <div className="relative">
                                    <input
                                    
                                        type="text"
                                        placeholder="Cari transaksi..."
                                        value={filters.q}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
                                        // className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div> */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari transaksi..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <DataTable
                                        data={data.data}
                                        columns={transactionColumns}
                                        pageSize={25}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "transfer" && (
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <CardTitle>Riwayat Transfer</CardTitle>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Select
                                            value={
                                                transferFilter === "semua"
                                                    ? "Semua Jenis"
                                                    : transferFilter === "masuk"
                                                        ? "Transfer Masuk"
                                                        : "Transfer Keluar"
                                            }
                                            onValueChange={(value) =>
                                                setTransferFilter(
                                                    value === "Semua Jenis" ? "semua" : value === "Transfer Masuk" ? "masuk" : "keluar",
                                                )
                                            }
                                            className="w-full sm:w-48"
                                        >
                                            <SelectItem value="semua" onSelect={() => setTransferFilter("semua")}>
                                                Semua Jenis
                                            </SelectItem>
                                            <SelectItem value="masuk" onSelect={() => setTransferFilter("masuk")}>
                                                Transfer Masuk
                                            </SelectItem>
                                            <SelectItem value="keluar" onSelect={() => setTransferFilter("keluar")}>
                                                Transfer Keluar
                                            </SelectItem>
                                        </Select>
                                        {/* <Button
                                            variant="outline"
                                            onClick={() => exportToCSV(filteredTransfers, "transfer")}
                                            className="w-full sm:w-auto"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export CSV
                                        </Button> */}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={filteredTransfers}
                                    columns={transferColumns}
                                    searchPlaceholder="Cari pengirim atau keterangan..."
                                    pageSize={10}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "tagihan" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <CardTitle>Daftar Tagihan</CardTitle>
                                        {/* <Button
                                            variant="outline"
                                            onClick={() => exportToCSV(mockTagihanData, "tagihan")}
                                            className="w-full sm:w-auto"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export CSV
                                        </Button> */}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <DataTable
                                        data={mockTagihanData}
                                        columns={tagihanColumns}
                                        searchPlaceholder="Cari nama tagihan atau periode..."
                                        pageSize={10}
                                    />
                                </CardContent>
                            </Card>

                            {/* Active Bills Summary */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card className="border-red-100">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-red-700">Tagihan Belum Lunas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {mockTagihanData
                                                .filter((t) => t.status === "belum_lunas")
                                                .map((tagihan) => (
                                                    <div key={tagihan.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{tagihan.nama}</p>
                                                            <p className="text-sm text-gray-600">{tagihan.periode}</p>
                                                            <p className="text-xs text-red-600">Jatuh tempo: {formatTanggal(tagihan.jatuhTempo)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-red-600">{formatRupiah(tagihan.sisa)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-emerald-100">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-emerald-700">Tagihan Lunas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {mockTagihanData
                                                .filter((t) => t.status === "lunas")
                                                .map((tagihan) => (
                                                    <div
                                                        key={tagihan.id}
                                                        className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"
                                                    >
                                                        <div>
                                                            <p className="font-medium text-gray-900">{tagihan.nama}</p>
                                                            <p className="text-sm text-gray-600">{tagihan.periode}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-emerald-600">{formatRupiah(tagihan.jumlah)}</p>
                                                            <Badge className="bg-emerald-100 text-emerald-800">Lunas</Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === "topup" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Up Saldo Dompet</CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Transfer ke salah satu nomor Virtual Account di bawah ini untuk menambah saldo dompet santri
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {/* BCA Virtual Account */}
                                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">BCA</span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="font-semibold text-gray-900">Bank BCA</h3>
                                                        <p className="text-xs text-gray-600">Virtual Account</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border">
                                                <p className="text-xs text-gray-600 mb-1">Nomor Virtual Account</p>
                                                <p className="font-mono text-lg font-bold text-gray-900">
                                                    70014 {selectedChild?.id || "123456"}
                                                </p>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(`70014${selectedChild?.id || "123456"}`)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                                >
                                                    Salin Nomor
                                                </button>
                                            </div>
                                        </div>

                                        {/* BNI Virtual Account */}
                                        <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">BNI</span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="font-semibold text-gray-900">Bank BNI</h3>
                                                        <p className="text-xs text-gray-600">Virtual Account</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border">
                                                <p className="text-xs text-gray-600 mb-1">Nomor Virtual Account</p>
                                                <p className="font-mono text-lg font-bold text-gray-900">
                                                    8808 {selectedChild?.id || "123456"}
                                                </p>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(`8808${selectedChild?.id || "123456"}`)}
                                                    className="text-xs text-orange-600 hover:text-orange-800 mt-1"
                                                >
                                                    Salin Nomor
                                                </button>
                                            </div>
                                        </div>

                                        {/* BRI Virtual Account */}
                                        <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">BRI</span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="font-semibold text-gray-900">Bank BRI</h3>
                                                        <p className="text-xs text-gray-600">Virtual Account</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border">
                                                <p className="text-xs text-gray-600 mb-1">Nomor Virtual Account</p>
                                                <p className="font-mono text-lg font-bold text-gray-900">
                                                    26207 {selectedChild?.id || "123456"}
                                                </p>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(`26207${selectedChild?.id || "123456"}`)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                                >
                                                    Salin Nomor
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mandiri Virtual Account */}
                                        <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-bold text-xs">MDR</span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="font-semibold text-gray-900">Bank Mandiri</h3>
                                                        <p className="text-xs text-gray-600">Virtual Account</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border">
                                                <p className="text-xs text-gray-600 mb-1">Nomor Virtual Account</p>
                                                <p className="font-mono text-lg font-bold text-gray-900">
                                                    70012 {selectedChild?.id || "123456"}
                                                </p>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(`70012${selectedChild?.id || "123456"}`)}
                                                    className="text-xs text-yellow-600 hover:text-yellow-800 mt-1"
                                                >
                                                    Salin Nomor
                                                </button>
                                            </div>
                                        </div>

                                        {/* BSI Virtual Account */}
                                        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">BSI</span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="font-semibold text-gray-900">Bank Syariah Indonesia</h3>
                                                        <p className="text-xs text-gray-600">Virtual Account</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border">
                                                <p className="text-xs text-gray-600 mb-1">Nomor Virtual Account</p>
                                                <p className="font-mono text-lg font-bold text-gray-900">
                                                    8091 {selectedChild?.id || "123456"}
                                                </p>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(`8091${selectedChild?.id || "123456"}`)}
                                                    className="text-xs text-green-600 hover:text-green-800 mt-1"
                                                >
                                                    Salin Nomor
                                                </button>
                                            </div>
                                        </div>

                                        {/* CIMB Niaga Virtual Account */}
                                        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-bold text-xs">CIMB</span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="font-semibold text-gray-900">CIMB Niaga</h3>
                                                        <p className="text-xs text-gray-600">Virtual Account</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border">
                                                <p className="text-xs text-gray-600 mb-1">Nomor Virtual Account</p>
                                                <p className="font-mono text-lg font-bold text-gray-900">
                                                    7221 {selectedChild?.id || "123456"}
                                                </p>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(`7221${selectedChild?.id || "123456"}`)}
                                                    className="text-xs text-red-600 hover:text-red-800 mt-1"
                                                >
                                                    Salin Nomor
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructions Card */}
                            <Card className="border-blue-100 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="text-blue-800">Cara Top Up Saldo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Melalui ATM</h4>
                                                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                                                    <li>Pilih menu &quot;Transfer&quot;</li>
                                                    <li>Pilih &quot;Virtual Account&quot; atau &quot;Rekening Lain&quot;</li>
                                                    <li>Masukkan nomor Virtual Account</li>
                                                    <li>Masukkan nominal yang ingin ditransfer</li>
                                                    <li>Konfirmasi transaksi</li>
                                                </ol>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Melalui Mobile Banking</h4>
                                                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                                                    <li>Buka aplikasi mobile banking</li>
                                                    <li>Pilih menu &quot;Transfer&quot;</li>
                                                    <li>Pilih &quot;Virtual Account&quot;</li>
                                                    <li>Masukkan nomor Virtual Account</li>
                                                    <li>Masukkan nominal dan konfirmasi</li>
                                                </ol>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">!</span>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <h5 className="font-medium text-gray-900">Penting untuk diketahui:</h5>
                                                    <ul className="text-sm text-gray-700 mt-1 space-y-1">
                                                        <li>• Saldo akan otomatis bertambah setelah transfer berhasil (maksimal 15 menit)</li>
                                                        <li>• Minimum top up Rp 10.000</li>
                                                        <li>• Tidak ada biaya admin untuk top up</li>
                                                        <li>• Simpan bukti transfer untuk keperluan konfirmasi</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
