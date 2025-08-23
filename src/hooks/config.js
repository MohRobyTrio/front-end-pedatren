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
  kewaliasuhan: ['admin', 'superadmin','waliasuh'],
  kepesantrenan: ['admin', 'superadmin','ustadz'],
  kepegawaian: ['admin', 'superadmin'],
  akademik: ['admin', 'superadmin'],
  golongan: ['admin', 'superadmin'],
  hafalan: ['admin', 'superadmin', 'ustadz'],
  csholat: ['admin', 'superadmin', 'ustadz'],
  transaksi: ['admin', 'superadmin', 'petugas'],
  pembayaran: ['admin', 'superadmin'],
  ///SubMenu///
  belanja: ['admin', 'superadmin', 'petugas'],
  dashboard: ['admin', 'superadmin'],
  santri: ['admin', 'superadmin'],
  perizinan: ['admin', 'superadmin', 'biktren', 'kamtib', 'pengasuh'],
  pelanggaran: ['admin', 'superadmin'],
  catatan_afektif: ['admin', 'superadmin', 'waliasuh'],
  catatan_kognitif: ['admin', 'superadmin', 'waliasuh'],
  wali_asuh: ['admin', 'superadmin'],
  anak_asuh: ['admin', 'superadmin'],
  group_kewaliasuhan: ['admin', 'superadmin'],
  hubungkan_wali_asuh: ['admin', 'superadmin'],
  kunjungan: ['admin', 'superadmin'],
  khadam: ['admin', 'superadmin'],
  tahfidz: ['admin', 'superadmin', 'ustadz'],
  nadhoman: ['admin', 'superadmin', 'ustadz'],
  karturfid: ['admin', 'superadmin'],
  kitab: ['admin', 'superadmin'],
  sholat: ['admin', 'superadmin'],
  jadwal_sholat: ['admin', 'superadmin'],
  presensi_sholat: ['admin', 'superadmin', 'ustadz'],
  kategori: ['admin', 'superadmin'],
  outlet: ['admin', 'superadmin'],
  user_outlet: ['admin', 'superadmin'],
  topup: ['admin', 'superadmin'],
  tarik: ['admin', 'superadmin'],

  bank: ['admin', 'superadmin'],
  virtual_account: ['admin', 'superadmin'],
  ///Fitur///
  
  ///Manage///
  manage: ['admin', 'superadmin'],
  tambahakun: ['admin', 'superadmin']
};
