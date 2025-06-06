import { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../hooks/config";
import useFetchSantri from "../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Santri";
import useDropdownWaliAsuh from "../../hooks/hook_dropdown/DropdownWaliAsuh";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";

const HubungkanWaliAsuh = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [selectedSantriIds, setSelectedSantriIds] = useState([]);
    const [selectedWaliAsuh, setSelectedWaliAsuh] = useState(null);
    const [isAllSelected, setIsAllSelected] = useState(false);

    useEffect(() => {
        console.log(selectedSantriIds);
    }, [selectedSantriIds]);

    const { menuWaliAsuh2 } = useDropdownWaliAsuh();

    const { santri, loadingSantri, error, setLimit, totalDataSantri, fetchData, searchTerm, setSearchTerm } = useFetchSantri();

    useEffect(() => {
        if (totalDataSantri && totalDataSantri != 0) setLimit(totalDataSantri);
    }, [setLimit, totalDataSantri]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedSantriIds.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Peringatan",
                text: "Pilih minimal satu santri untuk dipindah.",
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin memproses perpindahan?",
            text: "Pastikan data tujuan sudah sesuai.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, proses",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        const payload = {
            id_wali_asuh: selectedWaliAsuh,
            santri_id: selectedSantriIds,
        };

        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang memproses.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}fitur/anakasuh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log(result);
            
            Swal.close();

            if (response.status === 401) {
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            if (!response.ok) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message || "Terjadi kesalahan saat memproses perpindahan."}</div>`,
                });
                return;
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: result.message || "Berhasil ditambahkan sebagai anak asuh dan dikaitkan dengan wali asuh.",
            });

            // Reset form jika diperlukan
            setSelectedSantriIds([]);
            fetchData(true);
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            Swal.close();
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Terjadi kesalahan saat mengirim data.",
            });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-start gap-6 pl-6 pt-6 pb-6">
            <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Daftar Santri</h2>

                <div className="relative mb-4 w-full max-w-64">
                    <input
                        type="text"
                        placeholder="Cari nama santri..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i className="fas fa-search"></i>
                    </div>
                </div>

                {/* TABLE */}
                {error ? (
                    <div className="col-span-3 text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Muat Ulang
                        </button>
                    </div>
                ) : (
                    <DoubleScrollbarTable>
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-3 py-2 border-b text-center w-10">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setIsAllSelected(checked);
                                            if (checked) {
                                                // Centang semua, isi selectedSantriIds dengan semua id dari pelajar
                                                setSelectedSantriIds(santri.map((item) => item.id));
                                            } else {
                                                // Hilangkan semua centang
                                                setSelectedSantriIds([]);
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-3 py-2 border-b text-center w-10">No</th>
                                <th className="px-3 py-2 border-b">No. Induk Santri</th>
                                <th className="px-3 py-2 border-b">Nama</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {loadingSantri ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-6">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </td>
                                </tr>
                            ) : santri.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                                </tr>
                            ) : (
                                santri.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 text-center">
                                        <td className="px-3 py-2 border-b">
                                            <input
                                                type="checkbox"
                                                checked={selectedSantriIds.includes(item.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    if (checked) {
                                                        setSelectedSantriIds((prev) => {
                                                            const newSelected = [...prev, item.id];
                                                            if (newSelected.length === santri.length) {
                                                                setIsAllSelected(true);
                                                            }
                                                            return newSelected;
                                                        });
                                                    } else {
                                                        setSelectedSantriIds((prev) => {
                                                            const newSelected = prev.filter((id) => id !== item.id);
                                                            setIsAllSelected(false);
                                                            return newSelected;
                                                        });
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="px-3 py-2 border-b">{index + 1}</td>
                                        <td className="px-3 py-2 border-b">{item.nis}</td>
                                        <td className="px-3 py-2 border-b text-left">{item.nama}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </DoubleScrollbarTable>
                )}
            </div>

            {/* RIGHT SIDE - FORM TUJUAN */}
            <form onSubmit={handleSubmit} className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between self-start">
                {/* <div className="w-full lg:w-[350px] bg-white p-6 rounded-lg shadow-md flex flex-col justify-between self-start"> */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Tambahkan ke</h2>

                        <div className="flex flex-wrap w-full mb-4">
                            <div>
                                <label htmlFor="id_wali_asuh" className="block text-gray-700">Wali Asuh *</label>
                                <select
                                    className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${menuWaliAsuh2.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                    onChange={(e) => setSelectedWaliAsuh(e.target.value )}
                                    value={selectedWaliAsuh}
                                    disabled={menuWaliAsuh2.length <= 1}
                                    required
                                >
                                    {menuWaliAsuh2.map((waliAsuh, idx) => (
                                        <option key={idx} value={waliAsuh.id}>
                                            {waliAsuh.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition duration-200">
                        Proses
                    </button>
                {/* </div> */}
            </form>
        </div>
    );
};

export default HubungkanWaliAsuh;
