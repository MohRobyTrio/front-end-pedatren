import '@fortawesome/fontawesome-free/css/all.min.css';
import useFetchPengajar from '../../logic/logic_menu_data_pokok/Pengajar';
import { OrbitProgress } from "react-loading-indicators";
import defaultProfile from '/src/assets/blank_profile.png';


const Pengajar = () => {
    const { pengajar, loading, searchTerm, setSearchTerm, totalData, totalFiltered } = useFetchPengajar();

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
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
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Negara</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Wilayah</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Lembaga</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Provinsi</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Blok</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Jurusan</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Status</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Kabupaten</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Kamar</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Kelas</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Angkatan Pelajar</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Kecamatan</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Rombel</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Angkatan Santri</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Warga Pesantren</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Smartcard</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Phone Number</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Urut Berdasarkan</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Urut Secara</option>
                        </select>
                        {/* <select className="border border-gray-300 rounded p-2">
                            <option>25</option>
                        </select> */}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <select className="border border-gray-300 rounded p-2 mr-4">
                            <option>25</option>
                        </select>
                        <span>Total Data: {totalData || 0} | Ditemukan: {totalFiltered || 0}</span>
                    </div>
                    <input
                        className="border border-gray-300 rounded p-2"
                        placeholder="Cari Karyawan..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 listpesertadidik">
                    {loading ? (
                        <div className="col-span-3 flex justify-center items-center">
                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                        </div>
                    ) : pengajar.length === 0 ? (
                        <p className="text-center col-span-3">Tidak ada data</p>
                    ) : (
                        pengajar.map((item) => (
                            <div key={item.id_pengajar} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
                                <img
                                    alt={item.nama || "-"}
                                    className="w-20 h-24 object-cover"
                                    src={item.image_url || defaultProfile}
                                    width={50}
                                    height={50}
                                />
                                <div>
                                    <h2 className="font-semibold">{item.nama}</h2>
                                    <p className="text-gray-600">NIUP: {item.niup}</p>
                                    <p className="text-gray-600">{item.nama_pendidikan_terakhir}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <nav aria-label="Page navigation example" className="flex justify-end  mt-6">
                    <ul className="flex items-center -space-x-px h-10 text-sm">
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="sr-only">Previous</span>
                                <svg
                                    className="w-3 h-3 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 1 1 5l4 4"
                                    />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                1
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                2
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                aria-current="page"
                                className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                            >
                                3
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                4
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            >
                                5
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="sr-only">Next</span>
                                <svg
                                    className="w-3 h-3 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>

            </div>
        </div>
    )
}

export default Pengajar;