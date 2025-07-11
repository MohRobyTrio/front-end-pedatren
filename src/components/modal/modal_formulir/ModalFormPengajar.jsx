import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../hooks/config";
import { getCookie } from "../../../utils/cookieUtils";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
import { FaPlus } from "react-icons/fa";
import useLogout from "../../../hooks/Logout";
import { jenisJabatan } from "../../../data/menuData";
import { useNavigate } from "react-router-dom";
import DropdownGolonganGabungan from "../../../hooks/hook_dropdown/DropdownGolonganGabungan";

const Filters = ({ filterOptions, onChange, selectedFilters }) => {
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return (
        <div className="flex flex-col gap-4 w-full">
            {Object.entries(filterOptions).map(([label, options], index) => (
                <div key={`${label}-${index}`}>
                    <label htmlFor={label} className="block text-gray-700">
                        {capitalizeFirst(label)} *
                    </label>
                    <select
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${options.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                        onChange={(e) => onChange({ [label]: e.target.value })}
                        value={selectedFilters[label] || ""}
                        disabled={options.length <= 1}
                        required
                    >
                        {options.map((option, idx) => (
                            <option key={idx} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};


export const ModalAddPengajarFormulir = ({ isOpen, onClose, biodataId, cardId, refetchData, feature, handleAddAPI }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { filterLembaga, handleFilterChangeLembaga, selectedLembaga } = DropdownLembaga();
    const { gabunganList } = DropdownGolonganGabungan();

    useEffect(() => {
        if (isOpen) {
            handleFilterChangeLembaga({ lembaga: '' })
            setFormData({
                lembaga_id: "",
                golongan_id: "",
                jabatan: "",
                tahun_masuk: ""
            });
            setForm({ nama_mapel: '' });
            setMateriList([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Ubah label index ke-0 menjadi "Pilih ..."
    const updateFirstOptionLabel = (list, label) =>
        list.length > 0
            ? [{ ...list[0], label }, ...list.slice(1)]
            : list;

    // Buat versi baru filterLembaga yang labelnya diubah
    const updatedFilterLembaga = {
        lembaga: updateFirstOptionLabel(filterLembaga.lembaga, "Pilih Lembaga")
    };

    const isTambah = feature == 1;
    const endpoint = isTambah ? "pengajar" : "pengajar/pindah";
    const metod = isTambah ? "POST" : "PUT";
    const id = isTambah ? biodataId : cardId;

    // console.log("id :",id);
    // console.log("id :",feature);

    const [formData, setFormData] = useState({
        lembaga_id: "",
        golongan_id: "",
        jabatan: "",
        tahun_masuk: ""
    });
    const [materiList, setMateriList] = useState([]);
    const [form, setForm] = useState({ kode_mapel: '', nama_mapel: '' });
    const [showAddMateriModal, setShowAddMateriModal] = useState();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleAdd = () => {
        // e.preventDefault();
        if (!form.nama_mapel && !form.kode_mapel) return

        setMateriList([
            ...materiList,
            { kode_mapel: form.kode_mapel,
            nama_mapel: form.nama_mapel }
        ])
        setForm({ kode_mapel: '', nama_mapel: '' })
        closeAddMateriModal();
    }

    const handleRemove = (indexToRemove) => {
        const updatedList = materiList.filter((_, index) => index !== indexToRemove)
        setMateriList(updatedList)
    }

    // useEffect(() => {
    //     console.log(formData);
    // }, [formData])

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            lembaga_id: selectedLembaga.lembaga || ""
        }));
    }, [selectedLembaga]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmResult = await Swal.fire({
            title: "Yakin ingin mengirim data?",
            text: "Pastikan semua data sudah benar!",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, kirim",
            cancelButtonText: "Batal",
        });

        if (!confirmResult.isConfirmed) return;

        if (feature === 3) {
            await handleAddAPI(formData, materiList);
            return;
        }

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
            console.log("token :", token);


            // const nama_materi = materiList.map(item => item.nama);
            // const jumlah_menit = materiList.map(item => parseInt(item.menit));
            // const tahun_masuk_materi_ajar = materiList.map(item => item.tahun_masuk || null);
            // const tahun_akhir_materi_ajar = materiList.map(item => item.tahun_akhir || null);

            let payload = { ...formData };

            if (feature == 1) {
                // Struktur untuk feature 1
                payload = {
                    ...formData,
                    mata_pelajaran: materiList.map(item => ({
                        kode_mapel: item.kode_mapel || null,
                        nama_mapel: item.nama_mapel || null,
                        // jumlah_menit: item.menit ? parseInt(item.menit) : null,
                    })),
                    // jumlah_menit: materiList.map(item => parseInt(item.menit)),
                    // tahun_masuk_materi_ajar: materiList.map(item => item.tahun_masuk || null),
                    // tahun_akhir_materi_ajar: materiList.map(item => item.tahun_akhir || null),
                };
            } else if (feature == 2) {
                // Struktur untuk feature 2
                payload = {
                    ...formData,
                    mata_pelajaran: materiList.map(item => ({
                        kode_mapel: item.kode_mapel || null,
                        nama_mapel: item.nama_mapel || null,
                        // jumlah_menit: item.menit ? parseInt(item.menit) : null,
                    })),
                };
            }

            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

            const response = await fetch(`${API_BASE_URL}formulir/${id}/${endpoint}`, {
                method: metod,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });


            const result = await response.json();

            // console.log(result);
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
            // ✅ Kalau HTTP 500 atau fetch gagal, ini akan dilempar ke catch
            if (!response.ok) {
                if (response.status == 422) {
                    const errorList = Object.values(result.errors || {})
                        .flat()
                        .map(msg => `<li>${msg}</li>`)
                        .join("");

                    await Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        html: `<ul style="text-align: center; padding-left: 20px;">${errorList}</ul>`,
                    });
                    return;
                }
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            // ✅ Jika status dari backend false meskipun HTTP 200
            if (!("data" in result)) {


                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: center;">${result.message}</div>`,
                });
                return; // Jangan lempar error, cukup berhenti
            }

            // ✅ Sukses
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            refetchData?.();
            onClose?.(); // tutup modal jika ada
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                // text: "Terjadi kesalahan saat mengirim data.",
                html: `<div style="text-align: center;">${error.message}</div>`,
            });
        }
    };

    const closeAddMateriModal = () => {
        setShowAddMateriModal(false);
    };

    const openAddMateriModal = () => {
        setShowAddMateriModal(true);
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
                        leave="transition-transform duration-300 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className={`inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-sm ${feature == 1 ? 'sm:max-w-xl' : 'sm:max-w-lg'} sm:align-middle`}>
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
                                                {feature === 1 ? "Tambah Data Baru" : feature == 2 ? "Pindah" : "Tambah Materi"}
                                            </Dialog.Title>

                                            {showAddMateriModal && (
                                                <ModalAddMateriPengajarFormulir isOpen={showAddMateriModal} onClose={closeAddMateriModal} handleAdd={handleAdd} form={form} handleChange={handleChange} feature={feature} />
                                            )}

                                            {/* FORM ISI */}
                                            {feature != 3 && (
                                                <div className="space-y-4">
                                                    <>
                                                        <Filters filterOptions={updatedFilterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />

                                                        <div>
                                                            <label htmlFor="golongan" className="block text-gray-700">Golongan *</label>
                                                            <select
                                                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${gabunganList.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
                                                                onChange={(e) => setFormData({ ...formData, golongan_id: e.target.value })}
                                                                value={formData.golongan_id}
                                                                disabled={gabunganList.length <= 1}
                                                                required
                                                            >
                                                                {gabunganList.map((golongan, idx) => (
                                                                    <option key={idx} value={golongan.id}>
                                                                        {golongan.GolonganNama}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="golongan" className="block text-gray-700">Jenis Jabatan *</label>
                                                            <select
                                                                className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                                                                value={formData.jabatan}
                                                                required
                                                            >
                                                                {jenisJabatan.map((item, idx) => (
                                                                    <option key={idx} value={item.value}>
                                                                        {item.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="tahun_masuk" className="block text-gray-700">Tanggal Masuk *</label>
                                                            <input
                                                                type="date"
                                                                id="tahun_masuk"
                                                                name="tahun_masuk"
                                                                value={formData.tahun_masuk}
                                                                onChange={(e) => setFormData({ ...formData, tahun_masuk: e.target.value })}
                                                                required
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            />
                                                        </div>
                                                    </>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h1 className={`text-black font-bold flex items-center justify-between w-full mb-2 ${feature != 3 ? 'mt-4' : ''}`}>
                                        Mata Pelajaran
                                        <button
                                            type="button"
                                            onClick={() => {
                                                openAddMateriModal();
                                                console.log("add");
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded w-12 hover:bg-blue-800 cursor-pointer"
                                        >
                                            <FaPlus />
                                        </button>
                                    </h1>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm text-left">
                                            <thead className="bg-gray-100 text-gray-700 whitespace-nowrap">
                                                <tr>
                                                    <th className="px-3 py-2 border-b">No</th>
                                                    <th className="px-3 py-2 border-b">Kode Mapel</th>
                                                    <th className="px-3 py-2 border-b">Nama Mapel</th>
                                                    <th className="px-3 py-2 border-b">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-800">
                                                {materiList.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                                        <td className="px-3 py-2 border-b">{index + 1}</td>
                                                        <td className="px-3 py-2 border-b">{item.kode_mapel}</td>
                                                        <td className="px-3 py-2 border-b">{item.nama_mapel}</td>
                                                        {/* <td className="px-3 py-2 border-b">{item.menit}</td> */}
                                                        <td className="px-3 py-2 border-b">
                                                            <button
                                                                onClick={() => handleRemove(index)}
                                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {materiList.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-6">Belum Ada Materi</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>


                                {/* Footer Button */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
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

export const ModalKeluarPengajarFormulir = ({ isOpen, onClose, id, refetchData }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tahun_akhir: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            const response = await fetch(`${API_BASE_URL}formulir/${id}/pengajar/keluar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });


            const result = await response.json();
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
            // ✅ Kalau HTTP 500 atau fetch gagal, ini akan dilempar ke catch
            if (!response.ok) {
                throw new Error(result.message || "Terjadi kesalahan pada server.");
            }

            // ✅ Jika status dari backend false meskipun HTTP 200
            if (!("data" in result)) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    html: `<div style="text-align: left;">${result.message}</div>`,
                });
                return; // Jangan lempar error, cukup berhenti
            }

            // console.log(result);

            // ✅ Sukses
            await Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Data berhasil dikirim.",
            });

            refetchData?.();
            onClose?.(); // tutup modal jika ada
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            await Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Terjadi kesalahan saat mengirim data.",
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
                        leave="transition-transform duration-300 ease-in"
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
                                                Masukkan Tanggal
                                            </Dialog.Title>

                                            {/* FORM ISI */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="tahun_akhir" className="block text-gray-700">Tanggal Keluar *</label>
                                                    <input
                                                        type="date"
                                                        id="tahun_akhir"
                                                        name="tahun_akhir"
                                                        value={formData.tahun_akhir}
                                                        onChange={(e) => setFormData({ ...formData, tahun_akhir: e.target.value })}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Button */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
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

export const ModalAddMateriPengajarFormulir = ({ isOpen, onClose, handleAdd, form, handleChange, feature }) => {
    console.log(feature);

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
                        leave="transition-transform duration-300 ease-in"
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

                            {/* <form className="w-full" onSubmit={handleAdd}> */}
                            {/* Header */}
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-2 sm:mt-0 text-left w-full">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                        >
                                            Tambah Materi Ajar
                                        </Dialog.Title>

                                        {/* FORM ISI */}
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="kode_mapel" className="block text-gray-700">Kode Mapel *</label>
                                                <input
                                                    type="text"
                                                    name="kode_mapel"
                                                    placeholder="Masukkan Kode Mapel"
                                                    value={form.kode_mapel}
                                                    onChange={handleChange}
                                                    required
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="nama_mapel" className="block text-gray-700">Nama Mapel *</label>
                                                <input
                                                    type="text"
                                                    name="nama_mapel"
                                                    placeholder="Masukkan Nama Mapel"
                                                    value={form.nama_mapel}
                                                    onChange={handleChange}
                                                    required
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            {/* {feature === 1 && (
                                                    <>
                                                <div>
                                                    <label htmlFor="periode_akhir" className="block text-gray-700">Tahun Masuk Materi Ajar *</label>
                                                    <input
                                                        type="date"
                                                        name="tahun_masuk"
                                                        placeholder="Tahun Masuk Materi Ajar"
                                                        value={form.tahun_masuk}
                                                        onChange={handleChange}
                                                        required
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    />
                                                </div>
                                                </>
                                                )} */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Button */}
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAdd();
                                    }}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Simpan
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                            {/* </form> */}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};
