import { FaCheckCircle } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { FaQrcode } from "react-icons/fa";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";

const Perizinan = () => {
  const [search, setSearch] = useState("");

  const filterOptions = {
    negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura"],
    provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Tengah", "Jawa Timur"],
    kabupaten: ["Semua Kabupaten", "Bandung", "Semarang", "Surabaya"],
    kecamatan: ["Semua Kecamatan", "Cimahi", "Ungaran", "Gubeng"],
    wilayah: ["Pilih Wilayah", "wilayah A", "wilayah B"]
  };

  return (
    <div className="flex-1 pl-6 pt-6 pb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perizinan</h1>
        <div className="flex flex-wrap gap-2">
          <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
            Export
          </button>
          <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
            Statistik
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {Object.entries(filterOptions).map(([key, options]) => (
            <select key={key} className="border p-2 rounded w-full sm:w-auto">
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-2">
            <select className="border p-2 rounded">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>Total data 0</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari Perizinan ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button className="p-2 bg-green-500 text-white rounded">
              <i className="fas fa-filter"></i>
            </button>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg flex flex-col md:flex-row items-start gap-4 mb-4">
          <img src="/avatar1.png" alt="profile" className="w-16 h-16 rounded-full" />
          <div className="flex-1">
            <h2 className="font-bold">Sayyidah Latifah Al Ikromi</h2>
            <div className="grid grid-cols-2 gap-2">
              <p>🏠 Domisili</p><p>: D-6 - Daerah An-Najwa (D) - Wil. DALTIM</p>
              <p>🏫 Lembaga</p><p>: S2 Manajemen Pendidikan Islam</p>
              <p>📍 Alamat</p><p>: Kab. Situbondo, Jawa Timur</p>
              <p>Pencatat</p><p>: (AutoSystem)</p>
            </div>
          </div>
        </div>

        {/* Info Santri */}
        <div className="flex-1">
          <h2 className="text-lg font-bold"></h2>
          <p className="text-sm text-gray-600"> Domisili : </p>
          <p className="text-sm text-gray-600"> SMPN - Reguler - IX </p>
          <p className="text-sm text-gray-600"> Kalisat - Kab. Jember, Jawa Timur </p>
        </div>
      </div>
      {/* Informasi Izin */}
      <div className="mt-4 border-t pt-4">

        <p><strong>Alamat Tujuan:</strong> </p>
        <p><strong>Lama Izin:</strong> 26 Nov 2024 18:56:26 - 29 Nov 2024 17:00:35 (3 Hari)</p>
        <p><strong>Jenis Izin:</strong> Personal</p>
        <p className="text-blue-600 font-semibold">Status: Sudah berada di luar pondok</p>
      </div>
      {/* Detail Pembuat */}
      <div className="mt-4 border-t pt-4">
        <p><strong>Pembuat Izin:</strong> Linda Badriyati (wilayah)</p>
        <p><strong>Biktren:</strong> Rizqiyah Sakinah Safitri</p>
        <p><strong>Pengasuh:</strong> -</p>
        <p><strong>Kamtib:</strong> Abdul Rofek ✅</p>
        <p><strong>Keterangan:</strong> Santri izin pulang karena sakit dengan dijemput ibu kandungnya</p>
      </div>
      {/* Status & QR Code */}
      <div className="mt-4 flex justify-between items-center border-t pt-4">
        <div className="flex gap-2 text-gray-600 text-sm">
          <FaClock className="text-yellow-500" /> Sedang proses izin
          <FaCheckCircle className="text-blue-500" /> Perizinan diterima
          <FaCheckCircle className="text-blue-500" /> Sudah berada di luar pondok
        </div>
        <FaQrcode className="text-3xl text-gray-500" />
      </div>
      {/* Tanggal */}
      <div className="text-right text-gray-500 text-sm mt-2">
        <p>Tgl Dibuat  : 26 Nov 2024 18:55:25</p>
        <p>Tgl Diubah : 26 Nov 2024 19:06:03</p>
      </div>
    </div>

  )
}

export default Perizinan;