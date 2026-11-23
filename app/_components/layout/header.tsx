'use client'

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons";

import useScroll from "@/lib/hooks/useScroll";
import { useDependenciesCheck } from "@/lib/providers/DependenciesCheckProvider";

const NAV_LINKS = [
    { label: "How It Works", href: "#how-it-works", target: "internal" },
    { label: "Shop", href: "/product/wiggletug-core", target: "external" },
    { label: "Safety & FAQ", href: "#safety-faq", target: "internal" },
];

const TOP_THRESHOLD = 64;

const Header = () => {
    const headerRef = useRef<HTMLElement>(null);
    
    const { handleScroll } = useScroll();
    const { isFontLoaded } = useDependenciesCheck();

    const sectionIds = useMemo<string[]>(() => {
        const filtered = NAV_LINKS.filter((item) => item.target === 'internal')
        return filtered.map((item) => item.href)
    }, [])

    useGSAP(() => {
        const header = headerRef.current;
        if(!header || !isFontLoaded) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const duration = reducedMotion ? 0 : 0.35;
        let lastY = window.scrollY;
        let isHidden = false;

        const setHidden = (next: boolean) => {
            if(next === isHidden) return;
            isHidden = next;
            header.toggleAttribute("inert", next);
            header.classList.toggle("pointer-events-none", next);
            gsap.to(header, {
                yPercent: next ? -150 : 0,
                duration,
                ease: next ? "power2.in" : "power2.out",
                overwrite: true,
            });
        };

        const trigger = ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "max",
            markers: process.env.NEXT_PUBLIC_ENV === 'development' ? true : false,
            onUpdate: (self) => {
                const y = self.scroll();
                if(y <= TOP_THRESHOLD) {
                    setHidden(false);
                } 
                else if(self.direction === 1 && y > lastY) {
                    setHidden(true);
                } 
                else if(self.direction === -1) {
                    setHidden(false);
                }
                lastY = y;
            },
        });

        return () => {
            trigger.kill();
            header.removeAttribute("inert");
            header.classList.remove("pointer-events-none");
            gsap.set(header, { clearProps: "transform" });
        };
    }, { 
        scope: headerRef, 
        dependencies: [isFontLoaded]
    });

    return (
        <header
            ref={headerRef}
            className="fixed inset-x-0 top-0 z-50 will-change-transform"
        >
            <div className="container-hd pt-3 sm:pt-4">
                <div className="grid grid-cols-[1fr_auto_1fr] rounded-md items-center gap-1.5 px-2.5 py-2 sm:gap-3 sm:px-4 sm:py-2.5 bg-white/50 shadow-soft backdrop-blur-xl backdrop-saturate-150 border border-border">
                    <Link
                        href="/"
                        aria-label="WiggleTug home"
                        className="flex min-w-0 items-center gap-2 justify-self-start rounded-full outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                    >
                        <Image
                            src="/images/icon.svg"
                            alt=""
                            width={36}
                            height={36}
                            className="size-8 shrink-0 sm:size-9"
                        />
                        <span className="max-[380px]:hidden truncate font-display text-base leading-none text-forest sm:text-xl">
                            WiggleTug
                        </span>
                    </Link>

                    <nav aria-label="Primary" className="justify-self-center">
                        <ul className="flex items-center gap-3 sm:gap-8">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[15px] font-semibold text-forest transition-colors hover:text-olive nav-link-indicator"
                                    >
                                        <span className="hidden sm:inline">
                                            {link.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="justify-self-end">
                        <button
                            type="button"
                            aria-label="Open cart"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/70 p-2 text-forest ring-1 ring-sand transition-colors hover:bg-white hover:text-tangerine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive sm:px-4 sm:py-2"
                        >
                            <HugeiconsIcon
                                icon={ShoppingBag01Icon}
                                size={18}
                                strokeWidth={1.9}
                            />
                            <span className="hidden text-sm font-semibold sm:inline">
                                Cart
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
