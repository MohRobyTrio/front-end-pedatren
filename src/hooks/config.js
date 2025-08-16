export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const rolesWithAccess = {
  ///Aksi///
  tambah: ['admin', 'superadmin'],
  edit: ['admin', 'superadmin'],
  delete: ['admin', 'superadmin'],
  pindah: ['admin', 'superadmin'],
  keluar: ['admin', 'superadmin'],
  approve: ['biktren', 'kamtib', 'pengasuh'],
  ///Menu///
  kesantrian: ['admin', 'superadmin'],
  kelembagaan: ['admin', 'superadmin'],
  kewilayahan: ['admin', 'superadmin'],
  kewaliasuhan: ["admin", "superadmin"],
  kepegawaian: ["admin", "superadmin"],
  akademik: ['admin', 'superadmin'],
  golongan: ["admin", "superadmin"],
  ///SubMenu///
  dashboard: ["admin", "superadmin"],
  santri: ["admin", "superadmin"],
  perizinan: ["admin", "superadmin", "biktren", "kamtib", "pengasuh"],
  pelanggaran: ["admin", "superadmin"],
  kunjungan: ["admin", "superadmin"],
  khadam: ["admin", "superadmin"],
  ///Fitur///
  karturfid: ["admin", "superadmin"],
  kitab: ["admin", "superadmin"],
  sholat: ["admin", "superadmin"],
  jadwal_sholat: ["admin", "superadmin"],
  presensi_sholat: ["admin", "superadmin", "ustadz"],
  tahfidz: ["admin", "superadmin", "ustadz"],
  nadhoman: ["admin", "superadmin", "ustadz"],
  ///Manage///
  manage: ["admin", "superadmin"],
  tambahakun: ['admin', 'superadmin']
};
