const PresensiPesantren = () => {
  const activities = [
    { id: 1, name: "Ngaji Pagi", days: "Min Sen Rab Kam Sab", time: "05:30 - 06:30" },
    { id: 2, name: "Masuk Sekolah Formal Siswa", days: "Min Sen Sel Rab Kam Sab", time: "06:50 - 07:50" },
    { id: 3, name: "Ngaji Sore", days: "Min Sen Rab Kam Sab", time: "15:00 - 16:30" },
    { id: 4, name: "KBM Malam", days: "Min Sen Rab Jum Sab", time: "19:30 - 23:55" },
    { id: 5, name: "Pembinaan Al Qur'an", days: "Min Sen Sel Rab Jum Sab", time: "17:00 - 18:30" },
    { id: 6, name: "Pengajian Al Qur'an Pagi", days: "Min Sen Rab Kam Sab", time: "04:30 - 06:00" },
    { id: 7, name: "Pulang Sekolah Formal Siswa", days: "Min Sen Rab Kam Sab", time: "11:10 - 14:30" }
  ];

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Presensi Kegiatan</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="bg-blue-100 p-4 rounded-md mb-4">
        Pilih salah satu kegiatan untuk melanjutkan <b>Presensi</b>.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border p-4 rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-semibold">{activity.name}</h2>
            <p className="text-sm font-bold">Hari</p>
            <p className="text-sm">{activity.days}</p>
            <p className="text-sm font-bold">Jam</p>
            <p className="text-sm">{activity.time}</p>
            <div className="mt-2 flex gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded">Presensi</button>
              <button className="bg-blue-500 text-white px-3 py-1 rounded">Rekap</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default PresensiPesantren;
