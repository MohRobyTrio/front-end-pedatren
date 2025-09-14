"use client"

import { useEffect, useState } from "react"
import { BookOpen, Heart, MessageSquare, Award, Calendar } from "lucide-react"
import useFetchCatatanAfektifOrtu from "../../hooks/hooks_ortu/CatatanAfektif"
import { useActiveChild } from "../../components/ortu/useActiveChild"
import useFetchCatatanKognitifOrtu from "../../hooks/hooks_ortu/CatatanKognitif"
import { FaClipboardList } from "react-icons/fa"

function SimpleLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="container mx-auto space-y-6 max-w-7xl">{children}</div>
        </div>
    )
}

function Badge({ children, variant = "default", className = "" }) {
    const variants = {
        default: "bg-amber-100 text-amber-800 border-amber-200",
        secondary: "bg-blue-100 text-blue-800 border-blue-200",
        outline: "bg-white text-gray-700 border-gray-300",
        destructive: "bg-red-100 text-red-800 border-red-200",
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    )
}

function Card({ children, className = "" }) {
    return <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>{children}</div>
}

function CardHeader({ children, className = "" }) {
    return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

function CardTitle({ children, className = "" }) {
    return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
}

function CardContent({ children, className = "" }) {
    return <div className={`px-6 pb-6 ${className}`}>{children}</div>
}

function Button({ children, variant = "default", onClick, className = "" }) {
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    }

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}

export const AkademikPage = () => {
    const [activeTab, setActiveTab] = useState("afektif")
    const { activeChild: selectedChild } = useActiveChild()
    const { data: dataAfektif, loading: loadingAfektif, error: errorAfektif } = useFetchCatatanAfektifOrtu()
    const { data: dataKognitif, loading: loadingKognitif, error: errorKognitif } = useFetchCatatanKognitifOrtu()

    useEffect(() => {
        console.log("Data Afektif", dataAfektif);
        console.log("Data Kognitif", dataKognitif);
    }, [dataAfektif, dataKognitif])

    const mockAfektifData = {
        kepedulian: dataAfektif.kepedulian_nilai || "-",
        kebersihan: dataAfektif.kebersihan_nilai || "-",
        akhlak: dataAfektif.akhlak_nilai || "-",
        catatan: "Catatan afektif",
    }

    const mockKognitifData = {
        kebahasaan: dataKognitif.kebahasaan_nilai || "-",
        baca_kitab_kuning: dataKognitif.baca_kitab_kuning_nilai || "-",
        hafalan_tahfidz: dataKognitif.hafalan_tahfidz_nilai || "-",
        furudul_ainiyah: dataKognitif.furudul_ainiyah_nilai || "-",
        tulis_alquran: dataKognitif.tulis_alquran_nilai || "-",
        baca_alquran: dataKognitif.baca_alquran_nilai || "-",
        catatan: "Catatan kognitif",
    }

    // const mockKognitifData = [
    //     { mataPelajaran: "Matematika", semester: "Semester 1", nilai: 88 },
    //     { mataPelajaran: "Bahasa Indonesia", semester: "Semester 1", nilai: 90 },
    //     { mataPelajaran: "Ilmu Pengetahuan Alam", semester: "Semester 1", nilai: 75 },
    //     { mataPelajaran: "Ilmu Pengetahuan Sosial", semester: "Semester 1", nilai: 85 },
    // ]

    const formatTanggal = (dateString) => {
        const d = new Date(dateString)
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
    }

    const getAfektifLabel = (key) => {
        const labels = {
            kepedulian: "Kepedulian",
            kebersihan: "Kebersihan",
            akhlak: "Akhlak",
        }
        return labels[key] || key
    }

    const getKognitifLabel = (key) => {
        const labels = {
            kebahasaan: "Kebahasaan",
            baca_kitab_kuning: "Baca Kitab Kuning",
            hafalan_tahfidz: "Hafalan Tahfidz",
            furudul_ainiyah: "Furudul Ainiyah",
            tulis_alquran: "Tulis Al-Quran",
            baca_alquran: "Baca Al-Quran",
        }
        return labels[key] || key
    }

    const nilaiConfig = {
        A: { label: "Sangat Baik", color: "text-green-700 bg-green-50 border-green-200" },
        B: { label: "Baik", color: "text-blue-700 bg-blue-50 border-blue-200" },
        C: { label: "Cukup", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
        D: { label: "Kurang", color: "text-orange-700 bg-orange-50 border-orange-200" },
        E: { label: "Sangat Kurang", color: "text-red-700 bg-red-50 border-red-200" },
    }

    const getScoreColor = (score) => {
        const config = nilaiConfig[score]
        if (!config) return "text-gray-600"
        return config.color.split(" ").find((c) => c.startsWith("text-")) || "text-gray-600"
    }

    const getScoreBadgeVariant = (score) => {
        const config = nilaiConfig[score]
        return config ? config.color : "text-gray-600 bg-gray-100 border-gray-200"
    }

    if (loadingKognitif || loadingAfektif) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-50 bg-gray-200 rounded-lg"></div>
                        <div className="h-50 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <SimpleLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Award className="mr-3 h-6 w-6 text-blue-600" />
                        Penilaian Akademik
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Laporan perkembangan akademik dan karakter {selectedChild?.nama || "santri"}
                    </p>
                </div>

                {/* Tabs */}
                <Card className="shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                            <Button
                                variant={activeTab === "afektif" ? "default" : "ghost"}
                                onClick={() => setActiveTab("afektif")}
                                className="flex-1 rounded-md"
                            >
                                <Heart className="h-4 w-4 mr-2" />
                                Afektif
                            </Button>
                            <Button
                                variant={activeTab === "kognitif" ? "default" : "ghost"}
                                onClick={() => setActiveTab("kognitif")}
                                className="flex-1 rounded-md"
                            >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Kognitif
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {activeTab === "afektif" && (
                            Object.keys(dataAfektif || {}).length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FaClipboardList className="text-2xl text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Tidak Ada Data
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        Belum ada data penilaian afektif untuk ditampilkan.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {Object.entries(mockAfektifData)
                                        .filter(([k]) => k !== "catatan")
                                        .map(([key, value], idx) => {
                                            const config = nilaiConfig[value];
                                            return (
                                                <Card key={idx} className="border-gray-200 hover:shadow-md transition-all duration-200">
                                                    <CardContent className="p-6 text-center space-y-3">
                                                        <h3 className="font-medium text-gray-900 text-sm">
                                                            {getAfektifLabel(key)}
                                                        </h3>
                                                        <p className={`text-3xl font-bold ${getScoreColor(value)}`}>{value}</p>
                                                        <Badge className={`text-xs border ${getScoreBadgeVariant(value)}`}>
                                                            {config ? config.label : "N/A"}
                                                        </Badge>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                </div>
                            )
                        )}

                        {activeTab === "kognitif" && (
                            Object.keys(dataKognitif || {}).length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FaClipboardList className="text-2xl text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Tidak Ada Data
                                    </h3>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        Belum ada data penilaian kognitif untuk ditampilkan.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                                    {Object.entries(mockKognitifData)
                                        .filter(([k]) => k !== "catatan")
                                        .map(([key, value], idx) => {
                                            const config = nilaiConfig[value]
                                            return (
                                                <Card key={idx} className="border-gray-200 hover:shadow-md transition-all duration-200">
                                                    <CardContent className="p-6 text-center space-y-3">
                                                        <h3 className="font-medium text-gray-900 text-sm">{getKognitifLabel(key)}</h3>
                                                        <p className={`text-3xl font-bold ${getScoreColor(value)}`}>{value}</p>
                                                        <Badge className={`text-xs border ${getScoreBadgeVariant(value)}`}>
                                                            {config ? config.label : "N/A"}
                                                        </Badge>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                </div>
                            ))}
                    </CardContent>
                </Card>

                {activeTab === "afektif" && !errorAfektif && Object.keys(dataAfektif).length > 0 && (
                    <>
                        {/* Teacher Notes */}
                        <Card Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <MessageSquare className="h-6 w-6 text-blue-600" />
                                    Tindak Lanjut
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Card className="border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <CardContent className="p-6">
                                        <div className="flex justify-end items-start pb-4 ">
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {formatTanggal(dataAfektif.tanggal_buat)}
                                            </p>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Kepedulian</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataAfektif.kepedulian_tindak_lanjut || "-"}</p>
                                            </div>

                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Kebersihan</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataAfektif.kebersihan_tindak_lanjut || "-"}</p>
                                            </div>

                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Akhlak</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataAfektif.akhlak_tindak_lanjut || "-"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </>
                )}

                {activeTab === "kognitif" && !errorKognitif && Object.keys(dataKognitif).length > 0 && (
                    <>
                        {/* Teacher Notes */}
                        <Card Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <MessageSquare className="h-6 w-6 text-blue-600" />
                                    Tindak Lanjut
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Card className="border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <CardContent className="p-6">
                                        <div className="flex justify-end items-start pb-4 ">
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {formatTanggal(dataKognitif.tanggal_buat)}
                                            </p>
                                        </div>

                                        <div className="grid gap-4 lg:grid-cols-3">
                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Kebahasaan</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataKognitif.kebahasaan_tindak_lanjut || "-"}</p>
                                            </div>

                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Baca Kitab Kuning</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataKognitif.baca_kitab_kuning_tindak_lanjut || "-"}</p>
                                            </div>

                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Hafalan Tahfidz</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataKognitif.hafalan_tahfidz_tindak_lanjut || "-"}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Furudul Ainiyah</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataKognitif.furudul_ainiyah_tindak_lanjut || "-"}</p>
                                            </div>

                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Tulis Al-Quran</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataKognitif.tulis_alquran_tindak_lanjut || "-"}</p>
                                            </div>

                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-700 text-sm">Baca Al-Quran</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">{dataKognitif.baca_alquran_tindak_lanjut || "-"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </SimpleLayout >
    )
}
