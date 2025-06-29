import { useEffect, useMemo, useState } from "react";
import useFetchAfektif from "../../hooks/hook_menu_kepesantrenan/catatan_afektif";
import SantriAfektifCard from "../../components/catatanCard";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { OrbitProgress } from "react-loading-indicators";
import Pagination from "../../components/Pagination";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import { API_BASE_URL } from "../../hooks/config";
import { FaPlus } from "react-icons/fa";
import { ModalAddProgressAfektif } from "../../components/modal/ModalFormCatatan";
import Access from "../../components/Access";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";

const CatatanAfektif = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        wilayah: "",
        blok: "",
        kamar: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        jenisKelamin: "",
        kategori: "",
        nilai: "",
        periode: ""
    });

    // Menggunakan custom hooks untuk dropdown
    useEffect(() => {
        const fetchPeriode = async () => {
            try {
                const token = sessionStorage.getItem("token") || getCookie("token");
                const response = await fetch(`${API_BASE_URL}dropdown/periode`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

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
                const data = await response.json();

                // Ambil hanya bagian afektif dari respons API
                const afektifData = data.afektif;

                // Tambahkan pilihan "Semua Periode" sebagai pilihan pertama
                const formatted = [
                    { label: "Semua Periode", value: "" },
                    ...afektifData.map((item) => ({
                        label: item,
                        value: item,
                    })),
                ];

                setListPeriode(formatted);
            } catch (error) {
                console.error("Gagal mengambil data periode:", error);
            } finally {
                // setLoadingPeriode(false);
            }
        };

        fetchPeriode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [listPeriode, setListPeriode] = useState([]);
    // const [loadingPeriode, setLoadingPeriode] = useState(true);

    const { filterNegara, selectedNegara, handleFilterChangeNegara } = DropdownNegara();
    const { filterWilayah, selectedWilayah, handleFilterChangeWilayah } = DropdownWilayah();
    const { filterLembaga, selectedLembaga, handleFilterChangeLembaga } = DropdownLembaga();

    const negaraTerpilih = filterNegara.negara.find(n => n.value == selectedNegara.negara)?.label || "";
    const provinsiTerpilih = filterNegara.provinsi.find(p => p.value == selectedNegara.provinsi)?.label || "";
    const kabupatenTerpilih = filterNegara.kabupaten.find(k => k.value == selectedNegara.kabupaten)?.label || "";
    const kecamatanTerpilih = filterNegara.kecamatan.find(kec => kec.value == selectedNegara.kecamatan)?.label || "";

    const wilayahTerpilih = filterWilayah.wilayah.find(n => n.value == selectedWilayah.wilayah)?.nama || "";
    const blokTerpilih = filterWilayah.blok.find(p => p.value == selectedWilayah.blok)?.label || "";
    const kamarTerpilih = filterWilayah.kamar.find(k => k.value == selectedWilayah.kamar)?.label || "";

    const lembagaTerpilih = filterLembaga.lembaga.find(n => n.value == selectedLembaga.lembaga)?.label || "";
    const jurusanTerpilih = filterLembaga.jurusan.find(n => n.value == selectedLembaga.jurusan)?.label || "";
    const kelasTerpilih = filterLembaga.kelas.find(n => n.value == selectedLembaga.kelas)?.label || "";
    const rombelTerpilih = filterLembaga.rombel.find(n => n.value == selectedLembaga.rombel)?.label || "";

    const updatedFilters = useMemo(() => ({
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
    }), [
        filters,
        negaraTerpilih, provinsiTerpilih, kabupatenTerpilih, kecamatanTerpilih,
        wilayahTerpilih, blokTerpilih, kamarTerpilih,
        lembagaTerpilih, jurusanTerpilih, kelasTerpilih, rombelTerpilih
    ]);

    // const [page, setPage] = useState(1);

    const {
        data,
        loading,
        error,
        limit,
        setLimit,
        totalData,
        totalPages,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        fetchData
    } = useFetchAfektif(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);

    const filter3 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        kategori: [
            { label: "Semua Materi", value: "" },
            { label: "Akhlak", value: "akhlak" },
            { label: "Kebersihan", value: "kebersihan" },
            { label: "Kepedulian", value: "kepedulian" }
        ],
        nilai: [
            { label: "Semua Score", value: "" },
            { label: "Score A", value: "A" },
            { label: "Score B", value: "B" },
            { label: "Score C", value: "C" },
            { label: "Score D", value: "D" },
            { label: "Score E", value: "E" }
        ],
        periode: listPeriode
    }

    // Fetch data saat filter/page berubah
    // useEffect(() => {
    //     fetchData(updatedFilters, page);
    // }, [updatedFilters, page, fetchData]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const [showFormModal, setShowFormModal] = useState(false);

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Catatan Afektif</h1>
                <div className="flex items-center space-x-2">
                    <Access action="tambah">
                        <button onClick={() => setShowFormModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah</button>
                    </Access>
                </div>
            </div>

            {showFormModal && (
                <ModalAddProgressAfektif isOpen={showFormModal} onClose={() => setShowFormModal(false)} refetchData={fetchData} />
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
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
                        filterOptions={{
                            ...filter3,
                            nilai: filters.kategori
                                ? filter3.nilai
                                : [{ label: "Semua Score", value: "", disabled: true }],
                            periode: filter3.periode
                        }}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />
                </div>

                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalData={totalData}
                    limit={limit}
                    toggleLimit={(e) => setLimit(Number(e.target.value))}
                    // totalFiltered={groupedData.length}
                    toggleFilters={() => setShowFilters(!showFilters)}
                    showViewButtons={false}
                />

                <div>
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                            Error: {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {loading ? (
                            <div className="col-span-3 flex justify-center items-center">
                                <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                            </div>
                        ) : data.length > 0 ? (
                            <SantriAfektifCard santri={data} menu={19} fetchData={fetchData} label="afektif" />
                        ) : (
                            <p className="text-center py-8 text-gray-500">Tidak ada data</p>
                        )}
                    </div>
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default CatatanAfektif;