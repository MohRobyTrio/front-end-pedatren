import { FaBookOpen } from "react-icons/fa"

const DetailNadhoman = ({ nadhoman = [] }) => {

    const getStatusBadge = (status) => {
        const statusConfig = {
            tuntas: "bg-green-50 text-green-700 border-green-200",
            "on progress": "bg-amber-50 text-amber-700 border-amber-200",
            pending: "bg-gray-50 text-gray-700 border-gray-200",
        }

        const colorClass = statusConfig[status?.toLowerCase()] || statusConfig["pending"]

        return <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>{status || "Pending"}</span>
    }

    const getNilaiBadge = (nilai) => {
        const nilaiConfig = {
            lancar: "bg-green-50 text-green-700 border-green-200",
            cukup: "bg-amber-50 text-amber-700 border-amber-200",
            kurang: "bg-red-50 text-red-700 border-red-200",
        }

        const colorClass = nilaiConfig[nilai?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"

        return <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>{nilai || "-"}</span>
    }

    const getJenisSetoranBadge = (jenis) => {
        const jenisConfig = {
            baru: "bg-blue-50 text-blue-700 border-blue-200",
            murojaah: "bg-purple-50 text-purple-700 border-purple-200",
        }

        const colorClass = jenisConfig[jenis?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"

        return <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>{jenis || "-"}</span>
    }

    const TableView = () => (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Santri
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Kitab
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jenis Setoran
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bait</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Catatan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pencatat
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {nadhoman.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggal || "-"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.santri_nama || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.nama_kitab || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{getJenisSetoranBadge(item.jenis_setoran)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.bait || "-"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getNilaiBadge(item.nilai)}</td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="text-sm text-gray-900 truncate" title={item.catatan}>
                                        {item.catatan || "-"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pencatat || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    if (nadhoman.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center">
                    <FaBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Setoran</h3>
                    <p className="text-gray-500">Data setoran nadhoman akan ditampilkan di sini setelah ada pencatatan.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Detail Nadhoman</h2>
                    <p className="text-gray-600 mt-1">{nadhoman.length} data nadhoman</p>
                </div>
            </div>

            <TableView />
        </div>
    )
}

export default DetailNadhoman
