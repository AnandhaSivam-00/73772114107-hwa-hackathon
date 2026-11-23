'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface CheckContextType {
    isFontLoaded: boolean;
}

const DependenciesCheckContext = createContext<CheckContextType | undefined>(undefined);

const DependenciesCheckProvider = ({ children }: { children: ReactNode }) => {
    const [isFontLoaded, setIsFontLoaded] = useState<boolean>(false);

    useEffect(() => {
        document.fonts.ready.then(() => setIsFontLoaded(true))
    }, [])

    return (
        <DependenciesCheckContext value={{ isFontLoaded }}>
            {children}
        </DependenciesCheckContext>
    )
}

export const useDependenciesCheck = () => {
    const context = useContext(DependenciesCheckContext);
    if(context === undefined) {
        throw new Error('useDependenciesCheck must be used within a DependenciesCheckProvider')
    }
    return context;
}

export default DependenciesCheckProvider