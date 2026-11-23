'use client'

import { MouseEvent } from "react";
import { getLenis } from "../lenis";

type ScrollEventTriggerType = MouseEvent<HTMLAnchorElement>;

const useScroll = () => {
    const handleScroll = (e: ScrollEventTriggerType, id: string) => {
        e.preventDefault();

        const element = document.getElementById(id.replace('#', ''))
        if(element) {
            const lenis = getLenis();

            if(lenis) {
                lenis.scrollTo(element, {
                    lerp: 0.2,
                    lock: true
                })
            }
            else {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    return {
        handleScroll
    }
}

export default useScroll