"use client"

import { useState, useEffect } from "react"
import { BookOpen, TrendingUp, Award } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"

export const HafalanPage = () => {
    const [activeTab, setActiveTab] = useState("tahfidz")
    const [statusFilter, setStatusFilter] = useState("semua")
    const [dateRange, setDateRange] = useState({ start: "", end: "" })
    const [loading, setLoading] = useState(true)
    const { activeChild: selectedChild, updateActiveChild } = useActiveChild()

    const mockTahfidzData = [
        {
            id: 1,
            tanggal: "2025-01-15",
            surah: "Al-Baqarah",
            ayat: "1-10",
            status: "lulus",
            nilai: "A",
            catatan: "Hafalan lancar, tajwid baik",
        },
        {
            id: 2,
            tanggal: "2025-01-12",
            surah: "Al-Fatihah",
            ayat: "1-7",
            status: "lulus",
            nilai: "A+",
            catatan: "Sangat baik",
        },
        {
            id: 3,
            tanggal: "2025-01-10",
            surah: "An-Nas",
            ayat: "1-6",
            status: "mengulang",
            nilai: "B",
            catatan: "Perlu perbaikan tajwid",
        },
    ]

    const mockNadhomanData = [
        {
            id: 1,
            tanggal: "2025-01-14",
            judul: "Nadhom Imriti",
            bait: "1-5",
            status: "lulus",
            nilai: "A",
            catatan: "Hafalan baik, intonasi tepat",
        },
        {
            id: 2,
            tanggal: "2025-01-11",
            judul: "Alfiyah Ibn Malik",
            bait: "1-3",
            status: "lulus",
            nilai: "A+",
            catatan: "Sempurna",
        },
        {
            id: 3,
            tanggal: "2025-01-09",
            judul: "Nadhom Aqidah",
            bait: "1-2",
            status: "mengulang",
            nilai: "B",
            catatan: "Perlu latihan lagi",
        },
    ]

    useEffect(() => {
        setLoading(true)
        if (selectedChild) {
            updateActiveChild(selectedChild)
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChild])

    const Badge = ({ children, variant = "default" }) => {
        const variants = {
            default: "bg-gray-100 text-gray-800",
            success: "bg-green-100 text-green-800",
            warning: "bg-yellow-100 text-yellow-800",
            danger: "bg-red-100 text-red-800",
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
                {children}
            </span>
        )
    }

    const Card = ({ children, className = "" }) => (
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
    )

    const CardHeader = ({ children }) => <div className="px-6 py-4 border-b border-gray-200">{children}</div>

    const CardContent = ({ children }) => <div className="px-6 py-4">{children}</div>

    const CardTitle = ({ children, className = "" }) => (
        <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
    )

    const Select = ({ value, onValueChange, children, className = "" }) => {
        return (
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${className}`}
            >
                {children}
            </select>
        )
    }

    function Button({ children, variant = "default", onClick, className = "" }) {
        const variants = {
            default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-200",
        }

        return (
            <button
                onClick={onClick}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${variants[variant]} ${className}`}
            >
                {children}
            </button>
        )
    }

    const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

    const DataTable = ({ data, columns, searchPlaceholder }) => {
        const [searchTerm, setSearchTerm] = useState("")
        const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
        const [currentPage, setCurrentPage] = useState(1)
        const pageSize = 10

        const filteredData = data.filter((item) =>
            Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
        )

        const sortedData = [...filteredData].sort((a, b) => {
            if (!sortConfig.key) return 0

            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
            return 0
        })

        const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

        const totalPages = Math.ceil(sortedData.length / pageSize)

        const handleSort = (key) => {
            setSortConfig({
                key,
                direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
            })
        }

        return (
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        onClick={() => column.sortable && handleSort(column.key)}
                                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                                            }`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {column.render ? column.render(row[column.key]) : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {(currentPage - 1) * pageSize + 1} sampai{" "}
                            {Math.min(currentPage * pageSize, sortedData.length)} dari {sortedData.length} data
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Sebelumnya
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "lulus":
                return "success"
            case "mengulang":
                return "warning"
            default:
                return "default"
        }
    }

    const formatTanggal = (tanggal) => {
        return new Date(tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    const tahfidzColumns = [
        {
            key: "tanggal",
            label: "Tanggal",
            sortable: true,
            render: (value) => formatTanggal(value),
        },
        {
            key: "surah",
            label: "Surah",
            sortable: true,
        },
        {
            key: "ayat",
            label: "Ayat",
            sortable: false,
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <Badge variant={getStatusColor(value)}>
                    {value === "lulus" ? "Lulus" : value === "mengulang" ? "Mengulang" : value}
                </Badge>
            ),
        },
        {
            key: "nilai",
            label: "Nilai",
            sortable: true,
            render: (value) => (
                <span
                    className={`font-semibold ${value === "A+"
                        ? "text-emerald-600"
                        : value === "A"
                            ? "text-emerald-500"
                            : value === "B"
                                ? "text-yellow-600"
                                : "text-red-600"
                        }`}
                >
                    {value}
                </span>
            ),
        },
        {
            key: "catatan",
            label: "Catatan",
            sortable: false,
            render: (value) => <span className="text-sm text-gray-600 max-w-xs truncate block">{value}</span>,
        },
    ]

    const nadhomanColumns = [
        {
            key: "tanggal",
            label: "Tanggal",
            sortable: true,
            render: (value) => formatTanggal(value),
        },
        {
            key: "judul",
            label: "Judul Nadhom",
            sortable: true,
        },
        {
            key: "bait",
            label: "Bait",
            sortable: false,
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (value) => (
                <Badge variant={getStatusColor(value)}>
                    {value === "lulus" ? "Lulus" : value === "mengulang" ? "Mengulang" : value}
                </Badge>
            ),
        },
        {
            key: "nilai",
            label: "Nilai",
            sortable: true,
            render: (value) => (
                <span
                    className={`font-semibold ${value === "A+"
                        ? "text-emerald-600"
                        : value === "A"
                            ? "text-emerald-500"
                            : value === "B"
                                ? "text-yellow-600"
                                : "text-red-600"
                        }`}
                >
                    {value}
                </span>
            ),
        },
        {
            key: "catatan",
            label: "Catatan",
            sortable: false,
            render: (value) => <span className="text-sm text-gray-600 max-w-xs truncate block">{value}</span>,
        },
    ]

    const currentData = activeTab === "tahfidz" ? mockTahfidzData : mockNadhomanData
    const currentColumns = activeTab === "tahfidz" ? tahfidzColumns : nadhomanColumns

    // Filter data based on status and date range
    const filteredData = currentData.filter((item) => {
        const statusMatch = statusFilter === "semua" || item.status === statusFilter
        const dateMatch =
            (!dateRange.start || item.tanggal >= dateRange.start) && (!dateRange.end || item.tanggal <= dateRange.end)
        return statusMatch && dateMatch
    })

    const stats = {
        total: currentData.length,
        lulus: currentData.filter((item) => item.status === "lulus").length,
        mengulang: currentData.filter((item) => item.status === "mengulang").length,
        rataRata: "A",
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        {/* <div className="grid gap-4 md:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                            ))}
                        </div> */}
                        <div className="h-96 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <BookOpen className="mr-3 h-6 w-6 text-emerald-600" />
                        Hafalan Tahfidz & Nadhoman
                    </h1>
                    <p className="text-gray-600 mt-1">Progress hafalan tahfidz dan nadhoman {selectedChild?.nama || "santri"}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <CardHeader className="pb-4">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                            <Button
                                variant={activeTab === "tahfidz" ? "default" : "ghost"}
                                onClick={() => setActiveTab("tahfidz")}
                                className="flex-1 rounded-md"
                            >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Tahfidz
                            </Button>
                            <Button
                                variant={activeTab === "nadhoman" ? "default" : "ghost"}
                                onClick={() => setActiveTab("nadhoman")}
                                className="flex-1 rounded-md"
                            >
                                <Award className="h-4 w-4 mr-2" />
                                Nadhoman
                            </Button>
                        </div>
                    </CardHeader>

                    <div className="p-6 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="border-emerald-100">
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-emerald-600">
                                                Total {activeTab === "tahfidz" ? "Tahfidz" : "Nadhoman"}
                                            </p>
                                            <p className="text-2xl font-bold text-emerald-700">{stats.total}</p>
                                        </div>
                                        {activeTab === "tahfidz" ? (
                                            <BookOpen className="h-8 w-8 text-emerald-600" />
                                        ) : (
                                            <Award className="h-8 w-8 text-emerald-600" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-green-100">
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-green-600">Lulus</p>
                                            <p className="text-2xl font-bold text-green-700">{stats.lulus}</p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-green-600 font-bold">✓</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-yellow-100">
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-yellow-600">Mengulang</p>
                                            <p className="text-2xl font-bold text-yellow-700">{stats.mengulang}</p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <span className="text-yellow-600 font-bold">↻</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-100">
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-600">Rata-rata Nilai</p>
                                            <p className="text-2xl font-bold text-blue-700">{stats.rataRata}</p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters and Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail {activeTab === "tahfidz" ? "Tahfidz" : "Nadhoman"}</CardTitle>
                                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <Select value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-48">
                                        <SelectItem value="semua">Semua Status</SelectItem>
                                        <SelectItem value="lulus">Lulus</SelectItem>
                                        <SelectItem value="mengulang">Mengulang</SelectItem>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={filteredData}
                                    columns={currentColumns}
                                    searchPlaceholder={`Cari ${activeTab === "tahfidz" ? "surah, ayat" : "nadhom, bait"}, atau catatan...`}
                                    pageSize={10}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
