import { Link, useLocation } from "react-router-dom";
import { menuDataPokokItems, menuItems, menuKepegawaianItems, menuKepesantrenanItems, menuKewaliasuhanItems, menuMahromItems, 
    // menuRWSItems, 
    subPesertaDidik } from "../data/menuData";

const Sidebar = ({ submenuPesertaDidik, setSubmenuPesertaDidik, dropdownDataPokok, setDropdownDataPokok, dropdownDataKewaliasuhan, setDropdownKewaliasuhan, dropdownDataKepegawaian, setDropdownKepegawaian, dropdownDataKepesantrenan, setDropdownKepesantrenan, dropdownDataMahrom, setDropdownMahrom, 
    // dropdownDataRWS, setDropdownRWS, 
    isSidebarOpen, toggleDropdown }) => {

    const NavigationMenu = () => {
        const location = useLocation();
    
        return (
            <nav className="mt-4 px-4">
                <ul>
                    {menuItems.map((item) => {
                        // const isActive = location.pathname.startsWith(item.link);
                        const isActive = location.pathname === item.link || location.pathname.startsWith(item.link + "/");
    
                        return (
                            <li key={item.id} className="mb-2">
                                <Link
                                    to={item.link}
                                    className={`flex items-center cursor-pointer ${
                                        isActive ? "text-blue-700 font-bold" : "text-gray-700"
                                    }`}
                                >
                                    <i className={`${item.icon} mr-2`}></i>
                                    {item.text}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    };

    const MenuItem = ({ icon, text, link, onClick }) => {
        const location = useLocation();
        // const isActive = location.pathname.startsWith(link);
        const isActive = location.pathname === link || location.pathname.startsWith(link + "/");

    
        return (
            <li className="mb-2 ml-2">
                <Link
                    to={link}
                    className={`flex items-center cursor-pointer ${
                        isActive ? "text-blue-700 font-bold" : "text-gray-700"
                    }`}
                    onClick={onClick}
                >
                    <i className={`fas ${icon} mr-4`}></i>
                    {text}
                </Link>
            </li>
        );
    };

    const DropdownMenu = ({ items }) => {
        const location = useLocation();
    
        return (
            <ul className="mt-2">
                {items.map((item) => {
                    // const isActive = location.pathname.startsWith(item.link);
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
        const location = useLocation();
    
        return (
            <ul className="ml-6 mt-2">
                {subPesertaDidik.map((subItem) => {
                    const isActive = location.pathname === subItem.link;
                    
                    return (
                        <li key={subItem.id} className="mb-2">
                            <Link 
                                to={subItem.link} 
                                className={`flex items-center cursor-pointer ${
                                    isActive ? "text-cyan-500 font-bold" : "text-gray-700"
                                }`}
                            >
                                <i className="fas fa-chevron-right mr-2"></i>
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
            className="text-gray-600 text-sm flex items-center justify-between cursor-pointer"
            onClick={onClick}
        >
            {name}
            <i className={`fas fa-chevron-${isOpen ? "up" : "down"} ml-2`}></i>
        </h2>
    );

    return (
        <aside id="logo-sidebar"
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
            aria-label="Sidebar">
            <div className="w-64 bg-white h-full shadow-md flex flex-col">
                <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                    <NavigationMenu />
                    <div className="mt-6 px-4">
                        <MenuHeader
                            name="DATA POKOK"
                            isOpen={dropdownDataPokok}
                            onClick={() => toggleDropdown(setDropdownDataPokok)}
                        />
                        {dropdownDataPokok && (
                            <DropdownMenu items={menuDataPokokItems} />
                        )}
                    </div>
                    <div className="mt-6 px-4">
                        <MenuHeader name="KEWALIASUHAN" isOpen={dropdownDataKewaliasuhan} onClick={() => toggleDropdown(setDropdownKewaliasuhan)} />
                        {dropdownDataKewaliasuhan && (
                            <DropdownMenu items={menuKewaliasuhanItems} />
                        )}
                    </div>
                    <div className="mt-6 px-4">
                        <MenuHeader name="KEPESANTRENAN" isOpen={dropdownDataKepesantrenan} onClick={() => toggleDropdown(setDropdownKepesantrenan)} />
                        {dropdownDataKepesantrenan && (
                            <ul className="mt-2">
                                <DropdownMenu items={menuKepesantrenanItems} />
                            </ul>
                        )}
                    </div>
                    <div className="mt-6 px-4">
                        <MenuHeader name="KEPEGAWAIAN" isOpen={dropdownDataKepegawaian} onClick={() => toggleDropdown(setDropdownKepegawaian)} />
                        {dropdownDataKepegawaian && (
                            <ul className="mt-2">
                                <DropdownMenu items={menuKepegawaianItems} />
                            </ul>
                        )}
                    </div>
                    <div className="mt-6 px-4">
                        <MenuHeader name="MAHROM" isOpen={dropdownDataMahrom} onClick={() => toggleDropdown(setDropdownMahrom)} />
                        {dropdownDataMahrom && (
                            <ul className="mt-2">
                                <DropdownMenu items={menuMahromItems} />
                            </ul>
                        )}
                    </div>
                    {/* <div className="mt-6 px-4">
                        <MenuHeader name="RAPAT WALI SANTRI" isOpen={dropdownDataRWS} onClick={() => toggleDropdown(setDropdownRWS)} />
                        {dropdownDataRWS && (
                            <ul className="mt-2">
                                <DropdownMenu items={menuRWSItems} />
                            </ul>
                        )}
                    </div> */}
                </div>
            </div>
        </aside>
    )
};

export default Sidebar;