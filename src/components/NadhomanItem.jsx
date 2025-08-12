import { FaScroll, FaCalendarAlt, FaUser, FaBook, FaFileAlt } from "react-icons/fa"

const NadhomanItem = ({ data, title, menu }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <FaScroll className="text-amber-600 text-lg" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{data.nama_siswa || "Nama Siswa"}</h3>
                        <p className="text-xs text-gray-500">NIS: {data.nis || "-"}</p>
                    </div>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                    {data.kelas || "Kelas"}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-gray-400 text-xs" />
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="text-gray-900 font-medium">{data.tanggal || "-"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <FaBook className="text-gray-400 text-xs" />
                    <span className="text-gray-600">Kitab:</span>
                    <span className="text-gray-900 font-medium">{data.kitab || "-"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <FaFileAlt className="text-gray-400 text-xs" />
                    <span className="text-gray-600">Hafalan Baru:</span>
                    <span className="text-amber-600 font-semibold">{data.hafalan_baru || "0"} Bait</span>
                </div>
            </div>

            {data.keterangan && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Keterangan:</p>
                    <p className="text-sm text-gray-800">{data.keterangan}</p>
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <FaUser className="text-gray-400 text-xs" />
                    <span className="text-xs text-gray-500">{data.unit || "Unit"}</span>
                </div>
                <button className="text-amber-600 hover:text-amber-700 text-xs font-medium hover:underline">
                    Lihat Detail
                </button>
            </div>
        </div>
    )
}

export default NadhomanItem
