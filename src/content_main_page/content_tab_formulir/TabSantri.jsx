// import { useState } from "react";

// const TabSantri = () => {
//     const [endDate, setEndDate] = useState("");

//     return (
//         <div className="block" id="santri">
//             <h1 className="text-xl font-bold">Status Santri</h1>
//             <div className="mt-5">
//                 {/* <div className="bg-white shadow-md rounded-lg p-6"> */}
//                 <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="md:col-span-3 inline-flex items-center space-x-4 shadow-md p-4 rounded-lg w-full">
//                         <div>
//                             <h5 className="text-lg font-bold">2020712450</h5>
//                             <p className="text-gray-600 text-sm">Sejak 25 Agu 2020 Sampai Sekarang</p>
//                         </div>
//                     </div>
//                     <br />
//                     <div>
//                         <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
//                             Nomor Induk Santri
//                         </label>
//                         <input
//                             type="text"
//                             id="nis"
//                             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                             value="2020712450"
//                             disabled
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
//                             Tanggal Mulai
//                         </label>
//                         <input
//                             type="date"
//                             id="startDate"
//                             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
//                             Tanggal Akhir
//                         </label>
//                         <input
//                             type="date"
//                             id="endDate"
//                             className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700"></label>
//                         <button type="button" className="mt-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none">
//                             Batal
//                         </button>
//                     </div>
//                 </form>
//                 {/* </div> */}
//             </div>
//         </div>
//     );
// };

// export default TabSantri;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalAddSantriFormulir from "../../components/modal/modal_formulir/ModalFormAddSantri";

const TabSantri = () => {
    const { biodata_id } = useParams();
    const [santriList, setSantriList] = useState([]);
    const [selectedSantriId, setSelectedSantriId] = useState(null);
    const [selectedSantriDetail, setSelectedSantriDetail] = useState(null);
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    // Ambil list santri
    useEffect(() => {
        const fetchSantri = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/formulir/${biodata_id}/santri`);
                const result = await response.json();
                setSantriList(result.data || []);
            } catch (error) {
                console.error("Gagal mengambil data santri:", error);
            }
        };

        fetchSantri();
    }, [biodata_id]);

    // Ambil detail saat card diklik
    const handleCardClick = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/formulir/${id}/santri/show`);
            const result = await response.json();
            setSelectedSantriId(id);
            setSelectedSantriDetail(result.data);
            setEndDate(result.data.tanggal_keluar || "");
            setStartDate(result.data.tanggal_masuk || "");
        } catch (error) {
            console.error("Gagal mengambil detail santri:", error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedSantriDetail) return;

        const payload = {
            nis: selectedSantriDetail.nis,
            tanggal_masuk: startDate,
            tanggal_keluar: endDate || null,
            status: selectedSantriDetail.status || null,
        };

        try {
            const response = await fetch(
                `http://localhost:8000/api/formulir/${selectedSantriId}/santri`,
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
                setSelectedSantriDetail(result.data || payload);
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
        <div className="block" id="santri">
            <h1 className="text-xl font-bold flex items-center justify-between">Status Santri
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
                {santriList.map((santri) => (
                    <div key={santri.id}>
                        {/* Card */}
                        <div
                            className="bg-white shadow-md rounded-lg p-6 cursor-pointer w-full flex justify-between items-center"
                            onClick={() => handleCardClick(santri.id)}
                        >
                            <div>
                                <h5 className="text-lg font-bold">{santri.nis}</h5>
                                <p className="text-gray-600 text-sm">
                                    Sejak {formatDate(santri.tanggal_masuk)}{" "}
                                    Sampai {santri.tanggal_keluar ? formatDate(santri.tanggal_keluar) : "Sekarang"}
                                </p>
                            </div>
                            <span
                                className={`text-sm font-semibold px-3 py-1 rounded-full ${santri.status === "aktif"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {capitalizeFirst(santri.status)}
                            </span>
                        </div>

                        {/* Form Input */}
                        {selectedSantriId === santri.id && selectedSantriDetail && (
                            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                                        Nomor Induk Santri
                                    </label>
                                    <input
                                        type="text"
                                        id="nis"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 text-gray-500"
                                        value={selectedSantriDetail.nis}
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
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                                            onClick={handleUpdate}
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                                            onClick={() => {
                                                setSelectedSantriId(null);
                                                setSelectedSantriDetail(null);
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

// Kapitalisasi huruf pertama
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default TabSantri;
