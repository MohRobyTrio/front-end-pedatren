import CatatanAfektif from "../content_main_page/content _menu_kepesantrenan/CatatanAfektif";
import CatatanKognitif from "../content_main_page/content _menu_kepesantrenan/CatatanKognitif";
import Pelanggaran from "../content_main_page/content _menu_kepesantrenan/Pelanggaran";
import Perizinan from "../content_main_page/content _menu_kepesantrenan/Perizinan";
// import PresensiPesantren from "../content_main_page/content _menu_kepesantrenan/PresensiPesantren";
// import ReservasiMakan from "../content_main_page/content _menu_kepesantrenan/ReservasiMakan";
import Alumni from "../content_main_page/content_menu_data_pokok/Alumni";
import Karyawan from "../content_main_page/content_menu_data_pokok/Karyawan";
import Khadam from "../content_main_page/content_menu_data_pokok/Khadam";
import OrangTua from "../content_main_page/content_menu_data_pokok/OrangTua";
import Pengajar from "../content_main_page/content_menu_data_pokok/Pengajar";
import Pengurus from "../content_main_page/content_menu_data_pokok/Pengurus";
import PesertaDidik from "../content_main_page/content_menu_data_pokok/PesertaDidik";
import BersaudaraKandung from "../content_main_page/content_menu_data_pokok/sub_menu_peserta_didik/BersaudaraKandung";
import Pelajar from "../content_main_page/content_menu_data_pokok/sub_menu_peserta_didik/Pelajar";
import Santri from "../content_main_page/content_menu_data_pokok/sub_menu_peserta_didik/Santri";
import SantriNonDomisili from "../content_main_page/content_menu_data_pokok/sub_menu_peserta_didik/SantriNonDomisili";
import Wali from "../content_main_page/content_menu_data_pokok/Wali";
import WaliKelas from "../content_main_page/content_menu_data_pokok/WaliKelas";
import Golongan from "../content_main_page/content_menu_kepegawaian/Golongan";
import PindahKelas from "../content_main_page/content_menu_akademik/PindahKelas";
import GolonganJabatan from "../content_main_page/content_menu_kepegawaian/GolonganJabatan";
import KategoriGolongan from "../content_main_page/content_menu_kepegawaian/KategoriGolongan";
import Lembaga from "../content_main_page/content_menu_akademik/Lembaga";
import AnakPegawai from "../content_main_page/content_menu_kepegawaian/AnakPegawai";
import Pegawai from "../content_main_page/content_menu_kepegawaian/Pegawai";
// import PresensiPegawai from "../content_main_page/content_menu_kepegawaian/PresensiPegawai";
import AnakAsuh from "../content_main_page/content_menu_kewaliasuhan/AnakAsuh";
import GroupKewaliasuhan from "../content_main_page/content_menu_kewaliasuhan/GroupKewaliasuhan";
import WaliAsuh from "../content_main_page/content_menu_kewaliasuhan/WaliAsuh";
import Pengunjung from "../content_main_page/content_menu_mahrom/Pengunjung";
import KehadiranRWS from "../content_main_page/content_menu_rws/KehadiranRWS";
import TabBerkas from "../content_main_page/content_tab_formulir/TabBerkas";
import TabBiodata from "../content_main_page/content_tab_formulir/TabBiodata";
import TabDomisiliSantri from "../content_main_page/content_tab_formulir/TabDomisiliSantri";
import TabKaryawan from "../content_main_page/content_tab_formulir/TabKaryawan";
import TabKeluarga from "../content_main_page/content_tab_formulir/TabKeluarga";
import TabKhadam from "../content_main_page/content_tab_formulir/TabKhadam";
import TabPendidikan from "../content_main_page/content_tab_formulir/TabPendidikan";
import TabPengajar from "../content_main_page/content_tab_formulir/TabPengajar";
import TabPengurus from "../content_main_page/content_tab_formulir/TabPengurus";
import TabProgress from "../content_main_page/content_tab_formulir/TabProgress";
import TabSantri from "../content_main_page/content_tab_formulir/TabSantri";
import TabAnakAsuh from "../content_main_page/content_tab_formulir/TabAnakAsuh";
import TabWaliAsuh from "../content_main_page/content_tab_formulir/TabWaliAsuh";
import TabWaliKelas from "../content_main_page/content_tab_formulir/TabWaliKelas";
import TabWarPes from "../content_main_page/content_tab_formulir/TabWarPes";
import Dashboard from "../content_main_page/Dashboard";
import Formulir from "../content_main_page/Formulir";
import PindahKamar from "../content_main_page/content_menu_kewilayahan/PindahKamar";
import HubungkanWaliAsuh from "../content_main_page/content_menu_kewaliasuhan/HubungkanWaliAsuh";
import KelulusanPelajar from "../content_main_page/content_menu_akademik/KelulusanPelajar";
import AlumniSantri from "../content_main_page/content_menu_kewilayahan/AlumniSantri";
import Wilayah from "../content_main_page/content_menu_kewilayahan/Wilayah";
import Blok from "../content_main_page/content_menu_kewilayahan/Blok";
import Kamar from "../content_main_page/content_menu_kewilayahan/Kamar";
import Jurusan from "../content_main_page/content_menu_akademik/Jurusan";
import Kelas from "../content_main_page/content_menu_akademik/Kelas";
import Rombel from "../content_main_page/content_menu_akademik/Rombel";
import JamPelajaran from "../content_main_page/content_menu_akademik/JamPelajaran";
import JadwalPelajaran from "../content_main_page/content_menu_akademik/JadwalPelajaran";
import MataPelajaran from "../content_main_page/content_menu_akademik/MataPelajaran";
import TahunAjaran from "../content_main_page/content_menu_akademik/TahunAjaran";
import Semester from "../content_main_page/content_menu_akademik/Semester";
import Angkatan from "../content_main_page/content_menu_akademik/Angkatan";
// import ScanQRCode from "../content_main_page/ScanQRCode";

export const menuItems = [
    { id: "dashboard", icon: "fas fa-tachometer-alt", text: "Dashboard", link: "/dashboard", content: <Dashboard /> },
    // { id: "scanqrcode", icon: "fas fa-qrcode", text: "Scan QRCode", link: "/scanqrcode", content: <ScanQRCode /> },
    { id: "formulir", icon: "fas fa-file-alt", text: "Formulir", link: "/formulir", content: <Formulir /> },
];

export const menuDataPokokItems = [
    { id: "pesertadidik", icon: "fa-users", text: "Peserta Didik", link: "/peserta-didik", content: <PesertaDidik /> },
    { id: "orangtua", icon: "fa-user", text: "Orang Tua", link: "/orang-tua", content: <OrangTua /> },
    { id: "wali", icon: "fa-user-tie", text: "Wali", link: "/wali", content: <Wali /> },
    { id: "pengajar", icon: "fa-chalkboard-teacher", text: "Pengajar", link: "/pengajar", content: <Pengajar /> },
    { id: "pengurus", icon: "fa-user-cog", text: "Pengurus", link: "/pengurus", content: <Pengurus /> },
    { id: "karyawan", icon: "fa-briefcase", text: "Karyawan", link: "/karyawan", content: <Karyawan /> },
    { id: "walikelas", icon: "fa-chalkboard", text: "Wali Kelas", link: "/wali-kelas", content: <WaliKelas /> },
    { id: "khadam", icon: "fa-hands-helping", text: "Khadam", link: "/khadam", content: <Khadam /> },
    { id: "alumni", icon: "fa-user-graduate", text: "Alumni", link: "/alumni", content: <Alumni /> },
];

export const menuKewaliasuhanItems = [
    { id: "waliasuh", icon: "fa-user-shield", text: "Wali Asuh", link: "/wali-asuh", content: <WaliAsuh /> },
    { id: "groupkewaliasuhan", icon: "fa-book-open", text: "Group Kewaliasuhan", link: "/group-kewaliasuhan", content: <GroupKewaliasuhan /> },
    { id: "anakasuh", icon: "fa-users", text: "Anak Asuh", link: "/anak-asuh", content: <AnakAsuh /> },
    { id: "hubungkanwaliasuh", icon: "fa-link", text: "Hubungkan Wali Asuh", link: "/hubungkan-wali-asuh", content: <HubungkanWaliAsuh />, access: "kewaliasuhan", },
];

export const menuKepesantrenanItems = [
    { id: "perizinan", icon: "fa-id-card", text: "Perizinan", link: "/perizinan", content: <Perizinan /> },
    { id: "pelanggaran", icon: "fa-exclamation-triangle", text: "Pelanggaran", link: "/pelanggaran", content: <Pelanggaran /> },
    // { id: "presensipesantren", icon: "fa-calendar-check", text: "Presensi", link: "/presensi-pesantren", content: <PresensiPesantren /> },
    { id: "catatanafektif", icon: "fa-hand-holding-heart", text: "Catatan Afektif", link: "/catatan-afektif", content: <CatatanAfektif /> },
    { id: "catatankognitif", icon: "fa-brain", text: "Catatan Kognitif", link: "/catatan-kognitif", content: <CatatanKognitif /> },
    // { id: "reservasimakan", icon: "fa-cutlery", text: "Reservasi Makan", link: "/reservasi-makan", content: <ReservasiMakan /> },
];

export const menuKepegawaianItems = [
    { id: "pegawai", icon: "fa-briefcase", text: "Pegawai", link: "/pegawai", content: <Pegawai /> },
    { id: "anakpegawai", icon: "fa-book", text: "Anak Pegawai", link: "/anak-pegawai", content: <AnakPegawai /> },
    // { id: "presensipegawai", icon: "fa-calendar-check", text: "Presensi", link: "/presensi-pegawai", content: <PresensiPegawai /> },
    { id: "kategorigolongan", icon: "fa-tags", text: "Kategori Golongan", link: "/kategori-golongan", content: <KategoriGolongan />, access: "golongan" },
    { id: "golongan", icon: "fa-layer-group", text: "Golongan", link: "/golongan", content: <Golongan />, access: "golongan" },
    { id: "golonganjabatan", icon: "fa-briefcase", text: "Golongan Jabatan", link: "/golongan-jabatan", content: <GolonganJabatan />, access: "golongan" },
];

export const menuMahromItems = [
    { id: "pengunjung", icon: "fa-hands-helping", text: "Pengunjung", link: "/pengunjung", content: <Pengunjung /> },
];

export const menuRWSItems = [
    { id: "kehadiranRWS", icon: "fa-list", text: "Kehadiran RWS", link: "/kehadiran-rws", content: <KehadiranRWS /> },
];

// export const menuKelembagaanItems = [
    // { id: "lembaga", icon: "fa-building-columns", text: "Lembaga", link: "/lembaga", content: <Lembaga /> },
    // { id: "jurusan", icon: "fa-graduation-cap", text: "Jurusan", link: "/jurusan", content: <Jurusan /> },
    // { id: "kelas", icon: "fa-chalkboard", text: "Kelas", link: "/kelas", content: <Kelas /> },
    // { id: "rombel", icon: "fa-users", text: "Rombel", link: "/rombel", content: <Rombel /> },
    // { id: "kategorigolongan", icon: "fa-tags", text: "Kategori Golongan", link: "/kategori-golongan", content: <KategoriGolongan /> },
    // { id: "golongan", icon: "fa-layer-group", text: "Golongan", link: "/golongan", content: <Golongan /> },
    // { id: "golonganjabatan", icon: "fa-briefcase", text: "Golongan Jabatan", link: "/golongan-jabatan", content: <GolonganJabatan /> },
    // { id: "matapelajaran", icon: "fa-book-open", text: "Mata Pelajaran", link: "/mata-pelajaran", content: <MataPelajaran /> },
    // { id: "jampelajaran", icon: "fa-clock", text: "Jam Pelajaran", link: "/jam-pelajaran", content: <JamPelajaran /> },
    // { id: "jadwalpelajaran", icon: "fa-calendar-alt", text: "Jadwal Pelajaran", link: "/jadwal-pelajaran", content: <JadwalPelajaran /> },
// ];

export const menuKewilayahanItems = [
    { id: "wilayah", icon: "fa-map", text: "Wilayah", link: "/wilayah", content: <Wilayah /> },
    { id: "blok", icon: "fa-th-large", text: "Blok", link: "/blok", content: <Blok /> },
    { id: "kamar", icon: "fa-bed", text: "Kamar", link: "/kamar", content: <Kamar /> },
    { id: "pindahkamar", icon: "fa-right-left", text: "Pindah Kamar", link: "/pindah-kamar", content: <PindahKamar /> },
    { id: "alumnisantri", icon: "fa-user-graduate", text: "Alumni Santri", link: "/alumni-santri", content: <AlumniSantri /> },
];

export const menuAkademikItems =[
    { id: "pindahkelas", icon: "fa-repeat", text: "Pindah/Naik Kelas", link: "/pindah-kelas", content: <PindahKelas /> },
    // { id: "pindahkamar", icon: "fa-right-left", text: "Pindah Kamar", link: "/pindah-kamar", content: <PindahKamar /> },
    // { id: "hubungkanwaliasuh", icon: "fa-link", text: "Hubungkan Wali Asuh", link: "/hubungkan-wali-asuh", content: <HubungkanWaliAsuh /> },
    { id: "kelulusan", icon: "fa-graduation-cap", text: "Kelulusan Pelajar", link: "/kelulusan-pelajar", content: <KelulusanPelajar /> },
    // { id: "alumnisantri", icon: "fa-user-graduate", text: "Alumni Santri", link: "/alumni-santri", content: <AlumniSantri /> },
    // { id: "presensisantri", icon: "fa-calendar-check", text: "Presensi Santri", link: "/presensi-santri", content: <PresensiSantri /> }
    { id: "kelembagaan", icon: "fa-building-columns", text: "Kelembagaan", link: "/kelembagaan", content: <Lembaga /> },
    { id: "pelajaran", icon: "fa-book-open", text: "Pelajaran", link: "/pelajaran", content: <MataPelajaran /> },
    // { id: "jampelajaran", icon: "fa-clock", text: "Jam Pelajaran", link: "/jam-pelajaran", content: <JamPelajaran /> },
    // { id: "jadwalpelajaran", icon: "fa-calendar-alt", text: "Jadwal Pelajaran", link: "/jadwal-pelajaran", content: <JadwalPelajaran /> },
    { id: "tahunajaran", icon: "fa-calendar-check", text: "Tahun Ajaran", link: "/tahun-ajaran", content: <TahunAjaran /> },
    { id: "semester", icon: "fa-layer-group", text: "Semester", link: "/semester", content: <Semester /> },
    { id: "angkatan", icon: "fa-user-graduate", text: "Angkatan", link: "/angkatan", content: <Angkatan /> },
];

export const subKelembagaanItems = [
    { id: "lembaga", icon: "fa-building-columns", text: "Lembaga", link: "/kelembagaan/lembaga", content: <Lembaga /> },
    { id: "jurusan", icon: "fa-graduation-cap", text: "Jurusan", link: "/kelembagaan/jurusan", content: <Jurusan /> },
    { id: "kelas", icon: "fa-chalkboard", text: "Kelas", link: "/kelembagaan/kelas", content: <Kelas /> },
    { id: "rombel", icon: "fa-users", text: "Rombel", link: "/kelembagaan/rombel", content: <Rombel /> },
];

export const subPelajaranItems = [
    { id: "matapelajaran", icon: "fa-book-open", text: "Mata Pelajaran", link: "/pelajaran/mata-pelajaran", content: <MataPelajaran /> },
    { id: "jampelajaran", icon: "fa-clock", text: "Jam Pelajaran", link: "/pelajaran/jam-pelajaran", content: <JamPelajaran /> },
    { id: "jadwalpelajaran", icon: "fa-calendar-alt", text: "Jadwal Pelajaran", link: "/pelajaran/jadwal-pelajaran", content: <JadwalPelajaran /> },
];

export const tabsFormulir = [
  { id: "biodata", label: "Biodata", link: "biodata", content: <TabBiodata /> },
  { id: "keluarga", label: "Keluarga", link: "keluarga", content: <TabKeluarga /> },
  { id: "santri", label: "Santri", link: "santri", content: <TabSantri /> },
  { id: "domisili", label: "Domisili Santri", link: "domisili-santri", content: <TabDomisiliSantri /> },
  { id: "waliasuh", label: "Wali Asuh", link: "wali-asuh", content: <TabWaliAsuh /> },
  { id: "anakasuh", label: "Anak Asuh", link: "anak-asuh", content: <TabAnakAsuh /> },
  { id: "pendidikan", label: "Pendidikan", link: "pendidikan", content: <TabPendidikan /> },
  { id: "pengajar", label: "Pengajar", link: "pengajar", content: <TabPengajar /> },
  { id: "karyawan", label: "Karyawan", link: "karyawan", content: <TabKaryawan /> },
  { id: "pengurus", label: "Pengurus", link: "pengurus", content: <TabPengurus /> },
  { id: "walikelas", label: "Wali Kelas", link: "wali-kelas", content: <TabWaliKelas /> },
  { id: "khadam", label: "Khadam", link: "khadam", content: <TabKhadam /> },
  { id: "berkas", label: "Berkas", link: "berkas", content: <TabBerkas /> },
  { id: "warpes", label: "Warga Pesantren", link: "warga-pesantren", content: <TabWarPes /> },
  { id: "progress", label: "Progress Report", link: "progress-report", content: <TabProgress /> },
];

export const subPesertaDidik = [
    { id: "santri", text: "Santri", link: "/peserta-didik/santri", content: <Santri /> },
    { id: "santri-non-domisili", text: "Santri-Non-Domisili", link: "/peserta-didik/santri-non-domisili", content: <SantriNonDomisili /> },
    { id: "pelajar", text: "Pelajar", link: "/peserta-didik/pelajar", content: <Pelajar /> },
    { id: "bersaudara-kandung", text: "Bersaudara Kandung", link: "/peserta-didik/bersaudara-kandung", content: <BersaudaraKandung /> }
];

export const jenisBerkasList = [
    { id: 1, label: 'Kartu Keluarga (KK)', required: true },
    { id: 2, label: 'KTP/KIA', required: false },
    { id: 3, label: 'Akte Kelahiran', required: false },
    { id: 4, label: 'Pas Foto', required: false },
    { id: 5, label: 'Ijazah Terakhir', required: false },
    { id: 6, label: 'Fotokopi Rapor Terakhir', required: false },
    { id: 7, label: 'Surat Keterangan Sehat', required: false },
    { id: 8, label: 'BPJS / Kartu Asuransi Kesehatan', required: false },
    { id: 9, label: 'Surat Pernyataan Kesanggupan', required: false },
    { id: 10, label: 'Surat Izin Orang Tua', required: false },
    { id: 11, label: 'Surat Pernyataan Tidak Merokok', required: false },
    { id: 12, label: 'Surat Keterangan Pindah Sekolah', required: false },
    { id: 13, label: 'Surat Keterangan Lulus (SKL)', required: false },
    { id: 14, label: 'Surat Rekomendasi dari Ulama/Guru', required: false },
    { id: 15, label: 'Surat Pernyataan Bebas Narkoba', required: false },
    { id: 16, label: 'Surat Domisili (jika dari luar kota)', required: false },
    { id: 17, label: 'Surat Keterangan Anak Yatim/Piatu', required: false },
    { id: 18, label: 'Fotokopi Kartu Santri', required: false },
];

export const jenisJabatan = [
    { label: "Pilih Jenis jabatan", value: "" },
    { label: "Kultural", value: "kultural" },
    { label: "Tetap", value: "tetap" },
    { label: "Kontrak", value: "kontrak" },
    { label: "Pengkaderan", value: "pengkaderan" }
];