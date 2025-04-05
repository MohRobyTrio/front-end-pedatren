// const GroupKewaliasuhan = () => {
//     return (
//         <div className="flex-1 pl-6 pt-6 pb-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-2xl font-bold">Group Kewaliasuhan</h1>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="flex flex-wrap items-center mb-4">
//                     Edit disini
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default GroupKewaliasuhan;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faFilter,
    faFileExport,
} from "@fortawesome/free-solid-svg-icons";

const GroupKewaliasuhan = () => {
    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Group Kewaliasuhan</h1>
                <div className="space-x-2 flex flex-wrap">
                    <button className="border border-gray-400 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-100 cursor-pointer">Export</button>
                </div>
            </div>

            {/* Container */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Filter Section */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <select className="border border-gray-300 rounded px-4 py-2 text-sm">
                        <option>Semua Wilayah</option>
                    </select>

                    <select className="border border-gray-300 rounded px-4 py-2 text-sm">
                        <option>Pilih Jenis Kelamin</option>
                    </select>

                    <select className="border border-gray-300 rounded px-4 py-2 text-sm">
                        <option>Semua Jenis Group</option>
                    </select>

                    <div className="flex items-center gap-2 ml-auto">
                        <input
                            type="text"
                            placeholder="Cari Group / Wali Asuh"
                            className="border border-gray-300 rounded px-4 py-2 text-sm w-64"
                        />
                        <button className="px-3 py-2 bg-gray-100 rounded border hover:bg-gray-200">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        <button className="px-3 py-2 bg-gray-100 rounded border hover:bg-gray-200">
                            <FontAwesomeIcon icon={faFilter} />
                        </button>
                    </div>
                </div>

                {/* Data Summary */}
                <div className="flex justify-between items-center mb-4">
                    <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                    <p className="text-sm text-gray-600">Total data 607</p>
                </div>

                {/* Table */}
                <div className="overflow-auto">
                    <table className="min-w-full border text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="border px-4 py-2">#</th>
                                <th className="border px-4 py-2">Group</th>
                                <th className="border px-4 py-2">NIS Wali Asuh</th>
                                <th className="border px-4 py-2">Nama Wali Asuh</th>
                                <th className="border px-4 py-2">Wilayah</th>
                                <th className="border px-4 py-2">Jum. Anak Asuh</th>
                                <th className="border px-4 py-2">Tgl Update Group</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Contoh baris statis, bisa diganti dengan mapping data dari API */}
                            <tr className="hover:bg-gray-50">
                                <td className="border px-4 py-2">1</td>
                                <td className="border px-4 py-2">Princeton</td>
                                <td className="border px-4 py-2">1720502772</td>
                                <td className="border px-4 py-2">Muhammad Nizar</td>
                                <td className="border px-4 py-2">Wilayah Syekh Jumadil Kubro (01)</td>
                                <td className="border px-4 py-2">10 Anak</td>
                                <td className="border px-4 py-2">2 Jan 2019 13:10</td>
                            </tr>
                            {/* Tambahkan baris lain atau buat dynamic dari API */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GroupKewaliasuhan;
