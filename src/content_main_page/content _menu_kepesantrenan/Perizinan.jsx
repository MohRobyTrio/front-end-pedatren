import { useEffect, useState } from "react";
import useFetchPerizinan from "../../hooks/hook_menu_kepesantrenan/Perizinan";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png";
import Pagination from "../../components/Pagination";


const DataPerizinan = () => {
  const [filters, setFilters] = useState({
    alasan_izin: '',
    status: ''
  });

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
  } = useFetchPerizinan();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Data Perizinan</h1>
        <div className="space-x-2 flex flex-wrap">
          <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">
            Export Data
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
            }}
          />
        )}

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalData={totalData}
          limit={limit}
          toggleLimit={(e) => setLimit(Number(e.target.value))}
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
                {data.map(perizinan => (
                  <PerizinanCard key={perizinan.id} data={perizinan} />
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">Tidak ada data perizinan</p>
            )}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          className="mt-6"
        />
      </div>
    </div>
  );
};

// Komponen Card untuk Perizinan
const PerizinanCard = ({ data }) => {
  // const [checkedItems, setCheckedItems] = useState({
  //   diterima: data.status === 'Diterima',
  //   diluar: data.status === 'Sudah berada di luar pondok',
  //   kembali: data.status === 'Kembali tepat waktu'
  // });

  // const handleCheckboxChange = (item) => {
  //   setCheckedItems(prev => ({
  //     ...prev,
  //     [item]: !prev[item]
  //   }));
  // };

  return (
    <div key={data.id} className="max-w-6xl mx-auto">
      <div className="bg-gray-100 rounded border border-gray-200 p-6 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row">
          {/* Left Section - Student Photo */}
          <div className="md:w-1/5 mb-4 md:mb-0">
            <img
              src={data.foto_profil || blankProfile}
              alt={data.nama_santri}
              className="w-32 h-40 object-cover border border-gray-300 bg-gray-400"
            />
          </div>

          {/* Middle Section - Student Details */}
          <div className="md:w-2/5">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mr-2">{data.nama_santri}</h2>
              <span className="text-blue-800">{data.jenis_kelamin === 'p' ? '♀' : '♂'}</span>
            </div>

            <div className="space-y-2">
              <div className="flex">
                <div className="w-24 text-gray-700">Domisili</div>
                <div className="flex-1">
                  <span className="text-gray-600">: {data.kamar} - {data.blok} - {data.wilayah}</span>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-700">Lembaga</div>
                <div className="flex-1">
                  <span className="text-gray-600">: {data.lembaga}</span>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-700">Alamat</div>
                <div className="flex-1">
                  <span className="text-gray-600">: {data.kecamatan} - Kab. {data.kabupaten}, {data.provinsi}</span>
                </div>
              </div>

              <div className="flex mt-6">
                <div className="w-24 font-medium text-gray-800">Alasan Izin</div>
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">: {data.alasan_izin}</span>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-700">Alamat Tujuan</div>
                <div className="flex-1">
                  <span className="text-gray-600">: {data.alamat_tujuan}</span>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-700">Lama Izin</div>
                <div className="flex-1">
                  <div className="text-gray-600">: Sejak <span className="ml-8">{data.tanggal_mulai}</span></div>
                  <div className="text-gray-600">&nbsp;&nbsp;Sampai <span className="ml-4">{data.tanggal_akhir}</span></div>
                  <div className="text-gray-600">&nbsp;&nbsp;( {data.bermalam} | {data.lama_izin} )</div>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-700">Jenis Izin</div>
                <div className="flex-1">
                  <span className="text-gray-600">: {data.jenis_izin}</span>
                </div>
              </div>

              <div className="flex">
                <div className="w-24 text-gray-700">Status</div>
                <div className="flex-1">
                  <span className={`font-medium ${data.status === 'telat(sudah kembali)'
                    ? 'text-red-600'
                    : data.status === 'telat(belum kembali)'
                      ? 'text-red-600'
                      : 'text-blue-600'
                    }`}>
                    : {data.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Permission Details */}
          <div className="md:w-2/5 md:pl-6  border-gray-200 mt-6 md:mt-0">
            <div className="space-y-3">
              <div className="flex">
                <div className="w-32 text-gray-700">Pembuat Izin</div>
                <div className="flex-1">
                  <span className="text-gray-600">: {data.pembuat}</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-gray-700">Biktren</div>
                <div className="flex-1 flex items-center">
                  <span className="text-gray-600">: {data.nama_biktren}</span>
                  {/* <span className="text-green-500 ml-2">✓</span> */}
                </div>
              </div>

              <div className="flex">
                <div className="w-32 text-gray-700">Pengasuh</div>
                <div className="flex-1">
                  <span className="text-gray-600">: {data.nama_pengasuh}</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-32 text-gray-700">Kamtib</div>
                <div className="flex-1 flex items-center">
                  <span className="text-gray-600">: {data.nama_kamtib}</span>
                  {/* <span className="text-green-500 ml-2">✓</span> */}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-gray-700 font-medium">Keterangan:</div>
              <div className="mt-1 text-gray-600">
                {data.keterangan}
              </div>
            </div>

            <div className="mt-2">
              <div className="text-gray-700 font-medium">{(data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)") ? 'Sudah berada di Pondok :' : ''}</div>
              <div className="mt-1 font-medium text-blue-800">
                {data.tanggal_kembali}
              </div>
            </div>

            {/* QR Code */}
            {/* <div className="mt-4 flex justify-center">
              <div className="relative">
                <img
                  src="/api/placeholder/160/160"
                  alt="QR Code"
                  className="w-40 h-40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-full p-1 shadow-md">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-lg">J</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Status Steps */}
        <div className="mt-8 border-t pt-4">
          <div className="flex flex-wrap items-center">
            <div className="flex items-center mr-6 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">Sedang proses izin</span>
            </div>

            <div className="flex items-center mr-6 mb-2">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
            ${(data.status !== "sedang proses izin" || data.status !== "perizinan ditolak" || data.status !== "dibatalkan" )
                  ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-400 text-gray-400'}`}>
                {(data.status === "sudah berada diluar pondok" || data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)") && (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-700">{data.status === "dibatalkan" ? "Perizinan dibatalkan" : data.status === "perizinan ditolak" ? "Perizinan ditolak" : " Perizinan diterima"}</span>
            </div>

            <div className="flex items-center mr-6 mb-2">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
            ${(data.status === "sudah berada diluar pondok" || data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)")
                  ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-400 text-gray-400'}`}>
                {(data.status === "sudah berada diluar pondok" || data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)") && (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-700">Sudah berada di luar pondok</span>
            </div>

            <div className="flex items-center mb-2">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
            ${data.status === "kembali tepat waktu"
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : data.status === "telat(belum kembali)"
                    ? 'border-red-500 bg-red-500 text-white'
                      : data.status === "telat(sudah kembali)"
                      ? 'border-red-500 bg-red-500 text-white'
                       : 'border-gray-400 text-gray-400'}`}>
                {data.status === "telat(belum kembali)"
                  ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  : data.status === "kembali tepat waktu" && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                }{
                  data.status === "telat(sudah kembali)" && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                }
              </div> 
              <span className="text-gray-700">{data.status === "telat(belum kembali)" ? " Telat" : data.status === "telat(sudah kembali)" ? " Telat" : " Kembali tepat waktu"}</span>
            </div>
          </div>

          <div className="text-right text-gray-500 text-sm mt-2">
            <div>Tgl dibuat : {data.tgl_input}</div>
            <div>Tgl diubah : {data.tgl_update}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPerizinan;