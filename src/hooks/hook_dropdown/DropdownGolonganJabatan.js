import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const useDropdownGolonganJabatan = () => {
    const [menuGolonganJabatan, setMenuGolonganJabatan] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}dropdown/golongan-jabatan`)
            .then((res) => res.json())
            .then((data) => {
                const formatted = [
                    { label: "Pilih Golongan Jabatan", value: "" },
                    ...data.map((item) => ({
                        value: item.nama_golongan_jabatan,
                        label: item.nama_golongan_jabatan,
                    })),
                ];
                setMenuGolonganJabatan(formatted);
            })
            .catch((error) => {
                console.error("Gagal mengambil data golongan jabatan:", error);
                setMenuGolonganJabatan([
                    { label: "Pilih Golongan Jabatan", value: "" }
                ]);
            });
    }, []);

    return { menuGolonganJabatan };
};

export default useDropdownGolonganJabatan;
