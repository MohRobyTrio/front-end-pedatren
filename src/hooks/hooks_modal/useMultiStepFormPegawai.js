import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";
import { jenisBerkasList } from "../../data/menuData";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";

const useMultiStepFormPegawai = ({ onClose, refetchData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [unlockedTabs, setUnlockedTabs] = useState([0]);
  const { clearAuthData } = useLogout();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const watchedValues = watch();

  useEffect(() => {
    console.log("Data inputan berubah:", watchedValues);
  }, [watchedValues]);

  const nextStep = async () => {
    const form = document.querySelector("form");
    if (form && !form.reportValidity()) return;

    const valid = await trigger(getFieldsForTab(activeTab));
    if (!valid) return;

    const nextTab = activeTab + 1;
    if (!unlockedTabs.includes(nextTab)) {
      setUnlockedTabs([...unlockedTabs, nextTab]);
    }
    setActiveTab(nextTab);
  };

  const getFieldsForTab = (tabId) => {
    switch (tabId) {
      case 0:
        return [];
      case 1:
        return [];
      case 2:
        return [];
      case 3:
        return [];
      default:
        return [];
    }
  };

  const onValidSubmit = async (data) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Yakin ingin mengirim data?",
        text: "Pastikan semua data sudah benar!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, kirim",
        cancelButtonText: "Batal",
      });

      if (!confirmResult.isConfirmed) return;
      Swal.fire({
        title: "Mohon tunggu...",
        html: "Sedang proses.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();

      // === Append data dari modalPegawai (field utama) ===
      if (data.modalPegawai) {
        Object.entries(data.modalPegawai).forEach(([key, val]) => {
          if (val !== null && val !== undefined) {
            formData.append(key, val);
          }
        });
      }

      // === Append file berkas ===
      const berkas = [];
      for (let i = 1; i <= 18; i++) {
        const fileKey = `file_${i}`;
        if (data.modalPegawai[fileKey]) {
          berkas.push({
            file: data.modalPegawai[fileKey],
            jenis_berkas_id: i.toString(),
          });
        }
      }

      berkas.forEach((b, i) => {
        formData.append(`berkas[${i}][jenis_berkas_id]`, b.jenis_berkas_id);
        formData.append(`berkas[${i}][file_path]`, b.file);
      });

      // === Eksekusi API ===
      const token = getCookie("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}crud/pegawai`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      // console.log(result);

      console.log(result);
      Swal.close();
      // === Cek response ===
      if (response.status === 401) {
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
        const errorMessages = result.errors
          ? Object.entries(result.errors).map(
              ([field, messages]) =>
                `- ${field.replace(/_/g, " ")}: ${messages.join(", ")}`
            )
          : [result.message || "Gagal mengirim data"];

        await Swal.fire({
          icon: "error",
          title: "Gagal",
          html: `<div style="text-align: left;">${errorMessages.join(
            "<br>"
          )}</div>`,
        });

        throw new Error(result.message);
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: result.message,
      });

      const allFields = {
        ...Object.fromEntries(
          Object.keys(data.modalPegawai || {}).map((key) => [key, ""])
        ),
        ...Object.fromEntries(
          Array.from({ length: 18 }, (_, i) => [`file_${i + 1}`, null])
        ),
      };

      reset({ modalPegawai: allFields });
      setActiveTab(0); // kembali ke tab pertama
      setUnlockedTabs([0]);
      refetchData?.(true);
      onClose?.();
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const onInvalidSubmit = (errors) => {
    const fileErrors = Object.keys(errors)
      .filter((key) => key.startsWith("file_"))
      .map((key) => {
        const id = parseInt(key.split("_")[1], 10);
        const berkas = jenisBerkasList.find((item) => item.id === id);
        return `- ${berkas?.label || `Berkas ${id}`} wajib diisi`;
      });

    if (fileErrors.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Berkas wajib diunggah",
        html: `<pre style="text-align: left;">${fileErrors.join("<br>")}</pre>`,
      });
    }
  };

  const prevStep = () => {
    const prevTab = activeTab - 1;
    if (prevTab >= 0) setActiveTab(prevTab);
  };

  const resetData = () => {
    const currentModalPegawai = watch("modalPegawai") || {};

    const allFields = {
      ...Object.fromEntries(
        Object.keys(currentModalPegawai).map((key) => [key, ""])
      ),
      ...Object.fromEntries(
        Array.from({ length: 18 }, (_, i) => [`file_${i + 1}`, null])
      ),
    };

    reset({ modalPegawai: allFields });
    setActiveTab(0); // kembali ke tab pertama
    setUnlockedTabs([0]);
  };

  return {
    register,
    handleSubmit,
    control,
    setValue,
    resetData,
    watch,
    errors,
    activeTab,
    unlockedTabs,
    setActiveTab,
    nextStep,
    prevStep,
    onValidSubmit,
    onInvalidSubmit,
  };
};

export default useMultiStepFormPegawai;
