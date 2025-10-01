import { useState } from 'react';
import { API_BASE_URL } from '../config';
import { getCookie } from "../../utils/cookieUtils";
import Swal from 'sweetalert2';
import useLogout from '../Logout';
import { useNavigate } from 'react-router-dom';

const useApprovePerizinan = () => {
    const { clearAuthData } = useLogout();
    const navigate = useNavigate();
    const [isApproving, setIsApproving] = useState(false);
    const [error, setError] = useState(null);

    // Tambahkan parameter payload untuk data tambahan
    const approvePerizinan = async (id, role, action = "approve", payload = null) => {
        setIsApproving(true);
        setError(null);

        try {
            const token = sessionStorage.getItem("token") || getCookie("token");

            let endpoint = `${API_BASE_URL}approve/perizinan/${role}/${id}`;
            if (action === "reject") {
                endpoint = `${API_BASE_URL}reject/perizinan/${role}/${id}`;
            }

            // Siapkan opsi untuk fetch
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            };

            // Jika ada payload, tambahkan ke body request
            if (payload) {
                requestOptions.body = JSON.stringify(payload);
            }

            const response = await fetch(endpoint, requestOptions);

            if (response.status == 401 && !window.sessionExpiredShown) {
                window.sessionExpiredShown = true;
                await Swal.fire({
                    title: "Sesi Berakhir",
                    text: "Sesi anda telah berakhir, silakan login kembali.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                clearAuthData();
                navigate("/login");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal melakukan approval');
            }

            return true;
        } catch (err) {
            setError(err.message || 'Gagal melakukan approval');
            return false;
        } finally {
            setIsApproving(false);
        }
    };

    return { approvePerizinan, isApproving, error };
};

export default useApprovePerizinan;