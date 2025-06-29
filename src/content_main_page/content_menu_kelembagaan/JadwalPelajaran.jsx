import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import useFetchJadwalPelajaran from "../../hooks/hooks_menu_kelembagaan/JadwalPelajaran";
import { useEffect, useState } from "react";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import DropdownSemester from "../../hooks/hook_dropdown/DropdownSemester";
import { ModalAddOrEditJadwalPelajaran } from "../../components/modal/modal_kelembagaan/ModalFormJadwalPelajaran";

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
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState("");
    const [feature, setFeature] = useState("");
    const [filters, setFilters] = useState({
        lembaga_id: "",
        jurusan_id: "",
        kelas_id: "",
        rombel_id: "",
        semester_id: "",
        hari: "",
    })
    const { jadwalPelajaran, loadingJadwalPelajaran, error, fetchJadwalPelajaran, handleDelete } = useFetchJadwalPelajaran(filters);
    const { menuSemester } = DropdownSemester();

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

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Jadwal Pelajaran</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setData(null)
                        setFeature(1);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <ModalAddOrEditJadwalPelajaran isOpen={openModal} onClose={() => setOpenModal(false)} data={data} refetchData={fetchJadwalPelajaran} feature={feature} />

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
                ) : (
                    <DoubleScrollbarTable>
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                <tr>
                                    <th className="px-3 py-2 border-b w-10">#</th>
                                    <th className="px-3 py-2 border-b">Label</th>
                                    <th className="px-3 py-2 border-b">Jadwal Ke</th>
                                    <th className="px-3 py-2 border-b">Jadwal Mulai</th>
                                    <th className="px-3 py-2 border-b">Jadwal Selesai</th>
                                    <th className="px-3 py-2 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingJadwalPelajaran ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : jadwalPelajaran.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    jadwalPelajaran.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.label}</td>
                                            <td className="px-3 py-2 border-b">{item.jam_ke}</td>
                                            <td className="px-3 py-2 border-b">{item.jam_mulai}</td>
                                            <td className="px-3 py-2 border-b">{item.jam_selesai}</td>
                                            <td className="px-3 py-2 border-b text-center space-x-2 w-20">
                                                <button
                                                    onClick={() => {
                                                        setData(item);
                                                        setFeature(2);
                                                        setOpenModal(true);
                                                    }}
                                                    className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded cursor-pointer"
                                                >
                                                    <FaTrash />
                                                </button>
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

export default JadwalPelajaran;