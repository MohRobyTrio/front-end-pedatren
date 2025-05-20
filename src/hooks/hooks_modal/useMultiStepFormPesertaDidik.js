import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

export function useMultiStepFormPesertaDidik(onClose, jenisBerkasList) {
  const [activeTab, setActiveTab] = useState(0);
  const [unlockedTabs, setUnlockedTabs] = useState([0]);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
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

  const prevStep = () => {
    const prevTab = activeTab - 1;
    if (prevTab >= 0) setActiveTab(prevTab);
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

      const formData = new FormData();
      // Append all form data (singkat)
      Object.entries(data).forEach(([key, val]) => {
        if (!key.startsWith("file_")) {
          formData.append(key, val);
        }
      });

      const berkas = [];
      for (let i = 1; i <= 18; i++) {
        const fileKey = `file_${i}`;
        if (data[fileKey]) {
          berkas.push({ file: data[fileKey], jenis_berkas_id: i.toString() });
        }
      }

      berkas.forEach((b, i) => {
        formData.append(`berkas[${i}][jenis_berkas_id]`, b.jenis_berkas_id);
        formData.append(`berkas[${i}][file_path]`, b.file);
      });

      const token =
        getCookie("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}crud/pesertadidik`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

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
        text: "Data berhasil dikirim.",
      });

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

  return {
    register,
    handleSubmit,
    control,
    setValue,
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
}
