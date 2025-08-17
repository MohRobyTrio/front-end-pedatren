import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownSantri = () => {
  const [menuSantri, setMenuSantri] = useState([]);
  const [menuSantriCatatan, setMenuSantriCatatan] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    const localData = sessionStorage.getItem("menuSantri");

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        setMenuSantri(parsedData);
      } catch (error) {
        console.error("Gagal parsing data dari sessionStorage:", error);
        sessionStorage.removeItem("menuSantri");
      }
    } else {
      fetch(`${API_BASE_URL}data-pokok/santri`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((resMeta) => {
          const total = resMeta.total_data;
          if (!total || isNaN(total)) throw new Error("Gagal mendapatkan total_data");

          return fetch(`${API_BASE_URL}data-pokok/santri?limit=${total}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
        .then((res) => res.json())
        .then((resData) => {
          if (Array.isArray(resData.data)) {
            const formatted = [
              { label: "Pilih Santri", value: "", id: null },
              ...resData.data.map((item) => ({
                bio_id: item.biodata_id,
                id: item.id,
                value: item.nama,
                label: item.nama,
                nis: item.nis || "-",
                niup: item.niup || "-",
                lembaga: item.lembaga || "-",
                wilayah: item.wilayah || "-",
                kamar: item.kamar || "-",
                blok: item.blok || "-",
                angkatan: item.angkatan || "-",
                kota_asal: item.kota_asal || "-",
                foto_profil: item.foto_profil || "-",
              })),
            ];
            sessionStorage.setItem("menuSantri", JSON.stringify(formatted));
            setMenuSantri(formatted);
          } else {
            throw new Error("Data tidak valid dari API");
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil data santri:", error);
          setMenuSantri([{ label: "Pilih Santri", value: "", id: null }]);
        });
    }
  }, [token]);

  // 🔽 Tambahan untuk menuSantriCatatan
  useEffect(() => {
    const localDataCatatan = sessionStorage.getItem("menuSantriCatatan");

    if (localDataCatatan) {
      try {
        const parsedData = JSON.parse(localDataCatatan);
        setMenuSantriCatatan(parsedData);
      } catch (error) {
        console.error("Gagal parsing data menuSantriCatatan:", error);
        sessionStorage.removeItem("menuSantriCatatan");
      }
    } else {
      fetch(`${API_BASE_URL}dropdown/anakasuhcatatan`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((resData) => {
          if (Array.isArray(resData)) {
            const formatted = [
              { label: "Pilih Santri Catatan", value: "", id: null },
              ...resData.map((item) => ({
                id: item.id,
                value: item.nama,
                label: item.nama,
                nis: item.nis || "-",
                lembaga: item.nama_lembaga || "-",
                wilayah: item.nama_wilayah || "-",
                kamar: item.nama_kamar || "-",
              })),
            ];
            sessionStorage.setItem("menuSantriCatatan", JSON.stringify(formatted));
            setMenuSantriCatatan(formatted);
          } else {
            throw new Error("Data tidak valid dari API");
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil data santri catatan:", error);
          setMenuSantriCatatan([{ label: "Pilih Santri Catatan", value: "", id: null }]);
        });
    }
  }, [token]);

  return { menuSantri, menuSantriCatatan };
};

export default useDropdownSantri;
