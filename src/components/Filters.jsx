const Filters = ({ showFilters, filterOptions, onChange, selectedFilters }) => {
    if (!showFilters) return null;

    return (
        <div className="flex flex-col gap-4 w-full mb-4">
            {Object.entries(filterOptions).map(([label, options], index) => (
                <select 
                    key={`${label}-${index}`} 
                    className={`border border-gray-300 rounded p-2 ${options.length <= 1 ? 'bg-gray-200 text-gray-500' : ''}`} 
                    onChange={(e) => onChange({ [label]: e.target.value })} 
                    value={selectedFilters[label] || ""} // Menggunakan selectedFilters
                    disabled={options.length <= 1}
                >
                    {options.map((option, idx) => (
                        <option key={idx} value={option.value}>{option.label}</option>
                    ))}
                </select>
            ))}
        </div>
    );
};

export default Filters;
