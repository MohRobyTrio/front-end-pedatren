import { useState } from "react";
import useFetchPeserta from "../../hooks/useFetchPeserta";
import PesertaItem from "../../components/PesertaItem";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/filters";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PesertaDidik = () => {
    const { pesertaDidik, loading, error } = useFetchPeserta("https://355c-157-15-44-24.ngrok-free.app/api/v1/fe-peserta-didik");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

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

            {/* Pencarian & Total Data di Atas
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                totalData={filteredPeserta.length}
                toggleFilters={() => setShowFilters(!showFilters)}
            /> */}

            {/* Filter */}
            <Filters showFilters={showFilters} />

             {/* Pencarian & Total Data di Bawah */}
             <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                totalData={filteredPeserta.length}
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
    );
};

export default PesertaDidik;
