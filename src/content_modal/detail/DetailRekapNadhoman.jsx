import { FaBookOpen } from "react-icons/fa"

const DetailRekapNadhoman = ({ rekapNadhoman = [] }) => {
    const TableView = () => (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Santri
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                NIS
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Kitab
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Bait
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Progress (%)</th>

                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rekapNadhoman.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.santri_nama || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.nis || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.nama_kitab || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.total_bait}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center">
                                        {/* <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${item.persentase_selesai}%` }}
                                            ></div>
                                        </div> */}
                                        <span className="text-gray-600">{item.persentase_selesai}%</span>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
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
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Detail Rekap Nadhoman</h2>
                    <p className="text-gray-600 mt-1">{rekapNadhoman.length} data rekap nadhoman</p>
                </div>
            </div>

            <TableView />
        </div>
    )
}

export default DetailRekapNadhoman
