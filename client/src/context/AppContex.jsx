import { createContext } from "react";

export const AppContext = createContext();

const value = {
    
}

export const AppContextProvider = ({children}) =>{
    return (
        <AppContextProvider value={value}>
            {children}
        </AppContextProvider>
    )
}

