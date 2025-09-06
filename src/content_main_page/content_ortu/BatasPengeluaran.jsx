"use client"

import { useState, useEffect } from "react"
import { Settings, AlertTriangle, CheckCircle, Edit, History, PieChart, Shield } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"

// Custom formatRupiah and formatTanggalWaktu functions
const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

const formatTanggalWaktu = (dateString) => {
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(dateString))
}

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }) => (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
)

const CardContent = ({ children, className = "" }) => <div className={`px-6 py-4 ${className}`}>{children}</div>

const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...props }) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variants = {
        default: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    }

    const sizes = {
        default: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
    }

    return (
        <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    )
}

const Badge = ({ children, className = "" }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {children}
    </span>
)

const Input = ({ className = "", ...props }) => (
    <input
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
        {...props}
    />
)

const Label = ({ children, htmlFor, className = "" }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
        {children}
    </label>
)

const Alert = ({ children, className = "" }) => <div className={`rounded-md p-4 ${className}`}>{children}</div>

const AlertDescription = ({ children, className = "" }) => <div className={`text-sm ${className}`}>{children}</div>

// eslint-disable-next-line no-unused-vars
const Select = ({ children, value, onValueChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState(value)

    const handleSelect = (newValue) => {
        setSelectedValue(newValue)
        onValueChange(newValue)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                {selectedValue === "peringatan" ? "Peringatan Saja" : "Blokir Transaksi"}
            </button>
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div onClick={() => handleSelect("peringatan")} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
                        Peringatan Saja
                    </div>
                    <div onClick={() => handleSelect("blokir")} className="px-3 py-2 cursor-pointer hover:bg-gray-100">
                        Blokir Transaksi
                    </div>
                </div>
            )}
        </div>
    )
}

const Dialog = ({ children, open, onOpenChange }) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">{children}</div>
        </div>
    )
}

const DialogContent = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>

const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>

const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold text-gray-900">{children}</h2>

// const Tabs = ({ children, defaultValue, className = "" }) => {
//     const [activeTab, setActiveTab] = useState(defaultValue)

//     return (
//         <div className={className}>
//             {children.map((child) =>
//                 child.type.name === "TabsList"
//                     ? { ...child, props: { ...child.props, activeTab, setActiveTab } }
//                     : child.props.value === activeTab
//                         ? child
//                         : null,
//             )}
//         </div>
//     )
// }

// const TabsList = ({ children, activeTab, setActiveTab, className = "" }) => (
//     <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
//         {children.map((child) => ({
//             ...child,
//             props: { ...child.props, activeTab, setActiveTab },
//         }))}
//     </div>
// )

// const TabsTrigger = ({ children, value, activeTab, setActiveTab, className = "" }) => (
//     <button
//         onClick={() => setActiveTab(value)}
//         className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === value ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
//             } ${className}`}
//     >
//         {children}
//     </button>
// )

// const TabsContent = ({ children, value, className = "" }) => <div className={className}>{children}</div>

const DataTable = ({ data, columns, searchPlaceholder, pageSize = 10 }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const filteredData = data.filter((item) =>
        Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )

    const totalPages = Math.ceil(filteredData.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

    return (
        <div className="space-y-4">
            <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

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
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.render ? column.render(item[column.key]) : item[column.key]}
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
                        Menampilkan {startIndex + 1} sampai {Math.min(startIndex + pageSize, filteredData.length)} dari{" "}
                        {filteredData.length} data
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

const SimpleDonutChart = ({ used, total, label, size = 180 }) => {
    const percentage = total > 0 ? (used / total) * 100 : 0
    const circumference = 2 * Math.PI * 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle cx={size / 2} cy={size / 2} r="45" stroke="#e5e7eb" strokeWidth="10" fill="transparent" />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r="45"
                        stroke={percentage >= 100 ? "#ef4444" : percentage >= 80 ? "#f59e0b" : "#10b981"}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</div>
                    <div className="text-xs text-gray-500 text-center">{label}</div>
                </div>
            </div>
            <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">
                    {formatRupiah(used)} / {formatRupiah(total)}
                </div>
            </div>
        </div>
    )
}

export default function BatasPengeluaranPage() {
    const { activeChild: selectedChild } = useActiveChild()
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingLimit, setEditingLimit] = useState(null)
    const [activeTab, setActiveTab] = useState("visualisasi")

    // Mock current limits
    const [currentLimits, setCurrentLimits] = useState({
        harian: { amount: 50000, mode: "peringatan", active: true },
        mingguan: { amount: 300000, mode: "blokir", active: true },
        bulanan: { amount: 1000000, mode: "peringatan", active: false },
    })

    // Mock spending data - calculate from transactions
    const mockSpendingData = {
        harian: { used: 35000, period: "Hari ini" },
        mingguan: { used: 180000, period: "Minggu ini" },
        bulanan: { used: 650000, period: "Bulan ini" },
    }

    // Mock limit history
    const mockLimitHistory = [
        {
            id: 1,
            tanggal: "2025-01-15T10:30:00",
            jenis: "harian",
            limitLama: 40000,
            limitBaru: 50000,
            mode: "peringatan",
            alasan: "Kenaikan uang saku",
        },
        {
            id: 2,
            tanggal: "2025-01-10T14:15:00",
            jenis: "mingguan",
            limitLama: 250000,
            limitBaru: 300000,
            mode: "blokir",
            alasan: "Penyesuaian kebutuhan",
        },
        {
            id: 3,
            tanggal: "2025-01-01T09:00:00",
            jenis: "bulanan",
            limitLama: 800000,
            limitBaru: 1000000,
            mode: "peringatan",
            alasan: "Awal tahun ajaran baru",
        },
    ]

    useEffect(() => {
        // const activeChild = sessionStorage.getItem("active_child")
        // if (activeChild) {
        //     setSelectedChild(JSON.parse(activeChild))
        // }
    }, [])

    const getLimitStatus = (used, total, mode) => {
        const percentage = total > 0 ? (used / total) * 100 : 0

        if (percentage >= 100) {
            return {
                status: "exceeded",
                color: mode === "blokir" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800",
                message: mode === "blokir" ? "Limit terlampaui - Transaksi diblokir" : "Limit terlampaui - Peringatan",
                icon: mode === "blokir" ? Shield : AlertTriangle,
            }
        } else if (percentage >= 80) {
            return {
                status: "warning",
                color: "bg-yellow-100 text-yellow-800",
                message: "Mendekati batas limit",
                icon: AlertTriangle,
            }
        } else {
            return {
                status: "safe",
                color: "bg-emerald-100 text-emerald-800",
                message: "Dalam batas normal",
                icon: CheckCircle,
            }
        }
    }

    const handleEditLimit = (type) => {
        setEditingLimit({
            type,
            amount: currentLimits[type].amount,
            mode: currentLimits[type].mode,
            active: currentLimits[type].active,
        })
        setEditDialogOpen(true)
    }

    const handleSaveLimit = () => {
        if (editingLimit) {
            setCurrentLimits((prev) => ({
                ...prev,
                [editingLimit.type]: {
                    amount: Number.parseInt(editingLimit.amount),
                    mode: editingLimit.mode,
                    active: editingLimit.active,
                },
            }))
            setEditDialogOpen(false)
            setEditingLimit(null)
        }
    }

    const historyColumns = [
        {
            key: "tanggal",
            label: "Tanggal",
            sortable: true,
            render: (value) => formatTanggalWaktu(value),
        },
        {
            key: "jenis",
            label: "Jenis Limit",
            sortable: true,
            render: (value) => (
                <Badge className="bg-blue-100 text-blue-800">
                    {value === "harian" ? "Harian" : value === "mingguan" ? "Mingguan" : "Bulanan"}
                </Badge>
            ),
        },
        {
            key: "limitLama",
            label: "Limit Lama",
            sortable: true,
            render: (value) => formatRupiah(value),
        },
        {
            key: "limitBaru",
            label: "Limit Baru",
            sortable: true,
            render: (value) => formatRupiah(value),
        },
        {
            key: "mode",
            label: "Mode",
            sortable: true,
            render: (value) => (
                <Badge className={value === "blokir" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                    {value === "blokir" ? "Blokir" : "Peringatan"}
                </Badge>
            ),
        },
        {
            key: "alasan",
            label: "Alasan",
            sortable: false,
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Settings className="mr-3 h-6 w-6 text-indigo-600" />
                        Batas Pengeluaran
                    </h1>
                    <p className="text-gray-600 mt-1">Kelola batas pengeluaran {selectedChild?.nama || "santri"}</p>
                </div>

                {/* Alert for exceeded limits */}
                {Object.entries(currentLimits).map(([type, limit]) => {
                    if (!limit.active) return null
                    const spending = mockSpendingData[type]
                    const status = getLimitStatus(spending.used, limit.amount, limit.mode)

                    if (status.status === "exceeded") {
                        return (
                            <Alert
                                key={type}
                                className={`border-2 ${limit.mode === "blokir" ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}`}
                            >
                                <status.icon className="h-4 w-4" />
                                <AlertDescription className="font-medium">
                                    <strong>Limit {type} terlampaui!</strong> {status.message}
                                    <br />
                                    <span className="text-sm">
                                        Pengeluaran {spending.period.toLowerCase()}: {formatRupiah(spending.used)} dari{" "}
                                        {formatRupiah(limit.amount)}
                                    </span>
                                </AlertDescription>
                            </Alert>
                        )
                    }
                    return null
                })}

                {/* Limit Overview Cards */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(currentLimits).map(([type, limit]) => {
                        const spending = mockSpendingData[type]
                        const status = getLimitStatus(spending.used, limit.amount, limit.mode)
                        const StatusIcon = status.icon

                        return (
                            <Card key={type} className={`${!limit.active ? "opacity-60" : ""}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium">
                                        Limit {type === "harian" ? "Harian" : type === "mingguan" ? "Mingguan" : "Bulanan"}
                                    </CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <Badge className={status.color}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {status.status === "exceeded"
                                                ? "Terlampaui"
                                                : status.status === "warning"
                                                    ? "Peringatan"
                                                    : "Normal"}
                                        </Badge>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditLimit(type)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Status</span>
                                            <Badge className={limit.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                                                {limit.active ? "Aktif" : "Nonaktif"}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Mode</span>
                                            <Badge
                                                className={
                                                    limit.mode === "blokir" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                                                }
                                            >
                                                {limit.mode === "blokir" ? "Blokir" : "Peringatan"}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Limit</span>
                                            <span className="font-semibold">{formatRupiah(limit.amount)}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Terpakai</span>
                                            <span
                                                className={`font-semibold ${(spending.used / limit.amount) >= 1
                                                        ? "text-red-600"
                                                        : spending.used / limit.amount >= 0.8
                                                            ? "text-yellow-600"
                                                            : "text-emerald-600"
                                                    }`}
                                            >
                                                {formatRupiah(spending.used)}
                                            </span>
                                        </div>

                                        <div className="pt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${(spending.used / limit.amount) >= 1
                                                            ? "bg-red-500"
                                                            : spending.used / limit.amount >= 0.8
                                                                ? "bg-yellow-500"
                                                                : "bg-emerald-500"
                                                        }`}
                                                    style={{ width: `${Math.min((spending.used / limit.amount) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Math.round((spending.used / limit.amount) * 100)}% dari limit
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Tabs */}
                <div className="space-y-6">
                    <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
                        <button
                            onClick={() => setActiveTab("visualisasi")}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${activeTab === "visualisasi" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <PieChart className="mr-2 h-4 w-4" />
                            Visualisasi
                        </button>
                        <button
                            onClick={() => setActiveTab("riwayat")}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${activeTab === "riwayat" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <History className="mr-2 h-4 w-4" />
                            Riwayat
                        </button>
                    </div>

                    {activeTab === "visualisasi" && (
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                {Object.entries(currentLimits).map(([type, limit]) => {
                                    if (!limit.active) return null
                                    const spending = mockSpendingData[type]

                                    return (
                                        <Card key={type}>
                                            <CardHeader>
                                                <CardTitle className="text-center">
                                                    Limit {type === "harian" ? "Harian" : type === "mingguan" ? "Mingguan" : "Bulanan"}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex justify-center">
                                                <SimpleDonutChart
                                                    used={spending.used}
                                                    total={limit.amount}
                                                    label={spending.period}
                                                    size={180}
                                                />
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === "riwayat" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Riwayat Perubahan Limit</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DataTable
                                        data={mockLimitHistory}
                                        columns={historyColumns}
                                        searchPlaceholder="Cari riwayat perubahan..."
                                        pageSize={10}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Edit Limit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                Edit Limit{" "}
                                {editingLimit?.type === "harian"
                                    ? "Harian"
                                    : editingLimit?.type === "mingguan"
                                        ? "Mingguan"
                                        : "Bulanan"}
                            </DialogTitle>
                        </DialogHeader>
                        {editingLimit && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Jumlah Limit</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={editingLimit.amount}
                                        onChange={(e) => setEditingLimit((prev) => ({ ...prev, amount: e.target.value }))}
                                        placeholder="Masukkan jumlah limit"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mode">Mode Limit</Label>
                                    <Select
                                        value={editingLimit.mode}
                                        onValueChange={(value) => setEditingLimit((prev) => ({ ...prev, mode: value }))}
                                    />
                                    <p className="text-xs text-gray-500">
                                        {editingLimit.mode === "blokir"
                                            ? "Transaksi akan diblokir jika limit terlampaui"
                                            : "Hanya menampilkan peringatan jika limit terlampaui"}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={editingLimit.active}
                                        onChange={(e) => setEditingLimit((prev) => ({ ...prev, active: e.target.checked }))}
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="active">Aktifkan limit ini</Label>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button onClick={handleSaveLimit} className="bg-indigo-600 hover:bg-indigo-700">
                                        Simpan
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
