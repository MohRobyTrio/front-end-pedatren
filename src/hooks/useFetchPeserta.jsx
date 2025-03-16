import { useState, useEffect } from "react";

const useFetchPeserta = (url) => {
    const [pesertaDidik, setPesertaDidik] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data from:", url); // Cek apakah URL dipanggil

            try {
                const response = await fetch(url);
                // const response = await fetch(url, {
                //     headers: {
                //       "ngrok-skip-browser-warning": "true", // Tambahkan header ini
                //     },
                //   });
                console.log("Response status:", response.status); // Cek status HTTP

                if (!response.ok) {
                    throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}`);
                }

                const text = await response.text(); // Ambil respons sebagai teks mentah
                console.log("Raw Response:", text); // Log untuk cek apakah JSON valid

                const data = JSON.parse(text); // Parsing manual agar tahu kalau JSON invalid
                console.log("Data dari API:", data); // Log hasil parsing JSON

                setPesertaDidik(Array.isArray(data.data) ? data.data : []);

            } catch (err) {
                console.error("Fetch error:", err); // Log jika ada error
                setError(err.message);
                setPesertaDidik([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { pesertaDidik, loading, error };
};

export default useFetchPeserta;
