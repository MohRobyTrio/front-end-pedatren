import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const ModalAddLimitSaldoOrtu = ({ isOpen, onClose, data, refetchData, currentLimit }) => {
    console.log(data);
    
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        limit_saldo: "",
        tak_terbatas: 0,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                limit_saldo: currentLimit || "",
                tak_terbatas: currentLimit ? 0 : 1,
            });
        }
    }, [isOpen, currentLimit]);

    const handleToggleTakTerbatas = () => {
        const newTakTerbatasValue = formData.tak_terbatas == 1 ? 0 : 1;

        const updatedFormData = {
            ...formData,
            tak_terbatas: newTakTerbatasValue,
        };

        if (newTakTerbatasValue === 1) {
            updatedFormData.limit_saldo = '';
            setError('');
        }

        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.tak_terbatas == 0 && !formData.limit_saldo) {
            setError('Limit saldo harus diisi jika tidak tak terbatas');
            return;
        }

        if (formData.limit_saldo && parseFloat(formData.limit_saldo) < 0) {
            setError('Limit saldo tidak boleh negatif');
            return;
        }

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

            const token = sessionStorage.getItem("auth_token_ortu");

            // Tentukan data yang dikirim
            const payload = {
                santri_id: data?.id,
                limit_saldo: formData.limit_saldo,
                tak_terbatas: formData.tak_terbatas,
            };
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

            const response = await fetch(`${API_BASE_URL}view-ortu/set-limit-saldo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
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
                navigate("/ortu");
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
                text: result.message || "Data berhasil dikirim.",
            });

            refetchData?.({}, true, false);
            onClose?.();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.message || "Terjadi kesalahan saat mengirim data.",
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                {/* Background overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal content wrapper */}
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
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm sm:max-w-lg sm:align-middle">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                            >
                                                Atur Limit Saldo
                                            </Dialog.Title>
                                            {/* Header */}
                                            {data?.nama && (
                                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-gray-600">Santri:</p>
                                                    <p className="font-semibold text-gray-800">{data?.nama} - {data?.nis}</p>
                                                </div>
                                            )}

                                            {error && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm text-red-600">{error}</p>
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                <label htmlFor="limit_saldo" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Limit Saldo (Rp)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="limit_saldo"
                                                        value={
                                                            formData.limit_saldo
                                                                ? new Intl.NumberFormat("id-ID").format(formData.limit_saldo)
                                                                : ""
                                                        }
                                                        onChange={(e) => {
                                                            // hapus titik pemisah ribuan
                                                            const rawValue = e.target.value.replace(/\./g, "");
                                                            const val = rawValue === "" ? "" : parseInt(rawValue, 10);

                                                            setFormData({ ...formData, limit_saldo: val || "" });
                                                        }}
                                                        min="0"
                                                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formData.tak_terbatas === 1
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-800'
                                                            }`}
                                                        placeholder="Masukkan Nominal"
                                                        id="limit_saldo"
                                                        disabled={formData.tak_terbatas == 1}
                                                        step="0.01"
                                                    // className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formData.tak_terbatas === 1
                                                    //     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    //     : 'bg-white text-gray-800'
                                                    //     }`}
                                                    />
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 text-sm">Rp</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formData.tak_terbatas === 1
                                                        ? 'Tidak berlaku karena limit tak terbatas aktif'
                                                        : 'Minimal Rp 0'}
                                                </p>

                                            </div>

                                            <div className="mb-6">
                                                <label className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.tak_terbatas == 1}
                                                        onChange={handleToggleTakTerbatas}
                                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-gray-700 font-medium">
                                                        Limit Tak Terbatas
                                                    </span>
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1 ml-8">
                                                    Centang jika tidak ada batasan saldo
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};