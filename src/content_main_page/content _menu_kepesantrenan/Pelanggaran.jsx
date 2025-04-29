import { useEffect, useState } from "react";
import useFetchPelanggaran from "../../hooks/hook_menu_kepesantrenan/pelanggaran";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../components/Pagination";

const DataPelanggaran = () => {
    const [filters, setFilters] = useState({
        provinsi: '',
        jenis_pelanggaran: '',
        status_pelanggaran: ''
    });
    const [page, setPage] = useState(1);

    const {
        data,
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
        fetchData,
        filterOptions
    } = useFetchPelanggaran();

    const [showFilters, setShowFilters] = useState(false);

    // Fetch data saat filter/page berubah
    useEffect(() => {
        fetchData(filters);
    }, [filters, page, fetchData]);

    return (
        <div className="flex-1 p-6">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Data Pelanggaran</h1>
                <div className="space-x-2 flex flex-wrap">
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
                        Export Data
                    </button>
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
                        Statistik
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {showFilters && (
                    <Filters
                        filters={filters}
                        filterOptions={filterOptions}
                        onChange={(newFilters) => {
                            setFilters(newFilters);
                            setPage(1);
                        }}
                    />
                )}

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    totalFiltered={data.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    showViewButtons={false}
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
                        ) : data.length > 0 ? (
                            <div className="">
                                {data.map(pelanggaran => (
                                    <PelanggaranCard key={pelanggaran.id} data={pelanggaran} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-500">Tidak ada data pelanggaran</p>
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

// Komponen Card untuk Pelanggaran
const PelanggaranCard = ({ data }) => {
    return (
        <div key={data.id} className="flex flex-wrap p-4 rounded-lg shadow-sm gap-4 items-center bg-white mb-4">
            {/* Foto Santri */}
            <div className="w-24 h-24 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                {data.foto_profil ? (
                    <img src={data.foto_profil} alt={data.nama_santri} className="w-full h-full object-cover" />
                ) : (
                    <i className="fas fa-user text-gray-400 text-4xl"></i>
                )}
            </div>

            {/* Info Santri */}
            <div className="flex-1 space-y-2 min-w-[200px]">
                <h2 className="text-lg font-semibold">{data.nama_santri}</h2>
                <div className="flex">
                    <div className="w-24 text-black-700">Domisili</div>
                    <div className="flex-1">
                        <span className="text-black-600">: {data.wilayah} - {data.blok} {data.kamar}</span>
                    </div>
                </div>

                <div className="flex">
                    <div className="w-24 text-black-700">Pendidikan</div>
                    <div className="flex-1">
                        <span className="text-black-600">: {data.lembaga}</span>
                    </div>
                </div>

                <div className="flex">
                    <div className="w-24 text-black-700">Alamat</div>
                    <div className="flex-1">
                        <span className="text-black-600">: {data.kabupaten}, {data.provinsi}</span>
                    </div>
                </div>

                <br />

                <div className="flex">
                    <div className="w-24 text-black-700">Pencatat</div>
                    <div className="flex-1">
                        <span className="text-black-600">: ({data.pencatat})</span>
                    </div>
                </div>
            </div>

            {/* Detail Pelanggaran */}
            <div className="mt-6 md:mt-0 md:pl-8 md:w-1/2">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Pelanggaran</h2>

                <div className="space-y-2">
                    <div className="flex">
                        <div className="w-40 text-black-700">Kategori</div>
                        <div className="flex-1">
                            <span className={`text-black-600 ${data.jenis_pelanggaran === 'Berat'
                                    ? 'text-red-600'
                                    : data.jenis_pelanggaran === 'Sedang'
                                        ? 'text-orange-600'
                                        : 'text-yellow-600'
                                }`}>
                                : {data.jenis_pelanggaran}
                            </span>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="w-40 text-black-700">Diproses Mahkamah</div>
                        <div className="flex-1 flex items-center">
                            <span className="text-black-600">: {data.diproses_mahkamah ? 'Ya ✅' : 'Tidak ❌'}</span>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="w-40 text-black-700">Status</div>
                        <div className="flex-1">
                        <span className={`text-black-600 font-medium ${
                        data.status_pelanggaran === 'Sudah diproses' 
                            ? 'text-green-600' 
                            : data.status_pelanggaran === 'Sedang diproses'
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                    }`}>
                        : {data.status_pelanggaran}
                    </span>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="w-40 text-black-700">Jenis</div>
                        <div className="flex-1">
                            <span className="text-black-600">: {data.keterangan}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-right text-gray-500 text-sm">
                    {data.tgl_input}
                </div>
            </div>
            {/* <div className="flex-1 space-y-2 min-w-[200px]">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Pelanggaran</h2>
                <div className="flex gap-2 items-center">
                    <p className="font-semibold">Kategori: </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        data.jenis_pelanggaran === 'Berat' 
                            ? 'bg-red-100 text-red-800' 
                            : data.jenis_pelanggaran === 'Sedang'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {data.jenis_pelanggaran}
                    </span>
                </div>

                <div className="flex gap-2 items-center">
                    <p className="font-semibold">Putusan:</p>
                    <p className="text-sm">{data.jenis_putusan}</p>
                </div>
                
                <div className="flex gap-2 items-center">
                    <p className="font-semibold">Status:</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        data.status_pelanggaran === 'Selesai' 
                            ? 'bg-green-100 text-green-800' 
                            : data.status_pelanggaran === 'Sedang diproses'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        {data.status_pelanggaran}
                    </span>
                </div>
                <div className="flex gap-2 items-center">
                    <p className="text-sm">Keteragan    :{data.keterangan}</p>
                </div>
                
                
            </div> */}

            {/* Pencatat */}
            {/* <div className="text-center space-y-2 flex flex-col items-center min-w-[120px]">
                <p className="text-xs text-gray-500">{data.tgl_input}</p>
            </div> */}
        </div>
    );
};

export default DataPelanggaran;