const DetailPengurus = ({ pengurus }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">Jabatan</th>
                    <th className="px-3 py-2 border-b">Tanggal Mulai</th>
                    <th className="px-3 py-2 border-b">Tanggal Akhir</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">

                {
                    pengurus.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        pengurus.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b">{item.keterangan_jabatan || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tanggal_mulai || "-"}</td>  
                                <td className="px-3 py-2 border-b">{item.tanggal_akhir || "-"}</td>  
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>

);

export default DetailPengurus;