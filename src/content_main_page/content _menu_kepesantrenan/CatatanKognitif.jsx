import { FaFilter } from "react-icons/fa";

const CatatanKognitif = () => {
    
    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Catatan Kognitif</h1>
                <div className="space-x-2">
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Wali Asuh Tidak Menginput</button>
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Statistik</button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                    {[...Array(12)].map((_, i) => (
                        <select key={i} className="p-2 border rounded-md w-full">
                            <option>Filter {i + 1}</option>
                        </select>
                    ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span>25 Total data 426450</span>
                    <div className="flex items-center space-x-2">
                        <input type="text" placeholder="Cari Catatan .." className="p-2 border rounded-md" />
                        <button className="p-2 bg-green-500 text-white rounded-md flex items-center space-x-1">
                            <FaFilter />
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex p-4 border rounded-lg shadow-sm">
                            <img src="https://via.placeholder.com/100" alt="foto" className="w-24 h-24 rounded-md" />
                            <div className="ml-4 flex-1">
                                <h2 className="text-lg font-semibold">Bilqhis Madhania Faidah Putri</h2>
                                <p className="text-sm text-gray-600">Domisili: C.4 (Al-Mahdi) - Daerah Robi'ah Al-Adawiyah</p>
                                <p className="text-sm text-gray-600">Pendidikan: IPS Reguler - SMA-NJ</p>
                            </div>
                            <div>
                                <h2>Kebahasaan: <span className="text-green-600">[ B ]</span></h2>
                                <p className="text-sm">baik</p>
                                <p className="text-sm font-semibold">Tindak Lanjut:</p>
                                <p className="text-sm">Tingkatkan kebahasaan dengan baik dan benar.</p>
                            </div>
                            <div className="text-right">
                                <img src="https://via.placeholder.com/60" alt="wali asuh" className="w-16 h-16 rounded-full mx-auto" />
                                <p className="text-sm font-bold">Sitti Naiesa</p>
                                <p className="text-sm">(waliaush)</p>
                                <p className="text-xs text-gray-500">26 Nov 2024 14:42:51</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CatatanKognitif;
