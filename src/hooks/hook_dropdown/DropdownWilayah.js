import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const DropdownWilayah = ({ withSisa = false } = {}) => {
    const [data, setData] = useState([]);
    const [filterWilayah, setFilterWilayah] = useState({ wilayah: [], blok: [], kamar: [] });
    const [selectedWilayah, setselectedWilayah] = useState({ wilayah: "", blok: "", kamar: "" });
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
    //     const localData = sessionStorage.getItem("menuWilayah");

    // if (localData) {
    //   const parsed = JSON.parse(localData);
    //         setData(parsed.wilayah);
    //         setFilterWilayah({
    //             wilayah: [{ value: "", label: "Semua Wilayah" }, ...parsed.wilayah.map(w => ({ value: w.id, label: `${w.nama_wilayah} (${w.kategori})`, nama: w.nama_wilayah }))],
    //                 blok: [{ value: "", label: "Semua Blok" }],
    //                 kamar: [{ value: "", label: "Semua Kamar" }]
    //         });
    // } else {
        fetch(`${API_BASE_URL}dropdown/wilayah`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setData(data.wilayah);
                setFilterWilayah({
                    wilayah: [{ value: "", label: "Semua Wilayah" }, ...data.wilayah.map(w => ({ value: w.id, label: `${w.nama_wilayah} (${w.kategori})`, nama: w.nama_wilayah }))],
                    blok: [{ value: "", label: "Semua Blok" }],
                    kamar: [{ value: "", label: "Semua Kamar" }]
                });
                sessionStorage.setItem("menuWilayah", JSON.stringify(data));
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                // Jika fetch gagal, tetap set "Semua Negara"
                setFilterWilayah({
                    wilayah: [{ value: "", label: "Semua Wilayah" }],
                    blok: [{ value: "", label: "Semua Blok" }],
                    kamar: [{ value: "", label: "Semua Kamar" }]
                });
            });
        // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const forceFetchDropdownWilayah = async () => {
        const token = sessionStorage.getItem("token") || getCookie("token");

        try {
            const res = await fetch(`${API_BASE_URL}dropdown/wilayah`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            sessionStorage.setItem("menuWilayah", JSON.stringify(data));
            console.log("Berhasil update session menuWilayah");
            return data;
        } catch (err) {
            console.error("Gagal fetch ulang menuWilayah:", err);
            throw err;
        }
    };

    const handleFilterChangeWilayah = (newFilter) => {
        setselectedWilayah(prevFilters => {
            const updatedFilters = { ...prevFilters, ...newFilter };

            if (newFilter.wilayah) {
                updatedFilters.blok = "";
                updatedFilters.kamar = "";
            } else if (newFilter.blok) {
                updatedFilters.kamar = "";
            }

            return updatedFilters;
        });
    };

    useEffect(() => {
        if (selectedWilayah.wilayah === "") {
            setFilterWilayah(prevState => ({
                ...prevState,
                blok: [{ value: "", label: "Semua Blok" }],
                kamar: [{ value: "", label: "Semua Kamar" }]
            }));
            return;
        }

        const wilayahTerpilih = data.find(w => w.id == selectedWilayah.wilayah) || {};
        const blokTerpilih = wilayahTerpilih.blok?.find(b => b.id == selectedWilayah.blok) || {};

        setFilterWilayah({
            wilayah: filterWilayah.wilayah,
            blok: [{ value: "", label: "Semua Blok" }, ...(wilayahTerpilih.blok?.map(b => ({ value: b.id, label: b.nama_blok })) || [])],
            kamar: [{ value: "", label: "Semua Kamar" }, ...(blokTerpilih.kamar?.map(k => ({ value: k.id, label: withSisa ? `${k.nama_kamar} (Sisa ${k.slot})` : k.nama_kamar })) || [])]
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWilayah.wilayah, data, selectedWilayah.blok, filterWilayah.wilayah]);

    return { filterWilayah, selectedWilayah, handleFilterChangeWilayah, forceFetchDropdownWilayah };
};

export default DropdownWilayah;