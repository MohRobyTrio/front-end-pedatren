"use client"

import { useState } from "react"
import { BookOpen, Heart, MessageSquare, Award, Calendar } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"

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
    // const [selectedChild, setSelectedChild] = useState(null)
    const [activeTab, setActiveTab] = useState("afektif")
    const { activeChild: selectedChild } = useActiveChild()

    // const rataRataKognitif = 85 // Example value
    // const rataRataAfektif = 92 // Example value
    const mockAfektifData = {
        adab: 88,
        disiplin: 90,
        kebersihan: 75,
        kerjaSama: 85,
        catatan: "Catatan afektif",
    } // Example data
    const mockKognitifData = [
        { mataPelajaran: "Matematika", semester: "Semester 1", nilai: 88 },
        { mataPelajaran: "Bahasa Indonesia", semester: "Semester 1", nilai: 90 },
        { mataPelajaran: "Ilmu Pengetahuan Alam", semester: "Semester 1", nilai: 75 },
        { mataPelajaran: "Ilmu Pengetahuan Sosial", semester: "Semester 1", nilai: 85 },
    ] // Example data
    const mockCatatanUstadz = [
        {
            ustadz: "Ustadz Ahmad",
            mataPelajaran: "Matematika",
            tanggal: "2023-10-01",
            catatan: "Santri berusaha keras dalam belajar matematika.",
        },
        {
            ustadz: "Ustadz Siti",
            mataPelajaran: "Bahasa Indonesia",
            tanggal: "2023-10-02",
            catatan: "Santri perlu lebih banyak latihan dalam membaca.",
        },
    ] // Example data

    // useEffect(() => {
    //     const activeChild = sessionStorage.getItem("active_child")
    //     if (activeChild) setSelectedChild(JSON.parse(activeChild))
    // }, [])

    const getScoreColor = (score) => {
        if (score >= 90) return "text-emerald-600"
        if (score >= 80) return "text-amber-600"
        if (score >= 70) return "text-orange-600"
        return "text-red-600"
    }

    const getScoreBadgeVariant = (score) => {
        if (score >= 90) return "default"
        if (score >= 80) return "secondary"
        if (score >= 70) return "outline"
        return "destructive"
    }

    const formatTanggal = (dateString) => {
        const d = new Date(dateString)
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
    }

    const getAfektifLabel = (key) => {
        const labels = {
            adab: "Adab & Sopan Santun",
            disiplin: "Kedisiplinan",
            kebersihan: "Kebersihan",
            kerjaSama: "Kerja Sama",
        }
        return labels[key] || key
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

                {/* Summary Cards */}
                {/* <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-lg bg-gradient-to-br from-white to-amber-50 hover:shadow-xl transition-all duration-300 border-amber-200">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-amber-600" />
                                        <p className="text-sm font-medium text-amber-600">Rata-rata Kognitif</p>
                                    </div>
                                    <p className={`text-4xl font-bold ${getScoreColor(rataRataKognitif)}`}>{rataRataKognitif}</p>
                                    <p className="text-sm text-gray-500">Nilai akademik</p>
                                </div>
                                <div className="p-4 bg-amber-100 rounded-full">
                                    <TrendingUp className="h-8 w-8 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg bg-gradient-to-br from-white to-emerald-50 hover:shadow-xl transition-all duration-300 border-emerald-200">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-emerald-600" />
                                        <p className="text-sm font-medium text-emerald-600">Rata-rata Afektif</p>
                                    </div>
                                    <p className={`text-4xl font-bold ${getScoreColor(rataRataAfektif)}`}>{rataRataAfektif}</p>
                                    <p className="text-sm text-gray-500">Adab & Akhlak</p>
                                </div>
                                <div className="p-4 bg-emerald-100 rounded-full">
                                    <Heart className="h-8 w-8 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

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
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {Object.entries(mockAfektifData)
                                    .filter(([k]) => k !== "catatan")
                                    .map(([key, value], idx) => (
                                        <Card key={idx} className="border-gray-200 hover:shadow-md transition-all duration-200">
                                            <CardContent className="p-6 text-center space-y-3">
                                                <h3 className="font-medium text-gray-900 text-sm">{getAfektifLabel(key)}</h3>
                                                <p className={`text-3xl font-bold ${getScoreColor(value)}`}>{value}</p>
                                                <Badge variant={getScoreBadgeVariant(value)} className="text-xs">
                                                    {value >= 90
                                                        ? "Sangat Baik"
                                                        : value >= 80
                                                            ? "Baik"
                                                            : value >= 70
                                                                ? "Cukup"
                                                                : "Perlu Perbaikan"}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                        )}

                        {activeTab === "kognitif" && (
                            <div className="space-y-4">
                                {mockKognitifData.map((item, idx) => (
                                    <Card key={idx} className="border-gray-200 hover:shadow-md transition-all duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-center">
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-gray-900 text-lg">{item.mataPelajaran}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {item.semester}
                                                    </p>
                                                </div>
                                                <div className="text-right space-y-2">
                                                    <p className={`text-3xl font-bold ${getScoreColor(item.nilai)}`}>{item.nilai}</p>
                                                    <Badge variant={getScoreBadgeVariant(item.nilai)}>
                                                        {item.nilai >= 90 ? "A" : item.nilai >= 80 ? "B" : item.nilai >= 70 ? "C" : "D"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Teacher Notes */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                            Catatan Ustadz
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockCatatanUstadz.map((c, idx) => (
                            <Card key={idx} className="border-gray-200 bg-gray-50">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-gray-900">{c.ustadz}</p>
                                            <Badge variant="outline" className="text-xs">
                                                {c.mataPelajaran}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatTanggal(c.tanggal)}
                                        </p>
                                    </div>
                                    <p className="text-gray-900 leading-relaxed">{c.catatan}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </SimpleLayout>
    )
}
