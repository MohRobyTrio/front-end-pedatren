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
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                            <tr>
                                <th className="px-3 py-2 border-b">#</th>
                                <th className="px-3 py-2 border-b">Group</th>
                                <th className="px-3 py-2 border-b">NIS Wali Asuh</th>
                                <th className="px-3 py-2 border-b">Nama Wali Asuh</th>
                                <th className="px-3 py-2 border-b">Wilayah</th>
                                <th className="px-3 py-2 border-b">Jum. Anak Asuh</th>
                                <th className="px-3 py-2 border-b">Tgl Update Group</th>
                                <th className="px-3 py-2 border-b">Tgl Input Group</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {/* Contoh baris statis */}
                            <tr className="hover:bg-gray-50 whitespace-nowrap">
                                <td className="px-3 py-2 border-b">1</td>
                                <td className="px-3 py-2 border-b">Princeton</td>
                                <td className="px-3 py-2 border-b">1720502772</td>
                                <td className="px-3 py-2 border-b">Muhammad Nizar</td>
                                <td className="px-3 py-2 border-b">Wilayah Syekh Jumadil Kubro (01)</td>
                                <td className="px-3 py-2 border-b">10 Anak</td>
                                <td className="px-3 py-2 border-b">2 Jan 2019 13:10</td>
                                <td className="px-3 py-2 border-b">1 Jan 2019 13:11</td>
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
