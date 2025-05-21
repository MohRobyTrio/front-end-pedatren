const DetailWaliKelas = ({ waliKelas }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">Lembaga</th>
                    <th className="px-3 py-2 border-b">Jurusan</th>
                    <th className="px-3 py-2 border-b">Kelas</th>
                    <th className="px-3 py-2 border-b">Rombel</th>
                    <th className="px-3 py-2 border-b">Periode Awal</th>
                    <th className="px-3 py-2 border-b">Periode Akhir</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">

                {
                    waliKelas.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        waliKelas.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b">{item.Lembaga || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.Jurusan || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.Kelas || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.Rombel || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.Periode_awal || "-"}</td>  
                                <td className="px-3 py-2 border-b">{item.Periode_akhir || "-"}</td>  
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>

);

export default DetailWaliKelas;