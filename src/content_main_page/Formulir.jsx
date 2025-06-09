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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Formulir</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {!biodata_id ? (
                    <div className="text-center text-gray-600 py-12">
                        <p className="text-lg font-medium">Belum ada data yang dipilih.</p>
                        <p className="text-sm text-gray-500 mt-2">Silakan pilih data terlebih dahulu untuk melihat formulir.</p>
                    </div>
                ) : (
                    <>
                        <nav aria-label="Breadcrumb">
                            <ol className="flex flex-wrap rounded border border-gray-300 bg-white text-sm text-gray-700">
                                {tabsFormulir.map((tab, index) => {
                                    const fullPath = `/formulir/${biodata_id}/${tab.link}`;
                                    const isActive = location.pathname === fullPath;
                                    const bgColor = isActive ? "bg-gray-500 text-white font-semibold" : "bg-white";
                                    const chevronColor = isActive ? "bg-gray-500" : "bg-white";

                                    return (
                                        <li className="flex" key={tab.id}>
                                            <Link
                                                to={fullPath}
                                                className={`block h-10 pr-4 pl-6 leading-10 transition-colors ${bgColor}`}
                                            >
                                                {tab.label}
                                            </Link>
                                            {index < tabsFormulir.length && (
                                                <div className="relative flex items-center">
                                                    <span
                                                        className={`absolute inset-y-0 -start-px h-10 w-4 ${chevronColor} [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180`}
                                                    ></span>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>

                        <div className="p-4 relative">
                            <Outlet />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Formulir;
