import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const DropdownSemester = () => {
    const [menuSemester, setMenuSemester] = useState([]);
    const token = sessionStorage.getItem("token") || getCookie("token");

    useEffect(() => {
        const localData = sessionStorage.getItem("menuSemester");

        if (localData) {
            const parsedData = JSON.parse(localData);

            setMenuSemester([
                { label: "Pilih Semester", value: "" },
                ...parsedData.map((s) => ({
                    value: s.id,
                    label: s.semester.charAt(0).toUpperCase() + s.semester.slice(1)
                }))
            ]);
        } else {
            fetch(`${API_BASE_URL}dropdown/semester`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    // simpan ke sessionStorage
                    sessionStorage.setItem("menuSemester", JSON.stringify(data));

                    setMenuSemester([
                        { label: "Pilih Semester", value: "" },
                        ...data.map((s) => ({
                            value: s.id,
                            label: s.semester.charAt(0).toUpperCase() + s.semester.slice(1)
                        }))
                    ]);
                })
                .catch((error) => {
                    console.error("Error fetching semester:", error);
                    setMenuSemester([{ label: "Pilih Semester", value: "" }]);
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { menuSemester };
};

export default DropdownSemester;
