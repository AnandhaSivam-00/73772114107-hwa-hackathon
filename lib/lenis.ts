/**
 * Globally define the lenis
 */

import Lenis from 'lenis'

export const setLenis = (lenis: Lenis | null) => {
    (window as unknown as { lenis: Lenis | null }).lenis = lenis;
}

export const getLenis = () => {
    const lenis = (window as unknown as { lenis?: Lenis | null }).lenis;
    return lenis ?? undefined;
}