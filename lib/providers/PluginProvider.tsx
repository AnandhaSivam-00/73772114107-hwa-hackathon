'use client'

import Lenis from 'lenis'
import gsap from 'gsap'
import { ReactNode, useEffect } from 'react'
import { setLenis } from '../lenis'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger, MotionPathPlugin } from 'gsap/all'

// Register all the GSAP plugins once
if(typeof window !== 'undefined') {
    gsap.registerPlugin(
        useGSAP,
        ScrollTrigger,
        MotionPathPlugin
    )
}

// Adding the lenis instance with properties to the window object
const PluginProvider = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        const lenis = new Lenis({
            smoothWheel: true,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 0.6,
            touchMultiplier: 2,
            syncTouch: false,
            lerp: 0.08,
        })

        setLenis(lenis);

        lenis.on('scroll', (e) => {
            ScrollTrigger.update();
        })

        ScrollTrigger.addEventListener('refresh', () => lenis.resize())

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        gsap.ticker.lagSmoothing(0);

        return () => {
            setLenis(null);
            lenis.destroy();
            gsap.ticker.remove((time) => lenis.raf(time * 1000));
            ScrollTrigger.removeEventListener('refresh', () => lenis.resize())
        }
    }, [])

    return <>{children}</>
}

export default PluginProvider