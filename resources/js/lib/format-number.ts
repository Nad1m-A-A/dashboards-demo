/**
 * Formats a number as a US-locale string with comma separators and no decimals (rounded).
 * 
 * - If `value` is `undefined`, returns "—".
 * - If `value` is `null`, returns "null".
 * - Otherwise, rounds to the nearest integer and formats with commas.
 * 
 * @example formatNumber(1000) // "1,000"
 * @example formatNumber(1234.56) // "1,235"
 * @example formatNumber(null) // "null"
 * @example formatNumber(undefined) // "—"
 */
export function formatNumber(value: number | null | undefined): string {
    if (value === undefined) return "—";
    if (value === null) return "null";
    return Number(Number(value ?? 0).toFixed(0)).toLocaleString('en-US');
}
