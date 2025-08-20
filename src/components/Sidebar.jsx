import { Link, useLocation } from "react-router-dom";
import {
    menuAkademikItems,
    menuAlumni,
    menuBelanja,
    menuDataPokokItems,
    menuHafalan,
    menuItems,
    menuKepegawaianItems,
    menuKepesantrenanItems,
    menuKewaliasuhanItems,
    menuKewilayahanItems,
    // menuMahromItems,
    menuManageItems,
    menuSholat,
    menuTransaksiItems,
    subKelembagaanItems,
    subPelajaranItems,
    // subPesertaDidik
} from "../data/menuData";
import Access from "./Access";
import { hasAccess } from "../utils/hasAccess";
import { getRolesString } from "../utils/getRolesString";


const Sidebar = ({ dropdowns, toggleDropdown, isSidebarOpen }) => {
    const location = useLocation();
    // Ambil roles dari session/local storage atau context
    const roles = String(getRolesString())
        .split(",")
        .map(role => role.trim().toLowerCase());

    // Filter khusus untuk waliasuh
    let filteredKewaliasuhanItems = menuKewaliasuhanItems;
    if (roles.includes("waliasuh")) {
        filteredKewaliasuhanItems = menuKewaliasuhanItems.filter(item =>
            ["catatanafektif", "catatankognitif"].includes(item.id)
        );
    }

    const MenuItem = ({ icon, text, link, onClick, hasSubmenu, isOpen }) => {
        const isActive = location.pathname === link || location.pathname.startsWith(link + "/");


        return (
            <li className="mb-0.5 ml-2">
                <Link
                    to={link}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition
                    ${isActive
                            ? "bg-blue-100 text-blue-700 font-semibold shadow"
                            : "text-gray-700 font-medium hover:bg-gray-100 hover:text-blue-600"
                        }`}
                    onClick={onClick}
                >
                    <div className="flex items-center">
                        <i className={`fas ${icon} mr-3 text-base`} />
                        {text}
                    </div>

                    {hasSubmenu && text !== "Peserta Didik" && (
                        <i
                            className={`fas fa-chevron-${isOpen ? "down" : "right"} text-xs text-gray-500 ml-2`}
                        />
                    )}
                </Link>
            </li>
        );
    };


    const submenuMap = {
        // pesertadidik: subPesertaDidik,
        kelembagaan: subKelembagaanItems,
        kewilayahan: menuKewilayahanItems,
        pelajaran: subPelajaranItems,
        alumni: menuAlumni,
        csholat: menuSholat,
        hafalan: menuHafalan,
        transaksi: menuBelanja,
    };

    const DropdownMenu = ({ items }) => (
        <ul className="mt-1 ml-2">
            {items.map((item) => {
                const isValidOutlet = (value) => value && value !== "null" && value !== "undefined";

                const outletSession = sessionStorage.getItem("outlet");
                const outletLocal = localStorage.getItem("outlet");
                if (
                    item.id === "belanja" && !isValidOutlet(outletSession) && !isValidOutlet(outletLocal)
                ) {
                    return null; // Jangan tampilkan menu belanja
                }
                // const isPeserta = item.id == "pesertadidik";
                const hasSubmenu =
                    item.id == "pesertadidik" ||
                    item.id == "kelembagaan" ||
                    item.id == "pelajaran" ||
                    item.id == "kewilayahan" ||
                    item.id == "alumni" ||
                    item.id == "csholat" ||
                    item.id == "hafalan";
                // const isOpen = isPeserta ? true : dropdowns[item.id];
                // const isOpen = dropdowns[item.id];

                const stored = sessionStorage.getItem(`submenu-${item.id}`);
                const isOpen =
                    dropdowns[item.id] ??
                    (stored ? JSON.parse(stored) : false);

                if (item.access && !hasAccess(item.access)) return null;

                return (
                    <div key={item.id}>
                        <MenuItem
                            icon={item.icon}
                            text={item.text}
                            link={item.link || `/${item.id}`}
                            onClick={(e) => {
                                // if (hasSubmenu && !isPeserta) {
                                if (hasSubmenu) {
                                    e.preventDefault(); // Cegah navigasi untuk dropdown lain selain peserta didik
                                    const newState = !isOpen;
                                    sessionStorage.setItem(
                                        `submenu-${item.id}`,
                                        JSON.stringify(newState)
                                    );
                                }
                                if (hasSubmenu) {
                                    toggleDropdown(item.id);
                                }
                            }}
                            hasSubmenu={hasSubmenu}
                            isOpen={isOpen}
                        />
                        {hasSubmenu && isOpen && <SubMenuDropdown subData={submenuMap[item.id]} parentId={item.id} />}
                    </div>
                );
            })}
        </ul>
    );

    const SubMenuDropdown = ({ subData, parentId }) => {
        if (!Array.isArray(subData)) return null;

        return (
            <ul className="ml-7 mt-1">
                {subData.map((subItem) => {
                    if (subItem.access && !hasAccess(subItem.access)) return null;
                    const isActive = location.pathname === subItem.link;

                    // Gunakan warna merah untuk peserta didik, biru untuk lainnya
                    const activeBg = parentId === "pesertadidik" ? "bg-red-50" : "bg-blue-100";
                    const activeText = parentId === "pesertadidik" ? "text-red-500" : "text-blue-700";
                    const activeChevron = parentId === "pesertadidik" ? "text-red-300" : "text-blue-300";
                    const hoverText = parentId === "pesertadidik" ? "hover:text-red-500" : "hover:text-blue-600";
                    const hoverBg = parentId === "pesertadidik" ? "hover:bg-red-100" : "hover:bg-blue-50";
                    const defaultText = parentId === "pesertadidik" ? "text-red-400" : "text-gray-700";

                    return (
                        <li key={subItem.id} className="mb-0.5">
                            <Link
                                to={subItem.link}
                                className={`flex items-center px-3 py-1.5 rounded-md text-xs transition
                            ${isActive
                                        ? `${activeBg} ${activeText} font-semibold`
                                        : `${defaultText} font-medium ${hoverBg} ${hoverText}`
                                    }`}
                            >
                                <i className={`fas fa-chevron-right mr-2 text-xs ${activeChevron}`} />
                                {subItem.text}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        )
    };


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
                                if (item.access && !hasAccess(item.access)) return null;
                                const isActive = location.pathname === item.link || location.pathname.startsWith(item.link + "/");
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

                    <Access action="kesantrian">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Kesantrian"
                                isOpen={dropdowns.dataPokok}
                                onClick={() => toggleDropdown("dataPokok")}
                            />
                            {dropdowns.dataPokok && <DropdownMenu items={menuDataPokokItems} />}
                        </div>
                    </Access>

                    <Access action="kewaliasuhan">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Kewaliasuhan"
                                isOpen={dropdowns.kewaliasuhan}
                                onClick={() => toggleDropdown("kewaliasuhan")}
                            />
                            {dropdowns.kewaliasuhan && <DropdownMenu items={filteredKewaliasuhanItems} />}
                        </div>
                    </Access>

                    <Access action="kepesantrenan">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Kepesantrenan"
                                isOpen={dropdowns.kepesantrenan}
                                onClick={() => toggleDropdown("kepesantrenan")}
                            />
                            {dropdowns.kepesantrenan && <DropdownMenu items={menuKepesantrenanItems} />}
                        </div>
                    </Access>

                    <Access action="kepegawaian">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Kepegawaian"
                                isOpen={dropdowns.kepegawaian}
                                onClick={() => toggleDropdown("kepegawaian")}
                            />
                            {dropdowns.kepegawaian && <DropdownMenu items={menuKepegawaianItems} />}
                        </div>
                    </Access>

                    {/* <div className="mt-3 px-2">
                        <MenuHeader
                            name="Kepengasuhan"
                            isOpen={dropdowns.mahrom}
                            onClick={() => toggleDropdown("mahrom")}
                        />
                        {dropdowns.mahrom && <DropdownMenu items={menuMahromItems} />}
                    </div> */}

                    {/* <Access action="kewilayahan">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Kewilayahan"
                                isOpen={dropdowns.kewilayahan}
                                onClick={() => toggleDropdown("kewilayahan")}
                            />
                            {dropdowns.kewilayahan && <DropdownMenu items={menuKewilayahanItems} />}
                        </div>
                    </Access> */}

                    <Access action="transaksi">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Transaksi"
                                isOpen={dropdowns.transaksi}
                                onClick={() => toggleDropdown("transaksi")}
                            />
                            {dropdowns.transaksi && <DropdownMenu items={menuTransaksiItems} />}
                        </div>
                    </Access>

                    <Access action="akademik">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Akademik"
                                isOpen={dropdowns.akademik}
                                onClick={() => toggleDropdown("akademik")}
                            />
                            {dropdowns.akademik && <DropdownMenu items={menuAkademikItems} />}
                        </div>
                    </Access>

                    <Access action="manage">
                        <div className="mt-3 px-2">
                            <MenuHeader
                                name="Manage"
                                isOpen={dropdowns.manage}
                                onClick={() => toggleDropdown("manage")}
                            />
                            {dropdowns.manage && <DropdownMenu items={menuManageItems} />}
                        </div>
                    </Access>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
