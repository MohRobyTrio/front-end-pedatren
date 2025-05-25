import { useState } from 'react';
import { API_BASE_URL } from "../config";

export function useBerkas(bioId) {

  const [berkasList, setBerkasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil daftar berkas
  async function fetchBerkas() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}formulir/${bioId}/berkas`);
      if (!res.ok) throw new Error('Gagal memuat data berkas');
      const data = await res.json();
      console.log(data);
      
      setBerkasList(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Ambil detail 1 berkas by id
  async function fetchBerkasDetail(id) {
    const res = await fetch(`${API_BASE_URL}/formulir/${id}/berkas/show`);
    if (!res.ok) throw new Error('Gagal memuat detail berkas');
    return await res.json();
  }

  // Tambah berkas baru
  async function createBerkas(id, formData) {
    const res = await fetch(`${API_BASE_URL}/${id}/berkas`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Gagal menambah berkas');
    return await res.json();
  }

  // Update berkas
  async function updateBerkas(id, formData) {
    const res = await fetch(`${API_BASE_URL}/formulir/${id}/berkas`, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) throw new Error('Gagal mengupdate berkas');
    return await res.json();
  }

  return {
    berkasList,
    loading,
    error,
    fetchBerkas,
    fetchBerkasDetail,
    createBerkas,
    updateBerkas,
  };
}
