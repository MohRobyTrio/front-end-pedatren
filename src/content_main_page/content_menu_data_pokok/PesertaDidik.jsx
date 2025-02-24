import '@fortawesome/fontawesome-free/css/all.min.css';

const PesertaDidik = () => {
    return (
        // <div className="pr-6 sm:ml-64 overflow-y-auto no-scrollbar w-full">
        //     <div className="pt-4 mt-8">
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Peserta Didik</h1>
                <div className="flex items-center">
                    {/* <img
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                        height={40}
                        src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                        width={40}
                    /> */}
                    {/* <div className="ml-2">
                        <p className="text-gray-700">Nahrawi</p>
                        <p className="text-gray-500 text-sm">( supervisor )</p>
                    </div> */}
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
                    {/* <div className="flex flex-wrap justify-between w-full gap-1">
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Negara</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Wilayah</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Lembaga</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Provinsi</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Blok</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Jurusan</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Status</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Kabupaten</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Kamar</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Kelas</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Angkatan Pelajar</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Kecamatan</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Rombel</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Semua Angkatan Santri</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Warga Pesantren</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Smartcard</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Phone Number</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Urut Berdasarkan</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>Urut Secara</option>
                                </select>
                                <select className="border border-gray-300 rounded p-2 mb-2 w-full sm:w-1/2 lg:w-1/3">
                                    <option>25</option>
                                </select>
                            </div> */}
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
                        <select className="border border-gray-300 rounded p-2">
                            <option>25</option>
                        </select>
                    </div>

                    {/* <div className="flex items-center space-x-2">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">
                            Export
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded">
                            Statistik
                        </button>
                    </div> */}
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span>Total data 10213</span>
                    <input
                        className="border border-gray-300 rounded p-2"
                        placeholder="Cari Peserta Didik..."
                        type="text"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 listpesertadidik">
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <img
                            alt="Student Photo"
                            className="w-16 h-16 rounded-full"
                            height={50}
                            src="https://storage.googleapis.com/a1aa/image/xk3XTtOdy_7ZQDigxwY3GTe-mvNpC5hwmIOUCrln_nc.jpg"
                            width={50}
                        />
                        <div>
                            <h2 className="font-semibold">Edy Setyiawan</h2>
                            <p className="text-gray-600">NIUP: 122001165</p>
                            <p className="text-gray-600">UNUJA</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <img
                            alt="Student Photo"
                            className="w-16 h-16 rounded-full"
                            height={50}
                            src="https://storage.googleapis.com/a1aa/image/xk3XTtOdy_7ZQDigxwY3GTe-mvNpC5hwmIOUCrln_nc.jpg"
                            width={50}
                        />
                        <div>
                            <h2 className="font-semibold">Hidayatul Inayah</h2>
                            <p className="text-gray-600">NIUP: 1172020989</p>
                            <p className="text-gray-600">UNUJA</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <img
                            alt="Student Photo"
                            className="w-16 h-16 rounded-full"
                            height={50}
                            src="https://storage.googleapis.com/a1aa/image/xk3XTtOdy_7ZQDigxwY3GTe-mvNpC5hwmIOUCrln_nc.jpg"
                            width={50}
                        />
                        <div>
                            <h2 className="font-semibold">Ahla Hurinin Humaidah</h2>
                            <p className="text-gray-600">NIUP: 1220011685</p>
                            <p className="text-gray-600">SMA-NJ</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <img
                            alt="Student Photo"
                            className="w-16 h-16 rounded-full"
                            height={50}
                            src="https://storage.googleapis.com/a1aa/image/xk3XTtOdy_7ZQDigxwY3GTe-mvNpC5hwmIOUCrln_nc.jpg"
                            width={50}
                        />
                        <div>
                            <h2 className="font-semibold">Ahmad Lutfi Adilil Wara</h2>
                            <p className="text-gray-600">NIUP: 124202</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        //     </div>
        // </div>
    )
}

export default PesertaDidik;