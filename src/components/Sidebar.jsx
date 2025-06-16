import { Link, useLocation } from "react-router-dom";
import {
    menuAkademikItems,
    menuDataPokokItems,
    menuItems,
    menuKelembagaanItems,
    menuKepegawaianItems,
    menuKepesantrenanItems,
    menuKewaliasuhanItems,
    menuKewilayahanItems,
    menuMahromItems,
    subPesertaDidik
} from "../data/menuData";
import Access from "./Access";

const Sidebar = ({
    submenuPesertaDidik,
    setSubmenuPesertaDidik,
    dropdownDataPokok,
    setDropdownDataPokok,
    dropdownDataKewaliasuhan,
    setDropdownKewaliasuhan,
    dropdownDataKepegawaian,
    setDropdownKepegawaian,
    dropdownDataKepesantrenan,
    setDropdownKepesantrenan,
    dropdownDataMahrom,
    setDropdownMahrom,
    dropdownDataKelembagaan,
    setDropdownDataKelembagaan,
    dropdownDataAkademik,
    setDropdownDataAkademik,
    dropdownDataKewilayahan,
    setDropdownDataKewilayahan,
    isSidebarOpen,
    toggleDropdown
}) => {
    const location = useLocation();

    const MenuItem = ({ icon, text, link, onClick }) => {
        const isActive = location.pathname === link || location.pathname.startsWith(link + "/");

        return (
            <li className="mb-1 ml-2">
                <Link
                    to={link}
                    className={`flex items-center px-2.5 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                        isActive
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "text-gray-700 font-medium hover:bg-gray-100"
                    }`}
                    onClick={onClick}
                >
                    <i className={`fas ${icon} mr-2 text-sm`}></i>
                    {text}
                </Link>
            </li>
        );
    };

    const DropdownMenu = ({ items }) => {
        return (
            <ul className="mt-2 ml-2">
                {items.map((item) => {
                    const isActive = location.pathname === item.link || location.pathname.startsWith(item.link + "/");

                    return (
                        <div key={item.id}>
                            <MenuItem
                                icon={item.icon}
                                text={item.text}
                                link={item.link || `/${item.id}`}
                                isActive={isActive}
                                onClick={() => {
                                    if (item.id === "pesertadidik") {
                                        setSubmenuPesertaDidik(!submenuPesertaDidik);
                                    }
                                }}
                            />
                            {item.id === "pesertadidik" && submenuPesertaDidik && <SubMenuDropdownPesertaDidik />}
                        </div>
                    );
                })}
            </ul>
        );
    };

  const SubMenuDropdownPesertaDidik = () => {
    return (
        <ul className="ml-6 mt-2">
            {subPesertaDidik.map((subItem) => {
                const isActive = location.pathname === subItem.link;

                return (
                    <li key={subItem.id} className="mb-1">
                        <Link
                            to={subItem.link}
                            className={`flex items-center px-3 py-1.5 rounded-md text-xs transition-colors duration-200 ${
                                isActive
                                    ? "text-cyan-600 font-semibold bg-cyan-50"
                                    : "text-red-400 font-medium hover:bg-red-50"
                            }`}
                        >
                            <i className="fas fa-chevron-right mr-2 text-xs text-gray-400"></i>
                            {subItem.text}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};


    const MenuHeader = ({ name, isOpen, onClick }) => (
        <h2
            className="text-gray-600 text-xs font-semibold uppercase tracking-wider flex items-center justify-between px-2.5 py-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
            onClick={onClick}
        >
            {name}
            <i className={`fas fa-chevron-${isOpen ? "up" : "down"} ml-2`}></i>
        </h2>
    );

    return (
        <aside
            id="logo-sidebar"
            className={`fixed top-0 left-0 z-40 w-56 h-screen pt-16 transition-transform duration-300 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 shadow-lg`}
            aria-label="Sidebar"
        >
            <div className="w-56 bg-white h-full flex flex-col text-sm">
                <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                    <nav className="mt-4 px-3">
                        <ul>
                            {menuItems.map((item) => {
                                const isActive =
                                    location.pathname === item.link || location.pathname.startsWith(item.link + "/");

                                return (
                                    <li key={item.id} className="mb-1">
                                        <Link
                                            to={item.link}
                                            className={`flex items-center px-2.5 py-1.5 rounded-md transition-colors duration-200 ${
                                                isActive
                                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                                    : "text-gray-700 font-medium hover:bg-gray-100"
                                            }`}
                                        >
                                            <i className={`${item.icon} mr-2 text-sm`}></i>
                                            {item.text}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="mt-4 px-3">
                        <MenuHeader
                            name="Data Pokok"
                            isOpen={dropdownDataPokok}
                            onClick={() => toggleDropdown(setDropdownDataPokok)}
                        />
                        {dropdownDataPokok && <DropdownMenu items={menuDataPokokItems} />}
                    </div>

                    <div className="mt-4 px-3">
                        <MenuHeader
                            name="Kewaliasuhan"
                            isOpen={dropdownDataKewaliasuhan}
                            onClick={() => toggleDropdown(setDropdownKewaliasuhan)}
                        />
                        {dropdownDataKewaliasuhan && <DropdownMenu items={menuKewaliasuhanItems} />}
                    </div>

                    <div className="mt-4 px-3">
                        <MenuHeader
                            name="Kepesantrenan"
                            isOpen={dropdownDataKepesantrenan}
                            onClick={() => toggleDropdown(setDropdownKepesantrenan)}
                        />
                        {dropdownDataKepesantrenan && <DropdownMenu items={menuKepesantrenanItems} />}
                    </div>

                    <div className="mt-4 px-3">
                        <MenuHeader
                            name="Kepegawaian"
                            isOpen={dropdownDataKepegawaian}
                            onClick={() => toggleDropdown(setDropdownKepegawaian)}
                        />
                        {dropdownDataKepegawaian && <DropdownMenu items={menuKepegawaianItems} />}
                    </div>

                    <div className="mt-4 px-3">
                        <MenuHeader
                            name="Mahrom"
                            isOpen={dropdownDataMahrom}
                            onClick={() => toggleDropdown(setDropdownMahrom)}
                        />
                        {dropdownDataMahrom && <DropdownMenu items={menuMahromItems} />}
                    </div>

                    <Access action="akademik">
                        <div className="mt-4 px-3">
                            <MenuHeader
                                name="Akademik"
                                isOpen={dropdownDataAkademik}
                                onClick={() => toggleDropdown(setDropdownDataAkademik)}
                            />
                            {dropdownDataAkademik && <DropdownMenu items={menuAkademikItems} />}
                        </div>
                    </Access>
                    
                    <Access action="kelembagaan">
                        <div className="mt-4 px-3">
                            <MenuHeader
                                name="Kelembagaan"
                                isOpen={dropdownDataKelembagaan}
                                onClick={() => toggleDropdown(setDropdownDataKelembagaan)}
                            />
                            {dropdownDataKelembagaan && <DropdownMenu items={menuKelembagaanItems} />}
                        </div>
                    </Access>

                    <Access action="kewilayahan">
                        <div className="mt-4 px-3">
                            <MenuHeader
                                name="kewilayahan"
                                isOpen={dropdownDataKewilayahan}
                                onClick={() => toggleDropdown(setDropdownDataKewilayahan)}
                            />
                            {dropdownDataKewilayahan && <DropdownMenu items={menuKewilayahanItems} />}
                        </div>
                    </Access>

                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
