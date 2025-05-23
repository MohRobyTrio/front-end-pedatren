import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const renderStatus = (value) => {
    if (value === true || value === 1) return <FontAwesomeIcon icon={faCheck} className="text-green-600" />;
    // if (value === false || value === 0) return <FontAwesomeIcon icon={faTimes} className="text-red-600" />;
    if (value === false || value === 0 || value === null) return "";
    return "-";
};

const DetailKeluarga = ({ keluarga }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">NIK</th>
                    <th className="px-3 py-2 border-b">Nama</th>
                    <th className="px-3 py-2 border-b">Status Keluarga</th>
                    <th className="px-3 py-2 border-b">Sebagai Wali</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">

                {
                    keluarga.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        keluarga.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b">{item.nik || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.nama || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.status || item.status_keluarga || "-"}</td>
                                <td className="px-3 py-2 border-b">{renderStatus(item.wali || item.sebagai_wali || item["sebagai wali"])}</td>
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>

);

export default DetailKeluarga;