import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../config";
import { getCookie } from "../../utils/cookieUtils";
import useLogout from "../Logout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useActiveChild } from "../../components/ortu/useActiveChild";

const useFetchProfilOrtu = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const lastRequest = useRef("");
    const token = sessionStorage.getItem("auth_token_ortu") || getCookie("token");
    const { activeChild } = useActiveChild()
    const idSantri = JSON.parse(sessionStorage.getItem("active_child") || "null");

    const fetchData = useCallback(async (force = false) => {
            let url = `${API_BASE_URL}view-ortu/ProfileSantri?santri_id=${activeChild?.id || idSantri}`;

            // Skip duplicate requests
            if (!force && lastRequest.current === url) {
                console.log("Skip duplicate request");
                return;
            }
            lastRequest.current = url;
            console.log("Fetching data from:", url);

            try {
                setError(null);
                setLoading(true);
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status == 401 && !window.sessionExpiredShown) {
                    window.sessionExpiredShown = true;
                    await Swal.fire({
                        title: "Sesi Berakhir",
                        text: "Sesi anda telah berakhir, silakan login kembali.",
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                    clearAuthData();
                    navigate("/login-ortu");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();
                console.log("hasil",result);
                setData(result || []);
            } catch (err) {
                setError(err.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeChild]
    );

    // Auto fetch when dependencies change
    useEffect(() => {
        fetchData();
        console.log(activeChild.id);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChild]);


    return {
        // Data states
        data,
        loading,
        error,

        // Fetch function
        fetchData,
    };
};

export default useFetchProfilOrtu;
