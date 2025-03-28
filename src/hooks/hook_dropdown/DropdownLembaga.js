import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const DropdownLembaga = () => {
    const [data, setData] = useState([]);
    const [filterLembaga, setFilterLembaga] = useState({ lembaga: [], jurusan: [], kelas: [], rombel: [] });
    const [selectedLembaga, setSelectedLembaga] = useState({ lembaga: "", jurusan: "", kelas: "", rombel: "" });

    useEffect(() => {
        fetch(`${API_BASE_URL}dropdown/lembaga`)
            .then((res) => res.json())
            .then((data) => {
                setData(data.lembaga);
                setFilterLembaga({
                    lembaga: [{ value: "", label: "Semua Lembaga" }, ...data.lembaga.map(l => ({ value: l.id, label: l.nama_lembaga }))],
                    jurusan: [{ value: "", label: "Semua Jurusan" }],
                    kelas: [{ value: "", label: "Semua Kelas" }],
                    rombel: [{ value: "", label: "Semua Rombel" }]
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setFilterLembaga({
                    lembaga: [{ value: "", label: "Semua Lembaga" }],
                    jurusan: [{ value: "", label: "Semua Jurusan" }],
                    kelas: [{ value: "", label: "Semua Kelas" }],
                    rombel: [{ value: "", label: "Semua Rombel" }]
                });
            });
    }, []);

    const handleFilterChangeLembaga = (newFilter) => {
        setSelectedLembaga(prevFilters => {
            const updatedFilters = { ...prevFilters, ...newFilter };

            if (newFilter.lembaga) {
                updatedFilters.jurusan = "";
                updatedFilters.kelas = "";
                updatedFilters.rombel = "";
            } else if (newFilter.jurusan) {
                updatedFilters.kelas = "";
                updatedFilters.rombel = "";
            } else if (newFilter.kelas) {
                updatedFilters.rombel = "";
            }

            return updatedFilters;
        });
    };

    useEffect(() => {
        if (selectedLembaga.lembaga === "") {
            setFilterLembaga(prevState => ({
                ...prevState,
                jurusan: [{ value: "", label: "Semua Jurusan" }],
                kelas: [{ value: "", label: "Semua Kelas" }],
                rombel: [{ value: "", label: "Semua Rombel" }]
            }));
            return;
        }

        const currentLembaga = data.find(l => l.id == selectedLembaga.lembaga) || {};
        const currentJurusan = currentLembaga.jurusan?.find(j => j.id == selectedLembaga.jurusan) || {};
        const currentKelas = currentJurusan.kelas?.find(k => k.id == selectedLembaga.kelas) || {};

        setFilterLembaga({
            lembaga: filterLembaga.lembaga,
            jurusan: [{ value: "", label: "Semua Jurusan" }, ...(currentLembaga.jurusan?.map(j => ({ value: j.id, label: j.nama_jurusan })) || [])],
            kelas: [{ value: "", label: "Semua Kelas" }, ...(currentJurusan.kelas?.map(k => ({ value: k.id, label: k.nama_kelas })) || [])],
            rombel: [{ value: "", label: "Semua Rombel" }, ...(currentKelas.rombel?.map(r => ({ value: r.id, label: r.nama_rombel })) || [])]
        });
    }, [selectedLembaga.lembaga, data, selectedLembaga.jurusan, selectedLembaga.kelas, filterLembaga.lembaga]);

    return { filterLembaga, selectedLembaga, handleFilterChangeLembaga };
};

export default DropdownLembaga;
