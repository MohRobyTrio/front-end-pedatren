const DetailPendidikan = ({ pendidikan }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                <tr>
                    <th className="px-3 py-2 border-b">#</th>
                    <th className="px-3 py-2 border-b">No. Induk</th>
                    <th className="px-3 py-2 border-b">Nama Lembaga</th>
                    <th className="px-3 py-2 border-b">Jurusan</th>
                    <th className="px-3 py-2 border-b">Kelas</th>
                    <th className="px-3 py-2 border-b">Rombel</th>
                    <th className="px-3 py-2 border-b">Tahun Masuk</th>
                    <th className="px-3 py-2 border-b">Tahun Lulus</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">
                {
                    pendidikan.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                        </tr>
                    ) : (
                        pendidikan.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                <td className="px-3 py-2 border-b">{index + 1}</td>
                                <td className="px-3 py-2 border-b">{item.no_induk || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.nama_lembaga || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.nama_jurusan || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.nama_kelas || "-"}</td>
                                <td className="px-3 py-2 border-b capitalize">{item.nama_rombel || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tahun_masuk || "-"}</td>
                                <td className="px-3 py-2 border-b">{item.tahun_lul || "-"}</td>
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    </div>
);

export default DetailPendidikan;