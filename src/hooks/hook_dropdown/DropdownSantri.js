import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownSantri = () => {
    const [menuSantri, setMenuSantri] = useState([]);
    const [menuSantriCatatan, setMenuSantriCatatan] = useState([]);
    const [menuSantriCard, setMenuSantriCard] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        // const localData = sessionStorage.getItem("menuSantri");

        // if (localData) {
        //     try {
        //         const parsedData = JSON.parse(localData);
        //         setMenuSantri(parsedData);
        //     } catch (error) {
        //         console.error("Gagal parsing data dari sessionStorage:", error);
        //         sessionStorage.removeItem("menuSantri");
        //     }
        // } else {
            fetch(`${API_BASE_URL}data-pokok/santri`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((resMeta) => {
                    const total = resMeta.total_data;
                    if (!total || isNaN(total)) throw new Error("Gagal mendapatkan total_data");

                    return fetch(`${API_BASE_URL}data-pokok/santri?limit=${total}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                })
                .then((res) => res.json())
                .then((resData) => {
                    if (Array.isArray(resData.data)) {
                        const formatted = [
                            { label: "Pilih Santri", value: "", id: null },
                            ...resData.data.map((item) => ({
                                bio_id: item.biodata_id,
                                id: item.id,
                                value: item.nama,
                                label: item.nama,
                                nis: item.nis || "-",
                                niup: item.niup || "-",
                                lembaga: item.lembaga || "-",
                                wilayah: item.wilayah || "-",   
                                kamar: item.kamar || "-",
                                tanggal_lahir: item.tanggal_lahir || "-",
                                tempat_lahir: item.tempat_lahir || "-",
                                kecamatan: item.kecamatan || "-",
                                kabupaten: item.kabupaten || "-",
                                provinsi: item.provinsi || "-",
                                jalan: item.jalan || "-",
                                blok: item.blok || "-",
                                angkatan: item.angkatan || "-",
                                kota_asal: item.kota_asal || "-",
                                foto_profil: item.foto_profil || "-",
                            })),
                        ];
                        sessionStorage.setItem("menuSantri", JSON.stringify(formatted));
                        setMenuSantri(formatted);
                    } else {
                        throw new Error("Data tidak valid dari API");
                    }
                })
                .catch((error) => {
                    console.error("Gagal mengambil data santri:", error);
                    setMenuSantri([{ label: "Pilih Santri", value: "", id: null }]);
                });
        // }
    }, [token]);

    // 🔽 Tambahan untuk menuSantriCatatan
    useEffect(() => {
        // const localDataCatatan = sessionStorage.getItem("menuSantriCatatan");

        // if (localDataCatatan) {
        //     try {
        //         const parsedData = JSON.parse(localDataCatatan);
        //         setMenuSantriCatatan(parsedData);
        //     } catch (error) {
        //         console.error("Gagal parsing data menuSantriCatatan:", error);
        //         sessionStorage.removeItem("menuSantriCatatan");
        //     }
        // } else {
            fetch(`${API_BASE_URL}dropdown/anakasuhcatatan`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((resData) => {
                    if (Array.isArray(resData)) {
                        const formatted = [
                            { label: "Pilih Santri Catatan", value: "", id: null },
                            ...resData.map((item) => ({
                                id: item.id,
                                value: item.nama,
                                label: item.nama,
                                nis: item.nis || "-",
                                lembaga: item.nama_lembaga || "-",
                                wilayah: item.nama_wilayah || "-",
                                kamar: item.nama_kamar || "-",
                            })),
                        ];
                        sessionStorage.setItem("menuSantriCatatan", JSON.stringify(formatted));
                        setMenuSantriCatatan(formatted);
                    } else {
                        throw new Error("Data tidak valid dari API");
                    }
                })
                .catch((error) => {
                    console.error("Gagal mengambil data santri catatan:", error);
                    setMenuSantriCatatan([{ label: "Pilih Santri Catatan", value: "", id: null }]);
                });
        // }
    }, [token]);

    useEffect(() => {
        // const localDataCard = sessionStorage.getItem("menuSantriCard");

        // if (localDataCard) {
        //     try {
        //         const parsedData = JSON.parse(localDataCard);
        //         setMenuSantriCard(parsedData);
        //     } catch (error) {
        //         console.error("Gagal parsing data menuSantriCard:", error);
        //         sessionStorage.removeItem("menuSantriCard");
        //     }
        // } else {
            // Fetch pertama untuk ambil total
            fetch(`${API_BASE_URL}kartu`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((resData) => {
                    if (resData && typeof resData.total === "number") {
                        const total = resData.total;

                        // Fetch kedua dengan limit = total
                        return fetch(`${API_BASE_URL}kartu?limit=${total}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    } else {
                        throw new Error("Response tidak valid saat ambil total");
                    }
                })
                .then((res) => res.json())
                .then((resData) => {
                    if (resData && Array.isArray(resData.data)) {
                        const formatted = [
                            { label: "Pilih Santri Card", value: "", id: null },
                            ...resData.data.map((item) => ({
                                id: item.santri_id,
                                value: item.nama,
                                label: item.nama,
                                uid_kartu: item.uid_kartu || "-",
                                nis: item.nis || "-",
                                lembaga: item.nama_lembaga || "-",
                                wilayah: item.nama_wilayah || "-",
                                kamar: item.nama_kamar || "-",
                            })),
                        ];
                        sessionStorage.setItem("menuSantriCard", JSON.stringify(formatted));
                        setMenuSantriCard(formatted);
                    } else {
                        throw new Error("Data tidak valid saat fetch semua data");
                    }
                })
                .catch((error) => {
                    console.error("Gagal mengambil data santri card:", error);
                    setMenuSantriCard([{ label: "Pilih Santri Card", value: "", id: null }]);
                });
        // }
    }, [token]);

    return { menuSantri, menuSantriCatatan, menuSantriCard };
};

export default useDropdownSantri;
