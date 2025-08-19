import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteTracker = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const prevRoute = sessionStorage.getItem("prevRoute");

    // Hanya update prevRoute kalau route sekarang BUKAN "/formulir/..."
    if (!currentPath.startsWith("/formulir")) {
      sessionStorage.setItem("prevRoute", currentPath);
    }

    console.log("Current:", currentPath);
    console.log("Prev:", prevRoute);
  }, [location]);

  return children;
};

export default RouteTracker;
