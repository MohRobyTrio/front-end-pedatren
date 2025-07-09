import Swal from "sweetalert2";
import useLogout from "../../../hooks/Logout";
import { Fragment, useEffect, useRef, useState } from "react";
import { getCookie } from "../../../utils/cookieUtils";
import { API_BASE_URL } from "../../../hooks/config";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import useDropdownMataPelajaran from "../../../hooks/hook_dropdown/DropdownMataPelajaran";
import useDropdownJamPelajaran from "../../../hooks/hook_dropdown/DropdownJamPelajaran";

// const Filters = ({ filterOptions, onChange, selectedFilters }) => {
//     const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
//     return (
//         <div className="flex flex-col gap-4 w-full">
//             {Object.entries(filterOptions).map(([label, options], index) => (
//                 <div key={`${label}-${index}`}>
//                     <label htmlFor={label} className="block text-gray-700">
//                         {capitalizeFirst(label)} *
//                     </label>
//                     <select
//                         className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${options.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
//                         onChange={(e) => onChange({ [label]: e.target.value })}
//                         value={selectedFilters[label] || ""}
//                         disabled={options.length <= 1}
//                         required
//                     >
//                         {options.map((option, idx) => (
//                             <option key={idx} value={option.value}>{option.label}</option>
//                         ))}
//                     </select>
//                 </div>
//             ))}
//         </div>
//     );
// };

export const ModalAddOrEditJadwalPelajaran = ({ isOpen, onClose, data, refetchData }) => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    // const { menuSemester } = DropdownSemester();
    const { menuMataPelajaran } = useDropdownMataPelajaran();
    const { menuJamPelajaran } = useDropdownJamPelajaran();
    // const { filterLembaga, handleFilterChangeLembaga, selectedLembaga } = DropdownLembaga();
    const [formData, setFormData] = useState({
        lembaga_id: "",
        jurusan_id: '',
        kelas_id: '',
        rombel_id: '',
        semester_id: '',
    });
    const [materiList, setMateriList] = useState([]);
    const [form, setForm] = useState({ hari: '', mata_pelajaran: '', jam_pelajaran: '' });
    const [showAddMateriModal, setShowAddMateriModal] = useState(false);

    // const updateFirstOptionLabel = (list, label) =>
    //     list.length > 0
    //         ? [{ ...list[0], label }, ...list.slice(1)]
    //         : list;

    // Buat versi baru filterLembaga yang labelnya diubah
    // const updatedFilterLembaga = {
    //     lembaga: updateFirstOptionLabel(filterLembaga.lembaga, "Pilih Lembaga"),
    //     jurusan: updateFirstOptionLabel(filterLembaga.jurusan, "Pilih Jurusan"),
    //     kelas: updateFirstOptionLabel(filterLembaga.kelas, "Pilih Kelas"),
    //     rombel: updateFirstOptionLabel(filterLembaga.rombel, "Pilih Rombel"),
    // };

    useEffect(() => {
        setFormData({
            lembaga_id: data.lembaga_id,
            jurusan_id: data.jurusan_id,
            kelas_id: data.kelas_id,
            rombel_id: data.rombel_id,
            semester_id: data.semester_id
        })
    }, [data, isOpen])

    useEffect(() => {
        console.log("data modal", formData);
    }, [formData]);

    const handleRemove = (indexToRemove) => {
        const updatedList = materiList.filter((_, index) => index !== indexToRemove)
        setMateriList(updatedList)
    }

    const handleAdd = () => {
        // e.preventDefault();
        if (!form.hari && !form.mata_pelajaran && !form.jam_pelajaran) return

        setMateriList([
            ...materiList,
            {
                hari: form.hari,
                mata_pelajaran: form.mata_pelajaran,
                jam_pelajaran: form.jam_pelajaran,
            }
        ])
        setForm({ hari: '', mata_pelajaran: '', jam_pelajaran: '' })
        closeAddMateriModal();
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // useEffect(() => {
    //     if (isOpen) {

    //         if (feature == 2 && data) {
    //             setFormData({
    //                 pengajar_id: data.pengajar_id || "",
    //                 kode_mapel: data.kode_mapel || "",
    //                 nama_mapel: data.nama_mapel || ""
    //             });
    //         } else {
    //             // Reset saat tambah (feature === 1)
    //             setPengajar("");
    //             setFormData({
    //                 pengajar_id: "",
    //             });
    //         }
    //     }
    // }, [isOpen, feature, data]);

    // useEffect(() => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         lembaga_id: selectedLembaga.lembaga || "",
    //         jurusan_id: selectedLembaga.jurusan || "",
    //         kelas_id: selectedLembaga.kelas || "",
    //         rombel_id: selectedLembaga.rombel || "",
    //     }));
    // }, [selectedLembaga]);

    useEffect(() => {
        console.log(formData);

    }, [formData]);

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
            const url = `${API_BASE_URL}crud/jadwal-pelajaran`;

            const method = "POST";

            // Tentukan data yang dikirim
            const payload = {
                ...formData,
                jadwal: materiList.map(item => ({
                    hari: item.hari || null,
                    jam_pelajaran_id: item.jam_pelajaran || null,
                    mata_pelajaran_id: item.mata_pelajaran || null,
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
        setForm({
            hari: "",
            mata_pelajaran: "",
            jam_pelajaran: ""
        });
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
                        <Dialog.Panel className="inline-block overflow-y-auto align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all w-full max-w-md sm:max-w-lg sm:align-middle">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>

                            <ModalAddJadwalPelajaranFormulir isOpen={showAddMateriModal} onClose={closeAddMateriModal} handleAdd={handleAdd} form={form} handleChange={handleChange} feature={1} />

                            <form className="w-full" onSubmit={handleSubmit}>
                                {/* Header */}
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-2 sm:mt-0 text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                                            >
                                                Tambah Data Baru
                                            </Dialog.Title>
                                            {/* FORM ISI */}
                                            {/* <div className="space-y-4">
                                                <Filters filterOptions={updatedFilterLembaga} onChange={handleFilterChangeLembaga} selectedFilters={selectedLembaga} />
                                                <div>
                                                    <label htmlFor="semester_id" className="block text-gray-700">
                                                        Semester *
                                                    </label>
                                                    <select
                                                        name="semester_id"
                                                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                        onChange={(e) => setFormData((prev) => ({ ...prev, semester_id: e.target.value }))}
                                                        value={formData.semester_id}
                                                        required
                                                    >
                                                        {menuSemester.map((option, idx) => (
                                                            <option key={idx} value={option.value}>{option.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                    <h1 className={`text-black font-bold flex items-center justify-between w-full mb-2`}>
                                        Jadwal Pelajaran
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
                                                    <th className="px-3 py-2 border-b">Hari</th>
                                                    <th className="px-3 py-2 border-b">Jam Pelajaran</th>
                                                    <th className="px-3 py-2 border-b">Mata Pelajaran</th>
                                                    <th className="px-3 py-2 border-b">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-800">
                                                {materiList.map((item, index) => {
                                                    const mataPelajaran = menuMataPelajaran.find((opt) => opt.value == item.mata_pelajaran);
                                                    const jamPelajaran = menuJamPelajaran.find((opt) => opt.value == item.jam_pelajaran);

                                                    return (
                                                        <tr key={index} className="hover:bg-gray-50 whitespace-nowrap text-left">
                                                            <td className="px-3 py-2 border-b">{index + 1}</td>
                                                            <td className="px-3 py-2 border-b">{item.hari}</td>
                                                            <td className="px-3 py-2 border-b">
                                                                {jamPelajaran
                                                                    ? `${jamPelajaran.label} (${jamPelajaran.jam_mulai}-${jamPelajaran.jam_selesai})`
                                                                    : item.jam_pelajaran}
                                                            </td>
                                                            <td className="px-3 py-2 border-b">
                                                                {mataPelajaran
                                                                    ? mataPelajaran.kode_mapel
                                                                        ? `(${mataPelajaran.kode_mapel}) ${mataPelajaran.label}`
                                                                        : mataPelajaran.label
                                                                    : item.mata_pelajaran}
                                                            </td>
                                                            <td className="px-3 py-2 border-b">
                                                                <button
                                                                    onClick={() => handleRemove(index)}
                                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {materiList.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-6">Belum Ada Jadwal</td>
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

export const ModalAddJadwalPelajaranFormulir = ({ isOpen, onClose, handleAdd, form, handleChange, feature }) => {
    const { menuMataPelajaran } = useDropdownMataPelajaran();
    const { menuJamPelajaran } = useDropdownJamPelajaran();

    // Tambahkan state untuk input autocomplete mata pelajaran
    const [mataPelajaranSearch, setMataPelajaranSearch] = useState("");
    const [showDropdownMataPelajaran, setShowDropdownMataPelajaran] = useState(false);

    // Ref untuk mendeteksi klik di luar dropdown mata pelajaran
    const mataPelajaranWrapperRef = useRef(null);

    const filteredMataPelajaran = menuMataPelajaran.filter((option) =>
        option.label.toLowerCase().includes(mataPelajaranSearch.toLowerCase()) ||
        (option.kode_mapel && option.kode_mapel.toLowerCase().includes(mataPelajaranSearch.toLowerCase()))
    );


    // Fungsi saat memilih mata pelajaran dari dropdown
    const handleSelectMataPelajaran = (item) => {
        // Misal, jika form.mata_pelajaran harus berisi value pilihan:
        handleChange({
            target: { name: "mata_pelajaran", value: item.value },
        });
        // Atau jika kamu ingin menyimpan label di form, sesuaikan saja



        setMataPelajaranSearch(
            item.kode_mapel ? `(${item.kode_mapel}) ${item.label}` : item.label
        );

        setShowDropdownMataPelajaran(false);
    };

    useEffect(() => {
        console.log("selected mapel", form.mata_pelajaran);
    }, [form])

    // useEffect untuk menangani klik di luar dropdown mata pelajaran
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mataPelajaranWrapperRef.current &&
                !mataPelajaranWrapperRef.current.contains(event.target)
            ) {
                setShowDropdownMataPelajaran(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (!isOpen) {
            setMataPelajaranSearch("");
        }
    }, [isOpen]);


    useEffect(() => {
        const selected = menuMataPelajaran.find((opt) => opt.value == form.mata_pelajaran);

        if (selected) {
            setMataPelajaranSearch(
                selected.kode_mapel ? `(${selected.kode_mapel}) ${selected.label}` : selected.label
            );
        }

        // if (form) {
        //     setMataPelajaranSearch("");
        // }
    }, [form.mata_pelajaran, menuMataPelajaran, isOpen, form]);


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
                                            {feature == 1 ? "Tambah" : "Edit"} Jadwal Pelajaran
                                        </Dialog.Title>

                                        {/* FORM ISI */}
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="hari" className="block text-gray-700">Hari *</label>
                                                <select
                                                    name="hari"
                                                    value={form.hari}
                                                    onChange={handleChange}
                                                    required
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Pilih Hari</option>
                                                    <option value="Senin">Senin</option>
                                                    <option value="Selasa">Selasa</option>
                                                    <option value="Rabu">Rabu</option>
                                                    <option value="Kamis">Kamis</option>
                                                    <option value="Jumat">Jumat</option>
                                                    <option value="Sabtu">Sabtu</option>
                                                    <option value="Minggu">Minggu</option>
                                                </select>
                                            </div>
                                            {/* <div>
                                                <label htmlFor="mata_pelajaran" className="block text-gray-700">Mata Pelajaran *</label>
                                                <select
                                                    name="mata_pelajaran"
                                                    className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                    onChange={handleChange}
                                                    value={form.mata_pelajaran}
                                                    required
                                                >
                                                    {menuMataPelajaran.map((option, idx) => (
                                                        <option key={idx} value={option.value}>
                                                            {option.kode_mapel ? `(${option.kode_mapel}) ${option.label}` : option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div> */}
                                            <div className="relative" ref={mataPelajaranWrapperRef}>
                                                <label htmlFor="mata_pelajaran" className="block text-gray-700">Mata Pelajaran *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Cari Mata Pelajaran"
                                                    value={mataPelajaranSearch}
                                                    onChange={(e) => {
                                                        setMataPelajaranSearch(e.target.value)
                                                        setShowDropdownMataPelajaran(true)
                                                    }}
                                                    onFocus={() => setShowDropdownMataPelajaran(true)}
                                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />

                                                {showDropdownMataPelajaran && mataPelajaranSearch && filteredMataPelajaran.length > 0 && (
                                                    <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-sm max-h-48 overflow-y-auto">
                                                        {filteredMataPelajaran.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                onClick={() => handleSelectMataPelajaran(item)}
                                                                className="p-2 cursor-pointer hover:bg-gray-50"
                                                            >
                                                                {item.kode_mapel ? `(${item.kode_mapel}) ${item.label}` : item.label}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="jam_pelajaran" className="block text-gray-700">Jam Pelajaran *</label>
                                                <select
                                                    name="jam_pelajaran"
                                                    className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                                                    onChange={handleChange}
                                                    value={form.jam_pelajaran}
                                                    required
                                                >
                                                    {menuJamPelajaran.map((option, idx) => (
                                                        <option key={idx} value={option.value}>
                                                            {option.value ? `${option.label} (${option.jam_mulai}-${option.jam_selesai})` : option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
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
