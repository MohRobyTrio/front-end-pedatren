import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalAddSantriFormulir from "../../components/modal/modal_formulir/ModalFormAddSantri";

const TabKhadam = () => {
    const { biodata_id } = useParams();
    const [khadamList, setKhadamList] = useState([]);
    const [selectedKhadamId, setSelectedKhadamId] = useState(null);
    const [selectedKhadamDetail, setSelectedKhadamDetail] = useState(null);
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    // Ambil list Khadam
    useEffect(() => {
        const fetchKhadam = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/formulir/${biodata_id}/khadam`);
                const result = await response.json();
                setKhadamList(result.data || []);
            } catch (error) {
                console.error("Gagal mengambil data santri:", error);
            }
        };

        fetchKhadam();
    }, [biodata_id]);

    // Ambil detail saat card diklik
    const handleCardClick = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/formulir/${id}/khadam/show`);
            const result = await response.json();
            setSelectedKhadamId(id);
            setSelectedKhadamDetail(result.data);
            setEndDate(result.data.tanggal_keluar || "");
            setStartDate(result.data.tanggal_masuk || "");
        } catch (error) {
            console.error("Gagal mengambil detail santri:", error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedKhadamDetail) return;

        const payload = {
            nis: selectedKhadamDetail.nis,
            tanggal_masuk: startDate,
            tanggal_keluar: endDate || null,
            status: selectedKhadamDetail.status || null,
        };

        try {
            const response = await fetch(
                `http://localhost:8000/api/formulir/${selectedKhadamId}/santri`,
                {
                    method: "PUT", // Biasanya update pakai PUT
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            const result = await response.json();
            if (response.ok) {
                alert("Data berhasil diperbarui!");
                // Bisa reload data atau update state
                setSelectedKhadamDetail(result.data || payload);
                // Optional: update list jika perlu
            } else {
                alert("Gagal update: " + (result.message || "Terjadi kesalahan"));
            }
        } catch (error) {
            console.error("Error saat update:", error);
        }
    };

    // Fungsi untuk tutup modal tambah data
    const closeAddModal = () => {
        setShowAddModal(false);
    };

    // Fungsi untuk buka modal tambah data
    const openAddModal = () => {
        setShowAddModal(true);
    };

    return (
        <div className="block" id="khadam">
            <h1 className="text-xl font-bold flex items-center justify-between">Status Khadam
                <button
                    onClick={openAddModal}
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
                >
                    <i className="fas fa-plus"></i>
                    <span>Tambah Data</span>
                </button>
            </h1>

            {showAddModal && (
                <ModalAddSantriFormulir isOpen={showAddModal} onClose={closeAddModal} />
            )}
            
            <div className="mt-5 space-y-6">
                {khadamList.map((khadam) => (
                    <div key={khadam.id}>
                        {/* Card */}
                        <div
                            className="bg-white shadow-md rounded-lg p-6 cursor-pointer w-full flex justify-between items-center"
                            onClick={() => handleCardClick(khadam.id)}
                        >
                            <div>
                                <h5 className="text-lg font-bold">{khadam.keterangan}</h5>
                                <p className="text-gray-600 text-sm">
                                    Sejak {formatDate(khadam.tanggal_mulai)}{" "}
                                    Sampai {khadam.tanggal_akhir ? formatDate(khadam.tanggal_akhir) : "Sekarang"}
                                </p>

                            </div>
                            <span
                                className={`text-sm font-semibold px-3 py-1 rounded-full ${khadam.status === 1
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {khadam.status === 1 ? "Aktif" : "Nonaktif"}
                            </span>
                        </div>

                        {/* Form Input */}
                        {selectedKhadamId === khadam.id && selectedKhadamDetail && (
                            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                                        Keterangan
                                    </label>
                                    <input
                                        type="text"
                                        id="nis"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                                        value={selectedKhadamDetail.keterangan}
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                        Tanggal Akhir
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
                                    <div className="flex space-x-2 mt-1">
                                        {khadam.status === 1 && (
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                                            onClick={handleUpdate}
                                        >
                                            Simpan
                                        </button>
                                        )}
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                                            onClick={() => {
                                                setSelectedKhadamId(null);
                                                setSelectedKhadamDetail(null);
                                                setStartDate("");
                                                setEndDate("");
                                            }}
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </form>

                        )}
                    </div>
                ))}
            </div>  
        </div>
    );
};

// Format tanggal ke ID
const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
};

export default TabKhadam;
