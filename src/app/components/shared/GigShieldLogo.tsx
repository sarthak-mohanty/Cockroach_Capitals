// interface GigShieldMarkProps {
//   color?: string;
//   size?: number;
//   className?: string;
// }
//
// /**
//  * The GigShield G-shield mark (icon only).
//  * Pass color="white" for use on dark backgrounds.
//  */
// export function GigShieldMark({ color = '#1B2E6B', size = 32, className }: GigShieldMarkProps) {
//   // Proportional height: viewBox is 120 × 140
//   const height = Math.round(size * 140 / 120);
//   const sw = 7.5; // stroke-width inside the 120×140 viewBox
//
//   return (
//     <svg
//       width={size}
//       height={height}
//       viewBox="0 0 120 140"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={className}
//     >
//       {/* ── Outer shield ── */}
//       <path
//         d="M60 7 L15 7 L7 22 L7 78 C7 113 34 132 60 140 C86 132 113 113 113 78 L113 22 L105 7 Z"
//         stroke={color}
//         strokeWidth={sw}
//         strokeLinejoin="round"
//       />
//
//       {/* ── Inner G – left arc + bottom curve ── */}
//       <path
//         d="M60 24 L27 24 L21 34 L21 78 C21 104 42 118 60 125"
//         stroke={color}
//         strokeWidth={sw}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//
//       {/* ── Inner G – top-right horizontal arm ── */}
//       <path
//         d="M60 24 L84 24"
//         stroke={color}
//         strokeWidth={sw}
//         strokeLinecap="round"
//       />
//
//       {/* ── Inner G – right vertical (connects top arm to crossbar) ── */}
//       <path
//         d="M84 24 L84 58"
//         stroke={color}
//         strokeWidth={sw}
//         strokeLinecap="round"
//       />
//
//       {/* ── Inner G – crossbar ── */}
//       <path
//         d="M60 58 L84 58"
//         stroke={color}
//         strokeWidth={sw}
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }
//
// interface GigShieldWordmarkProps {
//   color?: string;
//   iconSize?: number;
//   className?: string;
//   gap?: number;
// }
//
// /**
//  * Horizontal lockup: G-shield icon + "GigShield" wordmark side by side.
//  */
// export function GigShieldWordmark({ color = '#1B2E6B', iconSize = 28, gap = 10, className }: GigShieldWordmarkProps) {
//   return (
//     <div className={`flex items-center ${className ?? ''}`} style={{ gap }}>
//       <GigShieldMark color={color} size={iconSize} />
//       <span
//         style={{
//           fontFamily: 'var(--font-display)',
//           fontWeight: 700,
//           fontSize: `${Math.round(iconSize * 0.72)}px`,
//           color,
//           lineHeight: 1,
//           letterSpacing: '0.04em',
//         }}
//       >
//         GigShield
//       </span>
//     </div>
//   );
// }

interface GigShieldMarkProps {
    color?: string;
    size?: number;
    className?: string;
}

/**
 * The GigShield G-shield mark (icon only).
 * Pass color="white" for use on dark backgrounds.
 */
export function GigShieldMark({ color = '#1B2E6B', size = 32, className }: GigShieldMarkProps) {
    // Proportional height: viewBox is 120 × 140
    const height = Math.round((size * 140) / 120);

    // A thicker stroke nicely replicates the bold weight of the reference image
    const sw = 13;

    return (
        <svg
            width={size}
            height={height}
            viewBox="0 0 120 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* The logo is a single continuous stroke.
        It starts at the inner part of the top-right lip, goes out, traces the entire
        shield border, comes back up the right side, and turns in to form the crossbar.
      */}
            <path
                d="
          M 72 46
          L 105 46
          L 105 26
          L 60 12
          L 15 26
          L 15 80
          C 15 112, 38 124, 60 132
          C 82 124, 105 112, 105 80
          L 105 66
          L 52 66
        "
                stroke={color}
                strokeWidth={sw}
                strokeLinejoin="miter"
                strokeLinecap="butt"
            />
        </svg>
    );
}

interface GigShieldWordmarkProps {
    color?: string;
    iconSize?: number;
    className?: string;
    gap?: number;
}

/**
 * Horizontal lockup: G-shield icon + "GigShield" wordmark side by side.
 */
export function GigShieldWordmark({ color = '#1B2E6B', iconSize = 28, gap = 10, className }: GigShieldWordmarkProps) {
    return (
        <div className={`flex items-center ${className ?? ''}`} style={{ gap }}>
            <GigShieldMark color={color} size={iconSize} />
            <span
                style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: `${Math.round(iconSize * 0.72)}px`,
                    color,
                    lineHeight: 1,
                    letterSpacing: '0.04em',
                }}
            >
        GigShield
      </span>
        </div>
    );
}
