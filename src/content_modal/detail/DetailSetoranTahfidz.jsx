"use client"

import { useState } from "react"
import { FaList, FaTh, FaBookOpen } from "react-icons/fa"

const DetailSetoranTahfidz = ({ setoranTahfidz = [] }) => {
  const [viewMode, setViewMode] = useState("table")

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

  const CardView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {setoranTahfidz.map((item, index) => (
        <div
          key={item.id || index}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">#{index + 1}</div>
              <h3 className="font-semibold text-gray-900">{item.santri_nama || "-"}</h3>
              <p className="text-sm text-gray-500">{item.tanggal || "-"}</p>
            </div>
            {getStatusBadge(item.status)}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Jenis Setoran</span>
              {getJenisSetoranBadge(item.jenis_setoran)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Surat</span>
              <span className="font-medium text-gray-900">{item.surat || "-"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Nilai</span>
              {getNilaiBadge(item.nilai)}
            </div>

            {item.catatan && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Catatan</p>
                <p className="text-sm text-gray-700">{item.catatan}</p>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">Pencatat: {item.pencatat || "-"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

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
                Jenis Setoran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surat</th>
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
            {setoranTahfidz.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggal || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.santri_nama || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getJenisSetoranBadge(item.jenis_setoran)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.surat || "-"}</td>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Detail Setoran Tahfidz</h2>
          <p className="text-gray-600 mt-1">{setoranTahfidz.length} data setoran</p>
        </div>

        {/* <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
              viewMode === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaList className="w-4 h-4" />
            Tabel
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
              viewMode === "cards" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FaTh className="w-4 h-4" />
            Kartu
          </button>
        </div> */}
      </div>

      {viewMode === "table" ? <TableView /> : <CardView />}
    </div>
  )
}

export default DetailSetoranTahfidz
