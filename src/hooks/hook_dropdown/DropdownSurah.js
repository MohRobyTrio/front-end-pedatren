import { useEffect, useState } from "react";

const DropdownSurah = () => {
  const [menuSurah, setMenuSurah] = useState([]);

  useEffect(() => {
    const localData = sessionStorage.getItem("menuSurah");

    if (localData) {
      // Ambil dari sessionStorage
      const parsedData = JSON.parse(localData);
      setMenuSurah([
        { label: "Pilih Surat", value: "" },
        ...parsedData
      ]);
    } else {
      // Fetch dari API
      fetch("https://quran-api.santrikoding.com/api/surah")
        .then((res) => res.json())
        .then((data) => {
          // Map data API ke format dropdown
          const formatted = data.map((surah) => ({
            value: surah.nomor,
            label: `${surah.nomor}. ${surah.nama_latin} (${surah.jumlah_ayat} ayat)`
          }));

          // Simpan ke sessionStorage
          sessionStorage.setItem("menuSurah", JSON.stringify(formatted));

          // Set ke state
          setMenuSurah([
            { label: "Pilih Surat", value: "" },
            ...formatted
          ]);
        })
        .catch((error) => {
          console.error("Error fetching surat:", error);
          setMenuSurah([{ label: "Pilih Surat", value: "" }]);
        });
    }
  }, []);

  return { menuSurah };
};

export default DropdownSurah;
