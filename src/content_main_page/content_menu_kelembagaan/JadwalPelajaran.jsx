import { OrbitProgress } from "react-loading-indicators";
import { FaPlus } from "react-icons/fa";
import useFetchJadwalPelajaran from "../../hooks/hooks_menu_kelembagaan/JadwalPelajaran";
import { useEffect, useState } from "react";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import DropdownSemester from "../../hooks/hook_dropdown/DropdownSemester";
import { ModalAddJadwalPelajaranFormulir, ModalAddOrEditJadwalPelajaran } from "../../components/modal/modal_kelembagaan/ModalFormJadwalPelajaran";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCalendar, faClock, faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../hooks/config";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";

const getPreviousKey = (key) => {
    const order = ["lembaga", "jurusan", "kelas", "rombel"];
    const index = order.indexOf(key);
    return index > 0 ? `${order[index - 1]}_id` : null;
};

const Filters = ({ filterOptions, onChange, selectedFilters, filters }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(filterOptions).map(([label, options], index) => {
                // Tampilkan 'lembaga' selalu, lainnya hanya jika filter sebelumnya terisi
                const prevKey = getPreviousKey(label);
                const showField = label === "lembaga" || (prevKey && filters[prevKey]);
                if (!showField) return null;

                return (
                    <div key={`${label}-${index}`} className="w-full">
                        <select
                            className={`w-full border border-gray-300 rounded p-2 ${options.length <= 1 ? "bg-gray-200 text-gray-500" : ""
                                }`}
                            onChange={(e) => onChange({ [label]: e.target.value })}
                            value={selectedFilters[label] || ""}
                            disabled={options.length <= 1}
                        >
                            {options.map((option, idx) => (
                                <option key={idx} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            })}
        </div>
    );
};

const JadwalPelajaran = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [filters, setFilters] = useState({
        lembaga_id: "",
        jurusan_id: "",
        kelas_id: "",
        rombel_id: "",
        semester_id: "",
        hari: "",
    })
    const [form, setForm] = useState({ hari: '', mata_pelajaran: '', jam_pelajaran: '' });
    const { jadwalPelajaran, loadingJadwalPelajaran, error, fetchJadwalPelajaran, handleDelete } = useFetchJadwalPelajaran(filters);
    const { menuSemester } = DropdownSemester();
    const [showAddMateriModal, setShowAddMateriModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const {
        filterLembaga: filterLembagaFilter,
        handleFilterChangeLembaga: handleFilterChangeLembagaFilter,
        selectedLembaga: selectedLembagaFilter,
    } = DropdownLembaga();

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

    useEffect(() => {
        console.log("lembaga", selectedLembagaFilter.lembaga);
        if (selectedLembagaFilter.lembaga === "") {
            if (selectedLembagaFilter.jurusan !== "") {
                handleFilterChangeLembagaFilter({ jurusan: "" });
            }
            if (selectedLembagaFilter.kelas !== "") {
                handleFilterChangeLembagaFilter({ kelas: "" });
            }
            if (selectedLembagaFilter.rombel !== "") {
                handleFilterChangeLembagaFilter({ rombel: "" });
            }
            console.log("clean");

            setFilters((prevFilters) => ({
                ...prevFilters,
                semester_id: "",
                hari: ""
            }));

        }

        setFilters({
            lembaga_id: selectedLembagaFilter.lembaga,
            jurusan_id: selectedLembagaFilter.jurusan,
            kelas_id: selectedLembagaFilter.kelas,
            rombel_id: selectedLembagaFilter.rombel,
            semester_id: filters.rombel_id ? "" : filters.semester_id
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLembagaFilter]);

    useEffect(() => {
        console.log(filters);
    }, [filters]);

    const shouldFetch = filters.lembaga_id != "" && filters.jurusan_id != "" && filters.kelas_id != "" && filters.rombel_id != "" && filters.semester_id != "";

    const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

    const formatTime = (time) => {
        return time.slice(0, 5) // Remove seconds
    }

    const getSubjectColor = (index) => {
        const colors = [
            "bg-blue-100 border-blue-300 text-blue-800",
            "bg-green-100 border-green-300 text-green-800",
            "bg-purple-100 border-purple-300 text-purple-800",
            "bg-orange-100 border-orange-300 text-orange-800",
            "bg-pink-100 border-pink-300 text-pink-800",
            "bg-indigo-100 border-indigo-300 text-indigo-800",
            "bg-yellow-100 border-yellow-300 text-yellow-800",
        ]
        return colors[index % colors.length]
    }

    const closeAddMateriModal = () => {
        setShowAddMateriModal(false);
    };

    const openAddMateriModal = () => {
        setShowAddMateriModal(true);
    };

    const fetchDetailJadwal = async (id) => {
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
            const response = await fetch(`${API_BASE_URL}crud/jadwal-pelajaran/${id}`);
            const result = await response.json();
            const data = result.data;

            setForm({
                hari: data.hari || '',
                mata_pelajaran: data.mata_pelajaran_id?.toString() || '',
                jam_pelajaran: data.jam_pelajaran_id?.toString() || '',
            });
        } catch (error) {
            console.error("Gagal mengambil data jadwal:", error);
        } finally {
            Swal.close();
        }
    };

    const handleUpdate = async () => {

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        const payload = {
            hari: form.hari,
            mata_pelajaran_id: form.mata_pelajaran,
            jam_pelajaran_id: form.jam_pelajaran
        };

        console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

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
            const token = sessionStorage.getItem("token") || getCookie("token");
            const response = await fetch(
                `${API_BASE_URL}crud/jadwal-pelajaran/${selectedId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                }
            );
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
            console.log(`${API_BASE_URL}crud/jadwal-pelajaran/${selectedId}`);
            const result = await response.json();
            console.log(result);

            if (response.ok) {
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: result.message || "Data berhasil diperbarui.",
                });
                closeAddMateriModal();
                fetchJadwalPelajaran();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal Memperbarui",
                    text: result.message || "Terjadi kesalahan saat memperbarui data.",
                });
            }
        } catch (error) {
            console.error("Error saat update:", error);
            await Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: "Gagal menghubungi server. Silakan coba lagi.",
            });
        }
    };

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Jadwal Pelajaran</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditJadwalPelajaran isOpen={openModal} onClose={() => setOpenModal(false)} refetchData={fetchJadwalPelajaran} />

            <ModalAddJadwalPelajaranFormulir isOpen={showAddMateriModal} onClose={closeAddMateriModal} handleAdd={handleUpdate} form={form} handleChange={handleChange} feature={2} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-full mb-4">
                    {/* Bungkus pakai grid 2 kolom saat lg, stacked saat <lg */}
                    <div className="grid grid-cols-1 gap-4">

                        {/* Filters */}
                        <div className="w-full">
                            <Filters
                                filterOptions={updatedFilterLembagaFilter}
                                onChange={handleFilterChangeLembagaFilter}
                                selectedFilters={selectedLembagaFilter}
                                filters={filters}
                            />
                        </div>

                        {/* Sort */}
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filters.rombel_id && (
                                    <div className="w-full">
                                        <select
                                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 capitalize"
                                            value={filters.semester_id || ""}
                                            onChange={(e) => setFilters({ ...filters, semester_id: e.target.value })}
                                            required
                                        >
                                            {menuSemester.map((urut, idx) => (
                                                <option key={idx} value={urut.value}>
                                                    {urut.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {/* {filters.semester_id && (
                                    <div className="w-full">
                                        <select
                                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 capitalize"
                                            value={filters.hari || ""}
                                            onChange={(e) => setFilters({ ...filters, hari: e.target.value })}
                                            required
                                        >
                                            <option value="">Pilih Hari</option>
                                            <option value="Senin">Senin</option>
                                            <option value="Selasa">Selasa</option>
                                            <option value="Rabu">Rabu</option>
                                            <option value="Kamis">Kamis</option>
                                            <option value="Jumat">Jumat</option>
                                            <option value="Sabtu">Sabtu</option>
                                            <option value="Minggu">Minggu</option>
                                        </select>
                                    </div>
                                )} */}
                            </div>
                        </div>

                    </div>
                </div>
                {!shouldFetch ? (

                    <div className="text-center py-6 text-gray-500 italic">Silakan pilih dropdown di atas terlebih dahulu.</div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-600 font-semibold mb-4">Terjadi kesalahan saat mengambil data.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Muat Ulang
                        </button>
                    </div>
                ) : loadingJadwalPelajaran ? (
                    <div className="col-span-3 flex justify-center items-center">
                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                    </div>
                ) : !jadwalPelajaran?.meta || !jadwalPelajaran?.data || Object.keys(jadwalPelajaran.data).length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic">
                        Tidak ada jadwal yang tersedia.
                    </div>
                ) : (
                    <div className="w-full mt-8">
                        {/* Header Information */}
                        <div className="bg-white rounded-lg shadow-lg drop-shadow p-6 mb-8">
                            {jadwalPelajaran?.meta && (
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{jadwalPelajaran.meta.lembaga}</h1>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faBook} className="w-4 h-4" />
                                                <span>{jadwalPelajaran.meta.jurusan}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                                                <span>
                                                    Kelas {jadwalPelajaran.meta.kelas} - {jadwalPelajaran.meta.rombel}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                                                <span>{jadwalPelajaran.meta.semester}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Schedule Grid */}
                        <div className="bg-white rounded-lg shadow-lg drop-shadow overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">Jadwal Pelajaran</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-1 p-1">
                                {daysOfWeek.map((day, dayIndex) => (
                                    <div key={`${day}-${dayIndex}`} className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                                        <div className="text-center mb-4">
                                            <h3 className="font-semibold text-lg text-gray-800 bg-white rounded-full py-2 px-4 shadow-sm">
                                                {day}
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            {jadwalPelajaran.data[day] ? (
                                                jadwalPelajaran.data[day]
                                                    .sort((a, b) => a.jam_ke - b.jam_ke)
                                                    .map((item, index) => (
                                                        <div
                                                            key={item.id}
                                                            className={`rounded-lg border-2 p-3 ${getSubjectColor(index)} transition-all duration-200 hover:shadow-md group relative`}
                                                        >
                                                            {/* Action Buttons */}
                                                            <div className="absolute top-2 right-2 flex gap-1">
                                                                <button
                                                                    onClick={async () => {
                                                                        setSelectedId(item.id)
                                                                        await fetchDetailJadwal(item.id);
                                                                        openAddMateriModal();
                                                                    }}
                                                                    className="p-1 bg-white rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                                                                    title="Edit Jadwal"
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} className="w-6 h-3" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="p-1 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                                                                    title="Hapus Jadwal"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} className="w-6 h-3" />
                                                                </button>
                                                            </div>

                                                            <div className="text-xs font-medium mb-1">Jam ke-{item.jam_ke}</div>
                                                            <div className="font-semibold text-sm mb-2 pr-8">{item.nama_mapel}</div>
                                                            <div className="text-xs space-y-1">
                                                                <div className="flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                                                                    <span className="truncate">{item.nama_pengajar}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                                                                    <span>
                                                                        {formatTime(item.jam_mulai)} - {formatTime(item.jam_selesai)}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs opacity-75">{item.kode_mapel}</div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="text-center text-gray-500 py-8">
                                                    <FontAwesomeIcon icon={faCalendar} className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">Tidak ada jadwal</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-8 bg-white rounded-lg shadow-lg drop-shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Jadwal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {Object.values(jadwalPelajaran.data).flat().length}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Mata Pelajaran</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{Object.keys(jadwalPelajaran.data).length}</div>
                                    <div className="text-sm text-gray-600">Hari Aktif</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {
                                            new Set(
                                                Object.values(jadwalPelajaran.data)
                                                    .flat()
                                                    .map((item) => item.nama_pengajar),
                                            ).size
                                        }
                                    </div>
                                    <div className="text-sm text-gray-600">Pengajar</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JadwalPelajaran;