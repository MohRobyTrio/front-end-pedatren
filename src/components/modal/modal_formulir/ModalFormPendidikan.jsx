import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../hooks/config";
import { getCookie } from "../../../utils/cookieUtils";
import DropdownLembaga from "../../../hooks/hook_dropdown/DropdownLembaga";
import useLogout from "../../../hooks/Logout";

const Filters = ({ filterOptions, onChange, selectedFilters }) => {
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return (
    <div className="flex flex-col gap-4 w-full">
      {Object.entries(filterOptions).map(([label, options], index) => (
        <div key={`${label}-${index}`}>
          <label htmlFor={label} className="block text-gray-700">
            {capitalizeFirst(label)} {label === 'lembaga' ? '*' : ''}
          </label>
          <select
            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${options.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`}
            onChange={(e) => onChange({ [label]: e.target.value })}
            value={selectedFilters[label] || ""}
            disabled={options.length <= 1}
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

export const ModalAddPendidikanFormulir = ({ isOpen, onClose, biodataId, cardId, refetchData, feature }) => {
  const { clearAuthData } = useLogout();
  const { filterLembaga, handleFilterChangeLembaga, selectedLembaga } = DropdownLembaga();

  // Ubah label index ke-0 menjadi "Pilih ..."
  const updateFirstOptionLabel = (list, label) =>
    list.length > 0
      ? [{ ...list[0], label }, ...list.slice(1)]
      : list;

  // Buat versi baru filterLembaga yang labelnya diubah
  const updatedFilterLembaga = {
    lembaga: updateFirstOptionLabel(filterLembaga.lembaga, "Pilih Lembaga"),
    jurusan: updateFirstOptionLabel(filterLembaga.jurusan, "Pilih Jurusan"),
    kelas: updateFirstOptionLabel(filterLembaga.kelas, "Pilih Kelas"),
    rombel: updateFirstOptionLabel(filterLembaga.rombel, "Pilih Rombel"),
  };

  const isTambah = feature == 1;
  const endpoint = isTambah ? "pendidikan" : "pendidikan/pindah";
  const metod = isTambah ? "POST" : "PUT";
  const id = isTambah ? biodataId : cardId;

  const [formData, setFormData] = useState({
    lembaga_id: "",
    jurusan_id: "",
    kelas_id: "",
    rombel_id: "",
    no_induk: "",
    tanggal_masuk: ""
    // tanggal_keluar: "",
    // status: ""
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      lembaga_id: selectedLembaga.lembaga || "",
      jurusan_id: selectedLembaga.jurusan || "",
      kelas_id: selectedLembaga.kelas || "",
      rombel_id: selectedLembaga.rombel || "",
    }));
  }, [selectedLembaga]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!formData.lembaga_id || !formData.no_induk || !formData.tanggal_masuk) {
      await Swal.fire({
        icon: "error",
        title: "Data tidak lengkap",
        text: "Lembaga, Nomor Induk, dan Tanggal Mulai wajib diisi",
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
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(`${API_BASE_URL}formulir/${id}/${endpoint}`, {
        method: metod,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        await Swal.fire({
          title: "Sesi Berakhir",
          text: "Sesi anda telah berakhir, silakan login kembali.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        clearAuthData();
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Terjadi kesalahan pada server.");
      }

      if (!("data" in result)) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          html: `<div style="text-align: center;">${result.message}</div>`,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data pendidikan berhasil disimpan.",
      });

      refetchData?.();
      onClose?.();
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
          leave="transition-opacity duration-200"
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
                        {isTambah ? 'Tambah Data Pendidikan' : 'Pindah Pendidikan'}
                      </Dialog.Title>

                      {/* FORM ISI */}
                      <div className="space-y-4">
                        <Filters
                          filterOptions={updatedFilterLembaga}
                          onChange={handleFilterChangeLembaga}
                          selectedFilters={selectedLembaga}
                        />

                        <div>
                          <label htmlFor="no_induk" className="block text-gray-700">Nomor Induk *</label>
                          <input
                            type="text"
                            id="no_induk"
                            name="no_induk"
                            value={formData.no_induk}
                            onChange={(e) => setFormData({ ...formData, no_induk: e.target.value })}
                            maxLength={50}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Masukkan Nomor Induk"
                          />
                        </div>

                        <div>
                          <label htmlFor="tanggal_masuk" className="block text-gray-700">Tanggal Mulai *</label>
                          <input
                            type="date"
                            id="tanggal_masuk"
                            name="tanggal_masuk"
                            value={formData.tanggal_masuk}
                            onChange={(e) => setFormData({ ...formData, tanggal_masuk: e.target.value })}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        {/* Komentar field tanggal_keluar */}
                        {/* <div>
                          <label htmlFor="tanggal_keluar" className="block text-gray-700">Tanggal Akhir</label>
                          <input
                            type="date"
                            id="tanggal_keluar"
                            name="tanggal_keluar"
                            value={formData.tanggal_keluar}
                            onChange={(e) => setFormData({ ...formData, tanggal_keluar: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div> */}

                        {/* Komentar field status */}
                        {/* <div>
                          <label htmlFor="status" className="block text-gray-700">Status</label>
                          <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Pilih Status</option>
                            <option value="aktif">Aktif</option>
                            <option value="tidak aktif">Tidak Aktif</option>
                          </select>
                        </div> */}
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

export const ModalKeluarPendidikanFormulir = ({ isOpen, onClose, id, refetchData }) => {
  const { clearAuthData } = useLogout();
  const [formData, setFormData] = useState({
    tanggal_keluar: "",
    status: "" // Tambahkan field status
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tanggal_keluar || !formData.status) {
      await Swal.fire({
        icon: "error",
        title: "Data tidak lengkap",
        text: "Tanggal keluar dan status wajib diisi",
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
      const token = sessionStorage.getItem("token") || getCookie("token");
      const response = await fetch(`${API_BASE_URL}formulir/${id}/pendidikan/keluar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        await Swal.fire({
          title: "Sesi Berakhir",
          text: "Sesi anda telah berakhir, silakan login kembali.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        clearAuthData();
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Terjadi kesalahan pada server.");
      }

      if (!("data" in result)) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          html: `<div style="text-align: left;">${result.message}</div>`,
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data pendidikan berhasil diperbarui.",
      });

      refetchData?.();
      onClose?.();
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
          leave="transition-opacity duration-200"
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
                        Masukkan Tanggal Keluar
                      </Dialog.Title>

                      {/* FORM ISI */}
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="tanggal_keluar" className="block text-gray-700">Tanggal Keluar *</label>
                          <input
                            type="date"
                            id="tanggal_keluar"
                            name="tanggal_keluar"
                            value={formData.tanggal_keluar}
                            onChange={(e) => setFormData({ ...formData, tanggal_keluar: e.target.value })}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="status" className="block text-gray-700">Status *</label>
                          <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Pilih Status</option>
                            <option value="do">DropOut</option>
                            <option value="berhenti">Berhenti</option>
                            <option value="cuti">Cuti</option>
                            <option value="alumni">Alumni</option>
                            <option value="nonaktif">Non Aktif</option>
                          </select>

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