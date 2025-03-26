import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const DropdownNegara = () => {
    const [data, setData] = useState([]);
    const [filterNegara, setFilterNegara] = useState({ negara: [], provinsi: [], kabupaten: [], kecamatan: [] });
    const [selectedNegara, setSelectedNegara] = useState({ negara: "", provinsi: "", kabupaten: "", kecamatan: "" });

    useEffect(() => {
        fetch(`${API_BASE_URL}menu-negara`)
            .then((res) => res.json())
            .then((data) => {
                setData(data.negara);
                setFilterNegara({
                    negara: [{ value: "", label: "Semua Negara" }, ...data.negara.map(n => ({ value: n.id, label: n.nama_negara }))],
                    provinsi: [{ value: "", label: "Semua Provinsi" }],
                    kabupaten: [{ value: "", label: "Semua Kabupaten" }],
                    kecamatan: [{ value: "", label: "Semua Kecamatan" }]
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                // Jika fetch gagal, tetap set "Semua Negara"
                setFilterNegara({
                    negara: [{ value: "", label: "Semua Negara" }],
                    provinsi: [{ value: "", label: "Semua Provinsi" }],
                    kabupaten: [{ value: "", label: "Semua Kabupaten" }],
                    kecamatan: [{ value: "", label: "Semua Kecamatan" }]
                });
            });
    }, []);

    const handleFilterChangeNegara = (newFilter) => {
        setSelectedNegara(prevFilters => {
            const updatedFilters = { ...prevFilters, ...newFilter };

            // Jika negara berubah, reset semua dropdown di bawahnya
            if (newFilter.negara) {
                updatedFilters.provinsi = "";
                updatedFilters.kabupaten = "";
                updatedFilters.kecamatan = "";
            } else if (newFilter.provinsi) {
                updatedFilters.kabupaten = "";
                updatedFilters.kecamatan = "";
            } else if (newFilter.kabupaten) {
                updatedFilters.kecamatan = "";
            }

            return updatedFilters;
        });
    };

    useEffect(() => {
        if (selectedNegara.negara === "") {
            setFilterNegara(prevState => ({
                ...prevState,
                provinsi: [{ value: "", label: "Semua Provinsi" }],
                kabupaten: [{ value: "", label: "Semua Kabupaten" }],
                kecamatan: [{ value: "", label: "Semua Kecamatan" }]
            }));
            return;
        }
    
        const currentNegara = data.find(n => n.id == selectedNegara.negara) || {};
        const currentProvinsi = currentNegara.provinsi?.find(p => p.id == selectedNegara.provinsi) || {};
        const currentKabupaten = currentProvinsi.kabupaten?.find(k => k.id == selectedNegara.kabupaten) || {};
    
        setFilterNegara({
            negara: filterNegara.negara,
            provinsi: [{ value: "", label: "Semua Provinsi" }, ...(currentNegara.provinsi?.map(p => ({ value: p.id, label: p.nama_provinsi })) || [])],
            kabupaten: [{ value: "", label: "Semua Kabupaten" }, ...(currentProvinsi.kabupaten?.map(k => ({ value: k.id, label: k.nama_kabupaten })) || [])],
            kecamatan: [{ value: "", label: "Semua Kecamatan" }, ...(currentKabupaten.kecamatan?.map(kec => ({ value: kec.id, label: kec.nama_kecamatan })) || [])]
        });
    }, [selectedNegara.negara, data, selectedNegara.provinsi, selectedNegara.kabupaten, filterNegara.negara]);
    
    return { filterNegara, selectedNegara, handleFilterChangeNegara };
};

export default DropdownNegara;
