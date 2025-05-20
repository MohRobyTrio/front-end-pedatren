import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { API_BASE_URL } from "../../hooks/config";

// Skema validasi form
const schema = yup.object({
  lembaga: yup.string().required('Lembaga wajib dipilih'),
  jurusan: yup.string().optional(),
  kelas: yup.string().optional(),
  rombel: yup.string().optional(),
  noInduk: yup.string().required('Nomor induk wajib diisi'),
  tglMulai: yup.date().required('Tanggal mulai wajib diisi'),
  tglAkhir: yup.date().optional()
    .test(
      'is-after-start',
      'Tanggal akhir harus setelah tanggal mulai',
      function (value) {
        return !value || value >= this.parent.tglMulai
      }
    ),
});

const TabPendidikan = () => {
  const { biodata_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [historyPendidikan, setHistoryPendidikan] = useState([]);
  const [errorHistory, setErrorHistory] = useState(null);

  // Data options from API
  const [lembagaOptions, setLembagaOptions] = useState([]);
  const [jurusanOptions, setJurusanOptions] = useState([]);
  const [kelasOptions, setKelasOptions] = useState([]);
  const [rombelOptions, setRombelOptions] = useState([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      lembaga: '',
      jurusan: '',
      kelas: '',
      rombel: '',
      noInduk: '',
      tglMulai: '',
      tglAkhir: '',
      status: ''
    }
  });

  // Watch selected values for chained dropdowns
  const selectedLembaga = watch('lembaga');
  const selectedJurusan = watch('jurusan');
  const selectedKelas = watch('kelas');

  // Load history pendidikan
  const loadHistoryPendidikan = async () => {
    if (!biodata_id) return;

    try {
      setIsLoading(true);
      setErrorHistory(null);
      const response = await axios.get(`${API_BASE_URL}formulir/${biodata_id}/pendidikan`, {
        params: { biodata_id }
      });

      if (response.data.data && response.data.data.length > 0) {
        setHistoryPendidikan(response.data.data);

        // Otomatis isi form dengan data terbaru
        const latestData = response.data.data[0];
        fillFormWithHistory(latestData);
      } else {
        setHistoryPendidikan([]);
      }
    } catch (error) {
      console.error('Error loading history pendidikan:', error);
      setErrorHistory('Gagal memuat history pendidikan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Isi form dengan data history
  const fillFormWithHistory = (historyData) => {
    setValue('lembaga', historyData.lembaga_id || '');
    setValue('jurusan', historyData.jurusan_id || '');
    setValue('kelas', historyData.kelas_id || '');
    setValue('rombel', historyData.rombel_id || '');
    setValue('noInduk', historyData.no_induk || '');
    setValue('tglMulai', historyData.tanggal_masuk || '');
    setValue('tglAkhir', historyData.tanggal_keluar || '');
    setValue('status', historyData.status || '');
    setIsUpdateMode(true);
  };

  // Load dropdown options
  useEffect(() => {
    const fetchLembaga = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}dropdown/${hapusini}/lembaga`);
        setLembagaOptions(response.data.data);
      } catch (error) {
        console.error('Error fetching lembaga:', error);
      }
    };

    fetchLembaga();
    loadHistoryPendidikan();
  }, [biodata_id]);

  // Load jurusan based on selected lembaga
  useEffect(() => {
    const fetchJurusan = async () => {
      if (!selectedLembaga) return;
      try {
        const response = await axios.get(`${API_BASE_URL}dropdown/lembaga/${selectedLembaga}/jurusan`);
        setJurusanOptions(response.data.data);
        setValue('jurusan', ''); // Reset jurusan when lembaga changes
      } catch (error) {
        console.error('Error fetching jurusan:', error);
      }
    };

    fetchJurusan();
  }, [selectedLembaga, setValue]);

  // Load kelas based on selected jurusan
  useEffect(() => {
    const fetchKelas = async () => {
      if (!selectedJurusan) return;
      try {
        const response = await axios.get(`${API_BASE_URL}dropdown/jurusan/${selectedJurusan}/kelas`);
        setKelasOptions(response.data.data);
        setValue('kelas', ''); // Reset kelas when jurusan changes
      } catch (error) {
        console.error('Error fetching kelas:', error);
      }
    };

    fetchKelas();
  }, [selectedJurusan, setValue]);

  // Load rombel based on selected kelas
  useEffect(() => {
    const fetchRombel = async () => {
      if (!selectedKelas) return;
      try {
        const response = await axios.get(`${API_BASE_URL}dropdown/kelas/${selectedKelas}/rombel`);
        setRombelOptions(response.data.data);
        setValue('rombel', ''); // Reset rombel when kelas changes
      } catch (error) {
        console.error('Error fetching rombel:', error);
      }
    };

    fetchRombel();
  }, [selectedKelas, setValue]);

  // Submit form
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('lembaga_id', data.lembaga);
      formData.append('jurusan_id', data.jurusan);
      formData.append('kelas_id', data.kelas);
      formData.append('rombel_id', data.rombel);
      formData.append('no_induk', data.noInduk);
      formData.append('tgl_mulai', data.tglMulai);
      if (data.tglAkhir) formData.append('tgl_akhir', data.tglAkhir);

      let response;
      if (isUpdateMode && biodata_id) {
        response = await axios.post(
          `${API_BASE_URL}formulir/${biodata_id}/pendidikan?_method=PUT`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}formulir/${biodata_id}/pendidikan?_method=POST`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      alert(isUpdateMode ? 'Data pendidikan berhasil diupdate!' : 'Data pendidikan berhasil disimpan!');

      // Reload history setelah simpan/update
      loadHistoryPendidikan();

      if (!isUpdateMode) {
        reset();
      }

    } catch (error) {
      console.error('Error saving data:', error);
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach(key => {
          alert(`${key}: ${backendErrors[key][0]}`);
        });
      } else {
        alert('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    reset();
    setIsUpdateMode(false);
  };

  if (isLoading && isUpdateMode) {
    return <div className="text-center p-5">Loading data...</div>;
  }

  return (
    <div className="relative p-2 bg-white">
      {/* Judul Formulir */}
      <h1 className="text-xl font-bold mb-4">
        {isUpdateMode ? `Formulir Pendidikan: ID ${biodata_id}` : 'Formulir Pendidikan Baru'}
      </h1>

      {/* Debug Info */}
      <div className="mb-4 p-2 bg-gray-100 text-xs">
        <p>Mode: {isUpdateMode ? 'Update' : 'Baru'}</p>
        <p>ID: {biodata_id || 'tidak ada'}</p>
      </div>
      <div className="mb-4 p-2 bg-gray-100 text-xs">
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>

      {/* History Pendidikan */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">History Pendidikan</h2>

        {errorHistory && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorHistory}
            <button
              onClick={loadHistoryPendidikan}
              className="ml-2 text-red-700 underline"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {historyPendidikan.length > 0 ? (
          <div className="space-y-3">
            {historyPendidikan.map((item) => (
              <div
                key={item.id}
                onClick={() => fillFormWithHistory(item)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${watch('noInduk') === item.no_induk ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.nama_lembaga} - {item.nama_jurusan}</h3>
                    <p className="text-sm text-gray-600">
                      {item.nama_kelas} - {item.nama_rombel} | No. Induk: {item.no_induk}
                    </p>
                    <p className="text-sm text-gray-600">
                      Periode: {item.tanggal_masuk}
                      {item.tanggal_keluar ? ` s/d ${item.tanggal_keluar}` : ' - Sekarang'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {item.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
            {isLoading ? 'Memuat history...' : 'Tidak ada history pendidikan'}
          </div>
        )}

        {historyPendidikan.length > 0 && (
          <button
            type="button"
            onClick={handleAddNew}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tambah Pendidikan Baru
          </button>
        )}
      </div>

      {/* Form Pendidikan */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lembaga */}
          <div className="flex flex-col">
            <label htmlFor="lembaga" className="text-black mb-1">
              Lembaga *
            </label>
            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
              <select
                id="lembaga"
                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                {...register('lembaga')}
                disabled={isLoading}
              >
                <option value="">Pilih Lembaga</option>
                {lembagaOptions.map(lembaga => (
                  <option key={lembaga.id} value={lembaga.id}>{lembaga.nama}</option>
                ))}
              </select>
            </div>
            {errors.lembaga && (
              <p className="text-red-500 text-sm mt-1">{errors.lembaga.message}</p>
            )}
          </div>

          {/* Jurusan */}
          <div className="flex flex-col">
            <label htmlFor="jurusan" className="text-black mb-1">
              Jurusan *
            </label>
            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
              <select
                id="jurusan"
                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                {...register('jurusan')}
                disabled={!selectedLembaga || isLoading}
              >
                <option value="">Pilih Jurusan</option>
                {jurusanOptions.map(jurusan => (
                  <option key={jurusan.id} value={jurusan.id}>{jurusan.nama}</option>
                ))}
              </select>
            </div>
            {errors.jurusan && (
              <p className="text-red-500 text-sm mt-1">{errors.jurusan.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kelas */}
          <div className="flex flex-col">
            <label htmlFor="kelas" className="text-black mb-1">
              Kelas *
            </label>
            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
              <select
                id="kelas"
                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                {...register('kelas')}
                disabled={!selectedJurusan || isLoading}
              >
                <option value="">Pilih Kelas</option>
                {kelasOptions.map(kelas => (
                  <option key={kelas.id} value={kelas.id}>{kelas.nama}</option>
                ))}
              </select>
            </div>
            {errors.kelas && (
              <p className="text-red-500 text-sm mt-1">{errors.kelas.message}</p>
            )}
          </div>

          {/* Rombel */}
          <div className="flex flex-col">
            <label htmlFor="rombel" className="text-black mb-1">
              Rombel *
            </label>
            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
              <select
                id="rombel"
                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 focus:outline-none sm:text-sm"
                {...register('rombel')}
                disabled={!selectedKelas || isLoading}
              >
                <option value="">Pilih Rombel</option>
                {rombelOptions.map(rombel => (
                  <option key={rombel.id} value={rombel.id}>{rombel.nama}</option>
                ))}
              </select>
            </div>
            {errors.rombel && (
              <p className="text-red-500 text-sm mt-1">{errors.rombel.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nomor Induk */}
          <div className="flex flex-col">
            <label htmlFor="noInduk" className="text-black mb-1">
              Nomor Induk *
            </label>
            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
              <input
                id="noInduk"
                type="text"
                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                {...register('noInduk')}
                disabled={isLoading}
              />
            </div>
            {errors.noInduk && (
              <p className="text-red-500 text-sm mt-1">{errors.noInduk.message}</p>
            )}
          </div>

          {/* Tanggal Mulai */}
          <div className="flex flex-col">
            <label htmlFor="tglMulai" className="text-black mb-1">
              Tanggal Mulai *
            </label>
            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
              <input
                id="tglMulai"
                type="date"
                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                {...register('tglMulai')}
                disabled={isLoading}
              />
            </div>
            {errors.tglMulai && (
              <p className="text-red-500 text-sm mt-1">{errors.tglMulai.message}</p>
            )}
          </div>

          {/* Tanggal Akhir */}
          <div className="flex flex-col">
            <label htmlFor="tglAkhir" className="text-black mb-1">
              Tanggal Akhir
            </label>
            <div className="flex items-center rounded-md shadow-md bg-white pl-3 border border-gray-300 focus-within:border-gray-500">
              <input
                id="tglAkhir"
                type="date"
                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                {...register('tglAkhir')}
                disabled={isLoading}
              />
            </div>
            {errors.tglAkhir && (
              <p className="text-red-500 text-sm mt-1">{errors.tglAkhir.message}</p>
            )}
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TabPendidikan;