import { createContext, useContext } from "react";

export const KeepAliveContext = createContext(null);

export const useKeepAliveCache = () => useContext(KeepAliveContext);