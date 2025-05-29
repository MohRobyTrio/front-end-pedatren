import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../hooks/config";
import { getCookie } from "../../../utils/cookieUtils";
import DropdownWilayah from "../../../hooks/hook_dropdown/DropdownWilayah";
import useLogout from "../../../hooks/Logout";

const Filters = ({ filterOptions, onChange, selectedFilters }) => {
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return (
    <div className="flex flex-col gap-4 w-full">
      {Object.entries(filterOptions).map(([label, options], index) => (
        <div key={`${label}-${index}`}>
          <label htmlFor={label} className="block text-gray-700">
            {capitalizeFirst(label)} {label === 'wilayah' ? '*' : ''}
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

export const ModalAddDomisiliFormulir = ({ isOpen, onClose, biodataId, cardId, refetchData, feature }) => {
  const { clearAuthData } = useLogout();
  const { filterWilayah, handleFilterChangeWilayah, selectedWilayah } = DropdownWilayah();

  const updateFirstOptionLabel = (list, label) =>
    list.length > 0
      ? [{ ...list[0], label }, ...list.slice(1)]
      : list;
      
  const updatedFilterWilayah = {
    wilayah: updateFirstOptionLabel(filterWilayah.wilayah, "Pilih Wilayah"),
    blok: updateFirstOptionLabel(filterWilayah.blok, "Pilih Blok"),
    kamar: updateFirstOptionLabel(filterWilayah.kamar, "Pilih Kamar"),
  };

  const isTambah = feature == 1;
  const endpoint = isTambah ? "domisili" : "domisili/pindah";
  const metod = isTambah ? "POST" : "PUT";
  const id = isTambah ? biodataId : cardId;    

  const [formData, setFormData] = useState({
    wilayah_id: "",
    blok_id: "",
    kamar_id: "",
    tanggal_masuk: ""
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      wilayah_id: selectedWilayah.wilayah || "",
      blok_id: selectedWilayah.blok || "",
      kamar_id: selectedWilayah.kamar || "",
    }));
  }, [selectedWilayah]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.wilayah_id || !formData.tanggal_masuk) {
      await Swal.fire({
        icon: "error",
        title: "Data tidak lengkap",
        text: "Wilayah dan Tanggal Mulai wajib diisi",
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
        text: "Data domisili berhasil disimpan.",
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
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-2 sm:mt-0 text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                      >
                        {isTambah ? 'Tambah Data Domisili' : 'Pindah Domisili'}
                      </Dialog.Title>

                      <div className="space-y-4">    
                        <Filters 
                          filterOptions={updatedFilterWilayah} 
                          onChange={handleFilterChangeWilayah} 
                          selectedFilters={selectedWilayah} 
                        />     

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

                        {/* <div> */}
                          {/* <label htmlFor="tanggal_keluar" className="block text-gray-700">Tanggal Akhir</label> */}
                          {/* <input
                            type="date"
                            id="tanggal_keluar"
                            name="tanggal_keluar"
                            value={formData.tanggal_keluar}
                            onChange={(e) => setFormData({ ...formData, tanggal_keluar: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          /> */}
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </div>

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

export const ModalKeluarDomisiliFormulir = ({ isOpen, onClose, id, refetchData }) => {
  const { clearAuthData } = useLogout();
  const [formData, setFormData] = useState({
    tanggal_keluar: ""
  });    

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tanggal_keluar) {
      await Swal.fire({
        icon: "error",
        title: "Data tidak lengkap",
        text: "Tanggal keluar wajib diisi",
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
      const response = await fetch(`${API_BASE_URL}formulir/${id}/domisili/keluar`, {
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
        text: "Data domisili berhasil diperbarui.",
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
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-2 sm:mt-0 text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900 text-center mb-8"
                      >
                        Masukkan Tanggal Keluar
                      </Dialog.Title>

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
                      </div>
                    </div>
                  </div>
                </div>

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