import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";

const Pelanggaran = () => {
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
                <h1 className="text-2xl font-bold">Pelanggaran</h1>
                <div className="flex flex-wrap gap-2">
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
                            placeholder="Cari Pelanggaran ..."
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
                        <h2 className="font-bold">Sholehatu Mahdia</h2>
                        <br />
                        <div className="grid grid-cols-2 gap-2">
                            <p>Domisili</p><p>: Wilayah Al-Hasyimiyah (03) - H.3</p>
                            <p>Pendidikan</p><p>: S2 Manajemen Pendidikan Islam</p>
                            <p>Alamat</p><p>: Kab. Situbondo, Jawa Timur</p>
                            <p>Pencatat</p><p>: (AutoSystem)</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold">Pelanggaran</p>
                        <br />
                        <div className="grid grid-cols-2 gap-2">
                            <p>Kategori</p><p>: Ringan</p>
                            <p>Diproses Mahkamah</p><p>: <span className="text-red-500">Tidak ❌</span></p>
                            <p>Status</p><p className="text-red-500">: Belum diproses</p>
                            <p>Jenis</p><p>: Telat kembali ke pondok pada perizinan...</p>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 text-right">26 Nov 2024 00:02:00</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pelanggaran;