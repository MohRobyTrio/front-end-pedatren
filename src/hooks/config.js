export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const rolesWithAccess = {
  tambah: ['admin', 'superadmin'],
  tambahakun: ['admin', 'superadmin'],
  edit: ['admin', 'superadmin'],
  delete: ['admin', 'superadmin'],
  kelembagaan: ['admin', 'superadmin'],
  kewilayahan: ['admin', 'superadmin'],
  akademik: ['admin', 'superadmin'],
  pindah: ['admin', 'superadmin'],
  keluar: ['admin', 'superadmin'],
  approve: ['biktren', 'kamtib', 'pengasuh'],
};
