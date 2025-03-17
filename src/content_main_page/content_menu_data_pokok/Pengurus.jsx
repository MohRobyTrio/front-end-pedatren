import { useState, useMemo } from "react";
import PengurusItem from "../../components/PengurusItem";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useFetchPengurus from "../../hooks/hooks_menu_data_pokok/Pengurus";

const Pengurus = () => {
    const { pengurus, loading, error } = useFetchPengurus();
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = {
        negara: ["Semua Negara", "Indonesia", "Malaysia", "Singapura", "Brunei", "Thailand"],
        wilayah: ["Semua Wilayah", "Wilayah Utara", "Wilayah Selatan", "Wilayah Timur", "Wilayah Barat"],
        lembaga: ["Semua Lembaga", "Madrasah", "Pesantren", "Universitas", "Sekolah"],
        provinsi: ["Semua Provinsi", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "DKI Jakarta"],
        blok: ["Semua Blok", "Blok A", "Blok B", "Blok C", "Blok D"],
        jurusan: ["Semua Jurusan", "IPA", "IPS", "Bahasa", "Agama", "Teknik"],
        status: ["Semua Status", "Aktif", "Tidak Aktif", "Alumni"],
        kabupaten: ["Semua Kabupaten", "Bandung", "Surabaya", "Semarang", "Medan"],
        kamar: ["Semua Kamar", "Kamar 101", "Kamar 102", "Kamar 103"],
        kelas: ["Semua Kelas", "Kelas 1", "Kelas 2", "Kelas 3"],
        angkatanPelajar: ["Semua Angkatan Pelajar", "2020", "2021", "2022", "2023"],
        kecamatan: ["Semua Kecamatan", "Kecamatan A", "Kecamatan B", "Kecamatan C"],
        rombel: ["Semua Rombel", "Rombel 1", "Rombel 2", "Rombel 3"],
        angkatanSantri: ["Semua Angkatan Santri", "2018", "2019", "2020", "2021"],
        wafat: ["Pilih Wafat/Hidup", "Wafat", "Hidup"],
        phoneNumber: ["Phone Number", "Tersedia", "Tidak Tersedia"],
        urutBerdasarkan: ["Urut Berdasarkan", "Nama", "Tanggal Masuk", "Nomor Induk"],
        urutSecara: ["Urut Secara", "Ascending", "Descending"]
    };

    const filteredPengurus = useMemo(() => {
        return (pengurus || []).filter((pengurus) =>
            pengurus.nama?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [pengurus, searchTerm]);

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Pengurus</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <Filters showFilters={showFilters} filterOptions={filterOptions} />
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={filteredPengurus.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                />

                {loading ? (
                    <div className="flex justify-center">
                        <i className="fas fa-spinner fa-spin text-2xl text-gray-500"></i>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center">
                        <p>{error}</p>
                        <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded" onClick={() => window.location.reload()}>
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3">
                        {filteredPengurus.length ? filteredPengurus.map((pengurus, index) => <PengurusItem key={index} pengurus={pengurus} />) : <p className="text-gray-500">Tidak ada data pengurus.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pengurus;