const Keluarga = () => {
    return (
        <>
            <h1 className="text-xl font-bold">Relasi Keluarga</h1>
            <hr className="border-t border-gray-300 my-4" />
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                    <label htmlFor="namaPerson" className="block text-sm font-medium text-gray-700">
                        Nama
                    </label>
                    <input
                        type="text"
                        id="namaPerson"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="Mat Saini"
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select id="status" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled>
                        <option>Saudara kandung</option>
                        <option>Ibu kandung</option>
                        <option>Ayah kandung</option>
                    </select>
                </div>
                <div className="flex items-center mt-6">
                    <input
                        type="checkbox"
                        id="sebagaiWali"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        defaultChecked
                        disabled
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700" htmlFor="sebagaiWali">
                        Sebagai Wali
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700"></label>
                    <button type="button" className="mt-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none">
                        Batal
                    </button>
                </div>
            </form>
        </>
    );
};

export default Keluarga;
