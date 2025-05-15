// Formulir session

// import { Link, Outlet, useLocation } from "react-router-dom";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { tabsFormulir } from "../data/menuData";

// const Formulir = () => {
//   const location = useLocation();
//   // const currentTab = tabsFormulir.find(tab => location.pathname.endsWith(tab.id));

//   return (
//     <div className="flex-1 pl-6 pt-6 pb-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Formulir</h1>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md">

//         <nav aria-label="Breadcrumb">
//           <ol className="flex flex-wrap rounded border border-gray-300 bg-white text-sm text-gray-700">
//             {tabsFormulir.map((tab, index) => {
//               const isActive = location.pathname === tab.link;
//               const bgColor = isActive ? "bg-gray-500 text-white font-semibold" : "bg-white";
//               const chevronColor = isActive ? "bg-gray-500" : "bg-white";

//               return (
//                 <li className="flex" key={tab.id}>
//                   <Link
//                     to={tab.link}
//                     className={`block h-10 pr-4 pl-6 leading-10 transition-colors ${bgColor}`}
//                   >
//                     {tab.label}
//                   </Link>
//                   {index < tabsFormulir.length && (
//                     <div className="relative flex items-center">
//                       <span
//                         className={`absolute inset-y-0 -start-px h-10 w-4 ${chevronColor} [clip-path:_polygon(0_0,_0%_100%,_100%_50%)] rtl:rotate-180`}
//                       ></span>
//                     </div>
//                   )}
//                 </li>
//               );
//             })}
//           </ol>
//         </nav>


//         {/* Keep-alive tab content */}
//         <div className="p-4 relative">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Formulir;

// Formulir route
import { useParams, Outlet, useLocation, Link } from "react-router-dom";
import { tabsFormulir } from "../data/menuData";

const Formulir = () => {
  const { biodata_id } = useParams();
  const location = useLocation();

  return (
    <div className="flex-1 pl-6 pt-6 pb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Formulir ID: {biodata_id}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap rounded border border-gray-300 bg-white text-sm text-gray-700">
            {tabsFormulir.map((tab, index) => {
              const fullPath = `/formulir/${biodata_id}/${tab.link}`;
              const isActive = location.pathname === fullPath;
              const bgColor = isActive ? "bg-gray-500 text-white font-semibold" : "bg-white";
              const chevronColor = isActive ? "bg-gray-500" : "bg-white";

              return (
                <li className="flex" key={tab.id}>
                  <Link
                    to={fullPath}
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

        <div className="p-4 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Formulir;
