import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownKategori = () => {
  const [menuKategori, setMenuKategori] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    const localData = sessionStorage.getItem("menuKategori");

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        setMenuKategori(parsedData);
      } catch (error) {
        console.error("Gagal parsing session menuKategori:", error);
        sessionStorage.removeItem("menuKategori");
      }
    } else {
      fetch(`${API_BASE_URL}dropdown-kategori`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((resData) => {
          if (Array.isArray(resData.data)) {
            const formatted = [
              ...resData.data.map((item) => ({
                kategori_id: item.kategori_id,
                nama_kategori: item.nama_kategori,
                nama_outlet: item.nama_outlet,
                label: `${item.nama_kategori} (${item.nama_outlet})`
              })),
            ];

            sessionStorage.setItem("menuKategori", JSON.stringify(formatted));
            setMenuKategori(formatted);
          } else {
            throw new Error("Data dari API tidak valid");
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil data kategori:", error);
          setMenuKategori([]);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { menuKategori };
};

export default useDropdownKategori;