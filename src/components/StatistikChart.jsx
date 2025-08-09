"use client"

import { useMemo } from "react"
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
    AreaChart,
    Tooltip,
} from "recharts"
import { OrbitProgress } from "react-loading-indicators"

const StatistikChart = ({ data, loading, totalData }) => {
    // Process data untuk berbagai chart
    const processedData = useMemo(() => {
        if (!data || data.length === 0) return null

        // 1. Distribusi Jenis Kelamin
        const jenisKelaminData = data.reduce((acc, item) => {
            const jk = item.jenis_kelamin === "l" ? "Laki-laki" : item.jenis_kelamin === "p" ? "Perempuan" : "Tidak Diketahui"
            acc[jk] = (acc[jk] || 0) + 1
            return acc
        }, {})

        const jenisKelaminChart = Object.entries(jenisKelaminData).map(([key, value]) => ({
            name: key,
            value: value,
            percentage: ((value / data.length) * 100).toFixed(1),
        }))

        // 2. Distribusi Status
        const statusData = data.reduce((acc, item) => {
            const status = item.status || "Tidak Diketahui"
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {})

        const statusChart = Object.entries(statusData).map(([key, value]) => ({
            name: key,
            value: value,
            percentage: ((value / data.length) * 100).toFixed(1),
        }))

        // 3. Distribusi Lembaga
        const lembagaData = data.reduce((acc, item) => {
            const lembaga = item.lembaga || "Tidak Diketahui"
            acc[lembaga] = (acc[lembaga] || 0) + 1
            return acc
        }, {})

        const lembagaChart = Object.entries(lembagaData)
            .map(([key, value]) => ({
                name: key.length > 15 ? key.substring(0, 15) + "..." : key,
                fullName: key,
                value: value,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10) // Top 10 lembaga

        // 4. Distribusi Wilayah
        const wilayahData = data.reduce((acc, item) => {
            const wilayah = item.wilayah || "Tidak Diketahui"
            acc[wilayah] = (acc[wilayah] || 0) + 1
            return acc
        }, {})

        const wilayahChart = Object.entries(wilayahData)
            .map(([key, value]) => ({
                name: key.length > 12 ? key.substring(0, 12) + "..." : key,
                fullName: key,
                value: value,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8) // Top 8 wilayah

        // 5. Distribusi Kota Asal (Top 10)
        const kotaAsalData = data.reduce((acc, item) => {
            const kota = item.kota_asal || "Tidak Diketahui"
            acc[kota] = (acc[kota] || 0) + 1
            return acc
        }, {})

        const kotaAsalChart = Object.entries(kotaAsalData)
            .map(([key, value]) => ({
                name: key.length > 15 ? key.substring(0, 15) + "..." : key,
                fullName: key,
                value: value,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)

        return {
            jenisKelamin: jenisKelaminChart,
            status: statusChart,
            lembaga: lembagaChart,
            wilayah: wilayahChart,
            kotaAsal: kotaAsalChart,
        }
    }, [data])

    const COLORS = {
        primary: ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"],
        gender: ["#3B82F6", "#EC4899"],
        status: ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
    }

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-blue-600">
                        Jumlah: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                </div>
            )
        }
        return null
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <OrbitProgress variant="disc" color="#2a6999" size="medium" text="Memuat statistik..." textColor="#2a6999" />
            </div>
        )
    }

    if (!processedData) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada data untuk ditampilkan</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 pb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Santri</h3>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="text-2xl font-bold text-blue-600">{totalData.toLocaleString()}</div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 pb-2">
                        <h3 className="text-sm font-medium text-gray-600">Data Ditampilkan</h3>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="text-2xl font-bold text-green-600">{data.length.toLocaleString()}</div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 pb-2">
                        <h3 className="text-sm font-medium text-gray-600">Lembaga Aktif</h3>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="text-2xl font-bold text-purple-600">{processedData.lembaga.length}</div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 pb-2">
                        <h3 className="text-sm font-medium text-gray-600">Wilayah Aktif</h3>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="text-2xl font-bold text-orange-600">{processedData.wilayah.length}</div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Jenis Kelamin Pie Chart */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-6 pb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Distribusi Jenis Kelamin</h3>
                        <p className="text-sm text-gray-600">Persentase berdasarkan jenis kelamin</p>
                    </div>
                    <div className="p-6 pt-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={processedData.jenisKelamin}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {processedData.jenisKelamin.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS.gender[index % COLORS.gender.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Status Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-6 pb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Distribusi Status</h3>
                        <p className="text-sm text-gray-600">Jumlah berdasarkan status santri</p>
                    </div>
                    <div className="p-6 pt-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={processedData.status}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" fill="#10B981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Lembaga Bar Chart */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-6 pb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Top 10 Lembaga</h3>
                        <p className="text-sm text-gray-600">Distribusi santri per lembaga</p>
                    </div>
                    <div className="p-6 pt-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={processedData.lembaga} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} fontSize={11} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload
                                                return (
                                                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                        <p className="font-medium text-gray-900">{data.fullName}</p>
                                                        <p className="text-blue-600">
                                                            Jumlah: <span className="font-semibold">{data.value}</span>
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Wilayah Area Chart */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-6 pb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Distribusi Wilayah</h3>
                        <p className="text-sm text-gray-600">Sebaran santri per wilayah</p>
                    </div>
                    <div className="p-6 pt-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={processedData.wilayah}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={11} />
                                    <YAxis />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload
                                                return (
                                                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                        <p className="font-medium text-gray-900">{data.fullName}</p>
                                                        <p className="text-purple-600">
                                                            Jumlah: <span className="font-semibold">{data.value}</span>
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kota Asal Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Top 10 Kota Asal</h3>
                    <p className="text-sm text-gray-600">Daftar kota asal dengan jumlah santri terbanyak</p>
                </div>
                <div className="p-6 pt-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ranking</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Kota Asal</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Jumlah Santri</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Persentase</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedData.kotaAsal.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-700">#{index + 1}</td>
                                        <td className="py-3 px-4 text-gray-900">{item.fullName}</td>
                                        <td className="py-3 px-4 text-right font-semibold text-blue-600">{item.value.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-right text-gray-600">
                                            {((item.value / data.length) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatistikChart
