"use client";
import { COLORS, FONTS } from "@/lib/constants";

/**
 * Numeric Input — auto-formats for currency/number input
 * Strips non-numeric chars, handles comma as decimal
 */
export function NumericInput({ value, onChange, w }) {
    return (
        <input
            type="text"
            value={value === 0 ? "" : value ?? ""}
            onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.,-]/g, "");
                onChange(v === "" ? 0 : parseFloat(v.replace(",", ".")) || 0);
            }}
            placeholder="0"
            style={{
                width: w || "100%",
                padding: "3px 5px",
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
                color: COLORS.accent2,
                fontSize: 10,
                fontFamily: FONTS.mono,
                outline: "none",
                textAlign: "right",
            }}
        />
    );
}

/**
 * Text Input — simple styled text input
 */
export function TextInput({ value, onChange, placeholder, w }) {
    return (
        <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || ""}
            style={{
                width: w || "100%",
                padding: "3px 5px",
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
                color: COLORS.text,
                fontSize: 10,
                fontFamily: FONTS.sans,
                outline: "none",
            }}
        />
    );
}
