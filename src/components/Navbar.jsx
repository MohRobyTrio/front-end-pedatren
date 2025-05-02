import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/Logout";
import logo from "../assets/logo.png";

const Navbar = ({ toggleSidebar, toggleDropdownProfil, isOpen }) => {
    const navigate = useNavigate();
    const { logout, isLoggingOut, logoutError } = useLogout();
    const userName = localStorage.getItem("name") || sessionStorage.getItem("name");

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login"); // arahkan ke halaman login
        } catch (error) {
            console.error("Logout gagal:", error.message);
        }
    };
    return (
        <nav className="fixed top-0 z-50 w-full bg-gray-800 border-b border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar"
                            aria-controls="logo-sidebar" type="button" onClick={toggleSidebar}
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open sidebar</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" fillRule="evenodd"
                                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                                </path>
                            </svg>
                        </button>
                        <a href="/" className="flex ms-2 md:me-24">
                            <img height="32" width="32" src={logo} className="h-8 me-3" alt="Pedatren Logo" />
                            <span
                                className="self-center text-white text-xl font-semibold sm:text-2xl whitespace-nowrap ">PEDATREN</span>
                        </a>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3 relative">
                            <div className='flex flex-row-reverse'>
                                <button
                                    type="button"
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600 cursor-pointer"
                                    aria-expanded={isOpen}
                                    onClick={toggleDropdownProfil}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img height="40" width="40" className="w-10 h-10 rounded-full"
                                        src="https://storage.googleapis.com/a1aa/image/pAPj3YDQYpFx78uqBMFpD5CY1oR_QcLARFVgoJVLIYE.jpg"
                                        alt="user photo" />
                                </button>
                            </div>

                            {isOpen && (
                                <div
                                    className="absolute right-[-12px] mt-43 z-50 w-48 text-base list-none bg-gray-700 divide-y divide-gray-600 rounded-sm shadow-md"
                                >
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-white" role="none">{userName}</p>
                                        <p className="text-sm font-medium text-gray-300 truncate" role="none">
                                            ( Supervisor )
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                                                role="menuitem"
                                            >
                                                {isLoggingOut ? "Logging out..." : "Sign out"}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;