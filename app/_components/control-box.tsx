'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { BatteryFullIcon, Infinity01Icon, LockIcon, PowerIcon, Timer01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/app/_components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/_components/ui/tooltip'

import { BAR_HEIGHTS, BUTTONS, INFO, SPEEDS, TIMERS } from '@/data/data'
import { DogMark } from '@/app/_assets/Illustrations'
import type { BtnId } from '@/lib/types'
import { cn } from '@/lib/utils'

const FLASH_MS = 1600
const TOOLTIP_MS = 3400

interface ControlBoxProps {
    className?: string
}

/** Renders the animated signal strength bars for the current speed level. */
function SignalBars({ level }: { level: number }) {
    return (
        <span className="flex items-end gap-1" aria-hidden="true">
            {[5, 8, 11, 14].map((h, i) => (
                <span
                    key={i}
                    style={{ height: h }}
                    className={cn(
                        "w-1 rounded-full bg-honey transition-opacity",
                        i < level + 1 ? "opacity-100" : "opacity-25"
                    )}
                />
            ))}
        </span>
    );
}

/** Interactive WiggleTug control device with a live OLED status simulator. */
const ControlBox = ({ className }: ControlBoxProps) => {
    const deviceRef = useRef<HTMLDivElement>(null);
    const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const flashKey = useRef(0);
    const bootTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [power, setPower] = useState(true);
    const [locked, setLocked] = useState(false);
    const [presses, setPresses] = useState(0);
    const [booting, setBooting] = useState(false);
    const [timerIndex, setTimerIndex] = useState(TIMERS.length - 1);
    const [speedIndex, setSpeedIndex] = useState(1);
    const [springOn, setSpringOn] = useState(true);
    const [activeInfo, setActiveInfo] = useState<BtnId | null>(null);
    const [openTip, setOpenTip] = useState<BtnId | null>(null);
    const [flash, setFlash] = useState<{ msg: string; k: number } | null>(null);

    const speed = SPEEDS[speedIndex];
    const timerLabel = TIMERS[timerIndex];
    const barsActive = power && !locked && !booting;

    // Clear every pending timer when the device unmounts
    useEffect(() => {
        return () => {
            if (flashTimer.current) clearTimeout(flashTimer.current);
            if (bootTimer.current) clearTimeout(bootTimer.current);
            if (tipTimer.current) clearTimeout(tipTimer.current);
        };
    }, []);

    // Subtle reveal for the device once it enters the viewport
    useGSAP(() => {
        const device = deviceRef.current;
        if (!device) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        gsap.from(device, {
            y: 48,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: device,
                start: "top 85%",
                once: true,
            },
        });
    }, { scope: deviceRef });

    const flashMessage = (msg: string) => {
        if (flashTimer.current) clearTimeout(flashTimer.current);
        flashKey.current += 1;
        setFlash({ msg, k: flashKey.current });
        flashTimer.current = setTimeout(() => setFlash(null), FLASH_MS);
    };

    const press = (id: BtnId) => {
        setActiveInfo(id);

        if (locked && id !== "lock") {
            flashMessage("PAW LOCK ON");
            return;
        }

        switch (id) {
            case "power": {
                if (power) {
                    if (bootTimer.current) clearTimeout(bootTimer.current);
                    setPower(false);
                    setLocked(false);
                    setPresses(0);
                    setBooting(false);
                    flashMessage("POWER OFF");
                }
                else {
                    setPower(true);
                    setBooting(true);
                    flashMessage("WOOF! HI BUDDY!");
                    bootTimer.current = setTimeout(() => setBooting(false), FLASH_MS);
                }
                break;
            }
            case "lock": {
                if (!power) return;
                const next = presses + 1;

                if (next >= 3) {
                    const nowLocked = !locked;
                    setLocked(nowLocked);
                    setPresses(0);
                    flashMessage(nowLocked ? "PAW LOCK ON" : "LOCK RELEASED");
                }
                else {
                    setPresses(next);
                    flashMessage(`LOCK · ${3 - next} MORE`);
                }
                break;
            }
            case "timer": {
                if (!power) return;
                const next = (timerIndex + 1) % TIMERS.length;
                setTimerIndex(next);
                flashMessage(`TIMER · ${TIMERS[next] === "AUTO" ? "AUTO-DAY" : TIMERS[next]}`);
                break;
            }
            case "spring": {
                if (!power) return;
                setSpringOn(!springOn);
                flashMessage(springOn ? "SPRING OFF" : "SPRING ON");
                break;
            }
            case "speed": {
                if (!power) return;
                const next = (speedIndex + 1) % SPEEDS.length;
                setSpeedIndex(next);
                flashMessage(`SPEED · ${SPEEDS[next].name}`);
                break;
            }
        }
    };

    const handlePress = (id: BtnId) => {
        press(id);
        setOpenTip(id);

        if (tipTimer.current) clearTimeout(tipTimer.current);
        tipTimer.current = setTimeout(() => setOpenTip(null), TOOLTIP_MS);
    };

    return (
        <div ref={deviceRef} data-band className={cn("relative w-full max-w-4xl", className)}>
            <TooltipProvider delayDuration={0}>
                {/* orange flip-lock levers */}
                <span aria-hidden="true" className="absolute -top-2 left-10 h-4 w-11 -rotate-6 rounded-md bg-tangerine shadow-glow" />
                <span aria-hidden="true" className="absolute -top-2 right-10 h-4 w-11 rotate-6 rounded-md bg-tangerine shadow-glow" />
                <span aria-hidden="true" className="absolute -bottom-2 left-14 h-4 w-11 rotate-3 rounded-md bg-tangerine-deep" />
                <span aria-hidden="true" className="absolute -bottom-2 right-14 h-4 w-11 -rotate-3 rounded-md bg-tangerine-deep" />

                <div className="rounded-[30px] border border-cream/10 bg-[#2c2e27] p-5 shadow-[0_34px_70px_-24px_rgba(0,0,0,0.6)] sm:p-7 lg:p-9">
                    {/* OLED screen */}
                    <div className="oled-glass oled-scanlines relative min-h-[248px] overflow-hidden rounded-2xl border border-black/60 p-5 shadow-screen sm:min-h-[300px] sm:p-7">
                        {!power ? (
                            <div className="grid min-h-[196px] place-items-center">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <HugeiconsIcon icon={PowerIcon} size={30} className="text-cream/20" />
                                    <p className="text-xs font-bold tracking-[0.35em] text-cream/30">
                                        STANDBY
                                    </p>
                                    <p className="text-[10px] text-cream/20">
                                        Press POWER to wake
                                    </p>
                                </div>
                            </div>
                        ) : locked ? (
                            <div className="grid min-h-[196px] place-items-center">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <HugeiconsIcon icon={LockIcon} size={34} className="text-honey text-glow-honey" />
                                    <p className="font-display text-xl tracking-wide text-cream text-glow-cream">
                                        PAW LOCK ON
                                    </p>
                                    <div className="flex gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <span
                                                key={i}
                                                className={cn(
                                                    "size-2.5 rounded-full transition-colors",
                                                    i < presses ? "bg-tangerine" : "bg-cream/20"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-cream/45">
                                        Press LOCK 3× to unlock
                                    </p>
                                </div>
                            </div>
                        ) : booting ? (
                            <div className="grid min-h-[196px] place-items-center">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <DogMark className="size-14 animate-bounce-soft text-honey" />
                                    <p className="font-display text-2xl tracking-wide text-honey text-glow-honey">
                                        WOOF! HI BUDDY!
                                    </p>
                                    <p className="text-[11px] font-semibold tracking-[0.25em] text-cream/50">
                                        SYSTEM READY · LET&apos;S PLAY
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4 sm:gap-6">
                                {/* Dog logo tile */}
                                <div className="shrink-0 self-start rounded-xl border border-honey/40 bg-honey/10 p-2.5 text-honey sm:p-3">
                                    <DogMark className="size-12 sm:size-16" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-display text-lg tracking-wide text-cream text-glow-cream sm:text-2xl">
                                            TUG MODE
                                        </span>
                                        <span className="flex items-center gap-2 text-honey">
                                            <SignalBars level={speed.level} />
                                            <b className="text-xs font-bold tabular-nums text-glow-honey sm:text-sm">
                                                LEVEL {speed.level}
                                            </b>
                                        </span>
                                    </div>

                                    <div className="mt-5 flex items-end justify-between gap-4">
                                        {/* intensity bars */}
                                        <div className="flex h-14 items-end gap-1.5 sm:h-20" aria-hidden="true">
                                            {BAR_HEIGHTS.map((h, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        height: `${h}%`,
                                                        animationDuration: speed.dur,
                                                        animationDelay: `${i * 0.13}s`,
                                                        transform: barsActive ? undefined : "scaleY(0.22)",
                                                    }}
                                                    className={cn(
                                                        "w-2.5 origin-bottom rounded-[3px] bg-honey/90 transition-transform sm:w-4",
                                                        barsActive && "animate-eq"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <div className="space-y-2 text-right">
                                            <div className="flex items-center justify-end gap-2 text-cream/90">
                                                <HugeiconsIcon icon={Timer01Icon} size={15} className="text-honey" />
                                                <span className="text-xs font-bold tabular-nums sm:text-sm">
                                                    {timerLabel === "AUTO" ? "AUTO-DAY" : timerLabel}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 text-cream/90">
                                                <HugeiconsIcon icon={Infinity01Icon} size={15} className="text-honey" />
                                                <span className="text-xs font-bold sm:text-sm">
                                                    {timerLabel === "AUTO" ? "CYCLE ∞" : "CYCLE"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-3 text-[10px] font-bold tracking-wider sm:text-[11px]">
                                        <span className={springOn ? "text-honey text-glow-honey" : "text-cream/40"}>
                                            SPRING {springOn ? "ON" : "OFF"}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-cream/50">
                                            <HugeiconsIcon icon={BatteryFullIcon} size={14} />
                                            87%
                                        </span>
                                        <span className="text-[#a3c06a]">{speed.name}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* transient flash message */}
                        {flash && (
                            <div
                                key={flash.k}
                                className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-black/85 px-4 text-center animate-in fade-in-0 zoom-in-95 duration-200"
                            >
                                <span className="font-display text-xl tracking-wide text-honey text-glow-honey sm:text-2xl">
                                    {flash.msg}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* 5 tactile buttons */}
                    <div className="mt-6 flex items-center justify-center gap-5 sm:gap-10 lg:gap-18">
                        {BUTTONS.map((b) => {
                            const dimmed =
                                (!power && b.id !== "power") ||
                                (locked && b.id !== "lock");
                            const highlighted =
                                (activeInfo === b.id && power) ||
                                (b.id === "power" && power) ||
                                (b.id === "lock" && locked) ||
                                (b.id === "spring" && springOn && power && !locked);
                            return (
                                <Tooltip key={b.id}>
                                    <TooltipTrigger asChild>
                                        <div className='flex flex-col justify-center items-center gap-y-5'>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`${INFO[b.id].title} button`}
                                                onClick={() => handlePress(b.id)}
                                                className={cn(
                                                    "grid size-11 cursor-pointer place-items-center rounded-md border border-cream/10 bg-[#23251f] text-cream/85 shadow-[inset_0_-3px_6px_rgba(0,0,0,0.5),0_2px_5px_rgba(0,0,0,0.4)] transition-all duration-150 hover:bg-transparent hover:text-honey active:scale-90 sm:size-12",
                                                    highlighted && "text-honey ring-2 ring-tangerine/70",
                                                    b.id === "lock" && locked && "ring-honey/80",
                                                    dimmed && "opacity-45"
                                                )}
                                            >
                                                <HugeiconsIcon icon={b.icon} size={20} strokeWidth={1.9} />
                                            </Button>

                                            <span className='text-base'>{b.label}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        sideOffset={10}
                                        // className="block max-w-xs rounded-xl border border-cream/20 bg-forest/80 px-4 py-3 text-cream shadow-lift backdrop-blur-xl backdrop-saturate-150"
                                    >
                                        <span className="flex flex-col gap-1.5 text-left">
                                            <span className="flex items-center gap-2 text-sm font-bold tracking-wide text-honey">
                                                <HugeiconsIcon icon={b.icon} size={14} strokeWidth={2.1} />
                                                {INFO[b.id].title}
                                            </span>
                                            <span className="text-xs font-normal leading-relaxed text-cream/75">
                                                {INFO[b.id].desc}
                                            </span>
                                        </span>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}

export default ControlBox