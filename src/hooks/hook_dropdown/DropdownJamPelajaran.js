import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownJamPelajaran = () => {
  const [menuJamPelajaran, setMenuJamPelajaran] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    const localData = sessionStorage.getItem("menuJamPelajaran");

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        setMenuJamPelajaran(parsedData);
      } catch (error) {
        console.error("Gagal parsing session menuJamPelajaran:", error);
        sessionStorage.removeItem("menuJamPelajaran");
      }
    } else {
      fetch(`${API_BASE_URL}crud/jam-pelajaran`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((resData) => {
          if (Array.isArray(resData.data)) {
            const formatted = [
              { label: "Pilih Jam Pelajaran", value: "", id: null },
              ...resData.data.map((item) => ({
                label: item.label,
                value: item.id,
                id: item.id,
                jam_ke: item.jam_ke,
                jam_mulai: item.jam_mulai?.slice(0, 5),
                jam_selesai: item.jam_selesai?.slice(0, 5),
              })),
            ];

            sessionStorage.setItem("menuJamPelajaran", JSON.stringify(formatted));
            setMenuJamPelajaran(formatted);
          } else {
            throw new Error("Data dari API tidak valid");
          }
        })
        .catch((error) => {
          console.error("Gagal mengambil data jam pelajaran:", error);
          setMenuJamPelajaran([{ label: "Pilih Jam Pelajaran", value: "", id: null }]);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const forceFetchDropdownJamPelajaran = async () => {
  const token = sessionStorage.getItem("token") || getCookie("token");

  try {
    const res = await fetch(`${API_BASE_URL}crud/jam-pelajaran`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = await res.json();

    if (!Array.isArray(resData.data)) {
      throw new Error("Data dari API tidak valid");
    }

    const formatted = [
      { label: "Pilih Jam Pelajaran", value: "", id: null },
      ...resData.data.map((item) => ({
        label: item.label,
        value: item.id,
        id: item.id,
        jam_ke: item.jam_ke,
        jam_mulai: item.jam_mulai?.slice(0, 5),  // Hilangkan detik
        jam_selesai: item.jam_selesai?.slice(0, 5),
      })),
    ];

    sessionStorage.setItem("menuJamPelajaran", JSON.stringify(formatted));
    console.log("Berhasil update session menuJamPelajaran");
    return formatted;
  } catch (err) {
    console.error("Gagal fetch ulang menuJamPelajaran:", err);
    throw err;
  }
};

  return { menuJamPelajaran, forceFetchDropdownJamPelajaran };
};

export default useDropdownJamPelajaran;
