import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { API_BASE_URL } from "../../hooks/config";

export const ModalExport = ({ isOpen, onClose }) => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [allPages, setAllPages] = useState(false);

    const fields = [
        { label: "No. KK", value: "no_kk" },
        { label: "NIK", value: "nik" },
        { label: "NIUP", value: "niup" },
        { label: "Nama", value: "nama" },
        { label: "Tempat Lahir", value: "tempat_lahir" },
        { label: "Tanggal Lahir", value: "tanggal_lahir" },
        { label: "Jenis Kelamin", value: "jenis_kelamin" },
        { label: "Anak ke", value: "anak_ke" },
        { label: "Jumlah Saudara", value: "jumlah_saudara" },
        { label: "NIS", value: "nis" },
        { label: "Domisili Santri", value: "domisili_santri" },
        { label: "Angkatan Santri", value: "angkatan_santri" },
        { label: "No Induk", value: "no_induk" },
        { label: "Lembaga", value: "lembaga" },
        { label: "Jurusan", value: "jurusan" },
        { label: "Kelas", value: "kelas" },
        { label: "Rombel", value: "rombel" },
        { label: "Angkatan Pelajar", value: "angkatan_pelajar" },
        { label: "Ibu Kandung", value: "ibu_kandung" }
    ];


    const handleFieldChange = (field) => {
        setSelectedFields((prev) =>
            prev.includes(field)
                ? prev.filter((f) => f !== field)
                : [...prev, field]
        );
    };

    const handleExport = () => {
        const baseUrl = `${API_BASE_URL}export/pesertadidik`; // Ganti sesuai route Laravel kamu
        const params = new URLSearchParams();

        // Tambahkan fields[] jika ada yang dipilih
        selectedFields.forEach(field => params.append("fields[]", field));

        // Tambahkan parameter 'all' hanya jika dicentang
        if (allPages) {
            params.append("all", "true");
        }

        // Trigger download dengan mengarahkan ke URL
        window.location.href = `${baseUrl}?${params.toString()}`;
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