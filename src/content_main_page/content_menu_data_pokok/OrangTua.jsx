import '@fortawesome/fontawesome-free/css/all.min.css';
import useFetchOrangTua from '../../logic/logic_menu_data_pokok/Orangtua';
import { OrbitProgress } from "react-loading-indicators";


const OrangTua = () => {
    const { orangtua, loading } = useFetchOrangTua();

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Orang Tua</h1>
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
                            <option>Semua Provinsi</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Kabupaten</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Semua Kecamatan</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Pilih Jenis Kelamin</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Pilih Jenis Kelamin Peserta Didik</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Pilih Orang Tuua Dari</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Pilih Wafat/Hidup</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Smartcard</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>Phone Number</option>
                        </select>
                        <select className="border border-gray-300 rounded p-2">
                            <option>25</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span>Total data 10213</span>
                    <input
                        className="border border-gray-300 rounded p-2"
                        placeholder="Cari Orang Tua..."
                        type="text"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 listpesertadidik">
                    {loading ? (
                        <div className="col-span-3 flex justify-center items-center">
                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                        </div>
                    ) : orangtua.length === 0 ? (
                        <p className="text-center col-span-3">Tidak ada data</p>
                    ) : (
                        orangtua.map((item) => (
                            <div key={item.id_pengajar} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                                <img
                                    alt={item.nama}
                                    className="w-16 h-16 rounded-full object-cover"
                                    src={item.image_url}
                                    width={50}
                                    height={50}
                                />
                                <div>
                                    <h2 className="font-semibold">{item.nama}</h2>
                                    <p className="text-gray-600">NIUP: {item.nik}</p>
                                    <p className="text-gray-600">{item.telepon}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrangTua;