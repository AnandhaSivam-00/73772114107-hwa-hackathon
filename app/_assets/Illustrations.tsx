export const ZigZagRopeVisual = () => {
    return (
        <div className="bg-cream-deep rounded-lg p-3 flex flex-col gap-2">
            <div
                className="flex items-center justify-between text-xs font-semibold text-forest-soft">
                <span>Dynamic Arc Sweep</span>
                <span className="text-tangerine font-bold">120° Wide Coverage</span>
            </div>
            <div className="h-28 w-full relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full text-olive" fill="none" stroke="currentColor"
                    viewBox="0 0 280 100">
                    <rect fill="currentColor" fillOpacity="0.15" height="22" rx="4"
                        stroke="currentColor" strokeWidth="2" width="30" x="125" y="8"></rect>
                    <circle cx="140" cy="19" fill="#FB6107" r="3"></circle>
                    <path d="M 140 28 Q 70 50 40 85" stroke="#FB6107" strokeDasharray="3 3"
                        strokeLinecap="round" strokeWidth="3"></path>
                    <path d="M 140 28 Q 140 60 140 88" stroke="#546341" strokeLinecap="round"
                        strokeWidth="3"></path>
                    <path d="M 140 28 Q 210 50 240 85" stroke="#FB6107" strokeDasharray="3 3"
                        strokeLinecap="round" strokeWidth="3"></path>
                    <circle cx="40" cy="85" fill="#DDA15E" r="6"></circle>
                    <circle cx="140" cy="88" fill="#546341" r="7"></circle>
                    <circle cx="240" cy="85" fill="#DDA15E" r="6"></circle>
                </svg>
            </div>
            <span
                className="text-center text-xs text-forest-soft font-medium">Kinetic
                Left-to-Right Oscillations vs Dead Straight Lines</span>
        </div>
    )
}

export const TensionSpringVisual = () => {
    return (
        <div className="bg-cream-deep rounded-lg p-3 flex flex-col gap-2">
            <div
                className="flex items-center justify-between text-xs font-semibold text-forest-soft">
                <span>Coil Resistance</span>
                <span className="text-olive font-bold">Safe Elastic Damper</span>
            </div>
            <div className="h-28 w-full relative flex items-center justify-center">
                <svg className="w-full h-full text-olive" fill="none" viewBox="0 0 280 100">
                    <line stroke="#8e7065" strokeLinecap="round" strokeWidth="4" x1="20" x2="20"
                        y1="20" y2="80"></line>
                    <path
                        d="M 20 50 L 50 50 L 60 30 L 75 70 L 90 30 L 105 70 L 120 30 L 135 70 L 150 50 L 190 50"
                        stroke="#546341" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="3"></path>
                    <rect fill="#BC6C25" height="16" rx="4" width="22" x="190" y="42"></rect>
                    <path d="M 212 50 C 230 45, 245 55, 265 50" stroke="#FB6107"
                        strokeLinecap="round" strokeWidth="4"></path>
                </svg>
            </div>
            <span
                className="text-center text-xs text-forest-soft font-medium">Internal
                shock absorber protects canine jaw and neck</span>
        </div>
    )
}

export const ScheduledRhythmVisual = () => {
    return (
        <div className="bg-cream-deep rounded-lg p-3 flex flex-col gap-2">
            <div
                className="flex items-center justify-between text-xs font-semibold text-forest-soft">
                <span>Cadence Pacing</span>
                <span className="text-caramel font-bold">Interval Routine</span>
            </div>
            <div className="h-28 w-full flex items-end justify-between px-3 pb-2 gap-2">
                <div
                    className="flex-1 bg-tangerine h-16 rounded-t flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-bold">PLAY</span>
                    <span className="text-xs">20m</span>
                </div>
                <div
                    className="flex-1 bg-sand h-8 rounded-t flex flex-col items-center justify-center text-forest-soft">
                    <span className="text-xs font-bold">REST</span>
                    <span className="text-xs">40m</span>
                </div>
                <div
                    className="flex-1 bg-tangerine h-20 rounded-t flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-bold">TUG</span>
                    <span className="text-xs">30m</span>
                </div>
                <div
                    className="flex-1 bg-sand h-10 rounded-t flex flex-col items-center justify-center text-forest-soft">
                    <span className="text-xs font-bold">NAP</span>
                    <span className="text-xs">60m</span>
                </div>
            </div>
            <span
                className="text-center text-xs text-forest-soft font-medium">Prevents
                overstimulation and protects domestic harmony</span>
        </div>
    )
}
