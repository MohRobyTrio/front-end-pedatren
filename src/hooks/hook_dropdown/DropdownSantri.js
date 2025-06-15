import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownSantri = () => {
  const [menuSantri, setMenuSantri] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    const localData = sessionStorage.getItem("menuSantri");
    // console.log("Data dari sessionStorage:", localData);

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        // console.log("Parsed sessionStorage data:", parsedData);
        setMenuSantri(parsedData);
      } catch (error) {
        console.error("Gagal parsing data dari sessionStorage:", error);
        sessionStorage.removeItem("menuSantri");
      }
    } else {
      console.log("Mengambil data dari API...");
      fetch(`${API_BASE_URL}data-pokok/santri`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        .then((res) => res.json())
        .then((resMeta) => {
          console.log("Meta response:", resMeta);
          const total = resMeta.total_data;
          if (!total || isNaN(total))
            throw new Error("Gagal mendapatkan total_data");

          return fetch(`${API_BASE_URL}data-pokok/santri?limit=${total}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        })
        .then((res) => res.json())
        .then((resData) => {
          // console.log("Full API Response:", resData);
          // console.log("First item detail:", resData.data[0]);
          
          if (Array.isArray(resData.data)) {
            const formatted = [
              { label: "Pilih Santri", value: "", id: null },
              ...resData.data.map((item) => {
                const formattedItem = {
                  bio_id: item.biodata_id,
                  id: item.id,
                  value: item.nama,
                  label: item.nama,
                  //list tambahan :3
                  nis: item.nis || '-',
                  niup: item.niup || '-',
                  lembaga: item.lembaga || '-',
                  wilayah: item.wilayah || '-',
                  kamar: item.kamar || '-',
                  blok: item.blok || '-',
                  angkatan: item.angkatan || '-',
                  kota_asal: item.kota_asal || '-',
                  foto_profil: item.foto_profil || '-'
                };
                // console.log("Formatted item:", formattedItem);
                return formattedItem;
              }),
            ];

            console.log("Final formatted data:", formatted);
            console.log("Jumlah data santri:", formatted.length - 1);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("Current menuSantri state:", menuSantri);

  return { menuSantri };
};

export default useDropdownSantri;