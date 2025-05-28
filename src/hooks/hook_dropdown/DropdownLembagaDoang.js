import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const useDropdownLembaga = () => {
    const [menuLembaga, setMenuLembaga] = useState([]);

    useEffect(() => {
        const localData = sessionStorage.getItem("menuLembaga");

        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                const formatted = [
                    { label: "Pilih Lembaga", value: "" },
                    ...parsedData.lembaga.map((item) => ({
                        value: item.id,
                        label: item.nama_lembaga,
                    })),
                ];
                setMenuLembaga(formatted);
            } catch (error) {
                console.error("Gagal parsing data lembaga dari sessionStorage:", error);
                sessionStorage.removeItem("menuLembaga");
            }
        } else {
            fetch(`${API_BASE_URL}dropdown/lembaga`)
                .then((res) => res.json())
                .then((data) => {
                    const formatted = [
                        { label: "Pilih Lembaga", value: "" },
                        ...data.lembaga.map((item) => ({
                            value: item.id,
                            label: item.nama_lembaga,
                        })),
                    ];
                    sessionStorage.setItem("menuLembaga", JSON.stringify(data));
                    setMenuLembaga(formatted);
                    console.log("Data lembaga berhasil diambil:", formatted);

                })
                .catch((error) => {
                    console.error("Gagal mengambil data lembaga:", error);
                    setMenuLembaga([{ label: "Pilih Lembaga", value: "" }]);
                });
        }
    }, []);

    return { menuLembaga };
};

export default useDropdownLembaga;