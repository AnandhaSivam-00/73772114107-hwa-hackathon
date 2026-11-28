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
const BOOT_MS = 1800
const TOOLTIP_MS = 3400

type FlashMessage = {
    msg: string
    k: number
}

interface ControlBoxProps {
    className?: string
}

interface SignalBarsProps {
    level: number
}

/** Renders the signal strength bars for the current speed level. */
function SignalBars({ level }: SignalBarsProps) {
    return (
        <span className="flex items-end gap-1" aria-hidden="true">
            {[5, 8, 11, 14].map((height, index) => (
                <span
                    key={index}
                    data-signal-bar
                    style={{ height }}
                    className={cn(
                        'w-1 rounded-xs bg-honey transition-opacity',
                        index < level + 1 ? 'opacity-100' : 'opacity-25'
                    )}
                />
            ))}
        </span>
    )
}

/** Interactive WiggleTug control device with a live OLED status simulator. */
const ControlBox = ({ className }: ControlBoxProps) => {
    const deviceRef = useRef<HTMLDivElement>(null)
    const bootTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const flashKey = useRef(0)
    const animatePressRef = useRef<(id: BtnId) => void>(() => {})

    const [power, setPower] = useState(true)
    const [locked, setLocked] = useState(false)
    const [presses, setPresses] = useState(0)
    const [booting, setBooting] = useState(false)
    const [timerIndex, setTimerIndex] = useState(TIMERS.length - 1)
    const [speedIndex, setSpeedIndex] = useState(1)
    const [springOn, setSpringOn] = useState(true)
    const [activeInfo, setActiveInfo] = useState<BtnId | null>(null)
    const [openTip, setOpenTip] = useState<BtnId | null>(null)
    const [flash, setFlash] = useState<FlashMessage | null>(null)

    const speed = SPEEDS[speedIndex]
    const timerLabel = TIMERS[timerIndex]
    const barsActive = power && !locked && !booting

    // Clear every pending timer when the device unmounts
    useEffect(() => {
        return () => {
            if(bootTimer.current) clearTimeout(bootTimer.current)
            if(tipTimer.current) clearTimeout(tipTimer.current)
        }
    }, [])

    // Device entrance: one timeline, scoped selectors, reduced-motion aware
    useGSAP(() => {
        const device = deviceRef.current
        if(!device) return

        const mm = gsap.matchMedia()

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: device,
                    start: 'top 85%',
                    once: true,
                },
                defaults: { ease: 'power3.out' },
            })

            timeline
                .from(device, {
                    y: 48,
                    autoAlpha: 0,
                    duration: 0.9,
                })
                .from('[data-device-lever]', {
                    scale: 0.6,
                    autoAlpha: 0,
                    duration: 0.45,
                    stagger: 0.06,
                }, '-=0.55')
                .from('[data-device-key-group]', {
                    y: 12,
                    autoAlpha: 0,
                    duration: 0.4,
                    stagger: 0.06,
                }, '-=0.45')
        }, device)

        return () => mm.revert()
    }, { scope: deviceRef })

    // Crossfade the OLED panel whenever the device changes mode
    useGSAP(() => {
        const panel = deviceRef.current?.querySelector<HTMLElement>('[data-screen-panel]')
        if(!panel) return
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo(panel, {
            autoAlpha: 0,
            y: 8,
            scale: 0.99,
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
        })
    }, { scope: deviceRef, dependencies: [power, locked, booting], revertOnUpdate: true })

    // Drive the equalizer bars with GSAP so speed changes stay in sync
    useGSAP(() => {
        const device = deviceRef.current
        if(!device) return

        const bars = gsap.utils.toArray<HTMLElement>('[data-eq-bar]', device)
        if(!bars.length) return

        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(bars, { scaleY: 1, transformOrigin: 'bottom center' })
            return
        }

        const duration = Number.parseFloat(speed.dur)

        gsap.fromTo(bars, {
            scaleY: 1,
            transformOrigin: 'bottom center',
        }, {
            scaleY: 0.3,
            duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            stagger: 0.13,
        })
    }, { scope: deviceRef, dependencies: [barsActive, speedIndex], revertOnUpdate: true })

    // Pop the signal bars when the speed level changes
    useGSAP(() => {
        const device = deviceRef.current
        if(!device) return
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const bars = gsap.utils.toArray<HTMLElement>('[data-signal-bar]', device)
        if(!bars.length) return

        gsap.fromTo(bars, {
            scaleY: 0.6,
            transformOrigin: 'bottom center',
        }, {
            scaleY: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            stagger: 0.04,
            overwrite: true,
        })
    }, { scope: deviceRef, dependencies: [speedIndex, barsActive], revertOnUpdate: true })

    // Bob the boot screen mascot while the greeting is visible
    useGSAP(() => {
        const mark = deviceRef.current?.querySelector<HTMLElement>('[data-boot-mark]')
        if(!mark || !booting) return
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.to(mark, {
            y: 8,
            rotation: 4,
            duration: 0.8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            transformOrigin: 'center center',
        })
    }, { scope: deviceRef, dependencies: [booting], revertOnUpdate: true })

    // Give the lock dots a small bounce as the triple-press sequence advances
    useGSAP(() => {
        const device = deviceRef.current
        if(!device) return
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const dots = gsap.utils.toArray<HTMLElement>('[data-lock-dot]', device)
        if(!dots.length) return

        dots.forEach((dot, index) => {
            gsap.to(dot, {
                scale: index < presses ? 1.15 : 1,
                duration: 0.3,
                ease: 'back.out(2)',
                overwrite: true,
            })
        })
    }, { scope: deviceRef, dependencies: [presses, locked], revertOnUpdate: true })

    // Animate the transient OLED flash message in and out
    useGSAP(() => {
        const flashEl = deviceRef.current?.querySelector<HTMLElement>('[data-flash]')
        if(!flashEl || !flash) return

        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(flashEl, { autoAlpha: 1, scale: 1 })
            const delayed = gsap.delayedCall(FLASH_MS / 1000, () => {
                setFlash((current) => (current?.k === flash.k ? null : current))
            })
            return () => delayed.kill()
        }

        const timeline = gsap.timeline({
            onComplete: () => {
                setFlash((current) => (current?.k === flash.k ? null : current))
            },
        })

        timeline
            .fromTo(flashEl, {
                autoAlpha: 0,
                scale: 0.92,
            }, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.25,
                ease: 'back.out(1.6)',
            })
            .to(flashEl, {
                autoAlpha: 0,
                scale: 0.96,
                duration: 0.2,
                ease: 'power2.in',
            }, `+=${FLASH_MS / 1000 - 0.45}`)

        return () => {
            timeline.kill()
        }
    }, { scope: deviceRef, dependencies: [flash], revertOnUpdate: true })

    const flashMessage = (msg: string) => {
        flashKey.current += 1
        setFlash({ msg, k: flashKey.current })
    }

    // Event-driven press feedback stays inside the GSAP context
    useGSAP((_, contextSafe) => {
        if(!contextSafe) return

        animatePressRef.current = contextSafe((id: BtnId) => {
            const device = deviceRef.current
            if(!device) return
            if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

            const button = device.querySelector<HTMLElement>(`[data-device-key="${id}"]`)
            if(!button) return

            gsap.fromTo(button, {
                scale: 0.9,
            }, {
                scale: 1,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)',
                overwrite: 'auto',
            })
        })
    }, { scope: deviceRef })

    const press = (id: BtnId) => {
        setActiveInfo(id)

        if(locked && id !== 'lock') {
            flashMessage('PAW LOCK ON')
            return
        }

        switch (id) {
            case 'power': {
                if(power) {
                    if(bootTimer.current) clearTimeout(bootTimer.current)
                    setPower(false)
                    setLocked(false)
                    setPresses(0)
                    setBooting(false)
                    flashMessage('POWER OFF')
                }
                else {
                    setPower(true)
                    setBooting(true)
                    bootTimer.current = setTimeout(() => setBooting(false), BOOT_MS)
                }
                break
            }
            case 'lock': {
                if(!power) return
                const next = presses + 1

                if(next >= 3) {
                    const nowLocked = !locked
                    setLocked(nowLocked)
                    setPresses(0)
                    flashMessage(nowLocked ? 'PAW LOCK ON' : 'LOCK RELEASED')
                }
                else {
                    setPresses(next)
                    flashMessage(`LOCK · ${3 - next} MORE`)
                }
                break
            }
            case 'timer': {
                if(!power) return
                const next = (timerIndex + 1) % TIMERS.length
                setTimerIndex(next)
                flashMessage(`TIMER · ${TIMERS[next] === 'AUTO' ? 'AUTO-DAY' : TIMERS[next]}`)
                break
            }
            case 'spring': {
                if(!power) return
                setSpringOn(!springOn)
                flashMessage(springOn ? 'SPRING OFF' : 'SPRING ON')
                break
            }
            case 'speed': {
                if(!power) return
                const next = (speedIndex + 1) % SPEEDS.length
                setSpeedIndex(next)
                flashMessage(`SPEED · ${SPEEDS[next].name}`)
                break
            }
        }
    }

    const handlePress = (id: BtnId) => {
        press(id)
        animatePressRef.current(id)
        setOpenTip(id)

        if(tipTimer.current) clearTimeout(tipTimer.current)
        tipTimer.current = setTimeout(() => setOpenTip(null), TOOLTIP_MS)
    }

    // Keep the pressed tooltip open while the pointer stays on its trigger
    const handleTipChange = (id: BtnId, open: boolean) => {
        if(open) {
            if(tipTimer.current) clearTimeout(tipTimer.current)
            setOpenTip(id)
            return
        }

        if(tipTimer.current) clearTimeout(tipTimer.current)
        setOpenTip((current) => (current === id ? null : current))
    }

    return (
        <div ref={deviceRef} data-band className={cn('relative w-full max-w-4xl', className)}>
            <TooltipProvider delayDuration={0}>
                {/* orange flip-lock levers */}
                <span data-device-lever aria-hidden="true" className="absolute -top-2 left-10 h-4 w-11 -rotate-6 rounded-md bg-tangerine shadow-glow" />
                <span data-device-lever aria-hidden="true" className="absolute -top-2 right-10 h-4 w-11 rotate-6 rounded-md bg-tangerine shadow-glow" />
                <span data-device-lever aria-hidden="true" className="absolute -bottom-2 left-14 h-4 w-11 rotate-3 rounded-md bg-tangerine-deep" />
                <span data-device-lever aria-hidden="true" className="absolute -bottom-2 right-14 h-4 w-11 -rotate-3 rounded-md bg-tangerine-deep" />

                <div className="rounded-4xl border border-cream/10 bg-graphite p-5 shadow-device sm:p-7 lg:p-9">
                    {/* OLED screen */}
                    <div className="oled-glass oled-scanlines relative min-h-54 overflow-hidden rounded-2xl border border-black/60 p-5 shadow-screen sm:min-h-57 sm:p-7">
                        {!power ? (
                            <div data-screen-panel className="grid min-h-48 place-items-center">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <HugeiconsIcon icon={PowerIcon} size={30} className="text-cream/20" />
                                    <p className="text-2xs font-bold tracking-widest text-cream/30">
                                        STANDBY
                                    </p>
                                    <p className="text-2xs text-cream/20">
                                        Press POWER to wake
                                    </p>
                                </div>
                            </div>
                        ) : locked ? (
                            <div data-screen-panel className="grid min-h-48 place-items-center">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <HugeiconsIcon icon={LockIcon} size={34} className="text-honey text-glow-honey" />
                                    <p className="font-display text-xl tracking-wide text-cream text-glow-cream">
                                        PAW LOCK ON
                                    </p>
                                    <div className="flex gap-2">
                                        {[0, 1, 2].map((index) => (
                                            <span
                                                key={index}
                                                data-lock-dot
                                                className={cn(
                                                    'size-2.5 rounded-full transition-colors',
                                                    index < presses ? 'bg-tangerine' : 'bg-cream/20'
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-2xs text-cream/45">
                                        Press LOCK 3× to unlock
                                    </p>
                                </div>
                            </div>
                        ) : booting ? (
                            <div data-screen-panel className="grid min-h-48 place-items-center">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <span data-boot-mark className="inline-flex text-honey">
                                        <DogMark className="size-14" />
                                    </span>
                                    <p className="font-display text-2xl tracking-wide text-honey text-glow-honey">
                                        WOOF! HI BUDDY!
                                    </p>
                                    <p className="text-2xs font-semibold tracking-widest text-cream/50">
                                        SYSTEM READY · LET&apos;S PLAY
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div data-screen-panel className="flex gap-4 sm:gap-6">
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
                                            {BAR_HEIGHTS.map((height, index) => (
                                                <span
                                                    key={index}
                                                    data-eq-bar
                                                    style={{ height: `${height}%` }}
                                                    className="w-2.5 origin-bottom rounded-t-xs bg-honey/90 sm:w-4"
                                                />
                                            ))}
                                        </div>
                                        <div className="space-y-2 text-right">
                                            <div className="flex items-center justify-between gap-2 text-cream/90">
                                                <span className="text-xs font-bold tabular-nums sm:text-sm">
                                                    {timerLabel === 'AUTO' ? 'AUTO-DAY' : timerLabel}
                                                </span>
                                                <HugeiconsIcon icon={Timer01Icon} size={15} className="text-honey" />
                                            </div>
                                            <div className="flex items-center justify-between gap-2 text-cream/90">
                                                <span className="text-xs font-bold sm:text-sm">
                                                    {timerLabel === 'AUTO' ? 'AUTO CYCLE' : 'CYCLE'}
                                                </span>
                                                <HugeiconsIcon icon={Infinity01Icon} size={15} className="text-honey" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between border-t border-cream/10 pt-3 text-2xs font-bold tracking-wider">
                                        <span className={springOn ? 'text-honey text-glow-honey' : 'text-cream/40'}>
                                            SPRING {springOn ? 'ON' : 'OFF'}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-cream/50">
                                            <HugeiconsIcon icon={BatteryFullIcon} size={18} />
                                            87%
                                        </span>
                                        <span className="text-moss">{speed.name}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* transient flash message */}
                        {flash && (
                            <div
                                key={flash.k}
                                data-flash
                                aria-live="polite"
                                className="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-2xl bg-black/85 px-4 text-center"
                            >
                                <span className="font-display text-xl tracking-wide text-honey text-glow-honey sm:text-2xl">
                                    {flash.msg}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* 5 tactile buttons */}
                    <div className="mt-6 flex items-center justify-center gap-5 sm:gap-10 lg:gap-16">
                        {BUTTONS.map((button) => {
                            const dimmed =
                                (!power && button.id !== 'power') ||
                                (locked && button.id !== 'lock')
                            const highlighted =
                                (activeInfo === button.id && power) ||
                                (button.id === 'power' && power) ||
                                (button.id === 'lock' && locked) ||
                                (button.id === 'spring' && springOn && power && !locked)

                            return (
                                <Tooltip
                                    key={button.id}
                                    open={openTip === button.id}
                                    onOpenChange={(open) => handleTipChange(button.id, open)}
                                >
                                    <TooltipTrigger asChild>
                                        <div data-device-key-group className="flex flex-col items-center justify-center gap-y-5">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                data-device-key={button.id}
                                                aria-label={`${INFO[button.id].title} button`}
                                                onClick={() => handlePress(button.id)}
                                                className={cn(
                                                    'grid size-11 cursor-pointer place-items-center rounded-md border border-cream/10 bg-graphite-deep text-cream/85 shadow-key transition-colors duration-150 hover:bg-transparent hover:text-honey sm:size-12',
                                                    highlighted && 'text-honey ring-2 ring-tangerine/70',
                                                    button.id === 'lock' && locked && 'ring-honey/80',
                                                    dimmed && 'opacity-50'
                                                )}
                                            >
                                                <HugeiconsIcon icon={button.icon} size={20} strokeWidth={1.9} />
                                            </Button>

                                            <span className="text-base">{button.label}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={10}>
                                        <span className="flex flex-col gap-1.5 text-left">
                                            <span className="flex items-center gap-2 text-sm font-bold tracking-wide text-honey">
                                                <HugeiconsIcon icon={button.icon} size={14} strokeWidth={2.1} />
                                                {INFO[button.id].title}
                                            </span>
                                            <span className="text-xs font-normal leading-relaxed text-cream/75">
                                                {INFO[button.id].desc}
                                            </span>
                                        </span>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}

export default ControlBox