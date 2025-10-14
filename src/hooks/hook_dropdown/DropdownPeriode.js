import { useEffect, useState } from "react";
import { getCookie } from "../../utils/cookieUtils";
import { API_BASE_URL } from "../config";

const useDropdownPeriode = () => {
    const [menuPeriode, setMenuPeriode] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        let url = `${API_BASE_URL}tagihan-santri/pembayaran/filters`;

        fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((resData) => {
                if (Array.isArray(resData.periodes)) {
                    const formattedPeriodes = resData.periodes.map((periode) => ({
                        value: periode,
                        label: periode,
                    }));

                    setMenuPeriode(formattedPeriodes);
                } else {
                    throw new Error("Data dari API tidak valid");
                }
            })
            .catch((error) => {
                console.error("Gagal mengambil data periode:", error);
                setMenuPeriode([]);
            });
    }, []);

    const menuPeriodeWithOptions = [
        { value: "", label: "Semua Periode" },
        ...menuPeriode
    ];

    return { menuPeriode: menuPeriodeWithOptions };
};

export default useDropdownPeriode;