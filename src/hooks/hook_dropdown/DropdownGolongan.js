import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const DropdownGolongan = () => {
    const [kategoriGolongan, setKategoriGolongan] = useState([]);
    const [golonganData, setGolonganData] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState("");
    const [filteredGolongan, setFilteredGolongan] = useState([]);
    const [isGolonganDisabled, setIsGolonganDisabled] = useState(true);

    const [allGolonganList, setAllGolonganList] = useState([]);


    useEffect(() => {
        const localData = sessionStorage.getItem("menuGolongan");

    if (localData) {   
      const parsedData = JSON.parse(localData);
        setGolonganData(parsedData);

        // ⬅️ Tambahkan ini
        setKategoriGolongan([
            { label: "Kategori Golongan", value: "" },
            ...parsedData.map(k => ({ value: k.id, label: k.kategoriGolongan_nama }))
        ]);
    } else {
        fetch(`${API_BASE_URL}dropdown/golongan`)
            .then((res) => res.json())
            .then((data) => {
                setKategoriGolongan([
                    { label: "Kategori Golongan", value: "" },
                    ...data.kategori_golongan.map(k => ({ value: k.id, label: k.kategoriGolongan_nama }))
                ]);
                
                sessionStorage.setItem("menuGolongan", JSON.stringify(data.kategori_golongan));
                setGolonganData(data.kategori_golongan);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setKategoriGolongan([{ label: "Kategori Golongan", value: "" }]);
            });
        }
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

    useEffect(() => {
        if (golonganData.length > 0) {
            // Flatten semua golongan dari tiap kategori jadi satu array
            const allGolongan = golonganData.flatMap(kategori =>
                kategori.golongan.map(g => ({ id: g.id, GolonganNama: g.GolonganNama }))
            );

            // Tambahkan opsi default di awal
            const allGolonganWithDefault = [
                { id: '', GolonganNama: 'Pilih Golongan' },
                ...allGolongan
            ];

            setAllGolonganList(allGolonganWithDefault);
            // Kalau mau cek console log
            // console.log("All Golongan (id + GolonganNama):", allGolongan);
        }
    }, [golonganData]);

    return { kategoriGolongan, filteredGolongan, setSelectedKategori, isGolonganDisabled, allGolonganList };
};

export default DropdownGolongan;