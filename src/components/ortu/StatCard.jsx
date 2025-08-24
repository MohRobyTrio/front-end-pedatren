"use client"

import LoadingSpinner from "./LoadingSpinner"


const StatCard = ({
    title,
    value,
    icon,
    trend,
    trendValue,
    color = "blue",
    loading = false,
    onClick,
    className = "",
}) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        green: "bg-green-50 text-green-600 border-green-200",
        red: "bg-red-50 text-red-600 border-red-200",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
        purple: "bg-purple-50 text-purple-600 border-purple-200",
    }

    const trendClasses = {
        up: "text-green-600",
        down: "text-red-600",
        neutral: "text-gray-500",
    }

    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 p-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
                } ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    {loading ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    )}
                    {trend && trendValue && (
                        <div className={`flex items-center gap-1 mt-1 text-xs ${trendClasses[trend]}`}>
                            <i
                                className={`fas ${trend === "up" ? "fa-arrow-up" : trend === "down" ? "fa-arrow-down" : "fa-minus"}`}
                            ></i>
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
                    <i className={`fas ${icon} text-xl`}></i>
                </div>
            </div>
        </div>
    )
}

export default StatCard
