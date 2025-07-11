import { useEffect, useState } from "react";

const SearchBar = ({ 
    searchTerm, 
    setSearchTerm, 
    totalData, 
    toggleFilters, 
    // totalFiltered, 
    toggleView, 
    limit, 
    toggleLimit,
    showViewButtons = true, // Prop baru dengan default true
    showFilterButtons = true,
    showSearch = true
}) => {
    const [viewMode, setViewMode] = useState("table");

    useEffect(() => {
        const savedViewMode = sessionStorage.getItem("viewMode");
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
    }, []);

    const handleViewChange = (mode) => {
        setViewMode(mode);
        sessionStorage.setItem("viewMode", mode);
        toggleView(mode);
    };

    return (
        <div className="flex flex-col md:flex-row-reverse justify-between md:items-center items-left mb-4 w-95 md:w-auto space-y-2">
            <div className="flex items-center space-x-2">
                {showSearch && (
                    <input
                        className="border border-gray-300 rounded p-2 w-40"
                        placeholder="Cari Nama ..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}
                
                {showViewButtons && (
                    <div className="flex border rounded-sm overflow-hidden">
                        <button aria-label="list"
                            className={`p-3 flex items-center justify-center cursor-pointer ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                                }`}
                            onClick={() => handleViewChange("list")}
                        >
                            <i className="fas fa-list text-lg"></i>
                        </button>

                        <button aria-label="table"
                            className={`p-3 flex items-center justify-center cursor-pointer ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                                }`}
                            onClick={() => handleViewChange("table")}
                        >
                            <i className="fas fa-table text-lg"></i>
                        </button>
                    </div>
                )}
                
                {showFilterButtons && (
                    <button aria-label="filter" className="p-3 bg-green-500 text-white rounded flex items-center justify-center cursor-pointer" onClick={toggleFilters}>
                        <i className="fas fa-filter text-lg"></i>
                    </button>
                )}
            </div>

            <div>
                <select aria-label="limit" className="border border-gray-300 rounded p-2 mr-4" value={limit} onChange={toggleLimit}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <span>Total Data: {totalData || 0}</span>
            </div>
        </div>
    );
};

export default SearchBar;