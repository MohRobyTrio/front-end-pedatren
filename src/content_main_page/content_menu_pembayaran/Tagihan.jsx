import { OrbitProgress } from "react-loading-indicators";
import { FaEdit, FaPlus, FaTimes, FaTrash, FaUsers } from "react-icons/fa";
import { Fragment, useState } from "react";
import DoubleScrollbarTable from "../../components/DoubleScrollbarTable";
import { hasAccess } from "../../utils/hasAccess";
import { Navigate, useNavigate } from "react-router-dom";
import useFetchTagihan from "../../hooks/hooks_menu_pembayaran/tagihan";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { ModalAddOrEditTagihan } from "../../components/modal/ModalFormTagihan";
import { ModalDetailTagihanSantri } from "../../components/modal/ModalFormProsesTagihan";
import { Check, ChevronsUpDown } from "lucide-react";
import { Combobox, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri";
import useLogout from "../../hooks/Logout";

const Tagihan = () => {
    // eslint-disable-next-line no-unused-vars
    const [filters, setFilters] = useState({
        status: "",
        tipe: "",
    })
    const [formData, setFormData] = useState({
        tagihan_id: '',
        santri_ids: [],
        jenis_kelamin: '',
        all: null,
    });
    const [errors, setErrors] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [tagihanData, setTagihanData] = useState("");
    const [feature, setFeature] = useState("");
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [tagihanQuery, setTagihanQuery] = useState('');
    const [santriQuery, setSantriQuery] = useState('');
    // const [monthInputValue, setMonthInputValue] = useState('');
    // const [showFilters, setShowFilters] = useState(false)
    const { tagihan, loadingTagihan, error, fetchTagihan, handleDelete, searchTerm, setSearchTerm, totalPages, currentPage, setCurrentPage, totalData } = useFetchTagihan(filters);
    const { menuSantri } = useDropdownSantri()
    const navigate = useNavigate();
    const { clearAuthData } = useLogout()
    const mockSantri = menuSantri.slice(1);
    const mockTagihan = tagihan

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const filteredTagihan = tagihanQuery === ''
        ? mockTagihan
        : mockTagihan.filter((tagihan) =>
            tagihan.nama_tagihan.toLowerCase().includes(tagihanQuery.toLowerCase()) ||
            tagihan.nominal.toLowerCase().includes(tagihanQuery.toLowerCase())
        );

    // Filter santri based on search query
    const filteredSantri = santriQuery === ''
        ? mockSantri
        : mockSantri.filter((santri) =>
            santri.label.toLowerCase().includes(santriQuery.toLowerCase()) ||
            santri.nis.toLowerCase().includes(santriQuery.toLowerCase()) ||
            santri.wilayah.toLowerCase().includes(santriQuery.toLowerCase())
        );

    const selectedTagihan = mockTagihan.find(p => p.id == formData.tagihan_id);
    const selectedSantri = mockSantri.filter(s => formData.santri_ids.includes(s.id));

    const validateForm = () => {
        const newErrors = {};

        // Tagihan wajib dipilih
        if (!formData.tagihan_id) {
            newErrors.tagihan_id = "Tagihan harus dipilih";
        }

        if (formData.all == 0) {
            // Manual → minimal pilih 1 santri
            if (!formData.santri_ids || formData.santri_ids.length === 0) {
                newErrors.santri_ids = "Minimal satu santri harus dipilih";
            }
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            const pesanError = Object.values(newErrors).join("<br/>");
            Swal.fire({
                icon: "error",
                title: "Validasi Gagal",
                html: pesanError,
                confirmButtonText: "OK"
            });
            return false;
        }

        return true;
    };

    const resetData = () => {
        fetchTagihan()
        setFormData({
            tagihan_id: '',
            santri_ids: [],
            jenis_kelamin: '',
            all: null
        });
        setErrors({});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const onSubmit = async () => {
        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

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

            // Tentukan URL dan method berdasarkan feature
            const url = `${API_BASE_URL}tagihan-santri/generate`;

            const method = "POST";

            // Tentukan data yang dikirim
            const payload = {
                tagihan_id: formData.tagihan_id,
                jenis_kelamin: formData.jenis_kelamin,
                santri_ids: formData.santri_ids,
            };
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            Swal.close();
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
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join("\n");

                    await Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        text: errorMessages,
                    });

                    return;
                }

                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            fetchTagihan()
            resetData()
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Terjadi kesalahan saat mengirim data.",
            });
        }
    };

    const handleSantriToggle = (santriId) => {
        setFormData(prev => ({
            ...prev,
            santri_ids: prev.santri_ids.includes(santriId)
                ? prev.santri_ids.filter(id => id !== santriId)
                : [...prev.santri_ids, santriId]
        }));
    };

    // const formatCurrencyRp = (amount) => {
    //     return new Intl.NumberFormat('id-ID', {
    //         style: 'currency',
    //         currency: 'IDR',
    //         minimumFractionDigits: 0
    //     }).format(amount);
    // };

    const formatKategori = (kategori) => {
        const map = {
            anak_pegawai: "Anak Pegawai",
            bersaudara: "Bersaudara",
            khadam: "Khadam",
            umum: "Umum",
        }
        return map[kategori] || kategori?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || kategori || "-"
    }

    // const handlePeriodeChange = (e) => {
    //     const inputValue = e.target.value; // Nilainya adalah "YYYY-MM"
    //     setMonthInputValue(inputValue);

    //     if (inputValue) {
    //         const [year, month] = inputValue.split('-');
    //         const dateObject = new Date(year, month - 1, 1);
    //         const formattedPeriode = dateObject.toLocaleDateString('id-ID', {
    //             month: 'long',
    //             year: 'numeric'
    //         }).toUpperCase();

    //         // Simpan format yang sudah benar ke state utama
    //         setFormData(prevData => ({
    //             ...prevData,
    //             periode: formattedPeriode
    //         }));
    //     } else {
    //         setFormData(prevData => ({
    //             ...prevData,
    //             periode: ''
    //         }));
    //     }
    // };

    if (!hasAccess("tagihan")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-4 sm:p-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Tagihan</h1>
                    {/* <p className="mt-1 text-sm text-gray-600">Kelola dan proses tagihan santri dengan mudah.</p> */}
                </div>
                {activeTab === 'list' && (
                    <div className="mt-4 sm:mt-0">
                        <button onClick={() => { setFeature(1); setTagihanData(null); setOpenModal(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-sm font-medium shadow-sm transition-transform transform active:scale-95"><FaPlus />Tambah</button>
                    </div>
                )}
            </div>

            <div className="flex-1">

                <ModalAddOrEditTagihan isOpen={openModal} onClose={() => setOpenModal(false)} data={tagihanData} refetchData={fetchTagihan} feature={feature} />

                <ModalDetailTagihanSantri isOpen={openDetail} onClose={() => setOpenDetail(false)} id={selectedId} />

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <nav className="border-b border-gray-200 mb-4">
                        <ul className="flex flex-wrap -mb-px">
                            <li className="mr-2">
                                <button
                                    onClick={() => setActiveTab('list')}
                                    className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${activeTab == 'list'
                                        ? "text-blue-600 border-blue-600 bg-blue-50"
                                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    Daftar Tagihan
                                </button>
                            </li>
                            <li className="mr-2">
                                <button
                                    onClick={() => setActiveTab('form')}
                                    className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${activeTab == 'form'
                                        ? "text-blue-600 border-blue-600 bg-blue-50"
                                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    Proses Tagihan Santri
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {activeTab == 'list' ? (
                        error ? (
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
                            <>
                                <SearchBar
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    totalData={totalData}
                                    showLimit={false}
                                    showSearch={false}
                                    showFilterButtons={false}
                                    onRefresh={() => fetchTagihan(true)}
                                    loadingRefresh={loadingTagihan}
                                />
                                <DoubleScrollbarTable>
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                            <tr>
                                                <th className="px-3 py-2 border-b w-10">#</th>
                                                <th className="px-3 py-2 border-b">Nama Tagihan</th>
                                                <th className="px-3 py-2 border-b">Tipe</th>
                                                <th className="px-3 py-2 border-b">Nominal</th>
                                                <th className="px-3 py-2 border-b">Jatuh Tempo</th>
                                                <th className="px-3 py-2 border-b">Status</th>
                                                <th className="px-3 py-2 border-b text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-800">
                                            {loadingTagihan ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center p-4">
                                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                                    </td>
                                                </tr>
                                            ) : tagihan.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-6">Tidak ada data</td>
                                                </tr>
                                            ) : (
                                                tagihan.map((item, index) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 whitespace-nowrap text-left cursor-pointer" onClick={() => {
                                                        setSelectedId(item.id)
                                                        setOpenDetail(true)
                                                    }}>
                                                        <td className="px-3 py-2 border-b">{index + 1}</td>
                                                        <td className="px-3 py-2 border-b">{item.nama_tagihan}</td>
                                                        <td className="px-3 py-2 border-b">
                                                            {item.tipe === 'bulanan' ? 'Bulanan' :
                                                                item.tipe === 'semester' ? 'Semester' :
                                                                    item.tipe === 'tahunan' ? 'Tahunan' : 'Sekali Bayar'}
                                                        </td>
                                                        <td className="px-3 py-2 border-b">{formatCurrency(item.nominal)}</td>
                                                        <td className="px-3 py-2 border-b">{formatDate(item.jatuh_tempo)}</td>
                                                        <td className="px-3 py-2 border-b w-30">
                                                            <span
                                                                className={`text-sm font-semibold px-3 py-1 rounded-full ${item.status
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-red-100 text-red-700"
                                                                    }`}
                                                            >
                                                                {item.status ? "Aktif" : "Nonaktif"}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 border-b text-center space-x-2 w-20">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setTagihanData(item);
                                                                    setFeature(2);
                                                                    setOpenModal(true);
                                                                }}
                                                                className="p-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleDelete(item.id)
                                                                }}
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
                                {totalPages > 1 && (
                                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                                )}
                            </>
                        )
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col max-w-4xl mx-auto">
                            <div className="px-4 py-2 space-y-4 flex-1 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Jenis Tagihan <span className="text-red-500">*</span>
                                    </label>

                                    <Combobox
                                        value={formData.tagihan_id}
                                        onChange={(value) =>
                                            setFormData((prev) => ({ ...prev, tagihan_id: value }))
                                        }
                                    >
                                        <div className="relative">
                                            {/* Input */}
                                            <Combobox.Input
                                                className={`w-full rounded-md border ${errors?.tagihan_id
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    } bg-white py-2 px-3 text-sm text-gray-900 focus:outline-none transition-all duration-200`}
                                                displayValue={() =>
                                                    selectedTagihan
                                                        ? `${selectedTagihan.nama_tagihan} - ${formatCurrency(
                                                            selectedTagihan.nominal
                                                        )}`
                                                        : ""
                                                }
                                                onChange={(event) => setTagihanQuery(event.target.value)}
                                                placeholder="Pilih jenis tagihan..."
                                            />

                                            {/* Tombol dropdown */}
                                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                                            </Combobox.Button>

                                            {/* Dropdown options */}
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                    {filteredTagihan.length === 0 ? (
                                                        <div className="cursor-default select-none py-2 px-4 text-gray-500">
                                                            Tidak ditemukan
                                                        </div>
                                                    ) : (
                                                        filteredTagihan.map((option) => (
                                                            <Combobox.Option
                                                                key={option.id}
                                                                className={({ active }) =>
                                                                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                                                    }`
                                                                }
                                                                value={option.id}
                                                            >
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${selected ? "font-medium" : "font-normal"
                                                                                }`}
                                                                        >
                                                                            {option.nama_tagihan} -{" "}
                                                                            {formatCurrency(option.nominal)}
                                                                        </span>
                                                                        {selected && (
                                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                                <Check className="h-5 w-5" />
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </Combobox.Option>
                                                        ))
                                                    )}
                                                </Combobox.Options>
                                            </Transition>
                                        </div>
                                    </Combobox>

                                    {/* Tambahan keterangan potongan */}
                                    {selectedTagihan?.potongans?.length > 0 && (
                                        <div className="mt-1 text-xs text-gray-600 border rounded-md p-2 bg-gray-50">
                                            <p className="font-medium text-gray-800 mb-1">Potongan terkait:</p>
                                            <ul className="list-disc list-inside space-y-0.5">
                                                {selectedTagihan.potongans.map((p) => (
                                                    <li key={p.id}>
                                                        {p.nama} ({formatKategori(p.kategori)}) -{" "}
                                                        {p.jenis === "persentase"
                                                            ? `${p.nilai}%`
                                                            : formatCurrency(p.nilai)}
                                                        {/* {p.keterangan && ` | ${p.keterangan}`} */}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>


                                {/* <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Periode <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="month"
                                            value={monthInputValue}
                                            onChange={handlePeriodeChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div> */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Jenis Kelamin (Opsional)
                                    </label>

                                    <select
                                        name="jenis_kelamin"
                                        value={formData.jenis_kelamin || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, jenis_kelamin: e.target.value })
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Semua Jenis Kelamin</option>
                                        <option value="l">Laki-laki</option>
                                        <option value="p">Perempuan</option>
                                    </select>

                                    {errors.jenis_kelamin && (
                                        <p className="text-sm text-red-600 font-medium">
                                            {errors.jenis_kelamin}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Pilih Data Santri <span className="text-red-500">*</span>
                                    </label>

                                    <div className="flex items-center gap-6">
                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="all"
                                                value="0"
                                                checked={formData.all == 0}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, all: e.target.value })
                                                }
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="text-sm text-gray-700">Pilih Santri</span>
                                        </label>

                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="all"
                                                value="1"
                                                checked={formData.all == 1}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, all: e.target.value })
                                                }
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="text-sm text-gray-700"><span className="text-gray-900">Semua Santri</span></span>
                                        </label>
                                    </div>

                                    {formData.all == 0 && (
                                        <>
                                            {/* Search input */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={santriQuery}
                                                    onChange={(e) => setSantriQuery(e.target.value)}
                                                    placeholder="Cari santri berdasarkan nama atau NIS..."
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>

                                            {/* Selected santri display */}
                                            {selectedSantri.length > 0 && (
                                                <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">
                                                            Santri Terpilih ({selectedSantri.length})
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setFormData((prev) => ({ ...prev, santri_ids: [] }))
                                                            }
                                                            className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                                                        >
                                                            Hapus Semua
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedSantri.map((santri) => (
                                                            <span
                                                                key={santri.id}
                                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white text-indigo-800 border border-indigo-200 shadow-sm"
                                                            >
                                                                <span>{santri.label}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSantriToggle(santri.id)}
                                                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    <FaTimes className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Santri list */}
                                            <div
                                                className={`max-h-56 overflow-y-auto border-2 rounded-xl ${errors.santri_ids ? "border-red-300" : "border-gray-200"
                                                    } bg-gray-50`}
                                            >
                                                {filteredSantri.length === 0 ? (
                                                    <div className="p-6 text-center text-gray-500">
                                                        <FaUsers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                                        <div className="font-medium">
                                                            {santriQuery
                                                                ? "Tidak ada santri ditemukan"
                                                                : "Tidak ada data santri"}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-gray-200">
                                                        {filteredSantri.map((santri) => (
                                                            <div
                                                                key={santri.id}
                                                                className="flex items-center p-4 hover:bg-white cursor-pointer transition-all duration-200 group"
                                                                onClick={() => handleSantriToggle(santri.id)}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.santri_ids.includes(santri.id)}
                                                                    readOnly
                                                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded-md transition-colors"
                                                                />
                                                                <div className="ml-4 flex-1">
                                                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                                        {santri.label}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        NIS: {santri.nis} - Wilayah {santri.wilayah}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {errors.santri_ids && (
                                                <p className="text-sm text-red-600 font-medium">
                                                    {errors.santri_ids}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                                {/* <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200"> */}
                                <div className=" flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={resetData}
                                        className="cursor-pointer inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Simpan
                                    </button>
                                </div>
                                {/* </div> */}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tagihan;