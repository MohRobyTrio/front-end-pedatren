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
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";

const Filters = ({ filterOptions, onChange, selectedFilters, vertical = false }) => {
    return (
        <>
            <div className={`w-full ${vertical ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}`}>
                {Object.entries(filterOptions).map(([label, options], index) => (
                    <div key={`${label}-${index}`} className="w-full">

                    {vertical && (
                        <label className="block text-gray-700 mb-1 capitalize">{label} Tujuan</label>
                    )}
                    <select
                        className={`w-full border border-gray-300 rounded p-2 ${options.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                            }`}
                        onChange={(e) => onChange({ [label]: e.target.value })}
                        value={selectedFilters[label] || ""}
                        disabled={options.length <= 1}
                        required={vertical}
                    >
                        {options.map((option, idx) => (
                            <option key={idx} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            </div>
        </>
    );
};

const HubungkanWaliAsuh = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [selectedSantriIds, setSelectedSantriIds] = useState([]);
    const [selectedWaliAsuh, setSelectedWaliAsuh] = useState(null);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [filters, setFilters] = useState({
        wilayah: "",
        blok: "",
        kamar: "",
    })

    useEffect(() => {
        console.log(selectedSantriIds);
    }, [selectedSantriIds]);

    const {
        filterWilayah: filterWilayahFilter,
        handleFilterChangeWilayah: handleFilterChangeWilayahFilter,
        selectedWilayah: selectedWilayahFilter,
    } = DropdownWilayah();

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const updatedFilterWilayahFilter = {
        wilayah: updateFirstOptionLabel(filterWilayahFilter.wilayah, "Pilih Wilayah"),
        blok: updateFirstOptionLabel(filterWilayahFilter.blok, "Pilih Blok"),
        kamar: updateFirstOptionLabel(filterWilayahFilter.kamar, "Pilih Kamar"),
    };

    const wilayahTerpilih = filterWilayahFilter.wilayah.find((n) => n.value == selectedWilayahFilter.wilayah)?.nama || "";
    const blokTerpilih = filterWilayahFilter.blok.find((n) => n.value == selectedWilayahFilter.blok)?.label || "";
    const kamarTerpilih = filterWilayahFilter.kamar.find((n) => n.value == selectedWilayahFilter.kamar)?.label || "";

    useEffect(() => {
        if (wilayahTerpilih || blokTerpilih || kamarTerpilih) {
            setFilters({
                wilayah: wilayahTerpilih,
                blok: blokTerpilih,
                kamar: kamarTerpilih,
            });
        }
    }, [wilayahTerpilih, blokTerpilih, kamarTerpilih]);

    const { menuWaliAsuh2 } = useDropdownWaliAsuh();

    const shouldFetch = selectedWilayahFilter.wilayah !== "";

    const { santri, loadingSantri, error, setLimit, totalDataSantri, fetchData, searchTerm, setSearchTerm, fetchAllData, limit, totalPages, currentPage, setCurrentPage, allSantriIds } = useFetchSantri(filters);

    // useEffect(() => {
    //     if (totalDataSantri && totalDataSantri != 0) setLimit(totalDataSantri);
    // }, [setLimit, totalDataSantri]);

    useEffect(() => {
        if (isAllSelected && allSantriIds.length > 0) {
            setSelectedSantriIds(allSantriIds);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allSantriIds]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedSantriIds.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Peringatan",
                text: "Pilih minimal satu santri untuk dijadikan anak asuh.",
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Yakin ingin memproses data ini?",
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
                background: "transparent",    // tanpa bg putih box
                showConfirmButton: false,     // tanpa tombol
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'p-0 shadow-none border-0 bg-transparent' // hilangkan padding, shadow, border, bg
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

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
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
                    html: `<div style="text-align: left;">${result.message || "Terjadi kesalahan saat memproses anak asuh."}</div>`,
                });
                return;
            }

            if (result.success && result.data?.berhasil?.length === 0 && result.data?.gagal?.length > 0) {
                const gagalMessages = result.data.gagal.map(item => `- ${item.message}`).join("<br>");
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align:left">${result.message}<br><br>${gagalMessages}</div>`,
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

    useEffect(() => {
        const availableIds = santri.map(item => item.id);

        setSelectedSantriIds(prevSelected =>
            prevSelected.filter(id => availableIds.includes(id))
        );

        if (!availableIds.some(id => selectedSantriIds.includes(id))) {
            setIsAllSelected(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [santri]);

    return (
        <div className="flex flex-col lg:flex-row items-start gap-6 pl-6 pt-6 pb-6">
            <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold mb-4">Daftar Santri</h2>
                <div className="relative w-full sm:w-auto sm:max-w-sm">
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
                    </div>
                <div className="flex flex-wrap w-full mb-4">
                    <Filters
                        filterOptions={updatedFilterWilayahFilter}
                        onChange={handleFilterChangeWilayahFilter}
                        selectedFilters={selectedWilayahFilter}
                    />
                </div>
                {/* <div className="relative mb-4 w-full max-w-64">
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
                </div> */}

                {/* TABLE */}
                {!shouldFetch ? (
                    <div className="text-center py-6 text-gray-500 italic">Silakan pilih wilayah terlebih dahulu.</div>
                ) : error ? (
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
                    <>
                    <SearchBar
                        totalData={totalDataSantri}
                        limit={limit}
                        toggleLimit={(e) => setLimit(Number(e.target.value))}
                        showViewButtons={false}
                        showFilterButtons={false}
                        showSearch={false}
                    />
                    <DoubleScrollbarTable>
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-3 py-2 border-b text-center w-10">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={async (e) => {
                                                const checked = e.target.checked;
                                                setIsAllSelected(checked);
                                                if (checked) {
                                                    await fetchAllData(); // Ambil semua ID dari semua halaman
                                                    setSelectedSantriIds(allSantriIds);
                                                } else {
                                                    setSelectedSantriIds([]);
                                                }
                                        }}
                                    />
                                </th>
                                <th className="px-3 py-2 border-b text-center w-10">No</th>
                                <th className="px-3 py-2 border-b">No. Induk Santri</th>
                                <th className="px-3 py-2 border-b">Nama</th>
                                <th className="px-3 py-2 border-b">Wilayah</th>
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
                                        <td className="px-3 py-2 border-b text-left">{item.wilayah}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </DoubleScrollbarTable>
                    {totalPages > 1 && (
                        <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                    )}
                    </>
                )}
            </div>

            {/* RIGHT SIDE - FORM TUJUAN */}
            <form onSubmit={handleSubmit} className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between self-start">
                {/* <div className="w-full lg:w-[350px] bg-white p-6 rounded-lg shadow-md flex flex-col justify-between self-start"> */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Tambahkan ke</h2>

                        <div className="flex flex-wrap w-full mb-4">
                            <div className="w-full">
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
