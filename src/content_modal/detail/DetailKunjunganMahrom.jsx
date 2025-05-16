const DetailKunjunganMahrom = ({ kunjunganMahrom }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">Nama</th>
                    <th className="px-3 py-2 border-b">Tanggal</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">
                {
                    kunjunganMahrom.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        kunjunganMahrom.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                 <td className="px-3 py-2 border-b capitalize">
                                    <span className="font-semibold">{item.nama_pengunjung || "-"}</span>
                                    {item.status ? <span className="text-gray-500"> ({item.status})</span> : ""}
                                </td>
                                <td className="px-3 py-2 border-b capitalize">{item.tanggal_kunjungan || "-"}</td>
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>
);

export default DetailKunjunganMahrom;