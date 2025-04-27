import { useEffect, useMemo, useState } from "react";
import PesertaItem from "../../../components/PesertaItem";
import SearchBar from "../../../components/SearchBar";
import Filters from "../../../components/Filters";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../../components/Pagination";
import DropdownNegara from "../../../hooks/hook_dropdown/DropdownNegara";
import DropdownWilayah from "../../../hooks/hook_dropdown/DropdownWilayah";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
import DropdownAngkatan from "../../../hooks/hook_dropdown/DropdownAngkatan";
// import useFetchPeserta from "../../../hooks/hooks_menu_data_pokok/PesertaDidik";
import useFetchPelajar from "../../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Pelajar";

const Pelajar = () => {
    const [filters, setFilters] = useState({
        phoneNumber: "",
        wargaPesantren: "",
        status: "",
        jenisKelamin: "",
        smartcard: "",
        pemberkasan: "",
        urutBerdasarkan: "",
        urutSecara: "",
        negara: "",       // Tambahkan default value
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wilayah: "",
        blok: "",
        kamar: "",
        angkatanPelajar: "",
        angkatanSantri: ""
    })
    
    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();
    const { menuAngkatanPelajar, menuAngkatanSantri } = DropdownAngkatan();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value == selectedWilayah.wilayah)?.label || "";
    const blokTerpilih = filterWilayah.blok.find(p => p.value == selectedWilayah.blok)?.label || "";
    const kamarTerpilih = filterWilayah.kamar.find(k => k.value == selectedWilayah.kamar)?.label || "";    

    const lembagaTerpilih = filterLembaga.lembaga.find(n => n.value == selectedLembaga.lembaga)?.label || "";
    const jurusanTerpilih = filterLembaga.jurusan.find(n => n.value == selectedLembaga.jurusan)?.label || "";
    const kelasTerpilih = filterLembaga.kelas.find(n => n.value == selectedLembaga.kelas)?.label || "";
    const rombelTerpilih = filterLembaga.rombel.find(n => n.value == selectedLembaga.rombel)?.label || "";

    // Gabungkan filter tambahan sebelum dipakai
    const updatedFilters = useMemo(() => ({
        ...filters, 
        negara: negaraTerpilih, 
        provinsi: provinsiTerpilih, 
        kabupaten: kabupatenTerpilih, 
        kecamatan: kecamatanTerpilih,
        wilayah: wilayahTerpilih,
        blok: blokTerpilih,
        kamar: kamarTerpilih,
        lembaga: lembagaTerpilih,
        jurusan: jurusanTerpilih,
        kelas: kelasTerpilih,
        rombel: rombelTerpilih
    }), [blokTerpilih, filters, jurusanTerpilih, kabupatenTerpilih, kamarTerpilih, kecamatanTerpilih, kelasTerpilih, lembagaTerpilih, negaraTerpilih, provinsiTerpilih, rombelTerpilih, wilayahTerpilih]);
    
    // const { pesertaDidik, loadingPesertaDidik, searchTerm, setSearchTerm, error, limit, setLimit, totalDataPesertaDidik, totalPages, currentPage, setCurrentPage } = useFetchPeserta(updatedFilters);
    const { pelajar, loadingPelajar, searchTerm, setSearchTerm, error, limit, setLimit, totalDataPelajar, totalPages, currentPage, setCurrentPage } = useFetchPelajar(updatedFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    // const totalPages = Math.ceil(totalDataPesertaDidik / limit);

    // console.log(totalPages);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter4 = {
        // Sudah
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        // Sudah
        status: [
            { label: "Semua Status", value: "" },
            { label: "Santri", value: "santri" },
            { label: "Santri Non Pelajar", value: "santri non pelajar" },
            { label: "Pelajar", value: "pelajar" },
            { label: "Pelajar Non Santri", value: "pelajar non santri" },
            { label: "Santri-Pelajar/Pelajar-Santri", value: "santri-pelajar" }
        ],
        
        angkatanPelajar: menuAngkatanPelajar,
        
        angkatanSantri: menuAngkatanSantri
    }
    const filter5 = {
        // Sudah
        wargaPesantren: [
            { label: "Warga Pesantren", value: "" },
            { label: "Memiliki NIUP", value: "memiliki niup" },
            { label: "Tanpa NIUP", value: "tanpa niup" }
        ],
        // Sudah
        pemberkasan: [
            { label: "Pemberkasan", value: "" },
            { label: "Tidak Ada Berkas", value: "tidak ada berkas" },
            { label: "Tidak Ada Foto Diri", value: "tidak ada foto diri" },
            { label: "Memiliki Foto Diri", value: "memiliki foto diri" },
            { label: "Tidak Ada KK", value: "tidak ada kk" },
            { label: "Tidak Ada Akta Kelahiran", value: "tidak ada akta kelahiran" },
            { label: "Tidak Ada Ijazah", value: "tidak ada ijazah" }
        ],
        // Sudah
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIUP", value: "niup" },
            { label: "Angkatan", value: "angkatan" },
            { label: "Jenis Kelamin", value: "jenis kelamin" },
            { label: "Tempat Lahir", value: "tempat lahir" }
        ],
        // Sudah
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" }
        ]
    }
    const filter6 ={
        // Sudah
        smartcard: [
            { label: "Smartcard", value: "" },
            { label: "Memiliki Smartcard", value: "memiliki smartcard" },
            { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
        ],
        // Sudah
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
        // kewaliasuhan: [
        //     { label: "Kewaliasuhan", value: "" },
        //     { label: "Wali Asuh / Anak Asuh", value: "waliasuh or anakasuh" },
        //     { label: "Non Kewaliasuhan", value: "non kewaliasuhan" }
        // ]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Pelajar</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara}/>
                    <Filters showFilters={showFilters} filterOptions={filterWilayah} onChange={handleFilterChangeWilayah} selectedFilters={selectedWilayah} />
                    <Filters showFilters={showFilters} filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter6} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataPelajar}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    totalFiltered={pelajar.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                />

                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                ) : (
                    viewMode === "list" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {loadingPelajar ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : pelajar.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                pelajar.map((student, index) => <PesertaItem key={index} student={student} />)
                            )}
                        </div>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 w-16">No.</th>
                                    <th className="border p-2">No. Induk Santri</th>
                                    <th className="border p-2">Nama</th>
                                    <th className="border p-2">Kamar</th>
                                    <th className="border p-2">Blok</th>
                                    <th className="border p-2">Wilayah</th>
                                    <th className="border p-2">Lembaga</th>
                                    <th className="border p-2">Kota Asal</th>
                                    <th className="border p-2">Angkatan</th>
                                    <th className="border p-2">Tgl Update Bio</th>
                                    <th className="border p-2">Tgl Input Bio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingPelajar ? (
                                    <tr>
                                        <td colSpan="9" className="text-center p-4">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : pelajar.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center p-4">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    pelajar.map((item, index) => (
                                        <tr key={item.id_pengajar || index} className="text-center">
                                            <td className="border p-2 w-16">{index + 1 || "-"}</td>
                                            <td className="border p-2">{item.nis || "-"}</td>
                                            <td className="border p-2">{item.nama || "-"}</td>
                                            <td className="border p-2">{item.kamar || "-"}</td>
                                            <td className="border p-2">{item.blok || "-"}</td>
                                            <td className="border p-2">{item.wilayah || "-"}</td>
                                            <td className="border p-2">{item.lembaga || "-"}</td>
                                            <td className="border p-2">{item.kota_asal || "-"}</td>
                                            <td className="border p-2">{item.angkatan || "-"}</td>
                                            <td className="border p-2">{item.tgl_update || "-"}</td>
                                            <td className="border p-2">{item.tgl_input || "-"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default Pelajar;
