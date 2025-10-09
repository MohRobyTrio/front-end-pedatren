import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const DropdownAngkatan = () => {
    const [menuAngkatanPelajar, setAngkatanPelajar] = useState([]);
    const [menuAngkatanSantri, setAngkatanSantri] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const localData = sessionStorage.getItem("menuAngkatan");

        if (localData) {
            const parsedData = JSON.parse(localData);

            setAngkatanPelajar([
                { label: "Pilih Angkatan", value: "" },
                ...parsedData.pelajar.map(a => ({ value: a.id, label: a.label }))
            ]);

            setAngkatanSantri([
                { label: "Pilih Angkatan", value: "" },
                ...parsedData.santri.map(a => ({ value: a.id, label: a.label }))
            ]);
        } else {
            fetch(`${API_BASE_URL}dropdown/angkatan`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    const pelajar = data.data.pelajar || [];
                    const santri = data.data.santri || [];

                    sessionStorage.setItem("menuAngkatan", JSON.stringify({ pelajar, santri }));

                    setAngkatanPelajar([
                        { label: "Pilih Angkatan", value: "" },
                        ...pelajar.map(a => ({ value: a.id, label: a.label }))
                    ]);

                    setAngkatanSantri([
                        { label: "Pilih Angkatan", value: "" },
                        ...santri.map(a => ({ value: a.id, label: a.label }))
                    ]);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setAngkatanPelajar([{ label: "Pilih Angkatan", value: "" }]);
                    setAngkatanSantri([{ label: "Pilih Angkatan", value: "" }]);
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

    return { menuAngkatanPelajar, menuAngkatanSantri };
};

export default DropdownAngkatan;
