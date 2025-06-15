import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownWaliAsuh = () => {
  const [menuWaliAsuh, setMenuWaliAsuh] = useState([]);
  const [menuWaliAsuh2, setMenuWaliAsuh2] = useState([]);
  const [menuWaliAsuh3, setMenuWaliAsuh3] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    const localData = sessionStorage.getItem("menuWaliAsuh");

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        setMenuWaliAsuh(parsedData);
      } catch (error) {
        console.error("Gagal parsing data dari sessionStorage:", error);
        sessionStorage.removeItem("menuWaliAsuh");
      }
    } else {
      fetch(`${API_BASE_URL}dropdown/wali-asuh`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        .then((res) => res.json())
        .then((resData) => {
          if (resData.status && Array.isArray(resData.data)) {
            const formatted = [
              { label: "Pilih Wali Asuh", value: "", id: null },
              ...resData.data.map((item) => ({
                id: item.id,
                value: item.nama,
                label: item.nama,
              })),
            ];

            sessionStorage.setItem("menuWaliAsuh", JSON.stringify(formatted));
            setMenuWaliAsuh(formatted);
          } else {
            throw new Error("Data tidak valid dari API");
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil data wali asuh:", error);
          setMenuWaliAsuh([
            { label: "Pilih Wali Asuh", value: "", id: null },
          ]);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch untuk /dropdown/waliasuh
  useEffect(() => {
    const local2 = sessionStorage.getItem("menuWaliAsuh2");

    if (local2) {
      try {
        setMenuWaliAsuh2(JSON.parse(local2));
      } catch {
        sessionStorage.removeItem("menuWaliAsuh2");
      }
    } else {
      fetch(`${API_BASE_URL}dropdown/waliasuh`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        .then((res) => res.json())
        .then((resData) => {
          if (Array.isArray(resData)) {
            const formatted = [
              { label: "Pilih Wali Asuh", value: "", id: "" },
              ...resData.map((item) => ({
                id: item.id,
                value: item.nama,
                label: `${item.nama} (${item.nama_grup})`,
              })),
            ];
            sessionStorage.setItem("menuWaliAsuh2", JSON.stringify(formatted));
            setMenuWaliAsuh2(formatted);
          }
        })
        .catch(() =>
          setMenuWaliAsuh2([{ label: "Pilih Wali Asuh", value: "", id: "" }])
        );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  const localData = sessionStorage.getItem("menuWaliAsuh3");

  if (localData) {
    try {
      const parsedData = JSON.parse(localData);
      setMenuWaliAsuh3(parsedData);
    } catch (error) {
      console.error("Gagal parsing data dari sessionStorage:", error);
      sessionStorage.removeItem("menuWaliAsuh3");
    }
  } else {
    fetch(`${API_BASE_URL}data-pokok/waliasuh`, {
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

          return fetch(`${API_BASE_URL}data-pokok/waliasuh?limit=${total}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        })
      .then((res) => res.json())
      .then((resData) => {
        if (Array.isArray(resData.data)) {
          const formatted = [
            { label: "Pilih Wali Asuh", value: "", id: null },
            ...resData.data.map((item) => ({
              ...item,
              value: item.nama || "-", // untuk keperluan dropdown
              label: item.nama || "-", // untuk keperluan dropdown
            })),
          ];

          sessionStorage.setItem("menuWaliAsuh3", JSON.stringify(formatted));
          setMenuWaliAsuh3(formatted);
        } else {
          throw new Error("Data tidak valid dari API");
        }
      })
      .catch((error) => {
        console.error("Gagal mengambil data wali asuh:", error);
        setMenuWaliAsuh3([{ label: "Pilih Wali Asuh", value: "", id: null }]);
      });
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  return { menuWaliAsuh, menuWaliAsuh2, menuWaliAsuh3 };
};

export default useDropdownWaliAsuh;
