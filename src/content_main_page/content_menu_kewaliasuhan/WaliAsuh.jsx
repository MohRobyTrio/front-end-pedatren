import { useEffect, useMemo, useState } from "react";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import useFetchWaliAsuh from "../../hooks/hooks_menu_kewaliasuhan/WaliAsuh";
import Filters from "../../components/Filters";
import SearchBar from "../../components/SearchBar";
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png";
import Pagination from "../../components/Pagination";
import ModalDetail from "../../components/modal/ModalDetail";
import { generateDropdownTahun } from "../../utils/generateDropdownTahun";

const WaliAsuh = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };    
    const [filters, setFilters] = useState({
        phoneNumber: "",
        smartcard: "",
        jenisKelamin: "",
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        angkatan: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        wilayah: "",
        blok: "",
        kamar: "",
        jenisWaliAsuh: ""
    });

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const wilayahTerpilih = filterWilayah.wilayah.find(w => w.value == selectedWilayah.wilayah)?.label || "";
    const blokTerpilih = filterWilayah.blok.find(b => b.value == selectedWilayah.blok)?.label || "";
    const kamarTerpilih = filterWilayah.kamar.find(k => k.value == selectedWilayah.kamar)?.label || "";

    const lembagaTerpilih = filterLembaga.lembaga.find(l => l.value == selectedLembaga.lembaga)?.label || "";
    const jurusanTerpilih = filterLembaga.jurusan.find(j => j.value == selectedLembaga.jurusan)?.label || "";
    const kelasTerpilih = filterLembaga.kelas.find(k => k.value == selectedLembaga.kelas)?.label || "";
    const rombelTerpilih = filterLembaga.rombel.find(r => r.value == selectedLembaga.rombel)?.label || "";

    const customFilterWilayah = {
        ...filterWilayah,
        jenisWaliAsuh: [
            { value: "", label: "Semua Jenis Wali Asuh" },
            { value: "dengan_grup", label: "Memiliki group" },
            { value: "tanpa_grup", label: "Tanpa group" }
        ]
    };

    const customSelectedWilayah = {
        ...selectedWilayah,
        jenisWaliAsuh: selectedWilayah.jenisWaliAsuh || ""
    };

    const handleFilterChangeWilayahDenganSub = (newFilters) => {
        handleFilterChangeWilayah(newFilters);
        if ("jenisWaliAsuh" in newFilters) {
            setFilters(prev => ({ ...prev, jenisWaliAsuh: newFilters.jenisWaliAsuh }));
        }
    };

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
    }), [filters, negaraTerpilih, provinsiTerpilih, kabupatenTerpilih, kecamatanTerpilih, wilayahTerpilih, blokTerpilih, kamarTerpilih, lembagaTerpilih, jurusanTerpilih, kelasTerpilih, rombelTerpilih]);

    const { waliAsuh, loadingWaliAsuh, searchTerm, setSearchTerm, error, limit, setLimit, totalDataWaliAsuh, totalPages, currentPage, setCurrentPage } = useFetchWaliAsuh(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState("");

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

    const filterJenisKelamin = {
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
        angkatan: generateDropdownTahun({
            placeholder: "Semua Angkatan",
            labelTemplate: "Tahun {year}"
        }),
    }

    const filter5 = {
        // Sudah
        wargaPesantren: [
            { label: "Warga Pesantren", value: "" },
            { label: "Memiliki NIUP", value: "memiliki niup" },
            { label: "Tanpa NIUP", value: "tanpa niup" }
        ],
        // Sudah
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIUP", value: "niup" },
            { label: "Jenis Kelamin", value: "jenis_kelamin" },
        ],
        // Sudah
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" }
        ]
    }

    const filterSmartcardPhone = {
        smartcard: [
            { label: "Smartcard", value: "" },
            { label: "Memiliki Smartcard", value: "memiliki smartcard" },
            { label: "Tidak Ada Smartcard", value: "tanpa smartcard" }
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" }
        ]
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Wali Asuh</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters showFilters={showFilters} filterOptions={filterNegara} onChange={handleFilterChangeNegara} selectedFilters={selectedNegara} />
                    <Filters showFilters={showFilters} filterOptions={customFilterWilayah} onChange={handleFilterChangeWilayahDenganSub} selectedFilters={customSelectedWilayah} />
                    <Filters showFilters={showFilters} filterOptions={filterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                    <Filters showFilters={showFilters} filterOptions={filterJenisKelamin} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filter5} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                    <Filters showFilters={showFilters} filterOptions={filterSmartcardPhone} onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))} selectedFilters={filters} />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataWaliAsuh}
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
                            {loadingWaliAsuh ? (
                                <div className="col-span-3 flex justify-center items-center">
                                    <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                </div>
                            ) : waliAsuh.length === 0 ? (
                                <p className="text-center col-span-3">Tidak ada data</p>
                            ) : (
                                waliAsuh.map((item, index) => (
                                    <div key={item.id || index} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer"  onClick={() => openModal(item)}>
                                        <img
                                            alt={item.nama || "-"}
                                            className="w-20 h-24 object-cover"
                                            src={item.foto_profil}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = blankProfile;
                                            }}
                                        />
                                        <div>
                                            <h2 className="font-semibold text-xl">{item.nama || "-"}</h2>
                                            <p className="text-gray-600">NIS : {item.nis || "-"}</p>
                                            <p className="text-gray-600">
                                                Angkatan:{" "}
                                                {item.angkatan && item.angkatan !== "-" && item.kota_asal && item.kota_asal !== "-" ? (
                                                    <>
                                                        {item.angkatan} - {item.kota_asal}
                                                    </>
                                                ) : item.angkatan && item.angkatan !== "-" ? (
                                                    item.angkatan
                                                ) : item.kota_asal && item.kota_asal !== "-" ? (
                                                    item.kota_asal
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
                                        <th className="px-3 py-2 border-b">#</th>
                                        <th className="px-3 py-2 border-b">No. Induk Santri</th>
                                        <th className="px-3 py-2 border-b">Nama</th>
                                        <th className="px-3 py-2 border-b">Kamar</th>
                                        <th className="px-3 py-2 border-b">Blok</th>
                                        <th className="px-3 py-2 border-b">Wilayah</th>
                                        <th className="px-3 py-2 border-b">Kota Asal</th>
                                        <th className="px-3 py-2 border-b">Angkatan</th>
                                        <th className="px-3 py-2 border-b">Tgl Update WA</th>
                                        <th className="px-3 py-2 border-b">Tgl Input WA</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800 text-center">
                                    {loadingWaliAsuh ? (
                                        <tr>
                                            <td colSpan="10" className="py-6">
                                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                            </td>
                                        </tr>
                                    ) : waliAsuh.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="py-6">Tidak ada data</td>
                                        </tr>
                                    ) : (
                                        waliAsuh.map((item, index) => (
                                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-left cursor-pointer" onClick={() => openModal(item)}>
                                                <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nis || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kamar || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.blok || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.wilayah || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.kota_asal || "-"}</td>
                                                <td className="px-3 py-2 border-b">{item.angkatan || "-"}</td>
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

                {isModalOpen && (
                    <ModalDetail
                        title="Wali Asuh"
                        menu={14}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}

                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default WaliAsuh;
