import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownGrupWaliAsuh = () => {
    const [menuGrup, setMenuGrup] = useState([]);
    const [menuGrup2, setMenuGrup2] = useState([]);

    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        // const localData = sessionStorage.getItem("menuGrup");

        // if (localData) {
        //     try {
        //         setMenuGrup(JSON.parse(localData));
        //     } catch (error) {
        //         console.error("Gagal parsing data dari sessionStorage:", error);
        //         sessionStorage.removeItem("menuGrup");
        //     }
        // } else {
            fetch(`${API_BASE_URL}dropdown/grup?filter=tanpa_wali_asuh`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((resData) => {
                    // Respon API langsung berupa array
                    const dataArr = Array.isArray(resData) ? resData : [];
                    if (dataArr.length > 0) {
                        const formatted = [
                            { label: "Pilih Grup", value: "", id: null },
                            ...dataArr.map((item) => ({
                                id: item.id,
                                value: item.nama_grup,
                                label: item.nama_grup,
                            })),
                        ];
                        sessionStorage.setItem("menuGrup", JSON.stringify(formatted));
                        setMenuGrup(formatted);
                    } else {
                        throw new Error("Data tidak valid dari API");
                    }
                })
                .catch((error) => {
                    console.error("Gagal mengambil data grup:", error);
                    setMenuGrup([{ label: "Pilih Grup", value: "", id: null }]);
                });
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // const localData = sessionStorage.getItem("menuGrup2");

        // if (localData) {
        //     try {
        //         setMenuGrup2(JSON.parse(localData));
        //     } catch (error) {
        //         console.error("Gagal parsing data dari sessionStorage:", error);
        //         sessionStorage.removeItem("menuGrup2");
        //     }
        // } else {
            fetch(`${API_BASE_URL}dropdown/grup`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((resData) => {
                    // Respon API langsung berupa array
                    const dataArr = Array.isArray(resData) ? resData : [];
                    if (dataArr.length > 0) {
                        const formatted = [
                            // { label: "Pilih Grup", value: "", id: null },
                            ...dataArr.map((item) => ({
                                id: item.id,
                                value: item.nama_grup,
                                label: item.nama_grup,
                                wilayah: item.wilayah,
                            })),
                        ];
                        sessionStorage.setItem("menuGrup2", JSON.stringify(formatted));
                        setMenuGrup2(formatted);
                    } else {
                        throw new Error("Data tidak valid dari API");
                    }
                })
                .catch((error) => {
                    console.error("Gagal mengambil data grup:", error);
                    setMenuGrup2([{ label: "Pilih Grup", value: "", id: null }]);
                });
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return { menuGrup, menuGrup2 };
};

export default useDropdownGrupWaliAsuh;
