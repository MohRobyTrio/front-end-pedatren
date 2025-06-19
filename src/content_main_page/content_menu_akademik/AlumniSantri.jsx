import { useEffect, useState } from "react";
import useFetchSantri from "../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Santri";
import { OrbitProgress } from "react-loading-indicators";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../hooks/config";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import useFetchLulusSantri from "../../hooks/hooks_menu_akademik/AlumniSantri";

const Filters = ({ filterOptions, onChange, selectedFilters, vertical = false }) => {
    return (
        <>
            <div className={`${vertical ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}`}>
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

const AlumniSantri = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [selectedSantriIds, setSelectedSantriIds] = useState([]);
    const [selectedLulusIds, setSelectedLulusIds] = useState([]);
    const [isAllSelectedSantri, setIsAllSelectedSantri] = useState(false);
    const [isAllSelectedLulus, setIsAllSelectedLulus] = useState(false);
    const [submitAction, setSubmitAction] = useState(null);
    const [filters, setFilters] = useState({
        wilayah: "",
        blok: "",
        kamar: "",
        urutBerdasarkan: ""
    })

    const [filtersLulus, setFiltersLulus] = useState({
        wilayah: "",
        blok: "",
        kamar: "",
        urutBerdasarkan: ""
    })

    const urutBerdasarkan = [
        { label: "Urut Berdasarkan", value: "" },
        { label: "Nama", value: "nama" },
        { label: "NIUP", value: "niup" },
        { label: "Jenis Kelamin", value: "jenis_kelamin" }
    ]

    useEffect(() => {
        console.log(selectedSantriIds);
    }, [selectedSantriIds])

    useEffect(() => {
        console.log(selectedLulusIds);
    }, [selectedLulusIds])

    const {
        filterWilayah: filterWilayahFilter,
        handleFilterChangeWilayah: handleFilterChangeWilayahFilter,
        selectedWilayah: selectedWilayahFilter,
    } = DropdownWilayah();

    const {
        filterWilayah: filterWilayahFilterLulus,
        handleFilterChangeWilayah: handleFilterChangeWilayahFilterLulus,
        selectedWilayah: selectedWilayahFilterLulus,
    } = DropdownWilayah();
    

    const shouldFetch = selectedWilayahFilter.wilayah != "";

    const { santri, loadingSantri, error, setLimit, totalDataSantri, fetchData, fetchAllData: fetchAllDataSantri, searchTerm: searchTermSantri, setSearchTerm: setSearchTermSantri, allSantriIds, limit, setCurrentPage: setCurrentPageSantri, currentPage: currentPageSantri, totalPages: totalPagesSantri } = useFetchSantri(filters);
    const { dataLulus, loadingLulus, error: errorLulus, setLimit: setLimitLulus, totalDataLulus, fetchData: fetchDataLulus, searchTerm: searchTermLulus, setSearchTerm: setSearchTermLulus, limit: limitLulus, setCurrentPage: setCurrentPageLulus, currentPage:currentPageLulus, totalPages: totalPagesLulus, fetchAllData: fetchAllDataLulus } = useFetchLulusSantri(filtersLulus);

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const updatedFilterWilayahFilter = {
        wilayah: updateFirstOptionLabel(filterWilayahFilter.wilayah, "Pilih Wilayah"),
        blok: updateFirstOptionLabel(filterWilayahFilter.blok, "Pilih Blok"),
        kamar: updateFirstOptionLabel(filterWilayahFilter.kamar, "Pilih Kamar"),
    };

    const updatedFilterWilayahFilterLulus = {
        wilayah: updateFirstOptionLabel(filterWilayahFilterLulus.wilayah, "Pilih Wilayah"),
        blok: updateFirstOptionLabel(filterWilayahFilterLulus.blok, "Pilih Blok"),
        kamar: updateFirstOptionLabel(filterWilayahFilterLulus.kamar, "Pilih Kamar"),
    };

    const wilayahTerpilih = filterWilayahFilter.wilayah.find((n) => n.value == selectedWilayahFilter.wilayah)?.nama || "";
    const blokTerpilih = filterWilayahFilter.blok.find((n) => n.value == selectedWilayahFilter.blok)?.label || "";
    const kamarTerpilih = filterWilayahFilter.kamar.find((n) => n.value == selectedWilayahFilter.kamar)?.label || "";

    const wilayahTerpilihLulus = filterWilayahFilterLulus.wilayah.find((n) => n.value == selectedWilayahFilterLulus.wilayah)?.nama || "";
    const blokTerpilihLulus = filterWilayahFilterLulus.blok.find((n) => n.value == selectedWilayahFilterLulus.blok)?.label || "";
    const kamarTerpilihLulus = filterWilayahFilterLulus.kamar.find((n) => n.value == selectedWilayahFilterLulus.kamar)?.label || "";

    useEffect(() => {
        if (wilayahTerpilih || blokTerpilih || kamarTerpilih) {
            setFilters({
                wilayah: wilayahTerpilih,
                blok: blokTerpilih,
                kamar: kamarTerpilih,
            });            
        }
        if (wilayahTerpilihLulus || blokTerpilihLulus || kamarTerpilihLulus) {
            console.log(wilayahTerpilihLulus);
            
            setFiltersLulus({
                wilayah: wilayahTerpilihLulus,
                blok: blokTerpilihLulus,
                kamar: kamarTerpilihLulus,
            });
        }
    }, [wilayahTerpilih, blokTerpilih, kamarTerpilih, wilayahTerpilihLulus, blokTerpilihLulus, kamarTerpilihLulus]);

    // useEffect(() => {
    //     if (totalDataSantri && totalDataSantri != 0) setLimit(totalDataSantri);
    // }, [setLimit, totalDataSantri]);

    useEffect(() => {
        if (isAllSelectedSantri && allSantriIds.length > 0) {
            setSelectedSantriIds(allSantriIds);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allSantriIds]);

    // useEffect(() => {
    //     console.log(totalDataLulus);
        
    //     if (totalDataLulus && totalDataLulus != 0) setLimitLulus(totalDataLulus);
    // }, [setLimitLulus, totalDataLulus]);

    const handlePageChangeSantri = (page) => {
        if (page >= 1 && page <= totalPagesSantri) {
            setCurrentPageSantri(page);
        }
    };

    const handlePageChangeLulus = (page) => {
        if (page >= 1 && page <= totalPagesLulus) {
            setCurrentPageLulus(page);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isProses = submitAction === "proses";
        const selectedIds = isProses ? selectedSantriIds : selectedLulusIds;

        if (selectedIds.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Peringatan",
                text: `Pilih minimal satu data ${isProses ? "santri" : "alumni"} untuk diproses.`,
            });
            return;
        }

        const endpoint = isProses ? "proses-alumni" : "batal-alumni";
        const payload = { santri_id: selectedIds };

        const confirmResult = await Swal.fire({
            title: "Yakin ingin memproses data ini?",
            text: "Pastikan data sudah sesuai.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, proses",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        // const payload = {
        //     id: selectedSantriIds,
        // };

        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang memproses.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}fitur/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            Swal.close();
            const result = await response.json();
            console.log(result);


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
                    html: `<div style="text-align: left;">${result.message || "Terjadi kesalahan saat memproses perpindahan."}</div>`,
                });
                return;
            }

            if (result.data?.gagal?.length > 0) {
                const gagalList = result.data.gagal
                    .map((item, index) => `<b>${index + 1}. ${item.nama}</b>`)
                    .join("<br><br>");

                await Swal.fire({
                    icon: "warning",
                    title: "Sebagian Gagal Diproses",
                    html: `
                    <div style="text-align: left;">
                        ${result.message}<br><br>
                        <b>Daftar santri yang gagal diproses:</b><br><br>
                        ${gagalList}
                    </div>`,
                });
            } else {
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: result.message || `${submitAction} lulus berhasil diproses!`,
                });
            }

            // Reset form jika diperlukan
            setIsAllSelectedLulus(false);
            setIsAllSelectedSantri(false);
            setSelectedSantriIds([]);
            setSelectedLulusIds([]);
            fetchData(true);
            fetchDataLulus(true);
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

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex flex-col lg:flex-row items-start gap-6 pl-6 pt-6 pb-6">
            <div className="w-full lg:w-20/49 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold">Daftar Santri</h2>
                    <div className="relative w-full sm:w-auto sm:max-w-sm">
                        <input
                            type="text"
                            placeholder="Cari nama santri..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            value={searchTermSantri}
                            onChange={(e) => setSearchTermSantri(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <i className="fas fa-search"></i>
                        </div>
                    </div>
                </div>

                <div className="w-full mb-4">
                    {/* Bungkus pakai grid 2 kolom saat lg, stacked saat <lg */}
                    <div className="grid grid-cols-1 gap-4">

                        {/* Filters */}
                        <div className="w-full">
                            <Filters
                                filterOptions={updatedFilterWilayahFilter}
                                onChange={handleFilterChangeWilayahFilter}
                                selectedFilters={selectedWilayahFilter}
                            />
                        </div>

                        {/* Sort */}
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="w-full">
                                    <select
                                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 capitalize"
                                        value={filters.urutBerdasarkan}
                                        onChange={(e) => setFilters({ ...filters, urutBerdasarkan: e.target.value })}
                                        required
                                    >
                                        {urutBerdasarkan.map((urut, idx) => (
                                            <option key={idx} value={urut.value}>
                                                {urut.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


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
                                            checked={isAllSelectedSantri}
                                            onChange={async (e) => {
                                                const checked = e.target.checked;
                                                setIsAllSelectedSantri(checked);
                                                if (checked) {
                                                    await fetchAllDataSantri(); // Ambil semua ID dari semua halaman
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
                                        <tr key={item.id || index} className="hover:bg-gray-50 text-center">
                                            <td className="px-3 py-2 border-b">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSantriIds.includes(item.id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        if (checked) {
                                                            setSelectedSantriIds((prev) => {
                                                                const newSelected = [...prev, item.id];
                                                                if (newSelected.length == santri.length) {
                                                                    setIsAllSelectedSantri(true);
                                                                }
                                                                return newSelected;
                                                            });
                                                        } else {
                                                            setSelectedSantriIds((prev) => {
                                                                const newSelected = prev.filter((id) => id != item.id);
                                                                setIsAllSelectedSantri(false);
                                                                return newSelected;
                                                            });
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-3 py-2 border-b">{(currentPageSantri - 1) * limit + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b">{item.nis}</td>
                                            <td className="px-3 py-2 border-b text-left">{item.nama}</td>
                                            <td className="px-3 py-2 border-b text-left">{item.wilayah}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </DoubleScrollbarTable>
                    {totalPagesSantri > 1 && (
                        <Pagination currentPage={currentPageSantri} totalPages={totalPagesSantri} handlePageChange={handlePageChangeSantri} />
                    )}
                    </>
                )}
            </div>

            {/* RIGHT SIDE - FORM TUJUAN */}
            <form
                onSubmit={handleSubmit}
                className="w-full lg:w-9/49 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between gap-4 lg:sticky lg:top-1/2 self-start transform lg:-translate-y-1/2 z-10"
            >

                <button
                    type="submit"
                    onClick={() => setSubmitAction("proses")}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-6 py-3 rounded transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                    Proses Lulus
                    <FontAwesomeIcon icon={isMobile ? faArrowDown : faArrowRight} />
                </button>

                <button
                    type="submit"
                    onClick={() => setSubmitAction("batal")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={isMobile ? faArrowUp : faArrowLeft} />
                    Batal Lulus
                </button>
            </form>


            <div className="w-full lg:w-20/49 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold">
                        Lulusan Santri
                        <p className="text-sm text-gray-500 mt-1">Menampilkan data lulusan 30 hari terakhir. Hanya data dalam rentang ini yang dapat dibatalkan kelulusannya.</p>
                    </h2>
                    <div className="relative w-full sm:w-auto sm:max-w-sm">
                        <input
                            type="text"
                            placeholder="Cari nama alumni..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            value={searchTermLulus}
                            onChange={(e) => setSearchTermLulus(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <i className="fas fa-search"></i>
                        </div>
                    </div>
                </div>

                
                <div className="w-full mb-4">
                    {/* Bungkus pakai grid 2 kolom saat lg, stacked saat <lg */}
                    <div className="grid grid-cols-1 gap-4">

                        {/* Filters */}
                        <div className="w-full">
                    <Filters
                        filterOptions={updatedFilterWilayahFilterLulus}
                        onChange={handleFilterChangeWilayahFilterLulus}
                        selectedFilters={selectedWilayahFilterLulus}
                    />
                </div>
                <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="w-full">
                                    <select
                                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 capitalize"
                                        value={filtersLulus.urutBerdasarkan}
                                        onChange={(e) => setFiltersLulus({ ...filtersLulus, urutBerdasarkan: e.target.value })}
                                        required
                                    >
                                        {urutBerdasarkan.map((urut, idx) => (
                                            <option key={idx} value={urut.value}>
                                                {urut.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                </div>
                </div>

                {errorLulus ? (
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
                        totalData={totalDataLulus}
                        limit={limitLulus}
                        toggleLimit={(e) => setLimitLulus(Number(e.target.value))}
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
                                            checked={isAllSelectedLulus}
                                            onChange={async (e) => {
                                                const checked = e.target.checked;
                                                setIsAllSelectedLulus(checked);
                                                if (checked) {
                                                    const allIds = await fetchAllDataLulus();
                                                    setSelectedLulusIds(allIds);
                                                } else {
                                                    // Hilangkan semua centang
                                                    setSelectedLulusIds([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="px-3 py-2 border-b text-center w-10">No</th>
                                    <th className="px-3 py-2 border-b">No. Induk</th>
                                    <th className="px-3 py-2 border-b">Nama</th>
                                    <th className="px-3 py-2 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingLulus ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : dataLulus.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    dataLulus.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 text-center">
                                            <td className="px-3 py-2 border-b">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLulusIds.includes(item.id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        if (checked) {
                                                            setSelectedLulusIds((prev) => {
                                                                const newSelected = [...prev, item.id];
                                                                if (newSelected.length === dataLulus.length) {
                                                                    setIsAllSelectedLulus(true);
                                                                }
                                                                return newSelected;
                                                            });
                                                        } else {
                                                            setSelectedLulusIds((prev) => {
                                                                const newSelected = prev.filter((id) => id !== item.id);
                                                                setIsAllSelectedLulus(false);
                                                                return newSelected;
                                                            });
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-3 py-2 border-b">{(currentPageLulus - 1) * limitLulus + index + 1 || "-"}</td>
                                            <td className="px-3 py-2 border-b text-left">{item.nis}</td>
                                            <td className="px-3 py-2 border-b text-left">{item.nama}</td>
                                            <td className="px-3 py-2 border-b">
                                                <span
                                                    className={`text-sm capitalize font-semibold px-3 py-1 rounded-full ${item.status == "alumni"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </DoubleScrollbarTable>
                    {totalPagesLulus > 1 && (
                        <Pagination currentPage={currentPageLulus} totalPages={totalPagesLulus} handlePageChange={handlePageChangeLulus} />
                    )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AlumniSantri;
