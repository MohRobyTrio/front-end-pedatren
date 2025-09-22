"use client"
import { User, Phone, Mail, Home, MapPin, Users, AlertCircle, RefreshCw } from "lucide-react"
import { useActiveChild } from "../../components/ortu/useActiveChild"
import useFetchProfilOrtu from "../../hooks/hooks_ortu/ProfilSantri"
import blankPhoto from "../../assets/user_no_bg.png"

const LoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Skeleton */}
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Card Skeleton */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center lg:col-span-1">
                        <div className="animate-pulse">
                            <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-36 mx-auto"></div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information Skeleton */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 lg:col-span-2">
                        <div className="animate-pulse">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                                <div className="h-6 bg-gray-200 rounded w-64"></div>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    </div>
                                ))}
                                <div className="md:col-span-2 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Parent Information Skeleton */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                    <div className="animate-pulse">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                            <div className="h-6 bg-gray-200 rounded w-64"></div>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-2">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="w-9 h-9 bg-gray-200 rounded-lg mr-3"></div>
                                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <div key={j} className="space-y-2">
                                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            </div>
                                        ))}
                                        <div className="md:col-span-2 space-y-2">
                                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ErrorDisplay = ({ error, onRetry }) => {
    return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Terjadi Kesalahan</h3>
                    <p className="text-gray-600 mb-6">Tidak dapat memuat data profil. Silakan coba lagi dalam beberapa saat.</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                        <p className="text-sm text-red-700 font-mono">{error}</p>
                    </div>
                    <button
                        onClick={() => onRetry(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Coba Lagi
                    </button>
                </div>
            </div>
        </div>
    )
}

export const ProfilPage = () => {
    const { activeChild } = useActiveChild()
    const { data, loading, error, fetchData } = useFetchProfilOrtu()

    if (loading) {
        return <LoadingSkeleton />
    }

    if (error) {
        return <ErrorDisplay error={error} onRetry={fetchData} />
    }

    const { Santri: santriData, Ortu_Wali: ortuData } = data.data

    const formatTanggal = (dateString) =>
        new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long", day: "numeric" }).format(new Date(dateString))

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const getGenderText = (gender) => (gender === "l" ? "Laki-laki" : "Perempuan")

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <User className="mr-3 h-6 w-6 text-blue-600" />
                        Profil Santri
                    </h1>
                    <p className="text-gray-600 mt-1">Informasi lengkap {santriData?.nama || "santri"}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Card */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center lg:col-span-1 hover:shadow-2xl transition-all duration-300">
                        <div className="w-32 h-32 mx-auto mb-6 relative rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-lg">
                            {santriData.pas_foto ? (
                                <img
                                    src={santriData.pas_foto || blankPhoto}
                                    alt={santriData.nama}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = blankPhoto;
                                    }}
                                />
                            ) : (
                                <User className="w-16 h-16 text-blue-600" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{santriData.nama || "-"}</h2>
                        <div className="space-y-3">
                            {/* <span className="inline-block bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                Aktif
                            </span> */}
                            <div className="space-y-2 text-sm text-gray-600">
                                {/* <p>
                                    <span className="font-medium">ID:</span> {santriData.santri_id}
                                </p> */}
                                <p>
                                    <span className="font-medium">NIK/No. Passport:</span> {santriData.identitas || "-"}
                                </p>
                                <p>
                                    <span className="font-medium">NIS:</span> {activeChild.nis || "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 lg:col-span-2 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center mb-6">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-3">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Informasi Pribadi & Akademik</h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Lengkap</label>
                                <p className="text-base font-medium text-gray-800">{santriData.nama}</p>
                            </div> */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jenis Kelamin</label>
                                <p className="text-base text-gray-800">{getGenderText(santriData.jenis_kelamin) || "-"}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Anak Ke</label>
                                <p className="text-base text-gray-800">{santriData.anak_ke || "-"}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Tempat, Tanggal Lahir
                                </label>
                                <p className="text-base text-gray-800">
                                    {[
                                        santriData?.tempat_lahir || null,
                                        santriData?.tanggal_lahir ? formatTanggal(santriData.tanggal_lahir) : null,
                                    ]
                                        .filter(Boolean) // buang null/undefined/empty string
                                        .join(", ")}
                                </p>
                                <p className="text-sm text-blue-600 font-medium">
                                    Usia: {santriData?.umur || "-"} tahun
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Wilayah</label>
                                <p className="text-base text-gray-800">{santriData.wilayah || "-"}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Blok</label>
                                <p className="text-base text-gray-800">{santriData.blok || "-"}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kamar</label>
                                <p className="text-base text-gray-800">{santriData.kamar || "-"}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lembaga</label>
                                <p className="text-base text-gray-800">{santriData.lembaga || "-"}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jurusan</label>
                                <p className="text-base text-gray-800">{santriData.jurusan || "-"}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kelas</label>
                                <p className="text-base text-gray-800">
                                    {[
                                        santriData?.kelas || null,
                                        santriData?.rombel || null
                                    ].filter(Boolean).join(" - ") || "-"}
                                </p>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                                    <MapPin className="mr-2 h-4 w-4" /> Alamat
                                </label>
                                <p className="text-base text-gray-800">
                                    {[
                                        santriData?.kecamatan || null,
                                        santriData?.kabupaten || null,
                                        santriData?.provinsi || null,
                                        santriData?.negara || null
                                    ].filter(Boolean).join(", ") || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Parent Information */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg mr-3">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Informasi Orang Tua/Wali</h3>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {ortuData.map((ortu, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm"
                            >
                                <div className="flex items-center mb-4">
                                    <div
                                        className={`p-2 rounded-lg mr-3 ${ortu.status.includes("ayah") ? "bg-blue-100" : "bg-pink-100"}`}
                                    >
                                        <User className={`h-5 w-5 ${ortu.status.includes("ayah") ? "text-blue-600" : "text-pink-600"}`} />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 capitalize">{ortu.status || "-"}</h4>
                                    {ortu.wali === 1 && (
                                        <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                                            Wali
                                        </span>
                                    )}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</label>
                                        <p className="text-base font-medium text-gray-800">{ortu.nama || "-"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">NIK</label>
                                        <p className="text-base text-gray-700">{ortu.nik || "-"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                                            <Phone className="mr-1 h-3 w-3" /> Telepon
                                        </label>
                                        <p className="text-base text-gray-700">{ortu.no_telepon || "-"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                                            <Mail className="mr-1 h-3 w-3" /> Email
                                        </label>
                                        <p className="text-base text-gray-700">{ortu.email || "-"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pekerjaan</label>
                                        <p className="text-base text-gray-700">{ortu.pekerjaan || "-"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Penghasilan</label>
                                        <p className="text-base font-medium text-emerald-600">{formatRupiah(ortu.penghasilan) || "-"}</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                                            <Home className="mr-1 h-3 w-3" /> Alamat
                                        </label>
                                        <p className="text-base text-gray-700">
                                            {[
                                                ortu?.jalan || null,
                                                ortu?.nama_kabupaten || null,
                                                ortu?.nama_provinsi || null,
                                                ortu?.nama_negara || null
                                            ].filter(Boolean).join(", ") || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
