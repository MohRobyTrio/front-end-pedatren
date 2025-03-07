const SearchBar = ({ searchTerm, setSearchTerm, totalData, toggleFilters }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <div>
                <span>Total data: {totalData}</span>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    className="border border-gray-300 rounded p-2"
                    placeholder="Cari Peserta Didik..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="p-2 bg-red-500 text-white rounded" onClick={toggleFilters}>
                    <i className="fas fa-broom"></i>
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
