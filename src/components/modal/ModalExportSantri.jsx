import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/Logout";
import { Fragment, useState } from "react";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IdCard, Table } from "lucide-react";
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri";
import { FaUsers } from "react-icons/fa";

export const ModalExportSantri = ({ isOpen, onClose, filters, searchTerm, limit, currentPage, fields = [], endpoint }) => {
    const { clearAuthData } = useLogout();
    const { menuSantri } = useDropdownSantri()
    const navigate = useNavigate();
    const [selectedFields, setSelectedFields] = useState([]);
    const [allPages, setAllPages] = useState(false);
    const [activeTab, setActiveTab] = useState('data');
    const [santriQuery, setSantriQuery] = useState('');
    // const [errors, setErrors] = useState({});
    const [exportType, setExportType] = useState('all');
    // const [exportFormat, setExportFormat] = useState('image');
    // const [cardSide, setCardSide] = useState('front');
    const [formData, setFormData] = useState({
        santri_ids: [],
    });

    const filteredSantri = santriQuery === ''
        ? menuSantri.slice(1)
        : menuSantri.slice(1).filter((santri) =>
            santri.label.toLowerCase().includes(santriQuery.toLowerCase()) ||
            santri.nis.toLowerCase().includes(santriQuery.toLowerCase()) ||
            santri.wilayah.toLowerCase().includes(santriQuery.toLowerCase())
        );

    const selectedSantri = menuSantri.slice(1).filter(s => formData.santri_ids.includes(s.id));

    const handleFieldChange = (field) => {
        setSelectedFields((prev) =>
            prev.includes(field)
                ? prev.filter((f) => f !== field)
                : [...prev, field]
        );
    };

    const handleExport = async () => {
        const baseUrl = `${API_BASE_URL}${endpoint}`;
        const params = new URLSearchParams();

        if (filters?.phoneNumber) params.append('phone_number', filters.phoneNumber);
        if (filters?.wargaPesantren) params.append('warga_pesantren', filters.wargaPesantren);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.jenisKelamin) params.append('jenis_kelamin', filters.jenisKelamin);
        if (filters?.smartcard) params.append('smartcard', filters.smartcard);
        if (filters?.pemberkasan) params.append('pemberkasan', filters.pemberkasan);
        if (filters?.urutBerdasarkan) params.append('sort_by', filters.urutBerdasarkan);
        if (filters?.urutSecara) params.append('sort_order', filters.urutSecara);
        if (filters?.negara && filters.negara !== "Semua Negara") params.append('negara', filters.negara);
        if (filters?.provinsi && filters.provinsi !== "Semua Provinsi") params.append('provinsi', filters.provinsi);
        if (filters?.kabupaten && filters.kabupaten !== "Semua Kabupaten") params.append('kabupaten', filters.kabupaten);
        if (filters?.kecamatan && filters.kecamatan !== "Semua Kecamatan") params.append('kecamatan', filters.kecamatan);
        if (filters?.wilayah && filters.wilayah !== "Semua Wilayah") params.append('wilayah', filters.wilayah);
        if (filters?.blok && filters.blok !== "Semua Blok") params.append('blok', filters.blok);
        if (filters?.kamar && filters.kamar !== "Semua Kamar") params.append('kamar', filters.kamar);
        if (filters?.angkatanPelajar) params.append('angkatan_pelajar', filters.angkatanPelajar);
        if (filters?.angkatanSantri) params.append('angkatan_santri', filters.angkatanSantri);
        if (filters?.lembaga && filters.lembaga !== "Semua Lembaga") params.append('lembaga', filters.lembaga);
        if (filters?.jurusan && filters.jurusan !== "Semua Jurusan") params.append('jurusan', filters.jurusan);
        if (filters?.kelas && filters.kelas !== "Semua Kelas") params.append('kelas', filters.kelas);
        if (filters?.rombel && filters.rombel !== "Semua Rombel") params.append('rombel', filters.rombel);

        if (searchTerm) params.append("nama", searchTerm);
        if (!allPages) {
            if (limit) params.append("limit", limit);
            if (currentPage) params.append("page", currentPage);
        }

        selectedFields.forEach(field => params.append("fields[]", field));

        if (allPages) {
            params.append("all", "true");
        }

        // window.location.href = `${baseUrl}?${params.toString()}`;
        const token = sessionStorage.getItem("token") || getCookie("token");
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
            const response = await fetch(`${baseUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
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

            if (!response.ok) {
                throw new Error("Export gagal");
            }

            const blob = await response.blob();

            // Ambil nama file dari Content-Disposition
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = '';
            if (contentDisposition && contentDisposition.includes('filename=')) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) {
                    filename = match[1].replace(/['"]/g, '');
                }
            }

            if (!filename) {
                const endpointPart = endpoint.split('/').pop(); // Ambil setelah slash terakhir
                filename = `export-${endpointPart || 'data'}.xlsx`;
            }

            // Paksa download file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export gagal:", err);
            alert("Export gagal: " + err.message);
        }

    };

    const handleExportCard = async () => {
        const token = sessionStorage.getItem("token") || getCookie("token");

        if (exportType === "selected" && selectedSantri.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "Pilih Santri",
                text: "Anda harus memilih minimal 1 santri untuk export.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            Swal.fire({
                background: "transparent",
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
                customClass: {
                    popup: "p-0 shadow-none border-0 bg-transparent"
                }
            });

            if (activeTab === "card") {
                // ===== Export ID Card =====
                const params = new URLSearchParams();

                if (exportType === "selected" && formData.santri_ids.length > 0) {
                    formData.santri_ids.forEach(id => params.append("santri_ids[]", id));
                }

                const response = await fetch(
                    `${API_BASE_URL}id-card/kanzus?${params.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    Swal.close();
                    Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: "Gagal membuat ID Card. Silakan coba lagi.",
                    });
                    return;
                }

                const blob = await response.blob();
                Swal.close(); // tutup loading setelah file siap

                // Trigger download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "id_card_kanzus.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "File ID Card berhasil dibuat, unduhan sedang berlangsung.",
                    timer: 2500,
                    showConfirmButton: false,
                });
            }

            // ===== Export Data (Excel) =====
            // const baseUrl = `${API_BASE_URL}${endpoint}`;
            // const params = new URLSearchParams();

            // append filters dsb sesuai code lama...
            // if (filters?.status) params.append("status", filters.status);
            // if (searchTerm) params.append("nama", searchTerm);
            // if (!allPages) {
            //     if (limit) params.append("limit", limit);
            //     if (currentPage) params.append("page", currentPage);
            // }
            // selectedFields.forEach(field => params.append("fields[]", field));
            // if (allPages) params.append("all", "true");

            // const response = await fetch(`${baseUrl}?${params.toString()}`, {
            //     method: "GET",
            //     headers: { "Authorization": `Bearer ${token}` }
            // });

            // Swal.close();
            // if (!response.ok) throw new Error("Export gagal");

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "File ID Card berhasil dibuat, file akan diunduh otomatis.",
                timer: 2500,
                showConfirmButton: false,
            });

            // const blob = await response.blob();
            // const url = window.URL.createObjectURL(blob);
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = "export-data.xlsx";
            // document.body.appendChild(a);
            // a.click();
            // a.remove();
            // window.URL.revokeObjectURL(url);

        } catch (err) {
            Swal.close();
            console.error("Export gagal:", err);
            alert("Export gagal: " + err.message);
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

    const CardHeader = ({ children }) => <div className="px-6 py-4 border-b border-gray-200">{children}</div>

    function Button({ children, variant = "default", onClick, className = "" }) {
        const variants = {
            default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-200",
        }

        return (
            <button
                onClick={onClick}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variants[variant]} ${className}`}
            >
                {children}
            </button>
        )
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition-transform duration-300 ease-out"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition-transform duration-200 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-xl relative max-h-[90vh] flex flex-col">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-semibold text-gray-900 text-center"
                                >
                                    Export Data
                                </Dialog.Title>
                            </div>
                            <CardHeader className="pb-4">
                                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                                    <Button
                                        variant={activeTab === "data" ? "default" : "ghost"}
                                        onClick={() => setActiveTab("data")}
                                        className="flex-1 rounded-md"
                                    >
                                        <Table className="h-4 w-4 mr-2" />
                                        Data
                                    </Button>
                                    <Button
                                        variant={activeTab === "card" ? "default" : "ghost"}
                                        onClick={() => setActiveTab("card")}
                                        className="flex-1 rounded-md"
                                    >
                                        <IdCard className="h-4 w-4 mr-2" />
                                        Kartu
                                    </Button>
                                </div>
                                <div className="mt-2 text-sm text-gray-500 text-center">
                                    {activeTab === "data"
                                        ? "Export Data akan menghasilkan file Excel (.xlsx)"
                                        : "Export Kartu akan menghasilkan file PDF (.pdf)"}
                                </div>
                            </CardHeader>

                            <div className="pt-6 px-6 overflow-y-auto text-left">
                                {activeTab === "data" ? (
                                    <>
                                        {/* Grid 2 kolom responsif */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                                            {fields.map((field) => (
                                                <label key={field.value} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFields.includes(field.value)}
                                                        onChange={() => handleFieldChange(field.value)}
                                                        className="mr-2"
                                                    />
                                                    {field.label}
                                                </label>
                                            ))}
                                        </div>

                                        {/* Garis atas */}
                                        <hr className="my-4 border-t border-gray-300" />

                                        {/* Centang semua halaman */}
                                        <label className="block">
                                            <input
                                                type="checkbox"
                                                checked={allPages}
                                                onChange={() => setAllPages(!allPages)}
                                                className="mr-2"
                                            />
                                            Semua data tanpa dibatasi perhalaman
                                            <div className="text-sm italic text-gray-500">
                                                (Bisa memakan waktu yang lama)
                                            </div>
                                        </label>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-800">
                                                Pilih Data Export <span className="text-red-500">*</span>
                                            </label>

                                            <div className="space-y-3">
                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="exportType"
                                                        value="all"
                                                        checked={exportType === 'all'}
                                                        onChange={(e) => setExportType(e.target.value)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <span className="text-gray-900">Export Semua Santri ({menuSantri.length} santri)</span>
                                                </label>

                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="exportType"
                                                        value="selected"
                                                        checked={exportType === 'selected'}
                                                        onChange={(e) => setExportType(e.target.value)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <span className="text-gray-900">Pilih Santri Tertentu</span>
                                                </label>
                                            </div>
                                        </div>
                                        {exportType === 'selected' && (
                                            <>
                                                <label className="block text-sm font-semibold text-gray-800">
                                                    Pilih Santri <span className="text-red-500">*</span>
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={santriQuery}
                                                        onChange={(e) => setSantriQuery(e.target.value)}
                                                        placeholder="Cari santri berdasarkan nama atau NIS..."
                                                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                                                    />
                                                </div>

                                                {selectedSantri.length > 0 && (
                                                    <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-100">
                                                        <div className="flex items-center justify-between">
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
                                                    </div>
                                                )}

                                                {/* Santri list */}
                                                <div
                                                    className={`max-h-56 overflow-y-auto border-2 rounded-xl border-gray-200 bg-gray-50`}
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

                                                {/* {errors.santri_ids && (
                                                    <p className="text-sm text-red-600 font-medium">
                                                        {errors.santri_ids}
                                                    </p>
                                                )} */}
                                            </>
                                        )}

                                        {/* <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-800">
                                                Sisi Kartu <span className="text-red-500">*</span>
                                            </label>

                                            <div className="grid grid-cols-1 gap-3">
                                                <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="cardSide"
                                                        value="front"
                                                        checked={cardSide === 'front'}
                                                        onChange={(e) => setCardSide(e.target.value)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <FaIdCard className="w-5 h-5 text-green-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">Depan Saja</div>
                                                        <div className="text-gray-500 text-sm">Export hanya bagian depan kartu</div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="cardSide"
                                                        value="both"
                                                        checked={cardSide === 'both'}
                                                        onChange={(e) => setCardSide(e.target.value)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <FaLayerGroup className="w-5 h-5 text-purple-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">Depan & Belakang</div>
                                                        <div className="text-gray-500 text-sm">Export kedua sisi kartu</div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-800">
                                                Format Export <span className="text-red-500">*</span>
                                            </label>

                                            <div className="grid grid-cols-1 gap-3">
                                                <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="exportFormat"
                                                        value="image"
                                                        checked={exportFormat === 'image'}
                                                        onChange={(e) => setExportFormat(e.target.value)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <FaFileImage className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">Gambar (PNG)</div>
                                                        <div className="text-gray-500 text-sm">Export sebagai file gambar</div>
                                                    </div>
                                                </label>

                                                <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="exportFormat"
                                                        value="pdf"
                                                        checked={exportFormat === 'pdf'}
                                                        onChange={(e) => setExportFormat(e.target.value)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <FaFilePdf className="w-5 h-5 text-red-600" />
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">PDF</div>
                                                        <div className="text-gray-500 text-sm">Export sebagai file PDF</div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div> */}
                                        {/* <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                                Ringkasan Export
                                            </label>
                                            <div className="space-y-1">
                                                <p className="text-gray-600 text-sm">
                                                    <span className="font-medium">Data:</span>{' '}
                                                    {exportType === 'all'
                                                        ? `Semua santri (${menuSantri.length} santri)`
                                                        : `Santri terpilih (${selectedSantri.length} santri)`
                                                    }
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    <span className="font-medium">Sisi Kartu:</span>{' '}
                                                    {cardSide === 'front' ? 'Depan saja' : 'Depan & Belakang'}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    <span className="font-medium">Format:</span>{' '}
                                                    {exportFormat === 'image' ? 'Gambar (PNG)' : 'PDF'}
                                                </p>
                                            </div>
                                        </div> */}
                                    </div>
                                )}
                                {/* Garis bawah */}
                                <hr className="my-4 border-t border-gray-300" />
                            </div>

                            <p className="text-red-600 text-sm mb-2">
                                Note: Jagalah privasi data. Haram disebar & dipergunakan untuk selain
                                kepentingan pesantren.
                            </p>

                            <div className="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                                <button
                                    type="submit"
                                    onClick={() => activeTab == "data" ? handleExport() : handleExportCard()}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                                >
                                    Export
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="cursor-pointer mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Batal
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};