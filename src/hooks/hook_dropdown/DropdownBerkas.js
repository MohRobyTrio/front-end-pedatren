import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const useDropdownBerkas = () => {
    const [jenisBerkasList, setJenisBerkasList] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const localData = sessionStorage.getItem("menuBerkas");

        // if (localData) {
        //     const parsedData = JSON.parse(localData);

        //     setJenisBerkasList([
        //         ...parsedData.data.map(a => ({ value: a.id, label: a.nama_jenis_berkas }))
        //     ]);
        // } else {
            fetch(`${API_BASE_URL}jenis-berkas`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((data) => {

                    sessionStorage.setItem("menuBerkas", JSON.stringify({ data }));

                    setJenisBerkasList([
                        ...data.map(a => ({ value: a.id, label: a.nama_jenis_berkas }))
                    ]);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setJenisBerkasList([]);
                });
        }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , []);

    return { jenisBerkasList };
};

export default useDropdownBerkas;
