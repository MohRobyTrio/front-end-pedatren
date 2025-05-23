import { useEffect, useMemo, useState } from "react";
import useFetchKognitif from "../../hooks/hook_menu_kepesantrenan/catatan_kognitif"; 
import SantriAfektifCard from "../../components/catatanCard";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../components/Pagination";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";

const CatatanKognitif = () => {
    const [filters, setFilters] = useState({
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        jenisKelamin: "",
        kategori: "",
        nilai: ""
    });

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();

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
        rombel: rombelTerpilih,
    }), [
        filters,
        negaraTerpilih, provinsiTerpilih, kabupatenTerpilih, kecamatanTerpilih,
        wilayahTerpilih, blokTerpilih, kamarTerpilih,
        lembagaTerpilih, jurusanTerpilih, kelasTerpilih, rombelTerpilih
    ]);

    const [page, setPage] = useState(1);

    const {
        groupedData,
        loading,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        fetchData
    } = useFetchKognitif(filters);

    const [showFilters, setShowFilters] = useState(false);

    //Fetch data saat filter/page berubah
    useEffect(() => {
        fetchData(updatedFilters, filters, page);
    }, [updatedFilters, filters, page, fetchData]);

    //debuging
    useEffect(() => {
        console.log('Updated Filters:', updatedFilters);
        console.log('Filters:', filters);
        fetchData(updatedFilters, page);
    }, [updatedFilters, page, fetchData]);

    // useEffect(() => {
    //     fetchData(updatedFilters);
    // }, [fetchData, updatedFilters]);

    const filter3 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        kategori: [
            { label: "Semua Materi", value: "" },
            { label: "Kebahasaan", value: "kebahasaan" },
            { label: "Baca kitab kuning", value: "baca kitab kuning" },
            { label: "Hafalan / Tahfidz", value: "hafalan tahfidz" },
            { label: "Furudhul Ainiyah", value: "furudul ainiyah" },
            { label: "Tulis Al-Quran", value: "tulis al-quran" },
            { label: "Baca Al-Quran", value: "baca al-quran" }
        ],
        nilai: [
            { label: "Semua Score", value: "" },
            { label: "Score A", value: "a" },
            { label: "Score B", value: "B" },
            { label: "Score C", value: "C" },
            { label: "Score D", value: "D" },
            { label: "Score E", value: "E" }
        ]
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold mb-6">Catatan Kognitif</h1>
                <div className="space-x-2 flex flex-wrap">
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Wali Asuh Tidak Menginput</button>
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Statistik</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterNegara}
                        onChange={handleFilterChangeNegara}
                        selectedFilters={selectedNegara}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterWilayah}
                        onChange={handleFilterChangeWilayah}
                        selectedFilters={selectedWilayah}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterLembaga}
                        onChange={handleFilterChangeLembaga}
                        selectedFilters={selectedLembaga}
                    />
                    <Filters 
                        showFilters={showFilters}
                        filterOptions={filter3}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />

                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    totalFiltered={groupedData.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    showViewButtons={false}
                // toggleView={setViewMode}
                />

                <div>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                            Error: {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {loading ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : Object.values(groupedData).length > 0 ? (
                            Object.values(groupedData).map(santri => (
                                <SantriAfektifCard key={santri.id_santri} santri={santri} />
                            ))
                        ) : (
                        <p className="text-center py-8 text-gray-500">Tidak ada data</p>
                        )}
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={setCurrentPage}
                    className="mt-6"
                />
            </div>

        </div>
    );
};

export default CatatanKognitif;