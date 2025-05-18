import { API_BASE_URL } from "../../hooks/config";

/**
 * Ambil list domisili berdasarkan biodataId (index)
 * @param {string|number} biodataId 
 * @returns {Promise<Array>}
 */
export const getDomisiliList = async (biodataId) => {
  try {
    const res = await fetch(`${API_BASE_URL}${biodataId}/domisili`);
    if (!res.ok) throw new Error("Respon tidak OK");
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [json.data];
  } catch (err) {
    console.error("Gagal ambil list domisili:", err);
    return [];
  }
};

/**
 * Ambil detail domisili berdasarkan id (show)
 * @param {string|number} id 
 * @returns {Promise<object|null>}
 */
export const getDomisiliDetail = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}${id}/domisili/show`);
    if (!res.ok) throw new Error("Respon tidak OK");
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("Gagal ambil detail domisili:", err);
    return null;
  }
};

/**
 * Tambah domisili baru (store)
 * @param {string|number} biodataId 
 * @param {object} data 
 * @returns {Promise<boolean>}
 */
export const createDomisili = async (biodataId, data) => {
  try {
    const res = await fetch(`${API_BASE_URL}${biodataId}/domisili`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wilayah: data.wilayah,
        blok: data.blok,
        kamar: data.kamar,
        nomor_induk: data.nomorIndukSantri,
        waktu_mulai: data.waktuMulai,
        waktu_akhir: data.waktuAkhir,
      }),
    });
    if (!res.ok) throw new Error("Respon tidak OK");
    const json = await res.json();
    return json.success || json.status === "success";
  } catch (err) {
    console.error("Gagal tambah domisili:", err);
    return false;
  }
};

/**
 * Update domisili berdasarkan id (update)
 * @param {string|number} id 
 * @param {object} data 
 * @returns {Promise<boolean>}
 */
export const updateDomisili = async (id, data) => {
  try {
    const res = await fetch(`${API_BASE_URL}${id}/domisili`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wilayah: data.wilayah,
        blok: data.blok,
        kamar: data.kamar,
        nomor_induk: data.nomorIndukSantri,
        waktu_mulai: data.waktuMulai,
        waktu_akhir: data.waktuAkhir,
      }),
    });
    if (!res.ok) throw new Error("Respon tidak OK");
    const json = await res.json();
    return json.success || json.status === "success";
  } catch (err) {
    console.error("Gagal update domisili:", err);
    return false;
  }
};
