import { Link, useLocation } from "react-router-dom";
import {
    menuAkademikItems,
    menuDataPokokItems,
    menuItems,
    // menuKelembagaanItems,
    menuKepegawaianItems,
    menuKepesantrenanItems,
    menuKewaliasuhanItems,
    menuKewilayahanItems,
    menuMahromItems,
    subPesertaDidik
} from "../data/menuData";
import Access from "./Access";
import { hasAccess } from "../utils/hasAccess";

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
    // dropdownDataKelembagaan,
    // setDropdownDataKelembagaan,
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
            <li className="mb-0.5 ml-2">
                <Link
                    to={link}
                    className={`flex items-center px-3 py-2 rounded-md text-sm transition
                        ${isActive
                            ? "bg-blue-100 text-blue-700 font-semibold shadow"
                            : "text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-600"
                        }`}
                    onClick={onClick}
                >
                    <i className={`fas ${icon} mr-3 text-base`} />
                    {text}
                </Link>
            </li>
        );
    };

    const DropdownMenu = ({ items }) => (
        <ul className="mt-1 ml-2">
            {items.map((item) => {
                const isActive = location.pathname === item.link || location.pathname.startsWith(item.link + "/");
                if (item.access && !hasAccess(item.access)) {
                    return null; // Jangan tampilkan jika tidak ada akses
                }
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

    const SubMenuDropdownPesertaDidik = () => (
        <ul className="ml-7 mt-1">
            {subPesertaDidik.map((subItem) => {
                const isActive = location.pathname === subItem.link;
                return (
                    <li key={subItem.id} className="mb-0.5">
                        <Link
                            to={subItem.link}
                            className={`flex items-center px-3 py-1.5 rounded-md text-xs transition
                            ${isActive
                                    ? "bg-red-50 text-red-500 font-semibold"
                                    : "text-red-400 font-medium hover:bg-red-100 hover:text-red-500"
                                }`}
                        >
                            <i className="fas fa-chevron-right mr-2 text-xs text-red-300"></i>
                            {subItem.text}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );



    const MenuHeader = ({ name, isOpen, onClick }) => (
        <h2
            className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer transition"
            onClick={onClick}
        >
            {name}
            <i className={`fas fa-chevron-${isOpen ? "up" : "down"} ml-2`} />
        </h2>
    );

    return (
        <aside
            id="logo-sidebar"
            className={`
                fixed top-0 left-0 z-40 w-56 h-screen pt-[56px]
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-xl
                sm:translate-x-0
            `}
            aria-label="Sidebar"
        >
            <div className="w-56 h-full flex flex-col text-sm">
                <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                    <nav className="mt-2 px-2">
                        <ul>
                            {menuItems.map((item) => {
                                const isActive =
                                    location.pathname === item.link || location.pathname.startsWith(item.link + "/");
                                return (
                                    <li key={item.id} className="mb-0.5">
                                        <Link
                                            to={item.link}
                                            className={`flex items-center px-3 py-2 rounded-md transition
                                                ${isActive
                                                    ? "bg-blue-100 text-blue-700 font-semibold shadow"
                                                    : "text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-600"
                                                }`}
                                        >
                                            <i className={`${item.icon} mr-3 text-base`}></i>
                                            {item.text}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="mt-3 px-2">
                        <MenuHeader
                            name="Data Pokok"
                            isOpen={dropdownDataPokok}
                            onClick={() => toggleDropdown(setDropdownDataPokok)}
                        />
                        {dropdownDataPokok && <DropdownMenu items={menuDataPokokItems} />}
                    </div>

                    <div className="mt-3 px-2">
                        <MenuHeader
                            name="Kewaliasuhan"
                            isOpen={dropdownDataKewaliasuhan}
                            onClick={() => toggleDropdown(setDropdownKewaliasuhan)}
                        />
                        {dropdownDataKewaliasuhan && <DropdownMenu items={menuKewaliasuhanItems} />}
                    </div>

                    <div className="mt-3 px-2">
                        <MenuHeader
                            name="Kepesantrenan"
                            isOpen={dropdownDataKepesantrenan}
                            onClick={() => toggleDropdown(setDropdownKepesantrenan)}
                        />
                        {dropdownDataKepesantrenan && <DropdownMenu items={menuKepesantrenanItems} />}
                    </div>

                    <div className="mt-3 px-2">
                        <MenuHeader
                            name="Kepegawaian"
                            isOpen={dropdownDataKepegawaian}
                            onClick={() => toggleDropdown(setDropdownKepegawaian)}
                        />
                        {dropdownDataKepegawaian && <DropdownMenu items={menuKepegawaianItems} />}
                    </div>

                    <div className="mt-3 px-2">
                        <MenuHeader
                            name="Mahrom"
                            isOpen={dropdownDataMahrom}
                            onClick={() => toggleDropdown(setDropdownMahrom)}
                        />
                        {dropdownDataMahrom && <DropdownMenu items={menuMahromItems} />}
                    </div>

                    <Access action="kewilayahan">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Kewilayahan"
                                isOpen={dropdownDataKewilayahan}
                                onClick={() => toggleDropdown(setDropdownDataKewilayahan)}
                            />
                            {dropdownDataKewilayahan && <DropdownMenu items={menuKewilayahanItems} />}
                        </div>
                    </Access>

                    {/* <Access action="kelembagaan">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Kelembagaan"
                                isOpen={dropdownDataKelembagaan}
                                onClick={() => toggleDropdown(setDropdownDataKelembagaan)}
                            />
                            {dropdownDataKelembagaan && <DropdownMenu items={menuKelembagaanItems} />}
                        </div>
                    </Access> */}

                    <Access action="akademik">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Akademik"
                                isOpen={dropdownDataAkademik}
                                onClick={() => toggleDropdown(setDropdownDataAkademik)}
                            />
                            {dropdownDataAkademik && <DropdownMenu items={menuAkademikItems} />}
                        </div>
                    </Access>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
