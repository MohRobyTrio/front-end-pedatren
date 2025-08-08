import { useParams, Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { tabsFormulir } from "../data/menuData";
import { useEffect } from "react";

const Formulir = () => {
    const { biodata_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (biodata_id) {
            sessionStorage.setItem("last_biodata_id", biodata_id);
        } else {
            const lastId = sessionStorage.getItem("last_biodata_id");
            const isFormulirRoot = location.pathname === "/formulir";
            if (lastId && isFormulirRoot) {
                navigate(`/formulir/${lastId}/${tabsFormulir[0].link}`, { replace: true });
            }
        }
    }, [biodata_id, navigate, location.pathname]);

    return (
        <div className="flex-1 pl-6 pt-6 pb-6">
            {!biodata_id ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-center text-gray-600 py-12">
                        <p className="text-lg font-medium">Belum ada data yang dipilih.</p>
                        <p className="text-sm text-gray-500 mt-2">Silakan pilih data terlebih dahulu untuk melihat formulir.</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Profile Card Container with Tabs */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-4">
                                <div className="relative">
                                    <img
                                        src="/professional-headshot.png"
                                        alt="Profile"
                                        className="w-28 h-28 rounded-lg object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-2xl font-bold text-gray-900">Ahmad Budi Santoso</h2>
                                        
                                    </div>
                                    <div className="flex flex-col items-start gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>NIK</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Jenis Kelamin</span>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        

                        {/* Tab Navigation */}
                        <nav className="border-b border-gray-300">
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
                                {tabsFormulir.map((tab) => {
                                    const fullPath = `/formulir/${biodata_id}/${tab.link}`;
                                    const isActive = location.pathname === fullPath;
                                    return (
                                        <li key={tab.id}>
                                            <Link
                                                to={fullPath}
                                                className={`inline-block p-3 rounded-t-lg border-b-2 transition-all duration-200 ${
                                                    isActive
                                                        ? "text-blue-600 border-blue-600 bg-gray-100 font-semibold"
                                                        : "border-transparent hover:text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                {tab.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    
                                <br />
                        <Outlet />
                    </div>
                </>
            )}
        </div>
    );
};

export default Formulir;
