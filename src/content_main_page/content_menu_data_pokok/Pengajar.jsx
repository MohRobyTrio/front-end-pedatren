import '@fortawesome/fontawesome-free/css/all.min.css';
import useFetchPengajar from '../../logic/logic_menu_data_pokok/Pengajar';
import { OrbitProgress } from "react-loading-indicators";
import defaultProfile from '/src/assets/blank_profile.png';
import SearchBar from '../../components/SearchBar';
<<<<<<< HEAD
import { useState } from 'react';
=======
import { useEffect, useState } from 'react';
>>>>>>> 8d431122e131fd4d24d1f21271d5f8b2c2d61358
import Filters from '../../components/Filters';


const Pengajar = () => {
    const { pengajar, loading, searchTerm, setSearchTerm, totalData, totalFiltered } = useFetchPengajar();
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const filterOptions = {
        negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura", "Brunei", "Thailand"],
        lembaga: ["Semua Lembaga", "Madrasah", "Pesantren", "Universitas", "Sekolah"],
        status: ["Semua Status", "Aktif", "Tidak Aktif", "Alumni"],
        provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "DKI Jakarta"],
        kecamatan: ["Semua Kecamatan", "Kecamatan A", "Kecamatan B", "Kecamatan C"],
        phoneNumber: ["Phone Number", "Tersedia", "Tidak Tersedia"],
        kabupaten: ["Semua Kabupaten", "Bandung", "Surabaya", "Semarang", "Medan"],
        urutBerdasarkan: ["Urut Berdasarkan", "Nama", "Tanggal Masuk", "Nomor Induk"],
        urutSecara: ["Urut Secara", "Ascending", "Descending"]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Pengajar</h1>
                <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                            Export
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">
                            Statistik
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Filters showFilters={showFilters} filterOptions={filterOptions} />
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    totalFiltered={totalFiltered}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}

                />
                {viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3">
                        {loading ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : pengajar.length === 0 ? (
                            <p className="text-center col-span-3">Tidak ada data</p>
                        ) : (
                            pengajar.map((item) => (
                                <div key={item.id_pengajar} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
                                    <img
                                        alt={item.nama || "-"}
                                        className="w-20 h-24 object-cover"
                                        src={item.image_url || defaultProfile}
                                        width={50}
                                        height={50}
                                    />
                                    <div>
                                        <h2 className="font-semibold">{item.nama}</h2>
                                        <p className="text-gray-600">NIUP: {item.niup}</p>
                                        <p className="text-gray-600">{item.nama_pendidikan_terakhir}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 w-16">No</th>
                                <th className="border p-2">NIUP</th>
                                <th className="border p-2">Nama</th>
                                <th className="border p-2">Pendidikan Terakhir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </td>
                                </tr>
                            ) : pengajar.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">Tidak ada data</td>
                                </tr>
                            ) : (
                                pengajar.map((item, index) => (
                                    <tr key={item.id_pengajar} className="text-center">
                                        <td className="border p-2 w-16">{index + 1}</td>
                                        <td className="border p-2">{item.niup}</td>
                                        <td className="border p-2">{item.nama}</td>
                                        <td className="border p-2">{item.nama_pendidikan_terakhir}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>


                )}
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
    )
}

export default Pengajar;