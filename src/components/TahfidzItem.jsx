import { FaQuran, FaCalendarAlt, FaUser, FaGraduationCap, FaBook, FaEdit, FaEye } from "react-icons/fa"

const TahfidzItem = ({ data, title, menu }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaQuran className="text-green-600 text-lg" />
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
        <div className="flex gap-1">
          <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
            <FaEye className="text-xs" />
          </button>
          <button className="p-1 text-green-500 hover:bg-green-50 rounded">
            <FaEdit className="text-xs" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400 text-xs" />
          <span className="text-gray-600">Tanggal:</span>
          <span className="font-medium text-gray-800">{data.tanggal || "-"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaUser className="text-gray-400 text-xs" />
          <span className="text-gray-600">Nama:</span>
          <span className="font-medium text-gray-800">{data.nama_siswa || "-"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaGraduationCap className="text-gray-400 text-xs" />
          <span className="text-gray-600">NIS:</span>
          <span className="font-medium text-gray-800">{data.nis || "-"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaBook className="text-gray-400 text-xs" />
          <span className="text-gray-600">Kelas:</span>
          <span className="font-medium text-gray-800">{data.kelas || "-"}</span>
        </div>

        <div className="bg-green-50 rounded-lg p-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-700 font-medium text-xs">Hafalan Baru</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              {data.hafalan_baru || "0"} Ayat
            </span>
          </div>
          <p className="text-green-600 text-xs">{data.keterangan || "Tidak ada keterangan"}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-700 font-medium text-xs">Murojaah</span>
          </div>
          <p className="text-blue-600 text-xs">{data.murojaah || "Tidak ada murojaah"}</p>
        </div>
      </div>
    </div>
  )
}

export default TahfidzItem
