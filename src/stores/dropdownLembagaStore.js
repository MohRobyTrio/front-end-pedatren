import { create } from 'zustand';
import { API_BASE_URL } from '../hooks/config';

const useDropdownLembagaStore = create((set, get) => ({
  data: [],
  isFetched: false, // penanda apakah sudah ambil data
  filterLembaga: {
    lembaga: [{ value: "", label: "Semua Lembaga" }],
    jurusan: [{ value: "", label: "Semua Jurusan" }],
    kelas: [{ value: "", label: "Semua Kelas" }],
    rombel: [{ value: "", label: "Semua Rombel" }]
  },
  selectedLembaga: {
    lembaga: "",
    jurusan: "",
    kelas: "",
    rombel: ""
  },

  fetchDropdownData: async () => {
    if (get().isFetched) {
      console.log("[ZUSTAND] Data sudah diambil sebelumnya. Skip fetch.");
      return;
    }

    try {
      console.log("[ZUSTAND] Memulai fetch data lembaga...");
      const res = await fetch(`${API_BASE_URL}dropdown/lembaga`);
      const result = await res.json();

      const mappedLembaga = result.lembaga.map(l => ({ value: l.id, label: l.nama_lembaga }));
      set({
        data: result.lembaga,
        isFetched: true, // tandai sudah fetch
        filterLembaga: {
          lembaga: [{ value: "", label: "Semua Lembaga" }, ...mappedLembaga],
          jurusan: [{ value: "", label: "Semua Jurusan" }],
          kelas: [{ value: "", label: "Semua Kelas" }],
          rombel: [{ value: "", label: "Semua Rombel" }]
        }
      });
      console.log("[ZUSTAND] Fetch selesai.");
    } catch (error) {
      console.error("[ZUSTAND] Gagal fetch data:", error);
    }
  },

  setSelectedLembaga: (newFilter) => {
    const prev = get().selectedLembaga;
    const updated = { ...prev, ...newFilter };

    if (newFilter.lembaga) {
      updated.jurusan = "";
      updated.kelas = "";
      updated.rombel = "";
    } else if (newFilter.jurusan) {
      updated.kelas = "";
      updated.rombel = "";
    } else if (newFilter.kelas) {
      updated.rombel = "";
    }

    set({ selectedLembaga: updated });

    // Update filterLembaga berdasarkan selected
    const data = get().data;
    const currentLembaga = data.find(l => l.id == updated.lembaga) || {};
    const currentJurusan = currentLembaga.jurusan?.find(j => j.id == updated.jurusan) || {};
    const currentKelas = currentJurusan.kelas?.find(k => k.id == updated.kelas) || {};

    set({
      filterLembaga: {
        lembaga: get().filterLembaga.lembaga,
        jurusan: [{ value: "", label: "Semua Jurusan" }, ...(currentLembaga.jurusan?.map(j => ({ value: j.id, label: j.nama_jurusan })) || [])],
        kelas: [{ value: "", label: "Semua Kelas" }, ...(currentJurusan.kelas?.map(k => ({ value: k.id, label: k.nama_kelas })) || [])],
        rombel: [{ value: "", label: "Semua Rombel" }, ...(currentKelas.rombel?.map(r => ({ value: r.id, label: r.nama_rombel })) || [])]
      }
    });
  }
}));

export default useDropdownLembagaStore;
