import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const useDropdownSantri = () => {
  const [menuSantri, setMenuSantri] = useState([]);

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
      fetch(`${API_BASE_URL}data-pokok/santri`)
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
  }, []);

  return { menuSantri };
};

export default useDropdownSantri;
