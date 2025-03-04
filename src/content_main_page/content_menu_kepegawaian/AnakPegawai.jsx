const AnakPegawai = () => {
    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Data Anak Pegawai</h1>
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
            <p className="text-red-500 text-sm italic">
                *Merupakan data pesertadidik yang sekaligus juga putra putri
                dari pegawai (pengurus/karyawan/pengajar)
            </p>
            <div className="bg-blue-100 p-3 rounded-md mt-2 w-full mb-4">
              Anak Pegawai
            </div>
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
                        <option>Pemberkasan</option>
                    </select>
                    <select className="border border-gray-300 rounded p-2">
                        <option>Pilih Jenis Kelamin</option>
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
                        <h2 className="font-semibold">Muhammad Arsyi rahmani</h2>
                        <p className="text-gray-600">NIUP: 22420720313</p>
                        <p className="text-gray-600">Paud Anak Sholeh</p>
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
                        <p className="text-gray-600">SMA-NJ</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default AnakPegawai;