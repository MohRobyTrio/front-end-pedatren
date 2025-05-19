const DetailPengajar = ({ pengajar }) => (
    <div>
        <h1 className="font-bold text-lg mb-2">Pangkalan Lembaga</h1>

        <div className="pl-2 border-l-2 border-gray-400 mb-6">
            <p className="font-bold text-md text-gray-600">{pengajar?.Pangkalan?.[0]?.lembaga}</p>
            <p className="text-sm text-gray-600"><span className="capitalize">{pengajar?.Pangkalan?.[0]?.pekerjaan_kontrak}</span> | {pengajar?.Pangkalan?.[0]?.kategori_golongan} | {pengajar?.Pangkalan?.[0]?.nama_golongan}</p>

            <div className="text-sm">
                <div className="flex text-gray-600">
                    <span className="w-10">Sejak</span>
                    <span>: {pengajar?.Pangkalan?.[0]?.sejak}</span>
                </div>
                <div className="flex text-gray-600">
                    <span className="w-19">Masa Kerja</span>
                    <span>: {pengajar?.Pangkalan?.[0]?.masa_kerja}</span>
                </div>
            </div>
        </div>

        <h1 className="text-lg font-bold mb-2">Materi Ajar</h1>

        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                    <tr>
                        <th className="px-3 py-2 border-b">#</th>
                        <th className="px-3 py-2 border-b">Lembaga</th>
                        <th className="px-3 py-2 border-b">Materi</th>
                        <th className="px-3 py-2 border-b">Tanggal Mulai</th>
                        <th className="px-3 py-2 border-b">Tanggal Akhir</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800">

                    {
                        pengajar?.Materi_Ajar?.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-6">Tidak ada data</td>
                            </tr>
                        ) : (
                            pengajar?.Materi_Ajar?.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-center text-left">
                                    <td className="px-3 py-2 border-b">{index + 1}</td>
                                    <td className="px-3 py-2 border-b">{item.lembaga || "-"}</td>
                                    <td className="px-3 py-2 border-b">{item.daftar_materi || "-"}</td>
                                    <td className="px-3 py-2 border-b">{item.tanggal_mulai || "-"}</td>
                                    <td className="px-3 py-2 border-b">{item.tanggal_akhir || "-"}</td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    </div>
);

export default DetailPengajar;