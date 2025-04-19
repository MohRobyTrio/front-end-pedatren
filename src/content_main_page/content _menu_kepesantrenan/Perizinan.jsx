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
      {/* Header */}
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

      {/* Card Putih */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {Object.entries(filterOptions).map(([key, options]) => (
            <select key={key} className="border p-2 rounded w-full sm:w-auto">
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
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
              onChange={e => setSearch(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button className="p-2 bg-green-500 text-white rounded">
              <i className="fas fa-filter"></i>
            </button>
          </div>
        </div>

        {/* Card Abu-Abu (Detail + Status) */}
        <div className="bg-gray-100 p-4 rounded-lg">
          {/* Detail Santri & Pembuat Izin */}
          <div className="flex flex-col md:flex-row items-start gap-4">
            <img src="/avatar1.png" alt="profile" className="w-30 h-30 rounded-full" />

            <div className="flex-1">
              <h2 className="font-bold">Sayyidah Latifah Al Ikromi 📍</h2>
              <div className="grid grid-cols-2 gap-2">
                <p>Domisili</p><p>: D-6 - Daerah An-Najwa (D) - Wil. DALTIM</p>
                <p>Lembaga</p><p>: SMPN - Reguler - IX</p>
                <p>Alamat</p><p>: Kalisat - Kab. Jember, Jawa Timur</p>
                <h2 className="font-bold">Alasan Izin</h2><h2><strong>: Berobat atau perlu rujuk ke rumah sakit</strong></h2>
                <p>Alamat Tujuan</p><p>: Kalisat - Kab. Jember, Jawa Timur</p>
                <p>Lama Izin</p><p>: Sejak 26 Nov 2024 18:56:26</p>
                <p>Jenis Izin</p><p>: Personal</p>
                <p>Status</p><p className="text-blue-600 font-semibold">: Sudah berada di luar pondok</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-2">
                <p>Pembuat Izin</p><p>: Linda Badriyati (wilayah)</p>
                <p>Biktren</p><p>: Rizqiyah Sakinah Safitri ✅</p>
                <p>Pengasuh</p><p>: -</p>
                <p>Kamtib</p><p>: Abdul Rofek ✅</p>
                <p>Keterangan</p><p>: Santri izin pulang karena sakit dengan dijemput ibu kandungnya</p>
              </div>
            </div>

            <FaQrcode className="text-9xl text-gray-500" />
          </div>

          {/* Separator & Status + Tanggal */}
          <div className="mt-6 border-t pt-4 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-600">
            <div className="flex flex-wrap items-center gap-2">
              <FaClock className="text-yellow-500" /> <span>Sedang proses izin</span>
              <FaCheckCircle className="text-blue-500" /> <span>Perizinan diterima</span>
              <FaCheckCircle className="text-blue-500" /> <span>Sudah berada di luar pondok</span>
            </div>
            <div className="text-right text-gray-500">
              <p>Tgl Dibuat : 26 Nov 2024 18:55:25</p>
              <p>Tgl Diubah : 26 Nov 2024 19:06:03</p>
            </div>
          </div>
        </div>

        {/* … konten lain, jika ada */}
      </div>
    </div>
  );
  
}

export default Perizinan;