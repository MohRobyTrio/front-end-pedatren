import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";

const DropdownHubungan = () => {
  const [menuHubungan, setMenuHubungan] = useState([]);
  const token = sessionStorage.getItem("token") || getCookie("token");

  useEffect(() => {
    const localData = sessionStorage.getItem("menuHubungan");

    if (localData) {
      const parsedData = JSON.parse(localData);
      setMenuHubungan([
        { label: "Pilih Hubungan", value: "" },
        ...parsedData.map(item => ({
          value: item.id,
          label: item.nama_status
        }))
      ]);
    } else {
      fetch(`${API_BASE_URL}dropdown/hubungan`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        .then((res) => res.json())
        .then((data) => {
          sessionStorage.setItem("menuHubungan", JSON.stringify(data));

          setMenuHubungan([
            { label: "Pilih Hubungan", value: "" },
            ...data.map(item => ({
              value: item.id,
              label: item.nama_status
            }))
          ]);
        })
        .catch((error) => {
          console.error("Error fetching hubungan:", error);
          setMenuHubungan([{ label: "Pilih Hubungan", value: "" }]);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { menuHubungan };
};

export default DropdownHubungan;
