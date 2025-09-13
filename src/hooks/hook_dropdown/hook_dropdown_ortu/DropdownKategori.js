import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const DropdownKategori = (outletId) => {
    const [menuKategori, setMenuKategori] = useState([]);
    const token = sessionStorage.getItem("auth_token_ortu");

    useEffect(() => {
        console.log(outletId);
        
        // kalau outletId kosong → langsung reset data
        if (!outletId) {
            setMenuKategori([]);
            return;
        }

        fetch(`${API_BASE_URL}dropdown-kategori?outlet_id=${outletId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setMenuKategori(data.data);
            })
            .catch((error) => {
                console.error("Error fetching kategori:", error);
                setMenuKategori([]);
            });
    }, [outletId, token]);

    return { menuKategori };
};

export default DropdownKategori;
