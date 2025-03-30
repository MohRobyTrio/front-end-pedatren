// import { useEffect, useState } from "react";
// import { API_BASE_URL } from "../config";

// const DropdownGolongan = () => {
//     const [data, setData] = useState([]);
//     const [filterGolongan, setFilterGolongan] = useState({
//         kategori: [],
//         golongan: []
//     });
//     const [selectedGolongan, setSelectedGolongan] = useState({
//         kategori: "",
//         golongan: ""
//     });

//     useEffect(() => {
//         fetch(`${API_BASE_URL}dropdown/golongan`)
//             .then((res) => res.json())
//             .then((data) => {
//                 setData(data.kategori_golongan);
//                 setFilterGolongan({
//                     kategori: [{ value: "", label: "Semua Kategori" }, ...data.kategori_golongan.map(k => ({ value: k.id, label: k.kategoriGolongan_nama }))],
//                     golongan: [{ value: "", label: "Semua Golongan" }]
//                 });
//                 console.log(filterGolongan);
//             })
//             .catch((error) => {
//                 console.error("Error fetching data:", error);
//                 setFilterGolongan({
//                     kategori: [{ value: "", label: "Semua Kategori" }],
//                     golongan: [{ value: "", label: "Semua Golongan" }]
//                 });
//             });
//     }, []);

//     useEffect(() => {
//         if (selectedGolongan.kategori === "") {
//             setFilterGolongan(prevState => ({
//                 ...prevState,
//                 golongan: [{ value: "", label: "Semua Golongan" }]
//             }));
//             return;
//         }

//         const currentKategori = data.find(k => k.id == selectedGolongan.kategori) || {};
//         setFilterGolongan(prevState => ({
//             ...prevState,
//             golongan: [{ value: "", label: "Semua Golongan" }, ...(currentKategori.golongan?.map(g => ({ value: g.id, label: g.GolonganNama })) || [])]
//         }));
//     }, [selectedGolongan.kategori, data]);

//     const handleFilterChangeGolongan = (newFilter) => {
//         setSelectedGolongan(prevFilters => {
//             const updatedFilters = { ...prevFilters, ...newFilter };
//             if (newFilter.kategori) {
//                 updatedFilters.golongan = "";
//             }
//             return updatedFilters;
//         });
//     };

//     return { filterGolongan, selectedGolongan, handleFilterChangeGolongan };
// };

// export default DropdownGolongan;

// import { useEffect, useState } from "react";
// import { API_BASE_URL } from "../config";

// const DropdownGolongan = () => {
//     const [kategoriGolongan, setKategoriGolongan] = useState([]);
//     const [golongan, setGolongan] = useState([]);

//     useEffect(() => {
//         fetch(`${API_BASE_URL}dropdown/golongan`)
//             .then((res) => res.json())
//             .then((data) => {
//                 setKategoriGolongan([
//                     { label: "Semua Kategori Golongan", value: "" },
//                     ...data.kategori_golongan.map(k => ({ value: k.id, label: k.kategoriGolongan_nama }))
//                 ]);
                
//                 setGolongan([
//                     { label: "Semua Golongan", value: "" },
//                     ...data.kategori_golongan.flatMap(k => k.golongan.map(g => ({
//                         value: g.id,
//                         label: `${k.kategoriGolongan_nama} - ${g.GolonganNama}`
//                     })))
//                 ]);
//             })
//             .catch((error) => {
//                 console.error("Error fetching data:", error);
//                 setKategoriGolongan([{ label: "Semua Kategori Golongan", value: "" }]);
//                 setGolongan([{ label: "Semua Golongan", value: "" }]);
//             });
//     }, []);

//     return { kategoriGolongan, golongan };
// };

// export default DropdownGolongan;


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