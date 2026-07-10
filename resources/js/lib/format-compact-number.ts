const SCALES = [
    { threshold: 1_000_000_000, divisor: 1_000_000_000, suffix: 'b' },
    { threshold: 1_000_000, divisor: 1_000_000, suffix: 'm' },
    { threshold: 1_000, divisor: 1_000, suffix: 'k' },
] as const;

const FRACTION_DIGITS = 3;

function truncateToDecimals(value: number, decimals: number): number {
    const factor = 10 ** decimals;

    return Math.trunc(value * factor) / factor;
}

/**
 * Formats a number as a compact string for tight UI spaces (charts, cards, badges).
 * Scaled values keep up to three decimals, trailing zeros stripped, plus a unit suffix.
 *
 * @example formatCompactNumber(8087500) // "8.087m"
 * @example formatCompactNumber(1500000) // "1.5m"
 * @example formatCompactNumber(90000000) // "90m"
 * @example formatCompactNumber(999) // "999"
 */
export function formatCompactNumber(value: number): string {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    for (const { threshold, divisor, suffix } of SCALES) {
        if (abs >= threshold) {
            const scaled = truncateToDecimals(abs / divisor, FRACTION_DIGITS);

            return `${sign}${Number(scaled.toFixed(FRACTION_DIGITS))}${suffix}`;
        }
    }

    return `${sign}${abs}`;
}
