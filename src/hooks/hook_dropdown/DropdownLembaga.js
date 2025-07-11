import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

// const DropdownLembaga = ({ defaultValues }) => {
const DropdownLembaga = () => {
    const [data, setData] = useState([]);
    const [filterLembaga, setFilterLembaga] = useState({ lembaga: [], jurusan: [], kelas: [], rombel: [] });
    const [selectedLembaga, setSelectedLembaga] = useState({ lembaga: "", jurusan: "", kelas: "", rombel: "" });
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const sessionData = sessionStorage.getItem("menuLembaga");

        if (sessionData) {
            const parsed = JSON.parse(sessionData);
            setData(parsed.lembaga);
            setFilterLembaga({
                lembaga: [
                { value: "", label: "Semua Lembaga" },
                ...parsed.lembaga.map((l) => ({ value: l.id, label: l.nama_lembaga }))
                ],
                jurusan: [{ value: "", label: "Semua Jurusan" }],
                kelas: [{ value: "", label: "Semua Kelas" }],
                rombel: [{ value: "", label: "Semua Rombel" }]
            });
        } else {

        fetch(`${API_BASE_URL}dropdown/lembaga`
            , {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setData(data.lembaga);
                setFilterLembaga({
                    lembaga: [{ value: "", label: "Semua Lembaga" }, ...data.lembaga.map(l => ({ value: l.id, label: l.nama_lembaga }))],
                    jurusan: [{ value: "", label: "Semua Jurusan" }],
                    kelas: [{ value: "", label: "Semua Kelas" }],
                    rombel: [{ value: "", label: "Semua Rombel" }]
                });
                sessionStorage.setItem("menuLembaga", JSON.stringify(data));
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
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const forceFetchDropdownLembaga = async () => {
        const token = sessionStorage.getItem("token") || getCookie("token");

        try {
            const res = await fetch(`${API_BASE_URL}dropdown/lembaga`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            sessionStorage.setItem("menuLembaga", JSON.stringify(data));
            console.log("Berhasil update session menuLembaga");
            return data;
        } catch (err) {
            console.error("Gagal fetch ulang menuLembaga:", err);
            throw err;
        }
    };

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

    return { filterLembaga, selectedLembaga, handleFilterChangeLembaga, forceFetchDropdownLembaga };
};

export default DropdownLembaga;
