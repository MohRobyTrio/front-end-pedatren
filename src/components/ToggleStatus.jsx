const ToggleStatus = ({ label, active, onClick, showLabel = false }) => {
    return (
        <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            <div
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    active ? "bg-blue-600" : "bg-gray-300"
                }`}
            >
                <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        active ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </div>
            {showLabel && (
                <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

export default ToggleStatus;
