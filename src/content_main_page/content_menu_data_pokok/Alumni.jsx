import { useState, useMemo, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useFetchAlumni from "../../hooks/hooks_menu_data_pokok/Alumni";
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png";
import Filters from "../../components/Filters";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import DropdownAngkatan from "../../hooks/hook_dropdown/DropdownAngkatan";
import Pagination from "../../components/Pagination";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";

const Alumni = () => {
    const [filters, setFilters] = useState({
        phoneNumber: "",
        wafathidup: "",
        status: "",
        jenisKelamin: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        angkatanPelajar: "",
        angkatanSantri: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: ""
    })

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();
    const { menuAngkatanKeluarPelajar, menuAngkatanKeluarSantri } = DropdownAngkatan();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const lembagaTerpilih = filterLembaga.lembaga.find(n => n.value == selectedLembaga.lembaga)?.label || "";
    const jurusanTerpilih = filterLembaga.jurusan.find(n => n.value == selectedLembaga.jurusan)?.label || "";
    const kelasTerpilih = filterLembaga.kelas.find(n => n.value == selectedLembaga.kelas)?.label || "";
    const rombelTerpilih = filterLembaga.rombel.find(n => n.value == selectedLembaga.rombel)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih,
        lembaga: lembagaTerpilih,
        jurusan: jurusanTerpilih,
        kelas: kelasTerpilih,
        rombel: rombelTerpilih
    }), [filters, jurusanTerpilih, kabupatenTerpilih, kecamatanTerpilih, kelasTerpilih, lembagaTerpilih, negaraTerpilih, provinsiTerpilih, rombelTerpilih]);

    const { alumni, loadingAlumni, searchTerm, setSearchTerm, error, limit, setLimit, totalDataAlumni, totalPages, currentPage, setCurrentPage } = useFetchAlumni(updatedFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
            const savedViewMode = sessionStorage.getItem("viewMode");
            if (savedViewMode) {
                setViewMode(savedViewMode);
            }
        }, []);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter3 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        status: [
            { label: "Semua Status", value: "" },
            { label: "Alumni Santri", value: "alumni santri" },
            { label: "Alumni Santri Non Pelajar", value: "alumni santri non pelajar" },
            { label: "Alumni Santri Tetapi Masih Pelajar Aktif", value: "alumni santri tetapi masih pelajar aktif" },
            { label: "Alumni Pelajar", value: "alumni pelajar" },
            { label: "Alumni Pelajar Non Santri", value: "alumni pelajar non santri" },
            { label: "Alumni Pelajar Tetapi Masih Santri Aktif", value: "alumni pelajar tetapi masih santri aktif" },
            { label: "Alumni Santri-Pelajar/Alumni Pelajar-Santri", value: "alumni pelajar sekaligus santri" }
        ],

        angkatanPelajar: menuAngkatanKeluarPelajar,

        angkatanSantri: menuAngkatanKeluarSantri
    }

    const filter4 = {
        wafathidup: [
            { label: "Pilih Wafat / Hidup", value: "" },
            { label: "Wafat", value: "sudah wafat" },
            { label: "Hidup", value: "masih hidup" }
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Alumni</h1>
                <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataAlumni}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                />

                {error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    viewMode === "list" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {loadingAlumni ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : alumni.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                alumni.map((item, index) => (
                                    <div key={item.id || index} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
                                        <img
                                            alt={item.nama || "-"}
                                            className="w-20 h-24 object-cover"
                                            src={item.foto_profil || blankProfile}
                                        />
                                        <div>
                                            <h2 className="font-semibold">{item.nama || "-"}</h2>
                                            <p className="text-gray-600">{item.kota_asal || "-"}</p>
                                            <p className="text-gray-600">
                                                Pend. Terakhir:{" "}
                                                {item.lembaga && item.lembaga !== "-" && item.tahun_keluar_santri && item.tahun_keluar_santri !== "-" ? (
                                                    <>
                                                        {item.lembaga} - {item.tahun_keluar_santri}
                                                    </>
                                                ) : item.lembaga && item.lembaga !== "-" ? (
                                                    item.lembaga
                                                ) : item.tahun_keluar_santri && item.tahun_keluar_santri !== "-" ? (
                                                    item.tahun_keluar_santri
                                                ) : (
                                                    "-"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                    <tr>
                                        <th className="px-3 py-2 border-b">No</th>
                                        <th className="px-3 py-2 border-b">NIUP</th>
                                        <th className="px-3 py-2 border-b">Nama</th>
                                        <th className="px-3 py-2 border-b">Status Santri Terakhir</th>
                                        <th className="px-3 py-2 border-b">Pendidikan Terakhir</th>
                                        <th className="px-3 py-2 border-b">Tgl Update Bio</th>
                                        <th className="px-3 py-2 border-b">Tgl Input Bio</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800">
                                    {loadingAlumni ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : alumni.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        alumni.map((item, index) => (
                                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center">
                                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                                <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">
                                                    Masuk: {item.tahun_masuk_santri || "-"}<br />
                                                    Bayang: {item.tahun_keluar_santri || "-"}
                                                </td>
                                                <td className="px-3 py-2 border-b">
                                                    {item.lembaga || "-"}<br />
                                                    <span className="italic">Lulus: {item.tahun_keluar_santri || "-"}</span>
                                                </td>
                                                <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    )
                )}


                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default Alumni;
