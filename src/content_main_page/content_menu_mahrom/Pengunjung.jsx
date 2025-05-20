import { useState, useEffect } from 'react';
import { OrbitProgress } from "react-loading-indicators";

const useFetchPengunjung = (page, limit) => {
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/api/data-pokok/pengunjung?page=${page}&per_page=${limit}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(json => {
                setData(json.data || []);
                setTotalData(json.total_data || 0);
                setTotalPages(json.total_pages || 1);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to fetch');
                setLoading(false);
            });
    }, [page, limit]);

    return { data, totalData, totalPages, loading, error };
};

const Pengunjung = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(25);

    const { data, totalData, totalPages, loading, error } = useFetchPengunjung(currentPage, limit);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Pengunjung</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Export</button>
                </div>
            </div>
            {error && (
                <div className="mb-4 text-red-600">
                    Error: {error}
                </div>
            )}
            {loading ? (
                <div className="flex justify-center py-10">
                    <OrbitProgress variant="disc" color="#2a6999" size="small" />
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                <tr>
                                    <th className="px-3 py-2 border-b">#</th>
                                    <th className="px-3 py-2 border-b">Wilayah Mahrom</th>
                                    <th className="px-3 py-2 border-b">Nama Pengunjung</th>
                                    <th className="px-3 py-2 border-b">Santri Dikunjungi</th>
                                    <th className="px-3 py-2 border-b">Jumlah Rombongan</th>
                                    <th className="px-3 py-2 border-b">Tanggal Kunjungan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="text-center py-4">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    data.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                            <td className="px-3 py-2 border-b">{(currentPage - 1) * limit + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.wilayah}</td>
                                            <td className="px-3 py-2 border-b">
                                                <div>{item.nama_pengunjung}</div>
                                                <div className="text-gray-500 text-sm italic">({item.status})</div>
                                            </td>
                                            <td className="px-3 py-2 border-b">
                                                <div>{item.santri_dikunjungi}</div>
                                                <div className="text-gray-500 text-sm italic">{item.kamar} - {item.blok} - {item.wilayah} -
                                                    {item.lembaga}, {item.jurusan}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 border-b">{item.jumlah_rombongan}</td>
                                            <td className="px-3 py-2 border-b">{item.tanggal_kunjungan}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>Total Data: {totalData}</div>
                        <div className="space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                            >
                                Prev
                            </button>
                            <span>{currentPage} / {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Pengunjung;
