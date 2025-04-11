import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";

const CatatanKognitif = () => {
    const [search, setSearch] = useState("");

    const filterOptions = {
        negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura"],
        provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Tengah", "Jawa Timur"],
        kabupaten: ["Semua Kabupaten", "Bandung", "Semarang", "Surabaya"],
        kecamatan: ["Semua Kecamatan", "Cimahi", "Ungaran", "Gubeng"],
        wilayah: ["Pilih Wilayah", "wilayah A", "wilayah B"]
    };

    return (
        <div className="flex-1 p-6">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Catatan Kognitif</h1>
                <div className="space-x-2 flex flex-wrap">
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Wali Asuh Tidak Menginput</button>
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Statistik</button>
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
                            placeholder="Cari Catatan ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-2 rounded flex-1"
                        />
                        <button className="p-2 bg-green-500 text-white rounded">
                            <i className="fas fa-filter"></i>
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex flex-wrap p-4 rounded-lg shadow-sm gap-4 items-center bg-white">
                            <img src="https://via.placeholder.com/100" alt="foto" className="w-24 h-24 rounded-md" />
                            <div className="flex-1 space-y-2 min-w-[200px]">
                                <h2 className="text-lg font-semibold">Bilqhis Madhania Faidah Putri</h2>
                                <p className="text-sm text-gray-600">Domisili: C.4 (Al-Mahdi) - Daerah Robi'ah Al-Adawiyah</p>
                                <p className="text-sm text-gray-600">Pendidikan: IPS Reguler - SMA-NJ</p>
                            </div>
                            <div className="flex-1 space-y-2 min-w-[150px]">
                                <h2>Kebahasaan: <span className="text-green-600">[ B ]</span></h2>
                                <p className="text-sm">baik</p>
                                <p className="text-sm font-semibold">Tindak Lanjut:</p>
                                <p className="text-sm">Tingkatkan kebahasaan dengan baik dan benar.</p>
                            </div>
                            <div className="text-center space-y-2 flex flex-col items-center min-w-[120px]">
                                <img src="https://via.placeholder.com/60" alt="wali asuh" className="w-16 h-16 rounded-full" />
                                <p className="text-sm font-bold">Sitti Naiesa</p>
                                <p className="text-sm">(waliasuh)</p>
                                <p className="text-xs text-gray-500">26 Nov 2024 14:42:51</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CatatanKognitif;