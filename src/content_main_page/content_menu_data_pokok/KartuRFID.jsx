import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useMemo, useState } from "react";
// import useFetchGolongan from "../../hooks/hooks_menu_kepegawaian/KartuRFID";
// import ModalAddOrEditGolongan from "../../components/modal/modal_kelembagaan/ModalFormGolongan";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate } from "react-router-dom";
import useFetchKartuRFID from "../../hooks/hooks_menu_data_pokok/KartuRFID";
import { ModalAddKartuRFID, ModalDetailTransaksiSantri } from "../../components/modal/ModalFormKartuRFID";
import Filters from "../../components/Filters";
import SearchBar from "../../components/SearchBar";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import DropdownAngkatan from "../../hooks/hook_dropdown/DropdownAngkatan";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import Pagination from "../../components/Pagination";


const KartuRFID = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [idSantri, setIdSantri] = useState(null);
    const [kartuData, setKartuData] = useState("");
    const [feature, setFeature] = useState("");
    const { menuAngkatanPelajar, menuAngkatanSantri } = DropdownAngkatan();
    const [filters, setFilters] = useState({
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wilayah: "",
        search: "",
    });

    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    // Dropdown hooks
    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga()


    const negaraTerpilih = filterNegara.negara.find((n) => n.value == selectedNegara.negara)?.label || ""
    const provinsiTerpilih = filterNegara.provinsi.find((p) => p.value == selectedNegara.provinsi)?.label || ""
    const kabupatenTerpilih = filterNegara.kabupaten.find((k) => k.value == selectedNegara.kabupaten)?.label || ""
    const kecamatanTerpilih = filterNegara.kecamatan.find((kec) => kec.value == selectedNegara.kecamatan)?.label || ""

    const wilayahTerpilih = filterWilayah.wilayah.find((n) => n.value == selectedWilayah.wilayah)?.nama || ""
    const blokTerpilih = filterWilayah.blok.find((p) => p.value == selectedWilayah.blok)?.label || ""
    const kamarTerpilih = filterWilayah.kamar.find((k) => k.value == selectedWilayah.kamar)?.label || ""

    const lembagaTerpilih = filterLembaga.lembaga.find((n) => n.value == selectedLembaga.lembaga)?.label || ""
    const jurusanTerpilih = filterLembaga.jurusan.find((n) => n.value == selectedLembaga.jurusan)?.label || ""
    const kelasTerpilih = filterLembaga.kelas.find((n) => n.value == selectedLembaga.kelas)?.label || ""
    const rombelTerpilih = filterLembaga.rombel.find((n) => n.value == selectedLembaga.rombel)?.label || ""

    const updatedFilters = useMemo(
        () => ({
            ...filters,
            negara: negaraTerpilih,
            provinsi: provinsiTerpilih,
            kabupaten: kabupatenTerpilih,
            kecamatan: kecamatanTerpilih,
            wilayah: wilayahTerpilih,
            blok: blokTerpilih,
            kamar: kamarTerpilih,
            lembaga: lembagaTerpilih,
            jurusan: jurusanTerpilih,
            kelas: kelasTerpilih,
            rombel: rombelTerpilih,
        }),
        [
            blokTerpilih,
            filters,
            jurusanTerpilih,
            kabupatenTerpilih,
            kamarTerpilih,
            kecamatanTerpilih,
            kelasTerpilih,
            lembagaTerpilih,
            negaraTerpilih,
            provinsiTerpilih,
            rombelTerpilih,
            wilayahTerpilih,
        ],
    )
    const {
        karturfid,
        loadingKartuRFID,
        error,
        fetchKartuRFID,
        handleDelete,
        searchTerm,
        setSearchTerm,
        limit,
        setLimit,
        totalDataKartuRFID,
        totalPages,
        currentPage,
        setCurrentPage,
    } = useFetchKartuRFID(updatedFilters);
    const [showFilters, setShowFilters] = useState(false)


    // Untuk searchbar
    // const handleSearchChange = (term) => {
    //     setFilters((prev) => ({ ...prev, search: term }));
    //     setSearchTerm(term);
    // };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter4 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" },
        ],
        status: [
            { label: "Semua Status", value: "" },
            { label: "Santri", value: "santri" },
            { label: "Santri Non Pelajar", value: "santri non pelajar" },
            { label: "Pelajar", value: "pelajar" },
            { label: "Pelajar Non Santri", value: "pelajar non santri" },
            { label: "Santri-Pelajar/Pelajar-Santri", value: "santri-pelajar" },
            // { label: "Santri Sekaligus Pelajar", value: "" },
        ],
        angkatanPelajar: updateFirstOptionLabel(menuAngkatanPelajar, "Semua Angkatan Pelajar"),
        angkatanSantri: updateFirstOptionLabel(menuAngkatanSantri, "Semua Angkatan Santri"),
    }

    const filter5 = {
        wargaPesantren: [
            { label: "Warga Pesantren", value: "" },
            { label: "Memiliki NIUP", value: "memiliki niup" },
            { label: "Tanpa NIUP", value: "tanpa niup" },
        ],
        urutBerdasarkan: [
            { label: "Urut Berdasarkan", value: "" },
            { label: "Nama", value: "nama" },
            { label: "NIUP", value: "niup" },
            { label: "Angkatan", value: "angkatan" },
            { label: "Jenis Kelamin", value: "jenis kelamin" },
            { label: "Tempat Lahir", value: "tempat lahir" },
        ],
        urutSecara: [
            { label: "Urut Secara", value: "" },
            { label: "A-Z / 0-9 (Ascending)", value: "asc" },
            { label: "Z-A / 9-0 (Descending)", value: "desc" },
        ],
        phoneNumber: [
            { label: "Phone Number", value: "" },
            { label: "Memiliki Phone Number", value: "memiliki phone number" },
            { label: "Tidak Ada Phone Number", value: "tidak ada phone number" },
        ],
    }

    const filter6 = {}

    if (!hasAccess("karturfid")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Kartu RFID</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={() => {
                        setFeature(1);
                        setKartuData(null);
                        setOpenModal(true);
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Filter Section */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ${showFilters ? "mb-4" : ""}`}>
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterNegara}
                        onChange={handleFilterChangeNegara}
                        selectedFilters={selectedNegara}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterWilayah}
                        onChange={handleFilterChangeWilayah}
                        selectedFilters={selectedWilayah}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filterLembaga}
                        onChange={handleFilterChangeLembaga}
                        selectedFilters={selectedLembaga}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filter4}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filter5}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filter6}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />
                </div>

                {/* SearchBar Section */}
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalDataKartuRFID}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    onRefresh={() => fetchKartuRFID(true)}
                    loadingRefresh={loadingKartuRFID}
                />

                <ModalAddKartuRFID
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    refetchData={fetchKartuRFID}
                    data={kartuData}
                    feature={feature}
                />

                <ModalDetailTransaksiSantri
                    isOpen={openDetailModal}
                    onClose={() => setOpenDetailModal(false)}
                    id={idSantri}
                />

                {error ? (
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
                                    <th className="px-3 py-2 border-b">Nama Santri</th>
                                    <th className="px-3 py-2 border-b">NIS</th>
                                    <th className="px-3 py-2 border-b">UID Kartu</th>
                                    <th className="px-3 py-2 border-b">Status</th>
                                    <th className="px-3 py-2 border-b">Tanggal Terbit</th>
                                    <th className="px-3 py-2 border-b">Tanggal Kadaluarsa</th>
                                    <th className="px-3 py-2 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {loadingKartuRFID ? (
                                    <tr>
                                        <td colSpan="8" className="text-center p-4">
                                            <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                        </td>
                                    </tr>
                                ) : karturfid.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-6">Tidak ada data</td>
                                    </tr>
                                ) : (
                                    karturfid.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left" onClick={() => {
                                            setIdSantri(item.santri_id);
                                            setOpenDetailModal(true);
                                        }}>
                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                            <td className="px-3 py-2 border-b">{item.nama}</td>
                                            <td className="px-3 py-2 border-b">{item.nis}</td>
                                            <td className="px-3 py-2 border-b">{item.uid_kartu}</td>
                                            <td className="px-3 py-2 border-b w-30">
                                                <span
                                                    className={`text-sm font-semibold px-3 py-1 rounded-full ${item.aktif
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.aktif ? "Aktif" : "Nonaktif"}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 border-b">{item.tanggal_terbit}</td>
                                            <td className="px-3 py-2 border-b">{item.tanggal_expired}</td>
                                            <td className="px-3 py-2 border-b text-center space-x-2 w-20">
                                                <button
                                                    onClick={() => {
                                                        setKartuData(item);
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
                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                )}
            </div>
        </div>
    );
};

export default KartuRFID;