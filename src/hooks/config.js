export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const rolesWithAccess = {
  ///Aksi///
  tambah: ['supervisor', 'superadmin'],
  edit: ['supervisor', 'superadmin'],
  delete: ['supervisor', 'superadmin'],
  pindah: ['supervisor', 'superadmin'],
  keluar: ['supervisor', 'superadmin'],
  approve: ['biktren', 'kamtib', 'pengasuh'],
  ///Menu///
  kesantrian: ['supervisor', 'superadmin'],
  kelembagaan: ['supervisor', 'superadmin'],
  kewilayahan: ['supervisor', 'superadmin'],
  kewaliasuhan: ['supervisor', 'superadmin'],
  kepegawaian: ['supervisor', 'superadmin'],
  akademik: ['supervisor', 'superadmin'],
  golongan: ['supervisor', 'superadmin'],
  hafalan: ['supervisor', 'superadmin', 'ustadz'],
  csholat: ['supervisor', 'superadmin', 'ustadz'],
  belanja: ['supervisor', 'superadmin'],
  ///SubMenu///
  dashboard: ['supervisor', 'superadmin'],
  santri: ['supervisor', 'superadmin'],
  perizinan: ['supervisor', 'superadmin', 'biktren', 'kamtib', 'pengasuh'],
  pelanggaran: ['supervisor', 'superadmin'],
  kunjungan: ['supervisor', 'superadmin'],
  khadam: ['supervisor', 'superadmin'],
  tahfidz: ['supervisor', 'superadmin', 'ustadz'],
  nadhoman: ['supervisor', 'superadmin', 'ustadz'],
  karturfid: ['supervisor', 'superadmin'],
  kitab: ['supervisor', 'superadmin'],
  sholat: ['supervisor', 'superadmin'],
  jadwal_sholat: ['supervisor', 'superadmin'],
  presensi_sholat: ['supervisor', 'superadmin', 'ustadz'],
  transaksi: ['supervisor', 'superadmin'],
  kategori: ['supervisor', 'superadmin'],
  ///Fitur///
  
  ///Manage///
  manage: ['supervisor', 'superadmin'],
  tambahakun: ['supervisor', 'superadmin']
};
