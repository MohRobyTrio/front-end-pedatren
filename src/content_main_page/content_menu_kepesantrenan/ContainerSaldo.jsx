import { useLocation, useNavigate, Outlet, Navigate } from "react-router-dom";
import { menuSaldo } from "../../data/menuData";
import { hasAccess } from "../../utils/hasAccess";

const ContainerSaldo = () => {
    const location = useLocation();
    const navigate = useNavigate();

    if (!hasAccess("saldo")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="bg-white shadow-sm rounded-lg">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header: Status + Action Buttons */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 space-y-4 lg:space-y-0">
                        {/* Info Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-xs text-gray-500">Sistem Aktif</p>
                                    <p className="text-sm font-medium text-gray-900">Saldo</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className="text-sm font-medium text-green-700">Siap Menerima Transaksi</p>
                                </div>
                            </div>
                        </div>
                        {/* Tabs Menu */}
                        <div className="flex space-x-2 items-center justify-center">
                            {menuSaldo.map((tab) => {
                                if (tab.access && !hasAccess(tab.access)) return null;
                                const isActive = location.pathname === tab.link;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => navigate(tab.link)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {/* <FaHistory className="inline mr-2" /> */}
                                        <i className={`fas ${tab.icon} mr-3 text-base`} />
                                        {tab.text}
                                    </button>
                                );
                            })}
                        </div>
                    </div>


                    {/* Konten Outlet */}
                </div>
            </div>
            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
};

export default ContainerSaldo;
