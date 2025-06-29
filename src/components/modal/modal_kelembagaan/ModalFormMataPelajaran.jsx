import Swal from "sweetalert2";
import useLogout from "../../../hooks/Logout";
import { Fragment, useEffect, useState } from "react";
import { getCookie } from "../../../utils/cookieUtils";
import { API_BASE_URL } from "../../../hooks/config";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ModalSelectPengajar } from "../../ModalSelectPengajar";
import { PengajarInfoCard } from "../../CardInfo";
import { FaPlus } from "react-icons/fa";
import { ModalAddMateriPengajarFormulir } from "../modal_formulir/ModalFormPengajar";
import useDropdownPengajar from "../../../hooks/hook_dropdown/DropdownPengajar";
import useDropdownMataPelajaran from "../../../hooks/hook_dropdown/DropdownMataPelajaran";

const ModalAddOrEditMataPelajaran = ({ isOpen, onClose, data, refetchData, feature }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const { menuPengajar } = useDropdownPengajar();
    const { forceFetchDropdownMataPelajaran } = useDropdownMataPelajaran();
    const [pengajar, setPengajar] = useState("");
    const [showSelectPengajar, setShowSelectPengajar] = useState(false);
    const id = data?.id;
    const [formData, setFormData] = useState({
        pengajar_id: "",
        kode_mapel: '',
        nama_mapel: '',
    });
    const [materiList, setMateriList] = useState([]);
    const [form, setForm] = useState({ kode_mapel: '', nama_mapel: '' });
    const [showAddMateriModal, setShowAddMateriModal] = useState(false);

    const handleRemove = (indexToRemove) => {
        const updatedList = materiList.filter((_, index) => index !== indexToRemove)
        setMateriList(updatedList)
    }

    const handleAdd = () => {
        // e.preventDefault();
        if (!form.nama_mapel && !form.kode_mapel) return

        setMateriList([
            ...materiList,
            {
                kode_mapel: form.kode_mapel,
                nama_mapel: form.nama_mapel
            }
        ])
        setForm({ kode_mapel: '', nama_mapel: '' })
        closeAddMateriModal();
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        if (isOpen) {

            if (feature == 2 && data) {
                setFormData({
                    pengajar_id: data.pengajar_id || "",
                    kode_mapel: data.kode_mapel || "",
                    nama_mapel: data.nama_mapel || ""
                });
            } else {
                // Reset saat tambah (feature === 1)
                setPengajar("");
                setFormData({
                    pengajar_id: "",
                });
            }
        }
    }, [isOpen, feature, data]);

    useEffect(() => {
        console.log(formData);

    }, [formData]);

    useEffect(() => {
        if (isOpen && feature === 1 && pengajar?.pengajar_id && formData !== pengajar.pengajar_id) {
            console.log("data pengajar berubah", pengajar.pengajar_id);
            setFormData((prev) => ({ ...prev, pengajar_id: pengajar.pengajar_id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pengajar, isOpen, feature]);

    useEffect(() => {

        if (isOpen && feature == 2 && formData.pengajar_id && menuPengajar.length > 0) {
            const s = menuPengajar.find((s) => s.pengajar_id == formData.pengajar_id);
            if (s) setPengajar(s);
        }
    }, [isOpen, feature, formData.pengajar_id, menuPengajar]);

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

            // Tentukan URL dan method berdasarkan feature
            const isEdit = feature === 2;
            const url = isEdit
                ? `${API_BASE_URL}formulir/${id}/update`
                : `${API_BASE_URL}formulir/mata-pelajaran`;

            const method = isEdit ? "PUT" : "POST";

            // Tentukan data yang dikirim
            const payload = isEdit
                ? {
                    ...formData,
                } : {
                    pengajar_id: formData.pengajar_id,
                    mata_pelajaran: materiList.map(item => ({
                        kode_mapel: item.kode_mapel || null,
                        nama_mapel: item.nama_mapel || null,
                    }))
                };
            console.log("Payload yang dikirim ke API:", JSON.stringify(payload, null, 2));

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

            refetchData?.();
            forceFetchDropdownMataPelajaran?.();
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
                        leave="transition-transform duration-200 ease-in"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-lg sm:max-w-2xl sm:align-middle">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <ModalAddMateriPengajarFormulir isOpen={showAddMateriModal} onClose={closeAddMateriModal} handleAdd={handleAdd} form={form} handleChange={handleChange} feature={feature} />

                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                            >
                                                {feature === 2
                                                    ? "Edit Data"
                                                    : pengajar && feature === 1
                                                        ? "Tambah Data Baru"
                                                        : null}
                                            </Dialog.Title>

                                            {(feature == 1 && !pengajar) && (
                                                <div className="mb-4 flex justify-center">
                                                    <div className="w-full max-w-2xl text-center">

                                                        <h2 className="text-lg font-semibold mb-4">
                                                            Pilih Data Pengajar Terlebih Dahulu
                                                        </h2>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSelectPengajar(true)}
                                                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                        >
                                                            Pilih Pengajar
                                                        </button>
                                                    </div>
                                                </div>

                                            )}
                                            <PengajarInfoCard pengajar={pengajar} setShowSelectPengajar={setShowSelectPengajar} />
                                            {/* FORM ISI */}
                                            {(pengajar && feature == 2) && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="kode_mapel" className="block text-gray-700">Kode Mapel *</label>
                                                        <input
                                                            type="text"
                                                            name="kode_mapel"
                                                            placeholder="Masukkan Kode Mapel"
                                                            value={formData.kode_mapel}
                                                            onChange={(e) => setFormData({ ...formData, kode_mapel: e.target.value })}
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
                                                            value={formData.nama_mapel}
                                                            onChange={(e) => setFormData({ ...formData, nama_mapel: e.target.value })}
                                                            required
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {(pengajar && feature == 1) && (
                                        <>
                                            <h1 className={`text-black font-bold flex items-center justify-between w-full mb-2`}>
                                                Mata Pelajaran
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        openAddMateriModal();
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
                                        </>
                                    )}
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
            <ModalSelectPengajar
                isOpen={showSelectPengajar}
                onClose={() => setShowSelectPengajar(false)}
                onPengajarSelected={(pengajar) => setPengajar(pengajar)}
            />
        </Transition>
    );
};

export default ModalAddOrEditMataPelajaran;