import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const DropdownGolonganGabungan = () => {
    const [gabunganList, setGabunganList] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const localData = sessionStorage.getItem("menuGolonganGabungan");

        if (localData) {
            const parsedData = JSON.parse(localData);
            setGabunganList([
                { id: "", GolonganNama: "Pilih Golongan" },
                ...parsedData
            ]);
        } else {
            fetch(`${API_BASE_URL}dropdown/golongan-gabungan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    const combinedData = data.combined || [];
                    const formatted = [
                        { id: "", GolonganNama: "Pilih Golongan" },
                        ...combinedData
                    ];
                    setGabunganList(formatted);
                    sessionStorage.setItem("menuGolonganGabungan", JSON.stringify(combinedData));
                })
                .catch((err) => {
                    console.error("Error fetching gabungan golongan:", err);
                    setGabunganList([{ id: "", GolonganNama: "Pilih Golongan" }]);
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { gabunganList };
};

export default DropdownGolonganGabungan;
