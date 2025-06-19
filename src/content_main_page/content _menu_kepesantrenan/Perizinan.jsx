import { useEffect, useState, useMemo } from "react";
import useFetchPerizinan from "../../hooks/hook_menu_kepesantrenan/Perizinan";
import useApprovePerizinan from "../../hooks/hook_menu_kepesantrenan/approvePerizinan";
import SearchBar from "../../components/SearchBar";
import Filters from "../../components/Filters";
import { OrbitProgress } from "react-loading-indicators";
import blankProfile from "../../assets/blank_profile.png";
import Pagination from "../../components/Pagination";
import DropdownNegara from "../../hooks/hook_dropdown/DropdownNegara";
import DropdownWilayah from "../../hooks/hook_dropdown/DropdownWilayah";
import DropdownLembaga from "../../hooks/hook_dropdown/DropdownLembaga";
import ModalDetail from "../../components/modal/ModalDetail";
import { FaFileExport, FaPlus } from "react-icons/fa";
import { ModalAddPerizinan, ModalApprove } from "../../components/modal/ModalFormPerizinan";
import Access from "../../components/Access";
import { getRolesString } from "../../utils/getRolesString";
import { ModalExport } from "../../components/modal/ModalExport";
import { API_BASE_URL } from "../../hooks/config";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";


const DataPerizinan = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [openModalExport, setOpenModalExport] = useState(false);
    const [selectedName, setSelectedName] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feature, setFeature] = useState("");

    const capitalizeFirstLetter = getRolesString(); 
    console.log("Roles:", capitalizeFirstLetter);
    
    
    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };
    const [filters, setFilters] = useState({
        negara: "",
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        lembaga: "",
        jurusan: "",
        kelas: "",
        rombel: "",
        jenisKelamin: ""
    });

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
        fetchData,
        // filterOptions
    } = useFetchPerizinan(updatedFilters);

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchData(updatedFilters, filters);
    }, [updatedFilters, filters, fetchData]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filter3 = {
        jenisKelamin: [
            { label: "Pilih Jenis Kelamin", value: "" },
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" }
        ],
        bermalam: [
            { label: "Bermalam / Tidak Bermalam", value: "" },
            { label: "Bermalam", value: "bermalam" },
            { label: "Tidak Bermalam", value: "tidak bermalam" }
        ],
        jenis_izin: [
            { label: "Rombongan / Personal", value: "" },
            { label: "Rombongan", value: "rombongan" },
            { label: "Personal", value: "personal" }
        ],
        status: [
            { label: "Semua Status Izin", value: "" },
            { label: "Sedang Proses Izin", value: "sedang proses izin" },
            { label: "Perizinan Diterima", value: "perizinan diterima" },
            { label: "Sudah Berada Di Luar Pondok", value: "sudah berada diluar pondok" },
            { label: "Perizinan Ditolak", value: "perizinan ditolak" },
            { label: "Perizinan Dibatalkan", value: "dibatalkan" },
            { label: "Telat (sudah kembali)", value: "telat(sudah kembali)" },
            { label: "Telat (belum kembali)", value: "telat(belum kembali)" },
            { label: "Kembali Tepat Waktu", value: "kembali tepat waktu" }
        ]
    }

    const filter4 = {
        masa_telat: [
            { label: "Semua Masa Telat", value: "" },
            { label: "Lebih Dari 1 Minggu", value: "lebih dari seminggu" },
            { label: "Lebih Dari 2 Minggu", value: "lebih dari 2 minggu" },
            { label: "Lebih Dari 1 Bulan", value: "lebih dari satu bulan" }
        ]
    }

    const fieldsExports = [
        { label: "Wewenang", value: "" },
        // { label: "No. KK", value: "no_kk" },
        // { label: "NIK", value: "nik" },
        // { label: "NIUP", value: "niup" },
        // { label: "Nama", value: "nama" },
        // { label: "Tempat Tgl Lahir", value: "tempat_tanggal_lahir" },
        // { label: "Tanggal Lahir", value: "tanggal_lahir" },
        // { label: "Jenis Kelamin", value: "jenis_kelamin" },
        // { label: "Anak ke", value: "anak_ke" },
        // { label: "Jumlah Saudara", value: "jumlah_saudara" },
        // { label: "Alamat", value: "alamat" },
        // { label: "NIS", value: "nis" },
        // { label: "Domisili Santri", value: "domisili_santri" },
        // { label: "Angkatan Santri", value: "angkatan_santri" },
        // { label: "No Induk", value: "no_induk" },
        // { label: "Lembaga", value: "lembaga" },
        // { label: "Jurusan", value: "jurusan" },
        // { label: "Kelas", value: "kelas" },
        // { label: "Rombel", value: "rombel" },
        // { label: "Angkatan Pelajar", value: "angkatan_pelajar" },
        // { label: "Pendidikan", value: "pendidikan" },
        // { label: "Status", value: "status" },
        // { label: "Ibu Kandung", value: "ibu_kandung" },
        // { label: "Ayah Kandung", value: "ayah_kandung" }
    ];

    const [showFormModal, setShowFormModal] = useState(false);

    return (
        <div className="flex-1 pl-6 pt-6 pb-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Perizinan</h1>
                <div className="flex items-center space-x-2">
                    <Access action="tambah">
                        <button onClick={() => {
                            setFeature(1);
                            setShowFormModal(true);
                            }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2"><FaPlus />Tambah </button>
                    </Access>
                    <button
                        onClick={() => setOpenModalExport(true)}
                        // disabled={exportLoading}
                        className={`px-4 py-2 rounded flex items-center gap-2 text-white cursor-pointer bg-blue-500 hover:bg-blue-700`}
                    >
                        <FaFileExport />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <ModalAddPerizinan isOpen={showFormModal} onClose={() => setShowFormModal(false)} refetchData={fetchData} feature={feature} id={selectedId} nama={selectedName} />

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
                        filterOptions={filter3}
                        onChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
                        selectedFilters={filters}
                    />
                    <Filters
                        showFilters={showFilters}
                        filterOptions={filter4}
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
                            <div className="">
                                {data.map(perizinan => (
                                    <PerizinanCard key={perizinan.id} data={perizinan} openModal={openModal} setShowFormModal={setShowFormModal} setFeature={setFeature} setSelectedId={setSelectedId} setSelectedName={setSelectedName} refetchData={fetchData} userRole={capitalizeFirstLetter} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-8 text-gray-500">Tidak ada data perizinan</p>
                        )}
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    className="mt-6"
                />

                <ModalExport isOpen={openModalExport} onClose={() => setOpenModalExport(false)} filters={updatedFilters} searchTerm={searchTerm} limit={limit} currentPage={currentPage} fields={fieldsExports} endpoint="export/perizinan" /> 

                {isModalOpen && (
                    <ModalDetail
                        title="Perizinan"
                        menu={17}
                        item={selectedItem}
                        onClose={closeModal}
                    />
                )}
            </div>
        </div>
    );
};

// Komponen Card untuk Perizinan
const PerizinanCard = ({ data, openModal, setShowFormModal, setFeature, setSelectedId, setSelectedName, refetchData}) => {

    // Dapatkan role user dari sistem
    const userRole = getRolesString().toLowerCase();

    const { clearAuthData } = useLogout();
    const navigate = useNavigate();

    const { approvePerizinan, isApproving, error } = useApprovePerizinan();

    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approveError, setApproveError] = useState(null);

    // Cek apakah user dapat melakukan approval untuk role ini
    const canApprove = useMemo(() => {
        if (!userRole) return false;

        // Cek status approval berdasarkan role
        const approvalStatus = {
            biktren: !data.approved_by_biktren,
            kamtib: !data.approved_by_kamtib,
            pengasuh: !data.approved_by_pengasuh
        };

        return approvalStatus[userRole];
    }, [userRole, data]);

    // Handle proses approval
    const handleApprove = async () => {
        setApproveError(null);
        const success = await approvePerizinan(data.id, userRole);

        if (success) {
            setShowApproveModal(false);
            try {
                await refetchData(true); // Tambahkan await & try-catch
            } catch (err) {
                console.error("Gagal refetch:", err);
            }
        } else {
            setApproveError(error);
        }
    };

    console.log(refetchData);
    console.log("role user:", userRole);
    // console.log("approvalStatus:", approvalStatus);
    console.log("canApprove:", canApprove);
    console.log("data:", data);
    const token = sessionStorage.getItem("token") || getCookie("token");
    

    const handleSetKeluar = async (id) => {
        try {
            Swal.fire({
                title: "Mohon tunggu...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });
            const response = await fetch(`${API_BASE_URL}crud/${id}/perizinan/set-keluar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

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

            const result = await response.json();
            console.log(result);

            if (!("data" in result)) {
                await Swal.fire({
                    text: result.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }

            if (!response.ok) throw new Error(`Gagal set keluar (${response.status})`);

            
            Swal.fire("Berhasil!", "success");
            refetchData(true); // misalnya kamu punya fungsi untuk refresh data
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", err.message, "error");
        }
    };

    const handleSetKembali = async (id) => {
        try {
            Swal.fire({
                title: "Mohon tunggu...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });
            const response = await fetch(`${API_BASE_URL}crud/${id}/perizinan/set-kembali`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
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
            const result = await response.json();
            console.log(result);
            if (!("data" in result)) {
                await Swal.fire({
                    text: result.message,
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }
            if (!response.ok) throw new Error(`Gagal set kembali (${response.status})`);

            
            Swal.fire("Berhasil!", "success");
            refetchData(true); // misalnya kamu punya fungsi untuk refresh data
        } catch (err) {
            console.error(err);
            Swal.fire("Gagal", err.message, "error");
        }
    };

    return (
        <div key={data.id} className="max-w-6xl mx-auto cursor-pointer" onClick={() => openModal(data)}>
            <div className="bg-white rounded border border-gray-200 p-1 shadow-sm mb-4">
                <div className="flex justify-end space-x-1">
                    {/* Tombol Approve */}
                    {canApprove ? (
                        <Access action="approve">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowApproveModal(true);
                                }}
                                className="w-24 h-6 flex items-center gap-2 px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded shadow cursor-pointer"
                            >
                                <i className="fas fa-check-circle"></i>
                                <span>Approve</span>
                            </button>
                        </Access>
                    ) : (
                        <div className="w-24 h-6"></div> // Elemen kosong dengan ukuran tombol
                    )}
                    <Access action="edit">
                        {data.status == "perizinan diterima" ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Set status menjadi "Keluar" atau panggil fungsi yang sesuai
                                    handleSetKeluar(data.id);
                                }}
                                className="h-6 flex items-center gap-2 px-2 py-1 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded shadow cursor-pointer"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Keluar</span>
                            </button>
                        ) : data.status == "sudah berada diluar pondok" ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Set status menjadi "Kembali" atau panggil fungsi yang sesuai
                                    handleSetKembali(data.id);
                                }}
                                className="h-6 flex items-center gap-2 px-2 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded shadow cursor-pointer"
                            >
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Kembali</span>
                            </button>
                        ) : null}
                    </Access>

                    <Access action="edit">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setFeature(2);
                                setSelectedId(data.id);
                                setSelectedName(data.nama_santri);
                                setShowFormModal(true);
                            }}
                            className="w-20 h-6 flex items-center gap-2 px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow cursor-pointer"
                        >
                            <i className="fas fa-edit"></i>
                            <span>Edit</span>
                        </button>
                    </Access>
                </div>
               

                {/* Modal Approval */}
                <ModalApprove
                    isOpen={showApproveModal}
                    onClose={() => setShowApproveModal(false)}
                    onConfirm={handleApprove}
                    isLoading={isApproving}
                    roleName={userRole}
                />
                {approveError && (
                    <div className="mt-2 text-red-600 text-sm">
                        Error: {approveError}
                    </div>
                )}

                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Student Photo */}
                    <div className="md:w-1/7 mb-4 md:mb-0 flex item-center justify-center rounded-md">
                        <img
                            alt={data.nama_santri || "-"}
                            className="w-24 h-24 object-cover rounded-md"
                            src={data.foto_profil}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = blankProfile;
                            }}
                        />
                    </div>

                    {/* Middle Section - Student Details */}
                    <div className="md:w-3/5 p-1/5">
                        <div className="flex items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mr-2">{data.nama_santri}</h2>
                            <span className="text-blue-800">{data.jenis_kelamin === 'p' ? '♀' : '♂'}</span>
                        </div>

                        <div className="space-y-1/4">
                            <div className="flex">
                                <div className="w-24 text-gray-700">Domisili</div>
                                <div className="flex-1">
                                    <span className="text-gray-600">: {data.kamar} - {data.blok} - {data.wilayah}</span>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-24 text-gray-700">Lembaga</div>
                                <div className="flex-1">
                                    <span className="text-gray-600">: {data.lembaga}</span>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-24 text-gray-700">Alamat</div>
                                <div className="flex-1">
                                    <span className="text-gray-600">: {data.kecamatan} - Kab. {data.kabupaten}, {data.provinsi}</span>
                                </div>
                            </div>

                            <div className="flex mt-1">
                                <div className="w-24 font-medium text-gray-800">Alasan Izin</div>
                                <div className="flex-1">
                                    <span className="text-gray-800 font-medium">: {data.alasan_izin}</span>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-24 text-gray-700">Alamat Tujuan</div>
                                <div className="flex-1">
                                    <span className="text-gray-600">: {data.alamat_tujuan}</span>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-24 text-gray-700">Lama Izin</div>
                                <div className="flex-1">
                                    <div className="text-gray-600">: Sejak <span className="ml-8">{data.tanggal_mulai}</span></div>
                                    <div className="text-gray-600">&nbsp;&nbsp;Sampai <span className="ml-4">{data.tanggal_akhir}</span></div>
                                    <div className="text-gray-600">&nbsp;&nbsp;( {data.bermalam} | {data.lama_izin} )</div>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-24 text-gray-700">Jenis Izin</div>
                                <div className="flex-1">
                                    <span className="text-gray-600">: {data.jenis_izin}</span>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-24 text-gray-700">Status</div>
                                <div className="flex-1">
                                    <span className={`font-medium ${data.status === 'telat(sudah kembali)'
                                        ? 'text-red-600'
                                        : data.status === 'telat(belum kembali)'
                                            ? 'text-red-600'
                                            : 'text-blue-600'
                                        }`}>
                                        : {data.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Permission Details */}
                    <div className="md:w-2/5 md:pl-2 p-1/5 border-gray-200 mt-6 md:mt-0">
                    <br />
                    <br />
                        <div className="space-y-1/4">
                            <div className="flex">
                                <div className="w-32 text-gray-700">Pembuat Izin</div>
                                <div className="flex-1">
                                    <span className="text-gray-600">: {data.pembuat}</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-32 text-gray-700">Biktren</div>
                                <div className="flex-1 flex items-center">
                                    <span className="text-gray-600">: {data.nama_biktren}</span>
                                    {/* <span className="text-green-500 ml-2">✓</span> */}
                                </div>
                            </div>

                            <div className="flex">
                                <div className="w-32 text-gray-700">Pengasuh</div>
                                <div className="flex-1">
                                    <span className="text-gray-600">: {data.nama_pengasuh}</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-32 text-gray-700">Kamtib</div>
                                <div className="flex-1 flex items-center">
                                    <span className="text-gray-600">: {data.nama_kamtib}</span>
                                    {/* <span className="text-green-500 ml-2">✓</span> */}
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <div className="text-gray-700 font-medium">Keterangan:</div>
                            <div className="mt-1 text-gray-600">
                                {data.keterangan}
                            </div>
                        </div>

                        <div className="mt-2">
                            {(data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)") && (
                                <>
                                    <div className="text-gray-700 font-medium">
                                        Sudah berada di Pondok :
                                    </div>
                                    <div className="mt-1 font-medium text-blue-800">
                                        {data.tanggal_kembali}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    
                </div>

                {/* Status Steps */}
                <div className="mt-8 border-t pt-4">
                    <div className="flex flex-wrap items-center">
                        <div className="flex items-center mr-6 mb-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-gray-700">Sedang proses izin</span>
                        </div>

                        <div className="flex items-center mr-6 mb-2">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
            ${(data.status === "perizinan ditolak" || data.status === "dibatalkan")
                                    ? 'border-red-500 bg-red-500 text-white'
                                    : (data.status !== "sedang proses izin")
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-400 text-gray-400'}`}>
                                {(data.status === "perizinan diterima" || data.status === "sudah berada diluar pondok" || data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)") && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {(data.status === "perizinan ditolak" || data.status === "dibatalkan") && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-gray-700">{data.status === "dibatalkan" ? "Perizinan dibatalkan" : data.status === "perizinan ditolak" ? "Perizinan ditolak" : " Perizinan diterima"}</span>
                        </div>

                        <div className="flex items-center mr-6 mb-2">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
            ${(data.status === "sudah berada diluar pondok" || data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)")
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-gray-400 text-gray-400'}`}>
                                {(data.status === "sudah berada diluar pondok" || data.status === "kembali tepat waktu" || data.status === "telat(sudah kembali)" || data.status === "telat(belum kembali)") && (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <span className="text-gray-700">Sudah berada di luar pondok</span>
                        </div>

                        <div className="flex items-center mb-2">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
            ${data.status === "kembali tepat waktu"
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : data.status === "telat(belum kembali)"
                                        ? 'border-red-500 bg-red-500 text-white'
                                        : data.status === "telat(sudah kembali)"
                                            ? 'border-red-500 bg-red-500 text-white'
                                            : 'border-gray-400 text-gray-400'}`}>
                                {data.status === "telat(belum kembali)"
                                    ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    : data.status === "kembali tepat waktu" && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                }{
                                    data.status === "telat(sudah kembali)" && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                }
                            </div>
                            <span className="text-gray-700">{data.status === "telat(belum kembali)" ? " Telat" : data.status === "telat(sudah kembali)" ? " Telat" : " Kembali tepat waktu"}</span>
                        </div>
                        <div className="justify-end ml-auto">
                            <div className="text-right text-gray-500 text-sm mt-2">
                                <div>Tgl dibuat : {data.tgl_input}</div>
                                <div>Tgl diubah : {data.tgl_update}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DataPerizinan;