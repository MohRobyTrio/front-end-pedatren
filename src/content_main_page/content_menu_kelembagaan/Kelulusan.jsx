import { useEffect, useState } from "react";
import useFetchPelajar from "../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Pelajar";
import { OrbitProgress } from "react-loading-indicators";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../hooks/config";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import useFetchLulus from "../../hooks/hooks_menu_kelembagaan/Kelulusan";

const Filters = ({ filterOptions, onChange, selectedFilters, vertical = false }) => {
    return (
        <>
            <div className={`${vertical ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}`}>
                {Object.entries(filterOptions).map(([label, options], index) => (
                    <div key={`${label}-${index}`} className="w-full">
                        {/* {Object.entries(filterOptions).map(([label, options], index) => (
                <div
                    key={`${label}-${index}`}
                    className={`mb-4 ${vertical ? "w-full" : "w-full px-2  md:w-1/2 "}`}
                > */}
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

const Kelulusan = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [selectedPelajarBiodataIds, setSelectedPelajarBiodataIds] = useState([]);
    const [selectedLulusBiodataIds, setSelectedLulusBiodataIds] = useState([]);
    const [isAllSelectedPelajar, setIsAllSelectedPelajar] = useState(false);
    const [isAllSelectedLulus, setIsAllSelectedLulus] = useState(false);
    const [submitAction, setSubmitAction] = useState(null);
    const [filters, setFilters] = useState({
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        urutBerdasarkan: ""
    })

    const [filtersLulus, setFiltersLulus] = useState({
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        urutBerdasarkan: ""
    })

    const urutBerdasarkan = [
        { label: "Urut Berdasarkan", value: "" },
        { label: "Nama", value: "nama" },
        { label: "NIUP", value: "niup" },
        { label: "Jenis Kelamin", value: "jenis_kelamin" }
    ]

    useEffect(() => {
        console.log(selectedPelajarBiodataIds);
    }, [selectedPelajarBiodataIds])

    useEffect(() => {
        console.log(selectedLulusBiodataIds);
    }, [selectedLulusBiodataIds])

    const {
        filterLembaga: filterLembagaFilter,
        handleFilterChangeLembaga: handleFilterChangeLembagaFilter,
        selectedLembaga: selectedLembagaFilter,
    } = DropdownLembaga();

    const {
        filterLembaga: filterLembagaFilterLulus,
        handleFilterChangeLembaga: handleFilterChangeLembagaFilterLulus,
        selectedLembaga: selectedLembagaFilterLulus,
    } = DropdownLembaga();
    

    const shouldFetch = selectedLembagaFilter.lembaga !== "";

    const { pelajar, loadingPelajar, error, setLimit, totalDataPelajar, fetchData, searchTerm: searchTermPelajar, setSearchTerm: setSearchTermPelajar } = useFetchPelajar(filters);
    const { dataLulus, loadingLulus, error: errorLulus, setLimit: setLimitLulus, totalDataLulus, fetchData: fetchDataLulus, searchTerm: searchTermLulus, setSearchTerm: setSearchTermLulus } = useFetchLulus(filtersLulus);

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    const updatedFilterLembagaFilter = {
        lembaga: updateFirstOptionLabel(filterLembagaFilter.lembaga, "Pilih Lembaga"),
        jurusan: updateFirstOptionLabel(filterLembagaFilter.jurusan, "Pilih Jurusan"),
        kelas: updateFirstOptionLabel(filterLembagaFilter.kelas, "Pilih Kelas"),
        rombel: updateFirstOptionLabel(filterLembagaFilter.rombel, "Pilih rombel"),
    };

    const updatedFilterLembagaFilterLulus = {
        lembaga: updateFirstOptionLabel(filterLembagaFilterLulus.lembaga, "Pilih Lembaga"),
        jurusan: updateFirstOptionLabel(filterLembagaFilterLulus.jurusan, "Pilih Jurusan"),
        kelas: updateFirstOptionLabel(filterLembagaFilterLulus.kelas, "Pilih Kelas"),
        rombel: updateFirstOptionLabel(filterLembagaFilterLulus.rombel, "Pilih rombel"),
    };

    const lembagaTerpilih = filterLembagaFilter.lembaga.find((n) => n.value == selectedLembagaFilter.lembaga)?.label || "";
    const jurusanTerpilih = filterLembagaFilter.jurusan.find((n) => n.value == selectedLembagaFilter.jurusan)?.label || "";
    const kelasTerpilih = filterLembagaFilter.kelas.find((n) => n.value == selectedLembagaFilter.kelas)?.label || "";
    const rombelTerpilih = filterLembagaFilter.rombel.find((n) => n.value == selectedLembagaFilter.rombel)?.label || "";

    const lembagaTerpilihLulus = filterLembagaFilterLulus.lembaga.find((n) => n.value == selectedLembagaFilterLulus.lembaga)?.label || "";
    const jurusanTerpilihLulus = filterLembagaFilterLulus.jurusan.find((n) => n.value == selectedLembagaFilterLulus.jurusan)?.label || "";
    const kelasTerpilihLulus = filterLembagaFilterLulus.kelas.find((n) => n.value == selectedLembagaFilterLulus.kelas)?.label || "";
    const rombelTerpilihLulus = filterLembagaFilterLulus.rombel.find((n) => n.value == selectedLembagaFilterLulus.rombel)?.label || "";

    useEffect(() => {
        if (lembagaTerpilih || jurusanTerpilih || kelasTerpilih || rombelTerpilih) {
            setFilters({
                lembaga: lembagaTerpilih,
                jurusan: jurusanTerpilih,
                kelas: kelasTerpilih,
                rombel: rombelTerpilih,
            });            
        }
        if (lembagaTerpilihLulus || jurusanTerpilihLulus || kelasTerpilihLulus || rombelTerpilihLulus) {
            setFiltersLulus({
                lembaga: lembagaTerpilihLulus,
                jurusan: jurusanTerpilihLulus,
                kelas: kelasTerpilihLulus,
                rombel: rombelTerpilihLulus,
            });
        }
    }, [lembagaTerpilih, jurusanTerpilih, kelasTerpilih, rombelTerpilih, lembagaTerpilihLulus, jurusanTerpilihLulus, kelasTerpilihLulus, rombelTerpilihLulus]);

    useEffect(() => {
        if (totalDataPelajar && totalDataPelajar != 0) setLimit(totalDataPelajar);
    }, [setLimit, totalDataPelajar]);

    useEffect(() => {
        console.log(totalDataLulus);
        
        if (totalDataLulus && totalDataLulus != 0) setLimitLulus(totalDataLulus);
    }, [setLimitLulus, totalDataLulus]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isProses = submitAction === "proses";
        const selectedIds = isProses ? selectedPelajarBiodataIds : selectedLulusBiodataIds;

        if (selectedIds.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Peringatan",
                text: `Pilih minimal satu data ${isProses ? "pelajar" : "alumni"} untuk diproses.`,
            });
            return;
        }

        const endpoint = isProses ? "proses-lulus" : "batal-lulus";
        const payload = { biodata_id: selectedIds };

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
        //     biodata_id: selectedPelajarBiodataIds,
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
                        <b>Daftar siswa yang gagal diproses:</b><br><br>
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
            setIsAllSelectedPelajar(false);
            setSelectedPelajarBiodataIds([]);
            setSelectedLulusBiodataIds([]);
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
            <div className="w-full lg:w-4/11 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold">Daftar Pelajar</h2>
                    <div className="relative w-full sm:w-auto sm:max-w-sm">
                        <input
                            type="text"
                            placeholder="Cari nama pelajar..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            value={searchTermPelajar}
                            onChange={(e) => setSearchTermPelajar(e.target.value)}
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
                                filterOptions={updatedFilterLembagaFilter}
                                onChange={handleFilterChangeLembagaFilter}
                                selectedFilters={selectedLembagaFilter}
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
                    <div className="text-center py-6 text-gray-500 italic">Silakan pilih lembaga terlebih dahulu.</div>
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
                    <DoubleScrollbarTable>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 border-b text-center w-10">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelectedPelajar}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setIsAllSelectedPelajar(checked);
                                                if (checked) {
                                                    // Centang semua, isi selectedSantriIds dengan semua id dari pelajar
                                                    setSelectedPelajarBiodataIds(pelajar.map((item) => item.biodata_id));
                                                } else {
                                                    // Hilangkan semua centang
                                                    setSelectedPelajarBiodataIds([]);
                                                }
                                            }}
                                        />
                                    </th>
                                    <th className="px-3 py-2 border-b text-center w-10">No</th>
                                    <th className="px-3 py-2 border-b">No. Induk (Siswa/Mahasiswa)</th>
                                    <th className="px-3 py-2 border-b">Nama</th>
                                    <th className="px-3 py-2 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingPelajar ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : pelajar.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    pelajar.map((item, index) => (
                                        <tr key={item.biodata_id || index} className="hover:bg-gray-50 text-center">
                                            <td className="px-3 py-2 border-b">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPelajarBiodataIds.includes(item.biodata_id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        if (checked) {
                                                            setSelectedPelajarBiodataIds((prev) => {
                                                                const newSelected = [...prev, item.biodata_id];
                                                                if (newSelected.length === pelajar.length) {
                                                                    setIsAllSelectedPelajar(true);
                                                                }
                                                                return newSelected;
                                                            });
                                                        } else {
                                                            setSelectedPelajarBiodataIds((prev) => {
                                                                const newSelected = prev.filter((biodata_id) => biodata_id !== item.biodata_id);
                                                                setIsAllSelectedPelajar(false);
                                                                return newSelected;
                                                            });
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.no_induk}</td>
                                            <td className="px-3 py-2 border-b text-left">{item.nama}</td>
                                            <td className="px-3 py-2 border-b">
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status === "aktif"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.status === "aktif" ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </DoubleScrollbarTable>
                )}
            </div>

            {/* RIGHT SIDE - FORM TUJUAN */}
            <form
                onSubmit={handleSubmit}
                className="w-full lg:w-3/11 bg-white p-6 rounded-lg shadow-md flex flex-col justify-between gap-4 lg:sticky lg:top-1/2 self-start transform lg:-translate-y-1/2 z-10"
            >

                <button
                    type="submit"
                    onClick={() => setSubmitAction("proses")}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-6 py-3 rounded transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                    Proses Lulus
                    <FontAwesomeIcon icon={isMobile ? faArrowUp : faArrowRight} />
                </button>

                <button
                    type="submit"
                    onClick={() => setSubmitAction("batal")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={isMobile ? faArrowDown : faArrowLeft} />
                    Batal Lulus
                </button>
            </form>


            <div className="w-full lg:w-4/11 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold">Alumni Pelajar</h2>
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
                        filterOptions={updatedFilterLembagaFilterLulus}
                        onChange={handleFilterChangeLembagaFilterLulus}
                        selectedFilters={selectedLembagaFilterLulus}
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
                    <DoubleScrollbarTable>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-3 py-2 border-b text-center w-10">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelectedLulus}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setIsAllSelectedLulus(checked);
                                                if (checked) {
                                                    // Centang semua, isi selectedSantriIds dengan semua id dari pelajar
                                                    setSelectedLulusBiodataIds(dataLulus.map((item) => item.biodata_id));
                                                } else {
                                                    // Hilangkan semua centang
                                                    setSelectedLulusBiodataIds([]);
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
                                                    checked={selectedLulusBiodataIds.includes(item.biodata_id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        if (checked) {
                                                            setSelectedLulusBiodataIds((prev) => {
                                                                const newSelected = [...prev, item.biodata_id];
                                                                if (newSelected.length === pelajar.length) {
                                                                    setIsAllSelectedLulus(true);
                                                                }
                                                                return newSelected;
                                                            });
                                                        } else {
                                                            setSelectedLulusBiodataIds((prev) => {
                                                                const newSelected = prev.filter((biodata_id) => biodata_id !== item.biodata_id);
                                                                setIsAllSelectedLulus(false);
                                                                return newSelected;
                                                            });
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b text-left">{item.no_induk}</td>
                                            <td className="px-3 py-2 border-b text-left">{item.nama}</td>
                                            <td className="px-3 py-2 border-b">
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status === "lulus"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.status === "lulus" ? "Lulus" : "-"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </DoubleScrollbarTable>
                )}
            </div>
        </div>
    );
};

export default Kelulusan;
