import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const useDropdownSatuanKerja = () => {
    const [menuSatuanKerja, setMenuSatuanKerja] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}dropdown/satuan-kerja`)
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
    }, []);

    return { menuSatuanKerja };
};

export default useDropdownSatuanKerja;
