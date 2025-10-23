import { useLocation, useNavigate, Outlet, Navigate } from "react-router-dom";
import { subMenuUsers } from "../../data/menuData";
import { hasAccess } from "../../utils/hasAccess";

const ContainerUsers = () => {
    const location = useLocation();
    const navigate = useNavigate();

    if (!hasAccess("c_users")) {
        return <Navigate to="/forbidden" replace />;
    }

    return (
        <div className="flex-1 p-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-10">
                <div className="bg-white mb-4">
                    <nav className="border-b border-gray-200">
                        <ul className="flex flex-wrap -mb-px">
                            {subMenuUsers.map((tab) => {
                                if (tab.access && !hasAccess(tab.access)) return null;
                                const isActive = location.pathname === tab.link;
                                return (
                                    <li key={tab.id} className="mr-2">
                                        <button
                                            onClick={() => navigate(tab.link)}
                                            className={`inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                                                isActive
                                                    ? "text-blue-600 border-blue-600 bg-blue-50"
                                                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {tab.text}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ContainerUsers;
