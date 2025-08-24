import { FaBookOpen } from "react-icons/fa"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"

const DetailRekapNadhoman = ({ rekapNadhoman = [] }) => {
    const TableView = () => (
        <DoubleScrollbarTable>
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                    <tr>
                        <th className="px-3 py-2 border-b w-16">#</th>
                        <th className="px-3 py-2 border-b">Tahun Ajaran</th>
                        <th className="px-3 py-2 border-b">NIS</th>
                        <th className="px-3 py-2 border-b">Nama Santri</th>
                        <th className="px-3 py-2 border-b">Nama Kitab</th>
                        <th className="px-3 py-2 border-b">Total Bait</th>
                        <th className="px-3 py-2 border-b">Progress (%)</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800">
                    {rekapNadhoman.map((student, index) => (
                            <tr key={student.nis} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b">{student.tahun_ajaran}</td>
                                <td className="px-3 py-2 border-b">{student.nis}</td>
                                <td className="px-3 py-2 border-b">{student.santri_nama}</td>
                                <td className="px-3 py-2 border-b">{student.nama_kitab}</td>
                                <td className="px-3 py-2 border-b">{student.total_bait}</td>
                                <td className="px-3 py-2 border-b">
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${student.persentase_selesai}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-gray-600">{student.persentase_selesai}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </DoubleScrollbarTable>
    )

    if (rekapNadhoman.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center">
                    <FaBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Rekap</h3>
                    <p className="text-gray-500">Data rekap nadhoman akan ditampilkan di sini setelah ada pencatatan.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Detail Rekap Nadhoman</h2>
                    <p className="text-gray-600 mt-1">{rekapNadhoman.length} data rekap nadhoman</p>
                </div>
            </div> */}

            <TableView />
        </div>
    )
}

export default DetailRekapNadhoman
