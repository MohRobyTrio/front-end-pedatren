import { useState } from "react";


const KehadiranRWS = () => {
  const [search, setSearch] = useState("");

  const filterOptions = {
    negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura"],
    provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Tengah", "Jawa Timur"],
    kabupaten: ["Semua Kabupaten", "Bandung", "Semarang", "Surabaya"],
    kecamatan: ["Semua Kecamatan", "Cimahi", "Ungaran", "Gubeng"],
    jenisKelamin: ["Pilih Jenis Kelamin", "Laki-laki", "Perempuan"],
    tahun: ["Semua Tahun", "2023", "2024", "2025"],
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Kehadiran RWS (Rapat Wali Santri)</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {Object.entries(filterOptions).map(([key, options]) => (
            <select key={key} className="border p-2 rounded">
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <select className="border p-2 rounded">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>Total data 0</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari RWS .."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded"
            />
            <button className="p-2 bg-green-500 text-white rounded">
              <i className="fas fa-filter"></i>
            </button>
          </div>
        </div>
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">NIK / No. Passport</th>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Kota Asal</th>
              <th className="border p-2">Phone1</th>
              <th className="border p-2">Phone2</th>
              <th className="border p-2">Tanggal Input</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-center p-4">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button className="border p-2 rounded">
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          <button className="border p-2 rounded text-blue-500">
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KehadiranRWS;
