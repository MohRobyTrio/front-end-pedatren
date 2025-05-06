import '@fortawesome/fontawesome-free/css/all.min.css';
import { OrbitProgress } from "react-loading-indicators";
import SearchBar from '../../components/SearchBar';
import { useEffect, useMemo, useState } from 'react';
import Filters from '../../components/Filters';
import useFetchPengajar from '../../hooks/hooks_menu_data_pokok/Pengajar';
import Pagination from '../../components/Pagination';
import DropdownNegara from '../../hooks/hook_dropdown/DropdownNegara';
import PesertaItem from '../../components/PesertaItem';
import DropdownGolongan from '../../hooks/hook_dropdown/DropdownGolongan';
import DropdownLembaga from '../../hooks/hook_dropdown/DropdownLembaga';


const Pengajar = () => {
    const [filters, setFilters] = useState({
        negara: "", 
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        kategori: "",
        golongan: "",
        lembaga: "",
        jenisJabatan: "",
        masaKerja: "",
        honeNumber: "",
        wargaPesantren: "",
        smartcard: "",
        pemberkasan: "",
        umur: "",
        totalMateriAjar: ""
    })

    const [selectedFilters, setSelectedFilters] = useState({
        kategori: "",
        golongan: "",
    });

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    // const { filterGolongan, selectedGolongan, handleFilterChangeGolongan } = DropdownGolongan();
    const { kategoriGolongan, filteredGolongan, setSelectedKategori } = DropdownGolongan();
    const { filterLembaga } = DropdownLembaga();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const kategoriTerpilih = selectedFilters.kategori
        ? kategoriGolongan.find(kt => kt.value == selectedFilters.kategori)?.label
        : undefined;
    const golonganTerpilih = selectedFilters.golongan
        ? filteredGolongan.find(g => g.value == selectedFilters.golongan)?.label
        : undefined;

    const lembagaTerpilih = filterLembaga.lembaga.find(l => l.value == filters.lembaga)?.label || "";

    const updatedFilters = useMemo(() => ({
        ...filters,
        negara: negaraTerpilih,
        provinsi: provinsiTerpilih,
        kabupaten: kabupatenTerpilih,
        kecamatan: kecamatanTerpilih,
        kategori: kategoriTerpilih,
        golongan: golonganTerpilih,
        lembaga: lembagaTerpilih
    }), [filters, golonganTerpilih, kabupatenTerpilih, kategoriTerpilih, kecamatanTerpilih, lembagaTerpilih, negaraTerpilih, provinsiTerpilih]);

    const { pengajar, loadingPengajar, searchTerm, setSearchTerm, totalDataPengajar, totalPages, totalFiltered, limit, setLimit, currentPage, setCurrentPage } = useFetchPengajar(updatedFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("list");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const handleFilterChange = (changed) => {
        const key = Object.keys(changed)[0];
        const value = Object.values(changed)[0];

        setSelectedFilters((prev) => {
            const updated = { ...prev, ...changed };

            if (key === "kategori") {
                setSelectedKategori(value); 
                updated["golongan"] = "";  
            }

            return updated;
        });

        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value, 
        }));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter2 = {
        lembaga: filterLembaga.lembaga,
        kategori: kategoriGolongan,
        golongan: filteredGolongan,
        totalMateriAjar: [
            { label: "Pilih Total Materi Ajar", value: ""},
            { label: "Kosong", value: "0"},
            { label: "1 Materi", value: "1"},
            { label: "Lebih dari 1 Materi", value: ">1"},
            { label: "2 Materi", value: "2"},
            { label: "Lebih dari 2 Materi", value: ">2"},
            { label: "3 Materi", value: "3"},
            { label: "Lebih dari 3 Materi", value: ">3"},
        ]
    }
    const filter3 = {
        // Sudah
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        // Sudah
        jenisJabatan: [
            { label: "Pilih Jenis jabatan", value: "" },
            { label: "Kultural", value: "kultural" },
            { label: "Tetap", value: "tetap" },
            { label: "Kontrak", value: "kontrak" },
            { label: "Pengkaderan", value: "pengkaderan" }
        ],
        masaKerja: [
            { label: "Pilih Masa Kerja", value: "" },
            { label: "< 1 Tahun", value: "1" },
            { label: "1-5 Tahun", value: "1-5" },
            { label: "6-10 Tahun", value: "6-10" },
            { label: "11-15 Tahun", value: "11-15" },
            { label: "16-20 Tahun", value: "16-20" },
            { label: "21-25 Tahun", value: "21-25" },
            { label: "26-30 Tahun", value: "26-30" },
            { label: "31-40 Tahun", value: "31-40" },
            { label: "> 40 Tahun", value: "40-200" }
        ]
    }

    const filter4 = {
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
        umur: [
            { label: "Semua Umur", value: "" },
            { label: "< 20 Tahun", value: "0-20" },
            { label: "20-29 Tahun", value: "20-29" },
            { label: "30-39 Tahun", value: "30-39" },
            { label: "40-49 Tahun", value: "40-49" },
            { label: "50-59 Tahun", value: "50-49" },
            { label: "60-65 Tahun", value: "60-65" },
            { label: "> 65 Tahun", value: "65-200" }
        ]
    }

    const filter5 = {
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
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 overflow-x-auto">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    {/* <Filters showFilters={showFilters} filterOptions={filterGolongan} onChange={handleFilterChangeGolongan} selectedFilters={selectedGolongan} /> */}
                    {/* <Filters showFilters={showFilters} filterOptions={filter2} onChange={(newFilters) => { setFilters((prev) => ({ ...prev, ...newFilters })); if (newFilters.kategori) setSelectedKategori(newFilters.kategori); }} selectedFilters={filters} /> */}
                    <Filters showFilters={showFilters} filterOptions={filter2} onChange={handleFilterChange} selectedFilters={selectedFilters} />
                    <Filters showFilters={showFilters} filterOptions={filter3} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter4} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataPengajar}
                    totalFiltered={totalFiltered}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    toggleView={setViewMode}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                />
                {viewMode === "list" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {loadingPengajar ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : pengajar.length === 0 ? (
                            <p className="text-center col-span-3">Tidak ada data</p>
                        ) : (
                            pengajar.map((student, index) => <PesertaItem key={index} student={student} />)
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                            <tr>
                                <th className="px-3 py-2 border-b">#</th>
                                <th className="px-3 py-2 border-b">NIUP</th>
                                <th className="px-3 py-2 border-b">Nama</th>
                                <th className="px-3 py-2 border-b">Umur</th>
                                <th className="px-3 py-2 border-b">Pangkalan Lembaga</th>
                                <th className="px-3 py-2 border-b">Materi Ajar</th>
                                <th className="px-3 py-2 border-b">Total Materi Ajar</th>
                                <th className="px-3 py-2 border-b">Masa Kerja</th>
                                <th className="px-3 py-2 border-b">Golonngan</th>
                                <th className="px-3 py-2 border-b">Pendidikan Terakhir</th>
                                <th className="px-3 py-2 border-b">Tgl Update Bio</th>
                                <th className="px-3 py-2 border-b">Tgl Input Bio</th>

                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {loadingPengajar ? (
                                <tr>
                                    <td colSpan="11" className="text-center p-4">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </td>
                                </tr>
                            ) : pengajar.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="text-center p-4">Tidak ada data</td>
                                </tr>
                            ) : (
                                pengajar.map((item, index) => (
                                    <tr key={item.id_pengajar || index} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                        <td className="px-3 py-2 border-b">{index + 1}</td>
                                        <td className="px-3 py-2 border-b">{item.niup || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.umur === 0 ? 0 : item.umur || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.lembaga || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.daftar_materi || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.total_materi === 0 ? 0 : item.total_materi || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.masa_kerja || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.golongan || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.pendidikan_terakhir || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.tgl_update || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.tgl_input || "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    )
}

export default Pengajar;