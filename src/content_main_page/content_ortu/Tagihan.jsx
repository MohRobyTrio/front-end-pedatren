"use client"

import { useState, useEffect } from "react"
import {
    FileText,
    Search,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    AlertCircle,
} from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"
import { useTagihanSantri } from "../../hooks/hooks_ortu/Tagihan"

export const TagihanPage = () => {
    const { activeChild: selectedChild } = useActiveChild()
    // const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [statusFilter, setStatusFilter] = useState("semua")

    const {
        tagihanList,
        statistik,
        loading
    } = useTagihanSantri();


    useEffect(() => {
        // setLoading(true)
        // Simulate loading
        // setTimeout(() => setLoading(false), 1500)
    }, [selectedChild])

    const formatTanggal = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "lunas":
                return "bg-emerald-100 text-emerald-800"
            case "sebagian":
                return "bg-amber-100 text-amber-800"
            case "pending":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "lunas":
                return <CheckCircle className="h-4 w-4 text-emerald-600" />
            case "sebagian":
                return <Clock className="h-4 w-4 text-amber-600" />
            case "pending":
                return <AlertCircle className="h-4 w-4 text-red-600" />
            default:
                return <Clock className="h-4 w-4 text-gray-600" />
        }
    }

    const isOverdue = (dateString) => {
        return new Date(dateString) < new Date()
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

    const Button = ({ children, onClick, variant = "default", className = "", disabled = false, ...props }) => {
        const baseClasses =
            "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        const variants = {
            default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
            outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
            ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        }

        const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`}
                {...props}
            >
                {children}
            </button>
        )
    }

    // Filter functions
    const filteredTagihan = tagihanList.filter((item) => {
        const statusMatch = statusFilter === "semua" || item.status === statusFilter
        const searchMatch =
            item.tagihan.nama_tagihan.toLowerCase().includes(searchTerm.toLowerCase())
        return statusMatch && searchMatch
    })

    // Pagination
    const totalPages = Math.ceil(filteredTagihan.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = filteredTagihan.slice(startIndex, startIndex + pageSize)

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="space-y-6 animate-pulse">
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <LoadingSkeleton />
            </div>
        )
    }

    const belum_lunas =
        (statistik?.status_breakdown?.pending ?? 0) +
        (statistik?.status_breakdown?.sebagian ?? 0);

    console.log("render TagihanPage")

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FileText className="mr-3 h-6 w-6 text-blue-600" />
                        Tagihan
                    </h1>
                    <p className="text-gray-600 mt-1">Kelola tagihan {selectedChild?.nama || "santri"}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-blue-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total Tagihan</p>
                                    <p className="text-3xl font-bold text-blue-700">{statistik?.total_tagihan}</p>
                                    <p className="text-sm text-gray-600">Tagihan keseluruhan</p>
                                </div>
                                <FileText className="h-12 w-12 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600">Belum Lunas</p>
                                    <p className="text-3xl font-bold text-red-700">{belum_lunas}</p>
                                    <p className="text-sm text-gray-600">Rp {statistik?.total_sisa}</p>
                                </div>
                                <AlertCircle className="h-12 w-12 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-emerald-600">Lunas</p>
                                    <p className="text-3xl font-bold text-emerald-700">{statistik?.status_breakdown.lunas}</p>
                                    <p className="text-sm text-gray-600">Tagihan terbayar</p>
                                </div>
                                <CheckCircle className="h-12 w-12 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-600">Cicilan</p>
                                    <p className="text-3xl font-bold text-amber-700">{statistik?.status_breakdown.sebagian}</p>
                                    <p className="text-sm text-gray-600">Dibayar sebagian</p>
                                </div>
                                <Clock className="h-12 w-12 text-amber-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className={`bg-white rounded-lg border border-gray-200 shadow-sm`}>
                    <div className={`px-6 py-4 border-b border-gray-200`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Daftar Tagihan</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="semua">Semua Status</option>
                                    <option value="pending">Belum Lunas</option>
                                    <option value="sebagian">Cicilan</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari tagihan..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Cards View */}
                    <CardContent className="block md:hidden">
                        <div className="space-y-4">
                            {paginatedData.map((tagihan) => (
                                <div key={tagihan.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{tagihan.tagihan.nama_tagihan}</h4>
                                            <p className="text-sm text-gray-600">{tagihan.periode}</p>
                                            {/* <p className="text-xs text-gray-500 mt-1">{tagihan.deskripsi}</p> */}
                                        </div>
                                        <div className="flex items-center ml-2">
                                            {getStatusIcon(tagihan.status)}
                                            <Badge className={`ml-2 ${getStatusColor(tagihan.status)}`}>
                                                {tagihan.status === "lunas"
                                                    ? "Lunas"
                                                    : tagihan.status === "pending"
                                                        ? "Belum Lunas"
                                                        : tagihan.status === "sebagian"
                                                            ? "Cicilan"
                                                            : tagihan.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Jumlah Tagihan</p>
                                            <p className="font-semibold text-gray-900">Rp {tagihan.nominal}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Sisa Pembayaran</p>
                                            <p className={`font-semibold ${tagihan.sisa > 0 ? "text-red-600" : "text-emerald-600"}`}>
                                                Rp {tagihan.sisa}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-3">
                                        <div>
                                            <p className="text-gray-600">Jatuh Tempo</p>
                                            <p className={`font-medium ${isOverdue(tagihan.tanggal_jatuh_tempo) && tagihan.status !== "lunas" ? "text-red-600" : "text-gray-900"}`}>
                                                {formatTanggal(tagihan.tanggal_jatuh_tempo)}
                                            </p>
                                        </div>
                                        {/* {tagihan.status !== "lunas" && (
                                            <Button variant="default" className="text-xs px-3 py-1">
                                                Bayar Sekarang
                                            </Button>
                                        )} */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    {/* Desktop Table View */}
                    <CardContent className="hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Tagihan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Periode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jatuh Tempo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sisa
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedData.map((tagihan) => (
                                        <tr key={tagihan.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{tagihan.tagihan.nama_tagihan}</div>
                                                    {/* <div className="text-sm text-gray-500">{tagihan.deskripsi}</div> */}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tagihan.periode}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={isOverdue(tagihan.tanggal_jatuh_tempo) && tagihan.status !== "lunas" ? "text-red-600 font-medium" : "text-gray-900"}>
                                                    {formatTanggal(tagihan.tanggal_jatuh_tempo)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Rp {tagihan.nominal}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`font-semibold ${tagihan.sisa > 0 ? "text-red-600" : "text-emerald-600"}`}>
                                                    Rp {tagihan.sisa}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(tagihan.status)}
                                                    <Badge className={`ml-2 ${getStatusColor(tagihan.status)}`}>
                                                        {tagihan.status === "lunas"
                                                            ? "Lunas"
                                                            : tagihan.status === "pending"
                                                                ? "Belum Lunas"
                                                                : tagihan.status === "sebagian"
                                                                    ? "Cicilan"
                                                                    : tagihan.status}
                                                    </Badge>
                                                </div>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {tagihan.status !== "lunas" ? (
                                                    <Button variant="default" className="text-xs px-3 py-1">
                                                        Bayar
                                                    </Button>
                                                ) : (
                                                    <span className="text-emerald-600">Selesai</span>
                                                )}
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Menampilkan {startIndex + 1} - {Math.min(startIndex + pageSize, filteredTagihan.length)} dari{" "}
                                    {filteredTagihan.length} tagihan
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
                        </div>
                    )}
                </div>

                {/* Summary Cards - Mobile/Desktop */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-red-100">
                        <CardHeader>
                            <CardTitle className="text-lg text-red-700">Tagihan Belum Lunas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {tagihanList
                                    .filter((t) => t.status === "pending")
                                    .slice(0, 3)
                                    .map((tagihan) => (
                                        <div key={tagihan.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{tagihan.tagihan.nama_tagihan}</p>
                                                <p className="text-sm text-gray-600">{tagihan.periode}</p>
                                                <p className="text-xs text-red-600">
                                                    Jatuh tempo: {formatTanggal(tagihan.tanggal_jatuh_tempo)}
                                                    {isOverdue(tagihan.tanggal_jatuh_tempo) && (
                                                        <span className="ml-2 font-medium">(Terlambat)</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-bold text-red-600">Rp {tagihan.sisa}</p>
                                            </div>
                                        </div>
                                    ))}
                                {tagihanList.filter((t) => t.status === "pending").length === 0 && (
                                    <p className="text-center text-gray-500 py-4">Tidak ada tagihan yang belum lunas</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-100">
                        <CardHeader>
                            <CardTitle className="text-lg text-emerald-700">Tagihan Lunas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {tagihanList
                                    .filter((t) => t.status === "lunas")
                                    .slice(0, 3)
                                    .map((tagihan) => (
                                        <div
                                            key={tagihan.id}
                                            className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{tagihan.tagihan.nama_tagihan}</p>
                                                <p className="text-sm text-gray-600">{tagihan.periode || "-"}</p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-bold text-emerald-600">Rp {tagihan.nominal}</p>
                                                <Badge className="bg-emerald-100 text-emerald-800 text-xs">Lunas</Badge>
                                            </div>
                                        </div>
                                    ))}
                                {tagihanList.filter((t) => t.status === "lunas").length === 0 && (
                                    <p className="text-center text-gray-500 py-4">Belum ada tagihan yang lunas</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}