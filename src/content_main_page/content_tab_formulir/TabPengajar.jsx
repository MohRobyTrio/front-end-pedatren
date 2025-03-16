import { useEffect, useState } from "react";

const TabPengajar = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch("https://api.example.com/pangkalan-lembaga") // Ganti dengan URL API yang benar
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Data tidak tersedia</p>;

    return (
        <div className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="font-bold text-xl">Pangkalan Lembaga</h1>
            <hr className="border-t border-gray-300 my-4" />
            <div className="mt-2 border-b pb-2">
                <h3 className="font-bold">{data.lembaga}</h3>
                <p className="text-gray-600">{data.status} | {data.jabatan} | {data.golongan}</p>
                <p className="text-gray-500">Sejak {data.tanggal_mulai} Sampai Sekarang</p>
            </div>
            
            <h2 className="font-semibold text-lg mt-4">Materi Ajar ({data.jam_mengajar} jam)</h2>
            <div className="mt-2 border-b pb-2">
                {data.materi.map((item, index) => (
                    <div key={index} className="mt-2">
                        <p className="font-bold">• {item.nama}</p>
                        <p className="text-gray-600">{item.jam} Jam @ {data.lembaga}</p>
                        <p className="text-gray-500">Sejak {item.tanggal_mulai} Sampai Sekarang</p>
                    </div>
                ))}
            </div>
            
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Tambah</button>
        </div>
    );
};

export default TabPengajar;
