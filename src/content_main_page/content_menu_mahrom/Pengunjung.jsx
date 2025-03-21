import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const data = [
    {
        wilayah: "Wilayah Al-Hasyimiyah (01)",
        nama: "Fais Isnainuddin",
        santri: "Eric Saiful Rachmat",
        jumlah: "4 Orang",
    },
    {
        wilayah: "Wilayah Al-Zaytun (02)",
        nama: "Abdul Aziz Hakim",
        santri: "Nabila Aziz Hakim",
        jumlah: "4 Orang",
    },
    // Tambahkan data lainnya sesuai kebutuhan
];

const Pengunjung = () => {
    const [search, setSearch] = useState("");
    const filteredData = data.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase())
    );

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
                <h1 className="text-2xl font-bold">Data Pengunjung Mahrom</h1>
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
                            placeholder="Cari Pengunjung .."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-2 rounded"
                        />
                        <button className="p-2 bg-green-500 text-white rounded">
                            <i className="fas fa-filter"></i>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border text-sm">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2 border">No</th>
                                <th className="p-2 border">Wilayah Mahrom</th>
                                <th className="p-2 border">Nama Pengunjung</th>
                                <th className="p-2 border">Santri yang Dikunjungi</th>
                                <th className="p-2 border">Jumlah Rombongan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} className="border">
                                    <td className="p-2 border text-center">{index + 1}</td>
                                    <td className="p-2 border">{item.wilayah}</td>
                                    <td className="p-2 border">{item.nama}</td>
                                    <td className="p-2 border">{item.santri}</td>
                                    <td className="p-2 border">{item.jumlah}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <nav aria-label="Page navigation example" className="flex justify-end  mt-6">
                    <ul className="flex items-center -space-x-px h-10 text-sm">
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="sr-only">Previous</span>
                                <svg
                                    className="w-3 h-3 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 1 1 5l4 4"
                                    />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                2
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                aria-current="page"
                                className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                            >
                                3
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                4
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                5
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="sr-only">Next</span>
                                <svg
                                    className="w-3 h-3 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>

            </div>
        </div>
    );
};

export default Pengunjung;
