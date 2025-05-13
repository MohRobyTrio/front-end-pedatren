import { Link, Outlet, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { tabsFormulir } from "../data/menuData";

const Formulir = () => {
  const location = useLocation();
  // const currentTab = tabsFormulir.find(tab => location.pathname.endsWith(tab.id));

  return (
    <div className="flex-1 pl-6 pt-6 pb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Formulir</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Tabs */}
        {/* <div className="flex flex-wrap gap-y-2 mb-4">
          {tabsFormulir.map((tab, index) => {
            const isActive = location.pathname === tab.link;
            const isFirst = index === 0;
            return (
              <Link
                key={tab.id}
                to={tab.link}
                className={`relative px-6 py-2 text-sm whitespace-nowrap font-medium transition-colors duration-200
                ${isActive ? "bg-gray-400 text-white" : "bg-gray-200 text-gray-700"}
                outline outline-2 outline-gray-600 outline-offset-[-2px]`}
                style={{
                  clipPath: isFirst
                    ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                    : "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0% 100%, 10% 50%)",
                  marginLeft: isFirst ? "0" : "-20px",
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div> */}

        {/* <div className="flex flex-wrap items-center mb-4">
          {tabsFormulir.map((tab, index) => (
            <span key={tab.id}>
              <Link to={tab.link}
                className={`cursor-pointer ${location.pathname === tab.link ? "text-blue-500 font-bold" : "text-gray-500"
                  }`}
              >
                {tab.label}
              </Link>
              {index < tabsFormulir.length - 1 && <i className="fas fa-chevron-right mx-2 text-gray-400"></i>}
            </span>
          ))}
        </div> */}

        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap rounded border border-gray-300 bg-white text-sm text-gray-700">
            {tabsFormulir.map((tab, index) => {
              const isActive = location.pathname === tab.link;
              const bgColor = isActive ? "bg-gray-500 text-white font-semibold" : "bg-white";
              const chevronColor = isActive ? "bg-gray-500" : "bg-white";

              return (
                <li className="flex" key={tab.id}>
                  <Link
                    to={tab.link}
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


        {/* Keep-alive tab content */}
        <div className="p-4 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Formulir;
