import { createContext, ReactNode, useState } from "react";

interface ViewDisplayContextType {
    isFullHeight: boolean,
    setIsFullHeight: (isFullHeight: boolean) => void
}

const ViewDisplayContext = createContext<ViewDisplayContextType>({} as ViewDisplayContextType)

interface ViewDisplayProviderProps {
    children: ReactNode
}

/**
 * This context modifies the layout disposition to make the main context of the page full height while disabling scrolling
 * @param children
 * @constructor
 */
const ViewDisplayProvider = ({children}: ViewDisplayProviderProps) => {
    // By default, we'll keep the layout as is
    const [isFullHeight, setIsFullHeight] = useState(false)
    
    return (
        <ViewDisplayContext.Provider value={{isFullHeight, setIsFullHeight}}>
            {children}
        </ViewDisplayContext.Provider>
    )
}

export default ViewDisplayContext
export { ViewDisplayProvider }