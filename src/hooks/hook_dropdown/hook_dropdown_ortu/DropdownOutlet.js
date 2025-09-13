import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const DropdownOutlet = () => {
    const [menuOutlet, setMenuOutlet] = useState([]);
    const token = sessionStorage.getItem("auth_token_ortu");

    useEffect(() => {
        fetch(`${API_BASE_URL}outlet`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setMenuOutlet(data.data);
            })
            .catch((error) => {
                console.error("Error fetching outlet:", error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { menuOutlet };
};

export default DropdownOutlet;
