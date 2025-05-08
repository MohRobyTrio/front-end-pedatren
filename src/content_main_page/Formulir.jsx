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
        <div className="flex flex-wrap gap-y-2 mb-4">
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
        </div>

        {/* Keep-alive tab content */}
        <div className="p-4 relative">
          <Outlet/>
          {/* {tabsFormulir.map(tab => (
            <div
              key={tab.id}
              style={{ display: location.pathname.endsWith(tab.id) ? "block" : "none" }}
            >
              {tab.component}
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Formulir;
