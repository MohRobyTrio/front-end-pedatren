import { useEffect, useState } from "react";
import { getCookie } from "../../../utils/cookieUtils";
import { API_BASE_URL } from "../../config";

const DropdownSholat = () => {
    const [menuSholat, setMenuSholat] = useState([]);
    const [menuJadwalSholat, setMenuJadwalSholat] = useState([]);
    const token = sessionStorage.getItem("token") || sessionStorage.getItem("auth_token_ortu") || getCookie("token");

    useEffect(() => {
        // const localData = sessionStorage.getItem("menuSholat");

        // if (localData) {
        //     const parsedData = JSON.parse(localData);

        //     setMenuSholat([
        //         ...parsedData.map((s) => ({
        //             value: s.id,
        //             label: s.nama_sholat
        //         }))
        //     ]);
        // } else {
            fetch(`${API_BASE_URL}sholat`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    // simpan ke sessionStorage
                    // sessionStorage.setItem("menuSholat", JSON.stringify(data));

                    setMenuSholat([
                        // { label: "Pilih Sholat", value: "" },
                        ...data.map((s) => ({
                            value: s.id,
                            label: s.nama_sholat
                        }))
                    ]);
                })
                .catch((error) => {
                    console.error("Error fetching sholat:", error);
                });
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // const localData = sessionStorage.getItem("menuJadwalSholat");

        // if (localData) {
        //     const parsedData = JSON.parse(localData);

        //     setMenuJadwalSholat([
        //         ...parsedData.map((s) => ({
        //             value: s.id,
        //             label: `${s.sholat.nama_sholat} (${s.jam_mulai}, ${s.jam_selesai})`
        //         }))
        //     ]);
        // } else {
            fetch(`${API_BASE_URL}jadwal-sholat`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    // simpan ke sessionStorage
                    // sessionStorage.setItem("menuJadwalSholat", JSON.stringify(data));

                    setMenuJadwalSholat([
                        // { label: "Pilih Sholat", value: "" },
                        ...data.map((s) => ({
                            value: s.id,
                            label: `${s.sholat.nama_sholat} (${s.jam_mulai}, ${s.jam_selesai})`
                        }))
                    ]);
                })
                .catch((error) => {
                    console.error("Error fetching sholat:", error);
                });
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { menuSholat, menuJadwalSholat };
};

export default DropdownSholat;
