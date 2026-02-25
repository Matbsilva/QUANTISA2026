// ============================================
// QUANTISA ORÇAMENTO — Formatting Utilities
// ============================================

/**
 * Format a number as Brazilian Real currency (R$)
 * Returns "—" for null, NaN, or zero values
 */
export function formatCurrency(value) {
    if (value == null || isNaN(value) || value === 0) return "—";
    return (
        "R$ " +
        Number(value).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );
}

/**
 * Format a number with Brazilian locale (comma decimal)
 * Returns "—" for null or NaN
 */
export function formatNumber(value) {
    if (value == null || isNaN(value)) return "—";
    return Number(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/**
 * Calculate BDI from rate object { ac, cf, mi, tm, te, tf, lc }
 * Formula: ((1 + AC + CF + MI) / (1 - (TM + TE + TF + LC))) - 1
 */
export function calcBDI(rates) {
    const denominator =
        1 - (rates.tm + rates.te + rates.tf + rates.lc) / 100;
    if (denominator <= 0) return 0;
    return (1 + (rates.ac + rates.cf + rates.mi) / 100) / denominator - 1;
}
