import { FaQuran, FaUser, FaIdCard, FaChartLine, FaStar } from "react-icons/fa"

const DetailRekapTahfidz = ({ rekapTahfidz }) => {
    // Convert percentage to number for calculations
    const percentage = Number(rekapTahfidz.persentase_khatam)

    // Determine progress color based on percentage
    const getProgressColor = (percent) => {
        if (percent >= 80) return "bg-green-500"
        if (percent >= 60) return "bg-blue-500"
        if (percent >= 40) return "bg-yellow-500"
        return "bg-red-500"
    }

    const getProgressTextColor = (percent) => {
        if (percent >= 80) return "text-green-600"
        if (percent >= 60) return "text-blue-600"
        if (percent >= 40) return "text-yellow-600"
        return "text-red-600"
    }

    const getStatusBadge = (percent) => {
        if (percent >= 80) return { text: "Sangat Baik", color: "bg-green-100 text-green-800" }
        if (percent >= 60) return { text: "Baik", color: "bg-blue-100 text-blue-800" }
        if (percent >= 40) return { text: "Cukup", color: "bg-yellow-100 text-yellow-800" }
        return { text: "Perlu Perbaikan", color: "bg-red-100 text-red-800" }
    }

    const status = getStatusBadge(percentage)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Card */}
            {/* <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <FaQuran className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Detail Rekap Tahfidz</h1>
                            <p className="text-green-100">Progress Hafalan Al-Quran</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{percentage.toFixed(1)}%</div>
                        <div className="text-green-100">Khatam</div>
                    </div>
                </div>
            </div> */}

            {/* Student Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FaUser className="mr-2 text-green-600" />
                    Informasi Santri
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <FaIdCard className="text-green-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">NIS</div>
                                <div className="font-semibold text-gray-800">{rekapTahfidz.nis}</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <FaUser className="text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Nama Santri</div>
                                <div className="font-semibold text-gray-800">{rekapTahfidz.santri_nama}</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <FaQuran className="text-purple-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Tahun Ajaran</div>
                                <div className="font-semibold text-gray-800">{rekapTahfidz.tahun_ajaran}</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <FaStar className="text-yellow-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Rata rata nilai</div>
                                <div className="font-semibold text-gray-800">{rekapTahfidz.rata_rata_nilai}</div>
                                {/* <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                    {status.text}
                                </span> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <FaChartLine className="mr-2 text-green-600" />
                    Progress Hafalan
                </h2>

                <div className="space-y-6">
                    {/* Progress Bar */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Persentase Khatam</span>
                            <span className={`text-sm font-bold ${getProgressTextColor(percentage)}`}>{percentage.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{rekapTahfidz.total_surat}</div>
                            <div className="text-sm text-gray-600">Total Surat</div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{rekapTahfidz.jumlah_setoran}</div>
                            <div className="text-sm text-gray-600">Jumlah Setoran</div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">{rekapTahfidz.surat_tersisa}</div>
                            <div className="text-sm text-gray-600">Surat Tersisa</div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-600">{rekapTahfidz.sisa_persentase}%</div>
                            <div className="text-sm text-gray-600">Tersisa</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement Card */}
            {/* <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Pencapaian</h3>
                        <p className="text-gray-600">
                            {percentage >= 80
                                ? "Masya Allah! Pencapaian yang luar biasa dalam menghafal Al-Quran."
                                : percentage >= 60
                                    ? "Alhamdulillah, progress yang baik. Terus semangat!"
                                    : percentage >= 40
                                        ? "Progress cukup baik, tingkatkan lagi ya!"
                                        : "Semangat! Mulai dengan konsisten menghafal setiap hari."}
                        </p>
                    </div>
                    <div className="text-4xl">
                        {percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : percentage >= 40 ? "📚" : "💪"}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <FaQuran className="mr-2" />
                    Lihat Detail Hafalan
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <FaChartLine className="mr-2" />
                    Lihat Progress Chart
                </button>
            </div> */}
        </div>
    )
}

export default DetailRekapTahfidz
