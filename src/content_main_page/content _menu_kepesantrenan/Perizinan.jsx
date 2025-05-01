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
      <div className="bg-white rounded border border-gray-200 p-6 shadow-sm">
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
                  <span className="text-blue-500 font-medium">: {data.status_izin}</span>
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
              <div className="mt-2 text-gray-600">
                {data.keterangan}
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
                <span className="text-white">✓</span>
              </div>
              <span className="text-gray-700">Sedang proses izin</span>
            </div>

            <div className="flex items-center mr-6 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white mr-2">
                <span className="text-white">✓</span>
              </div>
              <span className="text-gray-700">Perizinan diterima</span>
            </div>

            <div className="flex items-center mr-6 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white mr-2">
                <span className="text-white">✓</span>
              </div>
              <span className="text-gray-700">Sudah berada di luar pondok</span>
            </div>

            <div className="flex items-center mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-400 mr-2">
              </div>
              <span className="text-gray-400">Kembali tepat waktu</span>
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