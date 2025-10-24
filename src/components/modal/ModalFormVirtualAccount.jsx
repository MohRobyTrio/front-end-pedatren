import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../hooks/config";
import { getCookie } from "../../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// tambah: komponen santri
import { SantriInfoCard } from "../CardInfo";
import { ModalSelectSantri } from "../ModalSelectSantri";
import useDropdownSantri from "../../hooks/hook_dropdown/DropdownSantri";

export const ModalAddOrEditVirtualAccount = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const id = data?.id;

    // state santri (untuk pilih santri lewat modal)
    const [showSelectSantri, setShowSelectSantri] = useState(false);
    const { menuSantri } = useDropdownSantri();
    const [santri, setSantri] = useState("");
    const [santriSelectionCancelled, setSantriSelectionCancelled] = useState(false)

    // state bank dropdown
    const [banks, setBanks] = useState([]);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [errorBanks, setErrorBanks] = useState("");

    const [formData, setFormData] = useState({
        santri_id: "",
        bank_id: "",
        va_number: "",
        status: true, // boolean sesuai rule backend
    });

    // preload & reset ketika modal dibuka
    useEffect(() => {
        if (!isOpen) return;

        // preload form (edit vs tambah)
        if (feature == 2 && data) {
            setFormData({
                santri_id: data.santri_id || "",
                bank_id: data.bank_id || "",
                va_number: data.va_number || "",
                status: data.status == 1 ? true : false,
            });

            // jika dari list API sudah ada relasi santri, preload ke kartu
            setSantri(data.santri || "");
        } else {
            setFormData({
                santri_id: "",
                bank_id: "",
                va_number: "",
                status: true,
            });
            setSantri("");
        }

        // fetch daftar bank untuk dropdown
        const fetchBanks = async () => {
            try {
                setLoadingBanks(true);
                setErrorBanks("");
                const token = sessionStorage.getItem("token") || getCookie("token");
                const res = await fetch(`${API_BASE_URL}banks`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await res.json();

                if (res.status === 401 && !window.sessionExpiredShown) {
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

                if (!res.ok) {
                    throw new Error(json.message || "Gagal mengambil data bank.");
                }

                // asumsikan response memiliki array data bank (id, kode_bank, nama_bank)
                const list = Array.isArray(json.data.data) ? json.data.data : (Array.isArray(json) ? json : []);
                setBanks(list);
            } catch (err) {
                setErrorBanks(err.message || "Gagal mengambil data bank.");
            } finally {
                setLoadingBanks(false);
            }
        };

        fetchBanks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, feature, data, API_BASE_URL]);

    // sinkron santri terpilih -> formData.santri_id
    useEffect(() => {
        if (isOpen && feature == 2 && data.santri_id && menuSantri.length > 0) {
            const s = menuSantri.find((s) => s.id == data.santri_id)
            if (s) {
                setSantri(s)
            } else {
                setSantri(null)
            }
        }
    }, [isOpen, feature, data, menuSantri]);

    useEffect(() => {
        if (!isOpen) {
            setSantri(null)
            setSantriSelectionCancelled(false)
            setShowSelectSantri(false)
        }
    }, [isOpen])

    useEffect(() => {
        if (santri) {
            setFormData((prev) => ({
                ...prev,
                santri_id: santri.id,
            }));
        }
    }, [santri]);

    useEffect(() => {
        if (feature !== 1) return
        if (isOpen && (santri === null || santri === "")) {
            setShowSelectSantri(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, feature])

    useEffect(() => {
        if (feature !== 1) return
        // Only close modal if santri selection was explicitly cancelled and modal is not showing santri selector
        if (!showSelectSantri && (santri === null || santri === "") && santriSelectionCancelled) {
            onClose?.()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSelectSantri, santri, feature, santriSelectionCancelled])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.santri_id) {
            await Swal.fire({
                icon: "warning",
                title: "Santri belum dipilih",
                text: "Harap pilih Santri terlebih dahulu.",
            });
            return;
        }

        if (!formData.bank_id) {
            await Swal.fire({
                icon: "warning",
                title: "Bank belum dipilih",
                text: "Harap pilih Bank terlebih dahulu.",
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
                background: "transparent",
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: "p-0 shadow-none border-0 bg-transparent",
                },
            });

            const token = sessionStorage.getItem("token") || getCookie("token");

            const isEdit = feature === 2;
            const url = isEdit
                ? `${API_BASE_URL}virtual-accounts/${id}`
                : `${API_BASE_URL}virtual-accounts`;

            const method = isEdit ? "PUT" : "POST";

            const payload = {
                santri_id: formData.santri_id,
                bank_id: formData.bank_id,
                va_number: formData.va_number,
                status: formData.status, // boolean
            };
            console.log("Payload:", payload);

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            Swal.close();

            if (response.status === 401 && !window.sessionExpiredShown) {
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
                text: isEdit ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.",
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
                {/* Overlay */}
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

                {/* Content */}
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
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-3xl sm:align-middle relative">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <Dialog.Title className="text-lg leading-6 font-medium text-gray-900 text-center mb-8">
                                        {feature == 1 ? "Tambah Virtual Account" : "Edit Virtual Account"}
                                    </Dialog.Title>

                                    {/* FORM */}
                                    <div className="space-y-5">
                                        {/* Pilih Santri via modal */}
                                        {santri ? (
                                            <SantriInfoCard santri={santri} setShowSelectSantri={setShowSelectSantri} />
                                        ) : (
                                            <div className="text-center bg-gray-100 p-6 rounded-md border border-dashed border-gray-400">
                                                <p className="text-gray-600 mb-3">Belum ada Santri dipilih</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSelectSantri(true)}
                                                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Pilih Santri
                                                </button>
                                            </div>
                                        )}

                                        {/* Bank dropdown */}
                                        <div>
                                            <label htmlFor="bank_id" className="block text-gray-700">
                                                Bank *
                                            </label>
                                            <select
                                                id="bank_id"
                                                name="bank_id"
                                                value={formData.bank_id}
                                                onChange={(e) => setFormData({ ...formData, bank_id: e.target.value })}
                                                required
                                                disabled={loadingBanks || !!errorBanks}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                                            >
                                                <option value="">{loadingBanks ? "Memuat daftar bank..." : "Pilih Bank"}</option>
                                                {banks.map((b) => (
                                                    <option key={b.id} value={b.id}>
                                                        {b.kode_bank ? `${b.kode_bank} - ${b.nama_bank}` : b.nama_bank}
                                                    </option>
                                                ))}
                                            </select>
                                            {errorBanks && (
                                                <p className="text-red-600 text-sm mt-1">Gagal memuat daftar bank: {errorBanks}</p>
                                            )}
                                        </div>

                                        {/* VA Number */}
                                        <div>
                                            <label htmlFor="va_number" className="block text-gray-700">
                                                Nomor VA *
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                }}
                                                id="va_number"
                                                name="va_number"
                                                value={formData.va_number}
                                                onChange={(e) => setFormData({ ...formData, va_number: e.target.value })}
                                                maxLength={30}
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Masukkan Nomor VA"
                                            />
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formData.va_number.length}/30
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="block text-gray-700">Status *</label>
                                            <div className="flex space-x-4 mt-1">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value="true"
                                                        checked={formData.status === true}
                                                        onChange={() => setFormData({ ...formData, status: true })}
                                                        className="form-radio text-blue-500"
                                                    />
                                                    <span className="ml-2 text-gray-700">Aktif</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value="false"
                                                        checked={formData.status === false}
                                                        onChange={() => setFormData({ ...formData, status: false })}
                                                        className="form-radio text-blue-500"
                                                    />
                                                    <span className="ml-2 text-gray-700">Nonaktif</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>

            {/* Modal pilih santri */}
            <ModalSelectSantri
                isOpen={showSelectSantri}
                onClose={() => {
                    setShowSelectSantri(false)
                    if (!santri) {
                        setSantriSelectionCancelled(true)
                    }
                }}
                onSantriSelected={(santri) => setSantri(santri)}
                list={1}
            />
        </Transition>
    );
};
