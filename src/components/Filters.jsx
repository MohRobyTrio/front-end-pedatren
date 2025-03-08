const Filters = ({ showFilters, filterOptions }) => {
    if (!showFilters) return null;
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full mb-4">
            {Object.entries(filterOptions).map(([label, options], index) => (
                <select key={`${label}-${index}`} className="border border-gray-300 rounded p-2">
                    {options.map((option, idx) => (
                        <option key={idx}>{option}</option>
                    ))}
                </select>
            ))}
        </div>
    );
};

export default Filters;
