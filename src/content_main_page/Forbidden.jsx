import { useNavigate } from "react-router-dom";

const Forbidden = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-gray-900 h-screen flex items-center justify-center">
            <div className="px-4 mx-auto max-w-screen-xl text-center">
                <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-500">
                    403
                </h1>
                <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">
                    Akses Ditolak
                </p>
                <p className="mb-4 text-lg font-light text-gray-400">
                    Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex font-bold text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-red-900 my-4"
                >
                    Kembali
                </button>
            </div>
        </section>
    );
};

export default Forbidden;
