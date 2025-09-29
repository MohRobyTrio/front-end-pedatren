import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownPengajar = () => {
  const [menuPengajar, setMenuPengajar] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    // const localData = sessionStorage.getItem("menuPengajar");
    // // console.log("Data dari sessionStorage:", localData);

    // if (localData) {
    //   try {
    //     const parsedData = JSON.parse(localData);
    //     // console.log("Parsed sessionStorage data:", parsedData);
    //     setMenuPengajar(parsedData);
    //   } catch (error) {
    //     console.error("Gagal parsing data dari sessionStorage:", error);
    //     sessionStorage.removeItem("menuPengajar");
    //   }
    // } else {
      console.log("Mengambil data dari API...");
      fetch(`${API_BASE_URL}data-pokok/pengajar`, {
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

          return fetch(`${API_BASE_URL}data-pokok/pengajar?limit=${total}`, {
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
              { label: "Pilih Pengajar", value: "", id: null },
              ...resData.data.map((item) => ({
                ...item, 
              })),
            ];

            console.log("Final formatted data:", formatted);
            console.log("Jumlah data santri:", formatted.length - 1);

            sessionStorage.setItem("menuPengajar", JSON.stringify(formatted));
            setMenuPengajar(formatted);
          } else {
            throw new Error("Data tidak valid dari API");
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil data santri:", error);
          setMenuPengajar([{ label: "Pilih Pengajar", value: "", id: null }]);
        });
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("Current menuPengajar state:", menuPengajar);

  return { menuPengajar };
};

export default useDropdownPengajar;