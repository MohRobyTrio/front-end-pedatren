import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';

export default function ModalBerkas({ isOpen, onClose, onSubmit, initialData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    if (initialData) {
      setKeterangan(initialData.keterangan || '');
      setSelectedFile(null);
    } else {
      setKeterangan('');
      setSelectedFile(null);
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile && !initialData) {
      alert('Pilih file terlebih dahulu');
      return;
    }
    onSubmit({ file: selectedFile, keterangan, id: initialData?.id || null });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>

              <Dialog.Title className="text-xl font-semibold mb-4">
                {initialData ? 'Edit Berkas' : 'Tambah Berkas'}
              </Dialog.Title>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!initialData && (
                  <div>
                    <label className="block mb-1 text-gray-700">File</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                )}

                {initialData && (
                  <div className="text-sm text-gray-500 italic mb-2">
                    Upload file baru hanya jika ingin mengganti file lama.
                    <br />
                    Biarkan kosong jika tidak ingin mengganti.
                  </div>
                )}

                <div>
                  <label className="block mb-1 text-gray-700">Keterangan</label>
                  <input
                    type="text"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi singkat"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    {initialData ? 'Update' : 'Upload'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
