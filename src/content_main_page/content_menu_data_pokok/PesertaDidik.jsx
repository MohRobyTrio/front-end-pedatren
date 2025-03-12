import { useState } from "react";
import useFetchPeserta from "../../hooks/useFetchPeserta";
import PesertaItem from "../../components/PesertaItem";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PesertaDidik = () => {
    const { pesertaDidik, loading, error } = useFetchPeserta("http://127.0.0.1:8000/api/v1/pesertaDidik?page=1");
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
        wargaPesantren: ["Warga Pesantren", "Santri Mukim", "Santri Non-Mukim"],
        smartcard: ["Smartcard", "Ada", "Tidak Ada"],
        phoneNumber: ["Phone Number", "Tersedia", "Tidak Tersedia"],
        urutBerdasarkan: ["Urut Berdasarkan", "Nama", "Tanggal Masuk", "Nomor Induk"],
        urutSecara: ["Urut Secara", "Ascending", "Descending"]
    };
    

    // Filter peserta berdasarkan pencarian
    const filteredPeserta = pesertaDidik.filter((student) =>
        student.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Peserta Didik</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer">Statistik</button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Pencarian & Total Data di Atas
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                totalData={filteredPeserta.length}
                toggleFilters={() => setShowFilters(!showFilters)}
            /> */}
            

                {/* Filter */}
                <Filters showFilters={showFilters} filterOptions={filterOptions} />

                {/* Pencarian & Total Data di Bawah */}
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={filteredPeserta.length}
                    totalFiltered={0}
                    toggleFilters={() => setShowFilters(!showFilters)}

                />

                {/* List Peserta Didik */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 listpesertadidik">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : filteredPeserta.length === 0 ? (
                        <p>Tidak ada data peserta didik</p>
                    ) : (
                        filteredPeserta.map((student, index) => <PesertaItem key={index} student={student} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default PesertaDidik;
