import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownGolonganJabatan = () => {
    const [menuGolonganJabatan, setMenuGolonganJabatan] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        // const localData = sessionStorage.getItem("menuGolonganJabatan");

        // if (localData) {
        //     try {
        //         const parsedData = JSON.parse(localData);
        //         setMenuGolonganJabatan(parsedData);
        //     } catch (error) {
        //         console.error("Gagal parsing data dari sessionStorage:", error);
        //         sessionStorage.removeItem("menuGolonganJabatan");
        //     }
        // } else {
            fetch(`${API_BASE_URL}dropdown/golongan-jabatan`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    const formatted = [
                        { label: "Pilih Golongan Jabatan", value: "", val: "", id: "null" },
                        ...data.map((item) => ({
                            id: item.id,
                            val: item.id,
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
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { menuGolonganJabatan };
};

export default useDropdownGolonganJabatan;
