import { useEffect, useState } from "react";
import { getCookie } from "../../../utils/cookieUtils";
import { API_BASE_URL } from "../../config";

const DropdownTahunAjaran = () => {
    const [menuTahunAjaran, setMenuTahunAjaran] = useState([]);
    const token = sessionStorage.getItem("token") || sessionStorage.getItem("auth_token_ortu") || getCookie("token");

    useEffect(() => {
        // const localData = sessionStorage.getItem("menuTahunAjaran");

        // if (localData) {
        //     const parsedData = JSON.parse(localData);

        //     setMenuTahunAjaran([
        //         ...parsedData.map((s) => ({
        //             value: s.id,
        //             label: s.nama_tahunAjaran
        //         }))
        //     ]);
        // } else {
            fetch(`${API_BASE_URL}data-pokok/tahun-ajaran`, {
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
                    // sessionStorage.setItem("menuTahunAjaran", JSON.stringify(data));

                    setMenuTahunAjaran([
                        // { label: "Pilih TahunAjaran", value: "" },
                        ...data.data.map((s) => ({
                            value: s.id,
                            label: s.tahun_ajaran
                        }))
                    ]);
                })
                .catch((error) => {
                    console.error("Error fetching tahunAjaran:", error);
                });
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { menuTahunAjaran };
};

export default DropdownTahunAjaran;
