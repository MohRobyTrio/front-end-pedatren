import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const DropdownAngkatan = () => {
    const [menuAngkatanPelajar, setAngkatanPelajar] = useState([]);
    const [menuAngkatanSantri, setAngkatanSantri] = useState([]);
    const [menuAngkatanKeluarPelajar, setAngkatanKeluarPelajar] = useState([]);
    const [menuAngkatanKeluarSantri, setAngkatanKeluarSantri] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}menu-angkatan`)
            .then((res) => res.json())
            .then((data) => {
                setAngkatanPelajar([
                    { label: "Semua Angkatan Pelajar", value: "" },
                    ...data.data.angkatan_masuk.pelajar.map(a => ({ value: a.tahun, label: a.label }))
                ]);
                
                setAngkatanSantri([
                    { label: "Semua Angkatan Santri", value: "" },
                    ...data.data.angkatan_masuk.santri.map(a => ({ value: a.tahun, label: a.label }))
                ]);

                setAngkatanKeluarPelajar([
                    { label: "Semua Angkatan Pelajar", value: "" },
                    ...data.data.angkatan_keluar.pelajar.map(a => ({ value: a.tahun, label: a.label }))
                ]);

                setAngkatanKeluarSantri([
                    { label: "Semua Angkatan Santri", value: "" },
                    ...data.data.angkatan_keluar.santri.map(a => ({ value: a.tahun, label: a.label }))
                ]);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                // Jika terjadi error, tetap gunakan default value
                setAngkatanPelajar([{ label: "Semua Angkatan Pelajar", value: "" }]);
                setAngkatanSantri([{ label: "Semua Angkatan Santri", value: "" }]);
                setAngkatanKeluarPelajar([{ label: "Semua Angkatan Pelajar", value: "" }]);
                setAngkatanKeluarSantri([{ label: "Semua Angkatan Santri", value: "" }]);
            });
    }, []);

    return { menuAngkatanPelajar, menuAngkatanSantri, menuAngkatanKeluarPelajar, menuAngkatanKeluarSantri };
};

export default DropdownAngkatan;
