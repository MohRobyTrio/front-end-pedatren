const FormKhadam = ({ register }) => {
    return (
        <>
            <div className="space-y-2">
                {/* Input Keterangan */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="keterangan" className="md:w-1/4 text-black">
                        Keterangan
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md pl-1 border border-gray-500 bg-white border-gray-300">
                            <input
                                id="keterangan"
                                name="keterangan"
                                type="text"
                                placeholder="Masukkan keterangan"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalKhadam.keterangan')}
                            />
                        </div>
                    </div>
                </div>

                {/* Input Tanggal Mulai */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <label htmlFor="tanggal_mulai" className="md:w-1/4 text-black">
                        Tanggal Mulai
                    </label>
                    <div className="md:w-full md:max-w-md max-w-none">
                        <div className="flex items-center rounded-md shadow-md pl-1 border border-gray-500 bg-white border-gray-300">
                            <input
                                id="tanggal_mulai"
                                name="tanggal_mulai"
                                type="date"
                                className="w-full py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                {...register('modalKhadam.tanggal_mulai')}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};

export default FormKhadam;