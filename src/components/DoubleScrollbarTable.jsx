import { useEffect, useLayoutEffect, useRef } from "react";

const DoubleScrollbarTable = ({ children }) => {
    const topScrollRef = useRef(null);
    const bottomScrollRef = useRef(null);

    useEffect(() => {
        const top = topScrollRef.current;
        const bottom = bottomScrollRef.current;

        const syncTop = () => { if (bottom) bottom.scrollLeft = top.scrollLeft; };
        const syncBottom = () => { if (top) top.scrollLeft = bottom.scrollLeft; };

        if (top && bottom) {
            top.addEventListener("scroll", syncTop);
            bottom.addEventListener("scroll", syncBottom);
        }

        return () => {
            if (top) top.removeEventListener("scroll", syncTop);
            if (bottom) bottom.removeEventListener("scroll", syncBottom);
        };
    }, []);

    useLayoutEffect(() => {
        const updateWidth = () => {
            if (topScrollRef.current && bottomScrollRef.current) {
                const bottomTable = bottomScrollRef.current.querySelector("table");
                if (bottomTable) {
                    topScrollRef.current.firstChild.style.width = `${bottomTable.scrollWidth}px`;
                }
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [children]);

    return (
        <div className="w-full">
            <div ref={topScrollRef} className="overflow-x-auto mb-1">
                <div className="h-2 bg-transparent"></div>
            </div>
            <div ref={bottomScrollRef} className="overflow-x-auto">
                {children}
            </div>
        </div>
    );
};

export default DoubleScrollbarTable;
