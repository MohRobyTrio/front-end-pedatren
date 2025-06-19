import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import Swal from "sweetalert2";
import useLogout from "../../hooks/Logout";
import { useNavigate } from "react-router-dom";

export const ModalExport = ({ isOpen, onClose, filters, searchTerm, limit, currentPage, fields = [], endpoint }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [selectedFields, setSelectedFields] = useState([]);
    const [allPages, setAllPages] = useState(false);    

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
                title: 'Mohon tunggu...',
                html: 'Sedang memproses data untuk diekspor.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
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

                            <Dialog.Title
                                as="h3"
                                className="text-lg leading-6 font-medium text-gray-900 text-center mt-6"
                            >
                                Export Data
                            </Dialog.Title>

                            <div className="pt-6 px-6 overflow-y-auto text-left">
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
                                    onClick={handleExport}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                                >
                                    Export Excel
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