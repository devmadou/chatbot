import { createContext, ReactNode, useState } from "react";

interface ViewDisplayContextType {
    isFullHeight: boolean,
    setIsFullHeight: (isFullHeight: boolean) => void
}

const ViewDisplayContext = createContext<ViewDisplayContextType>({} as ViewDisplayContextType)

interface ViewDisplayProviderProps {
    children: ReactNode
}

const ViewDisplayProvider = ({children}: ViewDisplayProviderProps) => {
    const [isFullHeight, setIsFullHeight] = useState(false)
    return (
        <ViewDisplayContext.Provider value={{isFullHeight, setIsFullHeight}}>
            {children}
        </ViewDisplayContext.Provider>
    )
}

export default ViewDisplayContext
export { ViewDisplayProvider }