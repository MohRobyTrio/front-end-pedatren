import { faEye, faEyeSlash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/Logout";
import { formatValidationErrors } from "../../utils/messageError";
import { OrbitProgress } from "react-loading-indicators";

export const ModalAddUserOrtu = ({ isOpen, onClose, data, refetchData }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        no_kk: "",
        no_hp: "",
        email: "",
        password: "",
        confirm_password: "",
        status: null,
    });

    useEffect(() => {
        if (isOpen) {
            if (data) {
                setFormData({
                    no_kk: data.no_kk || "",
                    no_hp: data.no_hp || "",
                    email: data.email || "",
                    password: "",
                    confirm_password: "",
                    status: data.status == 1 ? true : false,
                })
            } else {
                setFormData({
                    no_kk: "",
                    no_hp: "",
                    email: "",
                    password: "",
                    confirm_password: "",
                });
            }
        }
    }, [isOpen, data])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8 && !data) {
            await Swal.fire({
                title: "Oops!",
                text: "Password minimal 8 karakter",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        } else if ((formData.password != formData.confirm_password) && !data) {
            await Swal.fire({
                title: "Oops!",
                text: "Password tidak sama",
                icon: "warning",
                confirmButtonText: "OK",
            });
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

            const token = sessionStorage.getItem("token") || getCookie("token");
            console.log(token);


            // Tentukan data yang dikirim
            const payload = {
                no_kk: formData.no_kk,
                no_hp: formData.no_hp,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirm_password,
                status: formData.status,
            };

            const isEditing = !!data?.id;
            if (isEditing && !formData.password) {
                delete payload.password;
                delete payload.password_confirmation;
            } else {
                delete payload.status;
            }

            const url = isEditing
                ? `${API_BASE_URL}user-ortu/${data.id}`
                : `${API_BASE_URL}user-ortu`;

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                // credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

            // const response = await fetch(`${API_BASE_URL}register`, {
            //     method: "POST",
            //     credentials: "include",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${token}`,
            //     },
            //     body: JSON.stringify(payload),
            // });

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
                let errorMessage = result.message || "Terjadi kesalahan pada server.";

                if (result.errors) {
                    errorMessage = formatValidationErrors(result.errors);
                }

                throw new Error(errorMessage);
            }

            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            refetchData?.();
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
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                            >
                                                {data ? "Update Data" : "Tambah Data Baru"}
                                            </Dialog.Title>
                                            {/* FORM ISI */}
                                            <div className="space-y-4">
                                                {/* Nama */}
                                                <div>
                                                    <label htmlFor="no_kk" className="block text-gray-700">No KK *</label>
                                                    <input
                                                        type="text"
                                                        id="no_kk"
                                                        name="no_kk"
                                                        value={formData.no_kk}
                                                        onChange={(e) => setFormData({ ...formData, no_kk: e.target.value })}
                                                        maxLength={255}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan No KK"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="no_hp" className="block text-gray-700">No Handphone *</label>
                                                    <input
                                                        type="text"
                                                        id="no_hp"
                                                        name="no_hp"
                                                        value={formData.no_hp}
                                                        onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                                                        maxLength={255}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan No Handphone"
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label htmlFor="email" className="block text-gray-700">Email *</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        maxLength={255}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="Masukkan Email"
                                                    />
                                                </div>

                                                {/* Password */}
                                                <div>
                                                    <label htmlFor="password" className="block text-gray-700">Password {!data && "*"}</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            id="password"
                                                            name="password"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            maxLength={255}
                                                            required={!data}
                                                            className="mt-1 block w-full pr-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            placeholder="Masukkan Password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 focus:outline-none cursor-pointer"
                                                        >
                                                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Confirm Password */}
                                                <div>
                                                    <label htmlFor="confirm_password" className="block text-gray-700">Konfirmasi Password {!data && "*"}</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            id="confirm_password"
                                                            name="confirm_password"
                                                            value={formData.confirm_password}
                                                            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                                            maxLength={255}
                                                            required={!data}
                                                            className="mt-1 block w-full pr-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            placeholder="Konfirmasi Password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 focus:outline-none cursor-pointer"
                                                        >
                                                            <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {data && (
                                                    <div>
                                                        <label className="block text-gray-700">Status Aktif *</label>
                                                        <div className="flex space-x-4 mt-1">
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="1"
                                                                    checked={formData.status == true}
                                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                                    className="form-radio text-blue-500 focus:ring-blue-500"
                                                                    required
                                                                />
                                                                <span className="ml-2 text-gray-700">Ya</span>
                                                            </label>
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value="0"
                                                                    checked={formData.status == false}
                                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                                    className="form-radio text-blue-500 focus:ring-blue-500"
                                                                    required
                                                                />
                                                                <span className="ml-2 text-gray-700">Tidak</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
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
                                        Cancel
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

const DetailRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-40 font-semibold text-gray-700">{label}</div>
        <div className="flex-1 text-gray-900">
            <span className="hidden sm:inline">: </span>
            {value || "-"}
        </div>
    </div>
);

export const ModalDetailUserOrtu = ({ isOpen, onClose, id }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && id) {
            const token = sessionStorage.getItem("token") || getCookie("token");
            setLoading(true);
            setData(null); // Reset data sebelumnya

            // !!! Sesuaikan URL endpoint ini jika berbeda (misal: /ortu/${id}) !!!
            fetch(`${API_BASE_URL}user-ortu/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal mengambil data user ortu");
                    return res.json();
                })
                .then((json) => {
                    // Sesuai JSON Anda, data ada di dalam 'json.data'
                    if (json.success && json.data) {
                        setData(json.data);
                    } else {
                        throw new Error("Format data tidak sesuai");
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setData(null);
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen, id]);

    // Format nilai untuk ditampilkan
    const getStatus = (status) => (status ? "Aktif" : "Nonaktif");

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
                        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full h-full relative max-h-[90vh] flex flex-col">
                            {/* Tombol Close */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            {/* Header */}
                            <div className="pt-6">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                    Detail User Orang Tua
                                </Dialog.Title>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto pr-8 pl-8 pt-4 text-left">
                                {loading ? (
                                    <div className="flex h-48 justify-center items-center">
                                        <OrbitProgress variant="disc" color="#2a6999" size="small" text="" textColor="" />
                                    </div>
                                ) : data ? (
                                    <div className="space-y-4">
                                        {/* Bagian Akun Ortu */}
                                        <div>
                                            <h4 className="text-md font-semibold text-blue-700 border-b pb-1 mb-2">
                                                Detail Akun
                                            </h4>
                                            <div className="space-y-2">
                                                <DetailRow label="Nomor KK" value={data.no_kk} />
                                                <DetailRow label="Nomor HP" value={data.no_hp} />
                                                <DetailRow label="Email" value={data.email} />
                                                <DetailRow label="Status Akun" value={getStatus(data.status)} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-red-500 text-center py-4">
                                        Gagal memuat data.
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 pt-4 text-right space-x-2 bg-gray-100 px-4 py-3 rounded-b-lg border-t border-gray-300">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
                                >
                                    Tutup
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
