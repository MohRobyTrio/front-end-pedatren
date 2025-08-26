import { FaUser, FaIdCard, FaChartLine } from "react-icons/fa"

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


    return (
        <div className="max-w-4xl mx-auto space-y-6">
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
        </div>
    )
}

export default DetailRekapTahfidz
