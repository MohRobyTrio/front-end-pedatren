import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import { getRolesString } from "../../utils/getRolesString";

// const useDropdownKategori = () => {
//   const [menuKategori, setMenuKategori] = useState([]);
//   const token = sessionStorage.getItem("token") || getCookie("token");

//   useEffect(() => {
//     const localData = sessionStorage.getItem("menuKategori");

//     if (localData) {
//       try {
//         const parsedData = JSON.parse(localData);
//         setMenuKategori(parsedData);
//       } catch (error) {
//         console.error("Gagal parsing session menuKategori:", error);
//         sessionStorage.removeItem("menuKategori");
//       }
//     } else {
//       fetch(`${API_BASE_URL}dropdown-kategori`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then((res) => res.json())
//         .then((resData) => {
//           if (Array.isArray(resData.data)) {
//             const formatted = [
//               ...resData.data.map((item) => ({
//                 kategori_id: item.kategori_id,
//                 nama_kategori: item.nama_kategori,
//                 nama_outlet: item.nama_outlet,
//                 label: `${item.nama_kategori} (${item.nama_outlet})`
//               })),
//             ];

//             sessionStorage.setItem("menuKategori", JSON.stringify(formatted));
//             setMenuKategori(formatted);
//           } else {
//             throw new Error("Data dari API tidak valid");
//           }
//         })
//         .catch((error) => {
//           console.error("Gagal mengambil data kategori:", error);
//           setMenuKategori([]);
//         });
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   return { menuKategori };
// };

// export default useDropdownKategori;


const useDropdownKategori = (outletId) => {
  const [menuKategori, setMenuKategori] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");
  const role = getRolesString();

  useEffect(() => {
    // Khusus Superadmin wajib pilih outlet dulu
    if (role === "Superadmin" && !outletId) {
      setMenuKategori([]);
      return;
    }

    const localData = sessionStorage.getItem("menuKategori");

    // Jika bukan Superadmin, langsung gunakan cache bila ada
    if (role !== "Superadmin" && localData) {
      try {
        const parsedData = JSON.parse(localData);
        setMenuKategori(parsedData);
        return;
      } catch (error) {
        console.error("Gagal parsing session menuKategori:", error);
        sessionStorage.removeItem("menuKategori");
      }
    }

    // Fetch data
    let url = `${API_BASE_URL}dropdown-kategori`;
    if (role === "Superadmin") {
      url += `?outlet_id=${outletId}`;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (Array.isArray(resData.data)) {
          const formatted = resData.data.map((item) => ({
            kategori_id: item.kategori_id,
            nama_kategori: item.nama_kategori,
            nama_outlet: item.nama_outlet,
            label: `${item.nama_kategori} (${item.nama_outlet})`,
          }));

          if (role !== "Superadmin") {
            // cache hanya untuk role biasa
            sessionStorage.setItem("menuKategori", JSON.stringify(formatted));
          }

          setMenuKategori(formatted);
        } else {
          throw new Error("Data dari API tidak valid");
        }
      })
      .catch((error) => {
        console.error("Gagal mengambil data kategori:", error);
        setMenuKategori([]);
      });
  }, [outletId, role, token]);

  return { menuKategori };
};

export default useDropdownKategori;
