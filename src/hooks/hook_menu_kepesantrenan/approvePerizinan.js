import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../config';
import { getCookie } from "../../utils/cookieUtils";


const useApprovePerizinan = () => {
    const [isApproving, setIsApproving] = useState(false);
    const [error, setError] = useState(null);

    const approvePerizinan = async (id, role) => {
        setIsApproving(true);
        setError(null);

        try {
            const token = sessionStorage.getItem("token") || getCookie("token");

            const endpoint = `${API_BASE_URL}approve/perizinan/${role}/${id}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

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