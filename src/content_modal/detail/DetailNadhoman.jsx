import { FaBookOpen } from "react-icons/fa"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"

const DetailNadhoman = ({ nadhoman = [] }) => {

    // eslint-disable-next-line no-unused-vars
    const getStatusBadge = (status) => {
        const statusConfig = {
            tuntas: "bg-green-50 text-green-700 border-green-200",
            "on progress": "bg-amber-50 text-amber-700 border-amber-200",
            pending: "bg-gray-50 text-gray-700 border-gray-200",
        }

        const colorClass = statusConfig[status?.toLowerCase()] || statusConfig["pending"]

        return <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>{status || "Pending"}</span>
    }

    // eslint-disable-next-line no-unused-vars
    const getNilaiBadge = (nilai) => {
        const nilaiConfig = {
            lancar: "bg-green-50 text-green-700 border-green-200",
            cukup: "bg-amber-50 text-amber-700 border-amber-200",
            kurang: "bg-red-50 text-red-700 border-red-200",
        }

        const colorClass = nilaiConfig[nilai?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"

        return <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>{nilai || "-"}</span>
    }

    // eslint-disable-next-line no-unused-vars
    const getJenisSetoranBadge = (jenis) => {
        const jenisConfig = {
            baru: "bg-blue-50 text-blue-700 border-blue-200",
            murojaah: "bg-purple-50 text-purple-700 border-purple-200",
        }

        const colorClass = jenisConfig[jenis?.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"

        return <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>{jenis || "-"}</span>
    }

    const TableView = () => (
        <DoubleScrollbarTable>
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                    <tr>
                        <th className="px-3 py-2 border-b w-16">#</th>
                        <th className="px-3 py-2 border-b">Tahun Ajaran</th>
                        <th className="px-3 py-2 border-b">Tanggal</th>
                        <th className="px-3 py-2 border-b">Nama Siswa</th>
                        <th className="px-3 py-2 border-b">Nama Kitab</th>
                        <th className="px-3 py-2 border-b">Jenis Storan</th>
                        <th className="px-3 py-2 border-b">Bait</th>
                        <th className="px-3 py-2 border-b">Nilai</th>
                        <th className="px-3 py-2 border-b">Catatan</th>
                        <th className="px-3 py-2 border-b">Status</th>
                        <th className="px-3 py-2 border-b">Pencatat</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800">
                    {nadhoman.map((item, index) => (
                            <tr
                                key={item.id || index}
                                className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left"
                            >
                                <td className="px-3 py-2 border-b">{index + 1 || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tahun_ajaran || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.santri_nama || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.nama_kitab || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.jenis_setoran || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.bait || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.nilai || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.catatan || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.status || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.pencatat || "-"}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </DoubleScrollbarTable>
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
            {/* <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Detail Nadhoman</h2>
                    <p className="text-gray-600 mt-1">{nadhoman.length} data nadhoman</p>
                </div>
            </div> */}

            <TableView />
        </div>
    )
}

export default DetailNadhoman
