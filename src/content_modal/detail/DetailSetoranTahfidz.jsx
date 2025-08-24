"use client"

import { FaBookOpen } from "react-icons/fa"
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable"

const DetailSetoranTahfidz = ({ setoranTahfidz = [] }) => {

    // eslint-disable-next-line no-unused-vars
    const getStatusBadge = (status) => {
        const statusConfig = {
            tuntas: "bg-green-50 text-green-700 border-green-200",
            "on progress": "bg-amber-50 text-amber-700 border-amber-200",
            pending: "bg-gray-50 text-gray-700 border-gray-200",
        }

        const colorClass = statusConfig[status?.toLowerCase()] || statusConfig["pending"]

        return <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClass}`}>{status || "-"}</span>
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

    // const CardView = () => (
    //   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    //     {setoranTahfidz.map((item, index) => (
    //       <div
    //         key={item.id || index}
    //         className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors"
    //       >
    //         <div className="flex items-start justify-between mb-4">
    //           <div>
    //             <div className="text-sm text-gray-500 mb-1">#{index + 1}</div>
    //             <h3 className="font-semibold text-gray-900">{item.santri_nama || "-"}</h3>
    //             <p className="text-sm text-gray-500">{item.tanggal || "-"}</p>
    //           </div>
    //           {getStatusBadge(item.status)}
    //         </div>

    //         <div className="space-y-3">
    //           <div className="flex items-center justify-between">
    //             <span className="text-sm text-gray-600">Jenis Setoran</span>
    //             {getJenisSetoranBadge(item.jenis_setoran)}
    //           </div>

    //           <div className="flex items-center justify-between">
    //             <span className="text-sm text-gray-600">Surat</span>
    //             <span className="font-medium text-gray-900">{item.surat || "-"}</span>
    //           </div>

    //           <div className="flex items-center justify-between">
    //             <span className="text-sm text-gray-600">Nilai</span>
    //             {getNilaiBadge(item.nilai)}
    //           </div>

    //           {item.catatan && (
    //             <div className="pt-3 border-t border-gray-100">
    //               <p className="text-xs text-gray-500 mb-1">Catatan</p>
    //               <p className="text-sm text-gray-700">{item.catatan}</p>
    //             </div>
    //           )}

    //           <div className="pt-2 border-t border-gray-100">
    //             <span className="text-xs text-gray-500">Pencatat: {item.pencatat || "-"}</span>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // )

    const TableView = () => (
        <DoubleScrollbarTable>
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                    <tr>
                        <th className="px-3 py-2 border-b w-16">#</th>
                        <th className="px-3 py-2 border-b">Tahun Ajaran</th>
                        <th className="px-3 py-2 border-b">Tanggal</th>
                        <th className="px-3 py-2 border-b">Nama Santri</th>
                        <th className="px-3 py-2 border-b">Jenis Setoran</th>
                        <th className="px-3 py-2 border-b">Keterangan</th>
                        <th className="px-3 py-2 border-b">Nilai</th>
                        <th className="px-3 py-2 border-b">Catatan</th>
                        <th className="px-3 py-2 border-b">Status</th>
                        <th className="px-3 py-2 border-b">Pencatat</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800">
                    {setoranTahfidz.map((item, index) => (
                        <tr
                            key={item.id || index}
                            className="hover:bg-gray-50 whitespace-nowrap text-center cursor-pointer text-left"
                        >
                            <td className="px-3 py-2 border-b">
                                {index + 1 || "-"}
                            </td>
                            <td className="px-3 py-2 border-b">{item.tahun_ajaran || "-"}</td>
                            <td className="px-3 py-2 border-b">{item.tanggal || "-"}</td>
                            <td className="px-3 py-2 border-b">{item.santri_nama || "-"}</td>
                            <td className="px-3 py-2 border-b capitalize">{item.jenis_setoran || "-"}</td>
                            <td className="px-3 py-2 border-b">{item.keterangan_setoran || "-"}</td>
                            <td className="px-3 py-2 border-b capitalize">{item.nilai || "-"}</td>
                            <td className="px-3 py-2 border-b">{item.catatan || "-"}</td>
                            <td className="px-3 py-2 border-b capitalize">{item.status || "-"}</td>
                            <td className="px-3 py-2 border-b">{item.pencatat || "-"}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </DoubleScrollbarTable>
    )

    if (setoranTahfidz.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center">
                    <FaBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Setoran</h3>
                    <p className="text-gray-500">Data setoran tahfidz akan ditampilkan di sini setelah ada pencatatan.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Detail Setoran Tahfidz</h2>
                    <p className="text-gray-600 mt-1">{setoranTahfidz.length} data setoran</p>
                </div>
            </div> */}

            <TableView />
        </div>
    )
}

export default DetailSetoranTahfidz
