// import { useEffect, useState } from 'react';
// import Filters from '../../components/Filters';

// const KehadiranRWS = () => {

//     const [showFilters, setShowFilters] = useState(false);



//     const filterOptions = {
//         negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura", "Brunei", "Thailand"],
//         lembaga: ["Semua Lembaga", "Madrasah", "Pesantren", "Universitas", "Sekolah"],
//         status: ["Semua Status", "Aktif", "Tidak Aktif", "Alumni"],
//         provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "DKI Jakarta"],
//         kecamatan: ["Semua Kecamatan", "Kecamatan A", "Kecamatan B", "Kecamatan C"],
//         phoneNumber: ["Phone Number", "Tersedia", "Tidak Tersedia"],
//         kabupaten: ["Semua Kabupaten", "Bandung", "Surabaya", "Semarang", "Medan"],
//         urutBerdasarkan: ["Urut Berdasarkan", "Nama", "Tanggal Masuk", "Nomor Induk"],
//         urutSecara: ["Urut Secara", "Ascending", "Descending"]
//     };


//     return (
//         <div className="flex-1 pl-6 pt-6 pb-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-bold">Data Kehadiran Rapat Wali Santri (RWS)</h1>
//                 <div className="flex items-center">
//                     <div className="flex items-center space-x-2">
//                         <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
//                             Rekap
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <Filters showFilters={showFilters} filterOptions={filterOptions} />
//                 <SearchBar
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     totalData={totalData}
//                     totalFiltered={totalFiltered}
//                     toggleFilters={() => setShowFilters(!showFilters)}
//                     toggleView={setViewMode}

//                 />
           
//                 <div className="overflow-x-auto">
//                     <table className="w-full border border-gray-300">
//                         <thead>
//                             <tr className="bg-gray-100 text-left">
//                                 <th className="p-2 border">#</th>
//                                 <th className="p-2 border">NIK / No. Passport</th>
//                                 <th className="p-2 border">Nama</th>
//                                 <th className="p-2 border">Kota Asal</th>
//                                 <th className="p-2 border">Phone1</th>
//                                 <th className="p-2 border">Phone2</th>
//                                 <th className="p-2 border">Tanggal Input</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td className="p-2 border" colSpan="7" align="center">Data tidak tersedia</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="flex justify-between items-center mt-4">
//                     <button className="px-4 py-2 bg-gray-200 rounded">Previous</button>
//                     <button className="px-4 py-2 text-blue-500">Next</button>
//                 </div>
//             </div>
//             </div>
//     )
// }

// export default KehadiranRWS;

import { useState } from "react";

export default function KehadiranRWS() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Data Kehadiran Rapat Wali Santri (RWS)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
        <select className="border p-2 rounded w-full"><option>Semua Negara</option></select>
        <select className="border p-2 rounded w-full"><option>Pilih Jenis Kelamin</option></select>
        <select className="border p-2 rounded w-full"><option>Semua Provinsi</option></select>
        <select className="border p-2 rounded w-full"><option>Semua Tahun</option></select>
        <select className="border p-2 rounded w-full"><option>Semua Kabupaten</option></select>
        <select className="border p-2 rounded w-full"><option>Semua Kecamatan</option></select>
      </div>

      <div className="flex justify-between items-center mb-4">
        <select className="border p-2 rounded">
          <option>25</option>
        </select>
        <span>Total data 0</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari RWS .."
            className="border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="p-2 bg-green-500 text-white rounded">🔍</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">#</th>
              <th className="p-2 border">NIK / No. Passport</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Kota Asal</th>
              <th className="p-2 border">Phone1</th>
              <th className="p-2 border">Phone2</th>
              <th className="p-2 border">Tanggal Input</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border" colSpan="7" align="center">Data tidak tersedia</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded">Previous</button>
        <button className="px-4 py-2 text-blue-500">Next</button>
      </div>
    </div>
  );
}
