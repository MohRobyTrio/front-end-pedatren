const SearchBar = ({ searchTerm, setSearchTerm, totalData, toggleFilters, totalFiltered, viewMode, onToggleView }) => {
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
                <div className="flex border rounded-sm overflow-hidden">
                    <button 
                        className={`p-3 flex items-center justify-center cursor-pointer ${
                            viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                        }`}
                        onClick={() => onToggleView('list')}
                    >
                        <i className="fas fa-list text-lg"></i>
                    </button>

                    <button 
                        className={`p-3 flex items-center justify-center cursor-pointer ${
                            viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                        }`}
                        onClick={() => onToggleView('table')}
                    >
                        <i className="fas fa-table text-lg"></i>
                    </button>
                </div>
                <button className="p-3 bg-green-500 text-white rounded flex items-center justify-center cursor-pointer" onClick={toggleFilters}>
                    <i className="fas fa-filter text-lg"></i>
                </button>

            </div>
        </div>
    );
};

export default SearchBar;
