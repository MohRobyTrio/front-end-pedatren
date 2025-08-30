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
  kewaliasuhan: ['admin', 'superadmin','wali_asuh'],
  kepesantrenan: ['admin', 'superadmin','ustadz'],
    hafalan: ['admin', 'superadmin', 'ustadz'],
    csholat: ['admin', 'superadmin', 'ustadz'],
  kepegawaian: ['admin', 'superadmin'],
  transaksi: ['admin', 'superadmin', 'petugas'],
  pembayaran: ['admin', 'superadmin'],
  akademik: ['admin', 'superadmin'],
    alumni: ['admin', 'superadmin'],
  manage: ['admin', 'superadmin'],

  ///SubMenu///
  dashboard: ['admin', 'superadmin'],
  
  // Kesantrian
    c_peserta_didik: ['admin', 'superadmin'],
      peserta_didik: ['admin', 'superadmin'],
      santri: ['admin', 'superadmin'],
      pelajar: ['admin', 'superadmin'],
      santri_non_domisili: ['admin', 'superadmin'],
      bersaudara_kandung: ['admin', 'superadmin'],

    c_orang_tua: ['admin', 'superadmin'],
      orang_tua: ['admin', 'superadmin'],
      wali: ['admin', 'superadmin'],

    karturfid: ['admin', 'superadmin'],

    // Kelembagaan
      lembaga: ['admin', 'superadmin'],
      jurusan: ['admin', 'superadmin'],
      kelas: ['admin', 'superadmin'],
      rombel: ['admin', 'superadmin'],

    // Kewilayahan
      wilayah: ['admin', 'superadmin'],
      blok: ['admin', 'superadmin'],
      kamar: ['admin', 'superadmin'],

  // Kewaliasuhan    
    wali_asuh: ['admin', 'superadmin'],
    anak_asuh: ['admin', 'superadmin'],
    group_kewaliasuhan: ['admin', 'superadmin'],
    hubungkan_wali_asuh: ['admin', 'superadmin'],
    catatan_afektif: ['admin', 'superadmin', 'wali_asuh'],
    catatan_kognitif: ['admin', 'superadmin', 'wali_asuh'],

  // Kepesantrenan
    perizinan: ['admin', 'superadmin', 'biktren', 'kamtib', 'pengasuh'],
    pelanggaran: ['admin', 'superadmin'],
    kunjungan: ['admin', 'superadmin'],
      // Hafalan
      kitab: ['admin', 'superadmin', 'ustadz'],
      tahfidz: ['admin', 'superadmin', 'ustadz'],
      nadhoman: ['admin', 'superadmin', 'ustadz'],
      // Sholat
      sholat: ['admin', 'superadmin', 'ustadz'],
      jadwal_sholat: ['admin', 'superadmin', 'ustadz'],
      presensi_sholat: ['admin', 'superadmin', 'ustadz'],
    khadam: ['admin', 'superadmin'],

  // Kepegawaian
  c_pegawai: ['admin', 'superadmin'],
    pegawai: ['admin', 'superadmin'],
    pengajar: ['admin', 'superadmin'],
    pengurus: ['admin', 'superadmin'],
    karyawan: ['admin', 'superadmin'],
    wali_kelas: ['admin', 'superadmin'],
  anak_pegawai: ['admin', 'superadmin'],
  kategori_golongan: ['admin', 'superadmin'],
  golongan: ['admin', 'superadmin'],
  golongan_jabatan: ['admin', 'superadmin'],

  // Transaksi
  outlet: ['admin', 'superadmin'],
  user_outlet: ['admin', 'superadmin'],
  kategori: ['admin', 'superadmin'],
  belanja: ['admin', 'superadmin', 'petugas'],
  saldo: ['admin', 'superadmin'],
    cek_saldo: ['admin', 'superadmin'],
    topup: ['admin', 'superadmin'],
    tarik: ['admin', 'superadmin'],

  // Pembayaran
  bank: ['admin', 'superadmin'],
  virtual_account: ['admin', 'superadmin'],
  tagihan: ['admin', 'superadmin'],
  
  // Akademik
  tahun_ajaran: ['admin', 'superadmin'],
  semester: ['admin', 'superadmin'],
  angkatan: ['admin', 'superadmin'],
  pindah_kamar: ['admin', 'superadmin'],
  pindah_naik_kelas: ['admin', 'superadmin'],
  kelulusan_pelajar: ['admin', 'superadmin'],
    data_alumni: ['admin', 'superadmin'],
    proses_alumni_santri: ['admin', 'superadmin'],

  // Manage
  pengguna: ['admin', 'superadmin'],
  log: ['admin', 'superadmin'],
  jenis_berkas: ['admin', 'superadmin'],
  
  ///Fitur///
  
  ///Manage///
  
  tambahakun: ['admin', 'superadmin']
};
