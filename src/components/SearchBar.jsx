const SearchBar = ({ searchTerm, setSearchTerm, totalData, toggleFilters, totalFiltered }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <div>
                <select className="border border-gray-300 rounded p-2 mr-4">
                    <option>25</option>
                </select>
                <span>Total Data: {totalData || 0} | Ditemukan: {totalFiltered || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    className="border border-gray-300 rounded p-2"
                    placeholder="Cari Peserta Didik..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="p-2 px-3 bg-green-500 text-white rounded" onClick={toggleFilters}>
                    <i className="fas fa-filter"></i>
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
