import { NavLink } from "react-router-dom"

const MobileNav = () => {
    const navItems = [
        { path: "/ortu", icon: "fa-home", label: "Home" },
        { path: "/hafalan", icon: "fa-book-quran", label: "Hafalan" },
        { path: "/perizinan", icon: "fa-file-alt", label: "Izin" },
        { path: "/keuangan", icon: "fa-wallet", label: "Keuangan" },
        { path: "/profil", icon: "fa-user", label: "Profil" },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="flex items-center justify-around">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                            }`
                        }
                    >
                        <i className={`fas ${item.icon} text-lg`}></i>
                        <span className="text-xs font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default MobileNav
