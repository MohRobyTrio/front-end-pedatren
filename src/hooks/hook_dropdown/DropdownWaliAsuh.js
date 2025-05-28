import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const useDropdownWaliAsuh = () => {
  const [menuWaliAsuh, setMenuWaliAsuh] = useState([]);

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
      fetch(`${API_BASE_URL}dropdown/wali-asuh`)
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
  }, []);

  return { menuWaliAsuh };
};

export default useDropdownWaliAsuh;
