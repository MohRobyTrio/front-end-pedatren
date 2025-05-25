import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage, faFileAlt, faFilePdf, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useBerkas } from '../../hooks/hooks_formulir/tabBerkas';
import ModalBerkas from '../../components/modal/modal_formulir/ModalBerkas';
import { useParams } from 'react-router-dom';

export default function TabBerkas() {
  const { biodata_id } = useParams();
  const bioId = biodata_id;
  const { berkasList, loading, error, fetchBerkas, createBerkas, updateBerkas } = useBerkas(bioId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null); // {id, keterangan} untuk edit

  useEffect(() => {
    fetchBerkas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bioId]);

  function iconForType(type) {
    if (!type) return faFileAlt;
    if (type.includes('image')) return faFileImage;
    if (type.includes('pdf')) return faFilePdf;
    return faFileAlt;
  }

  const handleOpenAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (berkas) => {
    setEditData({ id: berkas.id, keterangan: berkas.keterangan || '' });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async ({ file, keterangan, id }) => {
    try {
      if (id) {
        // update
        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('keterangan', keterangan);
        await updateBerkas(id, formData);
        alert('Berkas berhasil diperbarui');
      } else {
        // add
        if (!file) {
          alert('Pilih file terlebih dahulu');
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('keterangan', keterangan);
        await createBerkas(bioId, formData);
        alert('Berkas berhasil ditambahkan');
      }
      setModalOpen(false);
      fetchBerkas();
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="px-2 sm:px-4 w-full">
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-xl font-bold">Berkas</h1>
    <button
      onClick={handleOpenAdd}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
    >
      Tambah Berkas
    </button>
  </div>

  {loading && <p>Loading...</p>}
  {error && <p className="text-red-500">{error}</p>}

  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full">
    {berkasList.length === 0 && !loading && <p className="col-span-full text-center">Belum ada berkas.</p>}
    {berkasList.map((berkas) => (
      <div
        key={berkas.id}
        className="border rounded p-3 flex items-center space-x-3 bg-white shadow-sm w-full"
      >
        <FontAwesomeIcon
          icon={iconForType(berkas.mime_type)}
          size="2x"
          className="text-blue-600"
        />
        <div className="flex-1">
          <p className="font-semibold truncate">{berkas.nama_jenis_berkas || 'File'}</p>
          <p className="text-sm text-gray-600">{berkas.keterangan}</p>
        </div>
        <button
          onClick={() => handleOpenEdit(berkas)}
          className="text-yellow-500 hover:text-yellow-700"
          aria-label="Edit berkas"
          title="Edit berkas"
        >
          <FontAwesomeIcon icon={faEdit} size="lg" />
        </button>
      </div>
    ))}
  </div>


      <ModalBerkas
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editData}
      />
    </div>
  );
}
