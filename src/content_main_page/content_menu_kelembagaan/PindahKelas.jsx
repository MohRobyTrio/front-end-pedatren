import { useEffect, useState } from "react";
import useFetchPelajar from "../../hooks/hooks_menu_data_pokok/hooks_sub_menu_peserta_didik/Pelajar";
import { OrbitProgress } from "react-loading-indicators";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../hooks/config";

const Filters = ({ filterOptions, onChange, selectedFilters, vertical = false }) => {
    return (
        <>
            {Object.entries(filterOptions).map(([label, options], index) => (
                <div
                    key={`${label}-${index}`}
                    className={`mb-4 ${vertical ? "w-full" : "w-full px-2 sm:w-1/2 md:w-1/3 lg:w-1/4"}`}
                >
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
        </>
    );
};

const PindahKelas = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [selectedSantriIds, setSelectedSantriIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [filters, setFilters] = useState({
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
    })

    useEffect(() => {
        console.log(selectedSantriIds);
    }, [selectedSantriIds])

    const {
        filterLembaga: filterLembagaFilter,
        handleFilterChangeLembaga: handleFilterChangeLembagaFilter,
        selectedLembaga: selectedLembagaFilter,
    } = DropdownLembaga();

    // untuk form tujuan
    const {
        filterLembaga: filterLembagaTujuan,
        handleFilterChangeLembaga: handleFilterChangeLembagaTujuan,
        selectedLembaga: selectedLembagaTujuan,
    } = DropdownLembaga();
    const { pelajar, loadingPelajar, error, setLimit, totalDataPelajar, fetchData } = useFetchPelajar(filters);

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

    const updatedFilterLembagaTujuan = {
        lembaga: updateFirstOptionLabel(filterLembagaTujuan.lembaga, "-- Pilih Lembaga --"),
        jurusan: updateFirstOptionLabel(filterLembagaTujuan.jurusan, "-- Pilih Jurusan --"),
        kelas: updateFirstOptionLabel(filterLembagaTujuan.kelas, "-- Pilih Kelas --"),
        rombel: updateFirstOptionLabel(filterLembagaTujuan.rombel, "-- Pilih rombel --"),
    };

    const lembagaTerpilih = filterLembagaFilter.lembaga.find((n) => n.value == selectedLembagaFilter.lembaga)?.label || "";
    const jurusanTerpilih = filterLembagaFilter.jurusan.find((n) => n.value == selectedLembagaFilter.jurusan)?.label || "";
    const kelasTerpilih = filterLembagaFilter.kelas.find((n) => n.value == selectedLembagaFilter.kelas)?.label || "";
    const rombelTerpilih = filterLembagaFilter.rombel.find((n) => n.value == selectedLembagaFilter.rombel)?.label || "";

    useEffect(() => {
        if (lembagaTerpilih || jurusanTerpilih || kelasTerpilih || rombelTerpilih) {
            setFilters({
                lembaga: lembagaTerpilih,
                jurusan: jurusanTerpilih,
                kelas: kelasTerpilih,
                rombel: rombelTerpilih,
            });
        }
    }, [lembagaTerpilih, jurusanTerpilih, kelasTerpilih, rombelTerpilih]);

    useEffect(() => {
        if (totalDataPelajar && totalDataPelajar != 0) setLimit(totalDataPelajar);
    }, [setLimit, totalDataPelajar]);

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
            santri_id: selectedSantriIds,
            lembaga_id: selectedLembagaTujuan.lembaga,
            jurusan_id: selectedLembagaTujuan.jurusan,
            kelas_id: selectedLembagaTujuan.kelas,
            rombel_id: selectedLembagaTujuan.rombel,
        };

        try {
            Swal.fire({
                title: 'Mohon tunggu...',
                html: 'Sedang memproses perpindahan.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(`${API_BASE_URL}fitur/pindah-naik-jenjang`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
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
                text: "Pindah kelas berhasil diproses!",
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
        <div className="flex flex-col lg:flex-row gap-6 pl-6 pt-6 pb-6">
            {/* LEFT SIDE - FILTER + TABLE */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4">Daftar Siswa</h2>

                <div className="flex flex-wrap w-full mb-4">
                    <Filters
                        filterOptions={updatedFilterLembagaFilter}
                        onChange={handleFilterChangeLembagaFilter}
                        selectedFilters={selectedLembagaFilter}
                    />
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
                                                setSelectedSantriIds(pelajar.map((item) => item.biodata_id));
                                            } else {
                                                // Hilangkan semua centang
                                                setSelectedSantriIds([]);
                                            }
                                        }}
                                    />
                                </th>
                                <th className="px-3 py-2 border-b text-center w-10">No</th>
                                <th className="px-3 py-2 border-b">No. Induk (Siswa/Mahasiswa)</th>
                                <th className="px-3 py-2 border-b">Nama</th>
                                <th className="px-3 py-2 border-b">Kelas</th>
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
                                    <tr key={item.id} className="hover:bg-gray-50 text-center">
                                        <td className="px-3 py-2 border-b">
                                            <input
                                                type="checkbox"
                                                checked={selectedSantriIds.includes(item.biodata_id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    if (checked) {
                                                        setSelectedSantriIds((prev) => {
                                                            const newSelected = [...prev, item.biodata_id];
                                                            if (newSelected.length === pelajar.length) {
                                                                setIsAllSelected(true);
                                                            }
                                                            return newSelected;
                                                        });
                                                    } else {
                                                        setSelectedSantriIds((prev) => {
                                                            const newSelected = prev.filter((biodata_id) => biodata_id !== item.biodata_id);
                                                            setIsAllSelected(false);
                                                            return newSelected;
                                                        });
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="px-3 py-2 border-b">{index + 1}</td>
                                        <td className="px-3 py-2 border-b">{item.no_induk}</td>
                                        <td className="px-3 py-2 border-b text-left">{item.nama}</td>
                                        <td className="px-3 py-2 border-b">{item.kelas}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* RIGHT SIDE - FORM TUJUAN */}
            <form onSubmit={handleSubmit}>
                <div className="w-full lg:w-[350px] bg-white p-6 rounded-lg shadow-md flex flex-col justify-between self-start">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Pindahkan ke</h2>

                        <div className="flex flex-wrap w-full mb-4">
                            <Filters
                                filterOptions={updatedFilterLembagaTujuan}
                                onChange={handleFilterChangeLembagaTujuan}
                                selectedFilters={selectedLembagaTujuan}
                                vertical={true}
                            />
                        </div>
                    </div>

                    <button type="submit" className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition duration-200">
                        Proses Pindah
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PindahKelas;
