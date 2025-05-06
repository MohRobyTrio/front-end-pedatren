import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const DropdownGolongan = () => {
    const [kategoriGolongan, setKategoriGolongan] = useState([]);
    const [golonganData, setGolonganData] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState("");
    const [filteredGolongan, setFilteredGolongan] = useState([]);
    const [isGolonganDisabled, setIsGolonganDisabled] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}dropdown/golongan`)
            .then((res) => res.json())
            .then((data) => {
                setKategoriGolongan([
                    { label: "Kategori Golongan", value: "" },
                    ...data.kategori_golongan.map(k => ({ value: k.id, label: k.kategoriGolongan_nama }))
                ]);
                
                setGolonganData(data.kategori_golongan);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setKategoriGolongan([{ label: "Kategori Golongan", value: "" }]);
            });
    }, []);

    useEffect(() => {
        if (!selectedKategori) {
            setFilteredGolongan([{ label: "Golongan", value: "" }]);
            setIsGolonganDisabled(true);
        } else {
            const golonganByKategori = golonganData.find(k => k.id == selectedKategori)?.golongan || [];
            setFilteredGolongan([
                { label: "Golongan", value: "" },
                ...golonganByKategori.map(g => ({ value: g.id, label: g.GolonganNama }))
            ]);
            setIsGolonganDisabled(false);
        }
    }, [selectedKategori, golonganData]);

    return { kategoriGolongan, filteredGolongan, setSelectedKategori, isGolonganDisabled };
};

export default DropdownGolongan;