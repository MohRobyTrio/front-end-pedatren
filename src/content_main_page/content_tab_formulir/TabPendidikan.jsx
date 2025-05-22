import { useCallback, useEffect, useState } from "react";
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
  tglAkhir: yup.date().nullable().transform((value) => (value === "" ? null : value)),
  status: yup.string().optional()
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

  // State untuk menyimpan ID (hanya untuk parameter dropdown)
  const [selectedIds, setSelectedIds] = useState({
    lembaga_id: '',
    jurusan_id: '',
    kelas_id: '',
    rombel_id: ''
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      lembaga: '',
      jurusan: '',
      kelas: '',
      rombel: '',
      noInduk: '',
      tglMulai: '',
      tglAkhir: null,
      status: ''
    }
  });

  // Watch selected values
  const selectedLembaga = watch('lembaga');
  const selectedJurusan = watch('jurusan');
  const selectedKelas = watch('kelas');

  // Load history pendidikan
  const loadHistoryPendidikan = async () => {
    if (!biodata_id) return;

    try {
      setIsLoading(true);
      setErrorHistory(null);
      const response = await axios.get(`${API_BASE_URL}formulir/${biodata_id}/pendidikan`);

      if (response.data.data) {
        const data = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        setHistoryPendidikan(data);

        // Otomatis isi form dengan data terbaru jika ada
        if (data.length > 0) {
          fillFormWithHistory(data[0]);
        }
      } else {
        setHistoryPendidikan([]);
      }
    } catch (error) {
      console.error('Error loading history pendidikan:', error);
      setErrorHistory(error.response?.data?.message || 'Gagal memuat history pendidikan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Isi form dengan data history
  const fillFormWithHistory = (historyData) => {
    // Set nilai text/nama
    setValue('lembaga', historyData.nama_lembaga || '');
    setValue('jurusan', historyData.nama_jurusan || '');
    setValue('kelas', historyData.nama_kelas || '');
    setValue('rombel', historyData.nama_rombel || '');
    setValue('noInduk', historyData.no_induk || '');
    setValue('tglMulai', historyData.tanggal_masuk || '');
    setValue('tglAkhir', historyData.tanggal_keluar || null);
    setValue('status', historyData.status || '');

    // Cari ID untuk keperluan dropdown chaining
    const findId = (options, name, fieldName = 'nama') => {
      return options.find(opt => opt[fieldName] === name || opt[`nama_${fieldName}`] === name)?.id || '';
    };

    // Update selectedIds setelah form diisi
    setTimeout(() => {
      setSelectedIds({
        lembaga_id: findId(lembagaOptions, historyData.nama_lembaga, 'lembaga'),
        jurusan_id: findId(jurusanOptions, historyData.nama_jurusan),
        kelas_id: findId(kelasOptions, historyData.nama_kelas),
        rombel_id: findId(rombelOptions, historyData.nama_rombel)
      });
    }, 0);

    setIsUpdateMode(true);
  };

  // Load dropdown options
  useEffect(() => {
    const fetchLembaga = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}dropdown/lembaga`);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setLembagaOptions(data || []);
      } catch (error) {
        console.error('Error fetching lembaga:', error);
        setLembagaOptions([]);
      }
    };

    fetchLembaga();
    loadHistoryPendidikan();
  }, [biodata_id]);

  // Load jurusan based on selected lembaga ID
  useEffect(() => {
    const fetchJurusan = async () => {
      if (!selectedIds.lembaga_id) {
        setJurusanOptions([]);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}dropdown/jurusan/${selectedIds.lembaga_id}`);
        setJurusanOptions(Array.isArray(response.data) ? response.data : [response.data]);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching jurusan:', error);
        setJurusanOptions([]);
      }
    };

    fetchJurusan();
  }, [selectedIds.lembaga_id]);

  // Load kelas based on selected jurusan ID
  useEffect(() => {
    const fetchKelas = async () => {
      if (!selectedIds.jurusan_id) {
        setKelasOptions([]);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}dropdown/kelas/${selectedIds.jurusan_id}`);
        setKelasOptions(Array.isArray(response.data) ? response.data : [response.data]);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching kelas:', error);
        setKelasOptions([]);
      }
    };

    fetchKelas();
  }, [selectedIds.jurusan_id]);

  // Load rombel based on selected kelas ID
  useEffect(() => {
    const fetchRombel = async () => {
      if (!selectedIds.kelas_id) {
        setRombelOptions([]);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}dropdown/rombel/${selectedIds.kelas_id}`);
        setRombelOptions(Array.isArray(response.data) ? response.data : [response.data]);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching rombel:', error);
        setRombelOptions([]);
      }
    };

    fetchRombel();
  }, [selectedIds.kelas_id]);

  // Handle perubahan dropdown lembaga - PERBAIKAN DISINI
  const handleLembagaChange = useCallback((e) => {
    const selectedValue = e.target.value;
    const selectedOption = lembagaOptions.find(l => l.nama_lembaga === selectedValue);

    // Set nilai form secara langsung
    setValue('lembaga', selectedValue, { shouldValidate: true });

    // Reset nilai dropdown yang dependent
    setValue('jurusan', '', { shouldValidate: true });
    setValue('kelas', '', { shouldValidate: true });
    setValue('rombel', '', { shouldValidate: true });

    // Update selectedIds setelah form diupdate
    setSelectedIds(prev => ({
      ...prev,
      lembaga_id: selectedOption?.id || '',
      jurusan_id: '',
      kelas_id: '',
      rombel_id: ''
    }));
  }, [lembagaOptions, setValue, setSelectedIds]);

  // Handle perubahan dropdown jurusan - PERBAIKAN DISINI
  const handleJurusanChange = useCallback((e) => {
    const selectedValue = e.target.value;
    const selectedOption = jurusanOptions.find(j => j.nama === selectedValue);

    // Set nilai form secara langsung
    setValue('jurusan', selectedValue, { shouldValidate: true });

    // Reset nilai dropdown yang dependent
    setValue('kelas', '', { shouldValidate: true });
    setValue('rombel', '', { shouldValidate: true });

    // Update selectedIds setelah form diupdate
    setSelectedIds(prev => ({
      ...prev,
      jurusan_id: selectedOption?.id || '',
      kelas_id: '',
      rombel_id: ''
    }));
  }, [jurusanOptions, setValue, setSelectedIds]);

  // Handle perubahan dropdown kelas - PERBAIKAN DISINI
  const handleKelasChange = useCallback((e) => {
    const selectedValue = e.target.value;
    const selectedOption = kelasOptions.find(k => k.nama === selectedValue);

    // Set nilai form secara langsung
    setValue('kelas', selectedValue, { shouldValidate: true });

    // Reset nilai dropdown yang dependent
    setValue('rombel', '', { shouldValidate: true });

    // Update selectedIds setelah form diupdate
    setSelectedIds(prev => ({
      ...prev,
      kelas_id: selectedOption?.id || '',
      rombel_id: ''
    }));
  }, [kelasOptions, setValue, setSelectedIds]);

  // Handle perubahan dropdown rombel - PERBAIKAN DISINI
  const handleRombelChange = useCallback((e) => {
    const selectedValue = e.target.value;
    const selectedOption = rombelOptions.find(r => r.nama === selectedValue);

    // Set nilai form secara langsung
    setValue('rombel', selectedValue, { shouldValidate: true });

    // Update selectedIds setelah form diupdate
    setSelectedIds(prev => ({
      ...prev,
      rombel_id: selectedOption?.id || ''
    }));
  }, [rombelOptions, setValue, setSelectedIds]);

  // Submit form
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const payload = {
        lembaga_id: selectedIds.lembaga_id,
        jurusan_id: selectedIds.jurusan_id || null,
        kelas_id: selectedIds.kelas_id || null,
        rombel_id: selectedIds.rombel_id || null,
        no_induk: data.noInduk,
        tanggal_masuk: data.tglMulai,
        tanggal_keluar: data.tglAkhir || null,
        status: data.status || null
      };


      let response;
      if (isUpdateMode && biodata_id) {
        response = await axios.put(
          `${API_BASE_URL}formulir/${biodata_id}/pendidikan`,
          payload
        );
      } else {
        response = await axios.put(
          `${API_BASE_URL}formulir/${biodata_id}/pendidikan/pindah`,
          payload
        );
      };

      alert(isUpdateMode ? 'Data pendidikan berhasil diupdate!' : 'Data pendidikan berhasil disimpan!');
      loadHistoryPendidikan();

      if (!isUpdateMode) {
        reset();
        setSelectedIds({
          lembaga_id: '',
          jurusan_id: '',
          kelas_id: '',
          rombel_id: ''
        });
      };
    } catch (error) {
      console.error('Error saving data:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    reset();
    setSelectedIds({
      lembaga_id: '',
      jurusan_id: '',
      kelas_id: '',
      rombel_id: ''
    });
    setIsUpdateMode(false);
  };

  if (isLoading && isUpdateMode) {
    return <div className="text-center p-5">Loading data...</div>;
  }

  return (
    <div className="relative p-2 bg-white">
      {/* Judul Formulir */}
      <h1 className="text-xl font-bold flex items-center justify-between">Pendidikan
        {/* <button
          onClick={openAddModal}
          type="button"
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-green-800 cursor-pointer"
        >
          <i className="fas fa-plus"></i>
          <span>Tambah Data</span>
        </button> */}
      </h1>

      {/* History Pendidikan */}
      <div className="mb-6">
        {/* Debug Info - untuk development, bisa dihapus di production */}
        {/* <div className="mb-4 p-2 bg-gray-100 text-xs">
          <p>Mode: {isUpdateMode ? 'Update' : 'Baru'}</p>
          <p>ID: {biodata_id || 'tidak ada'}</p>
        </div> */}
        {/* <div className="mb-4 p-2 bg-gray-100 text-xs"> */}
          {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        {/* </div> */}
        {/* <h2 className="text-lg font-semibold mb-2">History Pendidikan</h2> */}

        <br />

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
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${watch('noInduk') === item.no_induk ? 'border-blue-100 bg-blue-50' : 'border-gray-200'
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
                  <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
            Tambah Pendidikan
          </button>
        )}
      </div>

      {/* Form Pendidikan */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 mt-4">
        <div className="sm:col-span-2 md:col-span-2">
          <label htmlFor="lembaga" className="block text-sm font-medium text-gray-700">
            Lembaga *
          </label>
          <select
            id="lembaga"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedLembaga || ""}
            onChange={handleLembagaChange}
            disabled={isLoading}
          >
            <option value="">Pilih Lembaga</option>
            {lembagaOptions?.map(lembaga => (
              <option key={lembaga.id} value={lembaga.nama_lembaga}>
                {lembaga.nama_lembaga}
              </option>
            ))}
          </select>
          {errors.lembaga && (
            <p className="text-red-500 text-sm mt-1">{errors.lembaga.message}</p>
          )}
        </div>

        <div className="sm:col-span-2 md:col-span-2">
          <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700">
            Jurusan
          </label>
          <select
            id="jurusan"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedJurusan || ""}
            onChange={handleJurusanChange}
            disabled={!selectedIds.lembaga_id || isLoading}
          >
            <option value="">Pilih Jurusan</option>
            {jurusanOptions.map(jurusan => (
              <option key={jurusan.id} value={jurusan.nama_jurusan}>{jurusan.nama_jurusan}</option>
            ))}
          </select>
          {errors.jurusan && (
            <p className="text-red-500 text-sm mt-1">{errors.jurusan.message}</p>
          )}
        </div>

        <div className="sm:col-span-2 md:col-span-2">
          <label htmlFor="kelas" className="block text-sm font-medium text-gray-700">
            Kelas
          </label>
          <select
            id="kelas"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedKelas || ""}
            onChange={handleKelasChange}
            disabled={!selectedIds.jurusan_id || isLoading}
          >
            <option value="">Pilih Kelas</option>
            {kelasOptions.map(kelas => (
              <option key={kelas.id} value={kelas.nama_kelas}>{kelas.nama_kelas}</option>
            ))}
          </select>
          {errors.kelas && (
            <p className="text-red-500 text-sm mt-1">{errors.kelas.message}</p>
          )}
        </div>

        <div className="sm:col-span-2 md:col-span-2">
          <label htmlFor="rombel" className="block text-sm font-medium text-gray-700">
            Rombel
          </label>
          <select
            id="rombel"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={watch('rombel') || ""}
            onChange={handleRombelChange}
            disabled={!selectedIds.kelas_id || isLoading}
          >
            <option value="">Pilih Rombel</option>
            {rombelOptions.map(rombel => (
              <option key={rombel.id} value={rombel.nama_rombel}>{rombel.nama_rombel}</option>
            ))}
          </select>
          {errors.rombel && (
            <p className="text-red-500 text-sm mt-1">{errors.rombel.message}</p>
          )}
        </div>

        <div className="sm:col-span-2 md:col-span-2">
          <label htmlFor="noInduk" className="block text-sm font-medium text-gray-700">
            Nomor Induk *
          </label>
          <input
            id="noInduk"
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            {...register('noInduk')}
            disabled={isLoading}
          />
          {errors.noInduk && (
            <p className="text-red-500 text-sm mt-1">{errors.noInduk.message}</p>
          )}
        </div>
      
        <div className="sm:col-span-2 md:col-span-3">
          <label htmlFor="tglMulai" className="block text-sm font-medium text-gray-700">
            Tanggal Mulai *
          </label>
          <input
            id="tglMulai"
            type="date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            {...register('tglMulai')}
            disabled={isLoading}
          />
          {errors.tglMulai && (
            <p className="text-red-500 text-sm mt-1">{errors.tglMulai.message}</p>
          )}
        </div>

        <div className="sm:col-span-2 md:col-span-3">
          <label htmlFor="tglAkhir" className="block text-sm font-medium text-gray-700">
            Tanggal Akhir
          </label>
          <input
            id="tglAkhir"
            type="date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            {...register('tglAkhir')}
            disabled={isLoading}
          />
          {errors.tglAkhir && (
            <p className="text-red-500 text-sm mt-1">{errors.tglAkhir.message}</p>
          )}
        </div>

        <div className="col-span-8 flex justify-start gap-2 mt-4">
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