import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownSatuanKerja = () => {
    const [menuSatuanKerja, setMenuSatuanKerja] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        fetch(`${API_BASE_URL}dropdown/satuan-kerja`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                const formatted = [
                    { label: "Pilih Satuan Kerja", value: "" },
                    ...data.map((item) => ({
                        value: item.nama_satuan_kerja,
                        label: item.nama_satuan_kerja,
                    })),
                ];
                setMenuSatuanKerja(formatted);
            })
            .catch((error) => {
                console.error("Gagal mengambil data satuan kerja:", error);
                setMenuSatuanKerja([
                    { label: "Pilih Satuan Kerja", value: "" }
                ]);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { menuSatuanKerja };
};

export default useDropdownSatuanKerja;
