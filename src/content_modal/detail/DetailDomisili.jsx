const DetailDomisili = ({ domisili }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">Kamar</th>
                    <th className="px-3 py-2 border-b">Blok</th>
                    <th className="px-3 py-2 border-b">Wilayah</th>
                    <th className="px-3 py-2 border-b">Tanggal Ditempati</th>
                    <th className="px-3 py-2 border-b">Tanggal Pindah</th>
                    <th className="px-3 py-2 border-b">Status</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">
                {
                    domisili.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        domisili.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.kamar || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.blok || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.wilayah || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tanggal_ditempati || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tanggal_pindah || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.status || "-"}</td>
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>
);

export default DetailDomisili;