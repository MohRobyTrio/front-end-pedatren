import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const useDropdownGolonganJabatan = () => {
  const [menuGolonganJabatan, setMenuGolonganJabatan] = useState([]);

  useEffect(() => {
    const localData = sessionStorage.getItem("menuGolonganJabatan");

    if (localData) {   
      try {
        const parsedData = JSON.parse(localData);
        setMenuGolonganJabatan(parsedData);
      } catch (error) {
        console.error("Gagal parsing data dari sessionStorage:", error);
        sessionStorage.removeItem("menuGolonganJabatan");
      }
    } else {
      fetch(`${API_BASE_URL}dropdown/golongan-jabatan`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = [
            { label: "Pilih Golongan Jabatan", value: "", id: null },
            ...data.map((item) => ({
              id: item.id,
              value: item.nama_golongan_jabatan,
              label: item.nama_golongan_jabatan,
            })),
          ];

          sessionStorage.setItem("menuGolonganJabatan", JSON.stringify(formatted));
          setMenuGolonganJabatan(formatted);
        })
        .catch((error) => {
          console.error("Gagal mengambil data golongan jabatan:", error);
          setMenuGolonganJabatan([
            { label: "Pilih Golongan Jabatan", value: "", id: null },
          ]);
        });
    }
  }, []);

  return { menuGolonganJabatan };
};

export default useDropdownGolonganJabatan;
