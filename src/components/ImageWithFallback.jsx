"use client"

import { useState, useEffect } from "react"

const ImageWithFallback = ({
    srcs = [], // array of src
    alt,
    className,
    fallbackIcon: FallbackIcon = null,
    sizeIconFallback = 6,
    ...props
}) => {
    const [currentSrcIndex, setCurrentSrcIndex] = useState(0)
    const [imageState, setImageState] = useState("loading")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const currentSrc = srcs[currentSrcIndex]

    // useEffect(() => {
    //     // Reset when srcs change
    //     setCurrentSrcIndex(0)
    //     setImageState("loading")
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [JSON.stringify(srcs)])

    useEffect(() => {
        // Reset when srcs change
        setCurrentSrcIndex(0)
        setImageState(srcs.length > 0 ? "loading" : "error")
        handleImageLoad()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(srcs)])

    const handleImageLoad = () => {
        console.log(srcs[currentSrcIndex]);
        
        setImageState("success")
    }

    const handleImageError = () => {
        if (currentSrcIndex < srcs.length - 1) {
            // Coba src berikutnya
            setCurrentSrcIndex(currentSrcIndex + 1)
            setImageState("loading")
        } else {
            setImageState("error")
        }
    }

    if (imageState === "error" || !currentSrc) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...props}>
                <FallbackIcon className={`w-${sizeIconFallback} h-${sizeIconFallback} text-gray-400`} />
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            {imageState === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
            )}
            <img
                src={currentSrc}
                alt={alt}
                className={`${className} ${imageState === "loading" ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={() => setIsModalOpen(true)}
                {...props}
            />
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black bg-white rounded"
                            onClick={() => setIsModalOpen(false)}
                        >
                            {/* <X className="w-7 h-7" /> */}
                        </button>
                        <img
                            src={currentSrc}
                            alt={alt}
                            className="rounded max-h-[70vh] w-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageWithFallback
