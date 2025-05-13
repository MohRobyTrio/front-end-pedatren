import { useState } from "react";

const DetailStatusSantri = ({ statusSantri }) => {
    const [activeTab, setActiveTab] = useState("kewaliasuhan");

    const tabs = [
        statusSantri?.Kewaliasuhan?.length > 0 && {
            id: "kewaliasuhan",
            label: "Kewaliasuhan",
            content: (
                statusSantri?.Kewaliasuhan.map((item, index) => (
                    <div key={`${item.id} - ${index}`} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer">
                        <div className="flex-1">
                            <p className="font-bold text-gray-400 border-b w-full pb-2">Group Kewaliasuhan: {item.group || "-"}</p>
                            <p className="text-gray-600 pt-2"><strong>Sebagai: </strong>{item.sebagai || "-"}</p>
                            <p className="text-gray-600"><strong>Nama Wali Asuh: </strong>{item["Nama Wali Asuh"] || "-"}</p>

                        </div>
                    </div>
                )))
        },
        statusSantri?.Info_Perizinan?.length > 0 && {
            id: "info_perizinan",
            label: "Info Perizinan",
            content: (
                statusSantri?.Info_Perizinan.map((item, index) => (
                    <div key={`${item.id} - ${index}`} className="bg-white p-6 rounded-lg shadow-md cursor-pointer">
                        <div className="flex flex-col md:flex-row justify-between md:items-start space-y-2 md:space-y-0">
                            <div>
                                <p className="text-gray-600">{item.tanggal || "-"}</p>
                                <p className="font-semibold">{item.keterangan || "-"}</p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-gray-600">{item.lama_waktu || "-"}</p>
                                <p className="text-gray-600 italic">{item.status || "-"}</p>
                            </div>
                        </div>
                    </div>
                ))
            )
        }
    ].filter(Boolean);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                        <tr>
                            <th className="px-3 py-2 border-b">#</th>
                            <th className="px-3 py-2 border-b">NIS</th>
                            <th className="px-3 py-2 border-b">Tanggal Mulai</th>
                            <th className="px-3 py-2 border-b">Tanggal Akhir</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {
                            statusSantri?.Santri?.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-6">Tidak ada data</td>
                                </tr>
                            ) : (
                                statusSantri?.Santri.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                        <td className="px-3 py-2 border-b">{index + 1}</td>
                                        <td className="px-3 py-2 border-b">{item.NIS || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.Tanggal_Mulai || "-"}</td>
                                        <td className="px-3 py-2 border-b">{item.Tanggal_Akhir || "-"}</td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </div>

            {tabs.length > 0 && (
                <>
                    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-500 mt-4">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`inline-block p-3 rounded-t-lg border-b-2 ${activeTab === tab.id
                                        ? "text-blue-600 border-blue-600 bg-gray-200"
                                        : "border-transparent hover:text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4">
                        {tabs.find((tab) => tab.id === activeTab)?.content}
                    </div>
                </>
            )}
        </div>
    );
};

export default DetailStatusSantri;
