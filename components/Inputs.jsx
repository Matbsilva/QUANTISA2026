"use client";
import { COLORS, FONTS } from "@/lib/constants";
import { useState, useEffect } from "react";

/**
 * NumericInput — accepts Brazilian comma (139,45) or dot (139.45)
 * Uses controlled local string state so mid-typing ("139,") is not lost.
 * Commits parsed float to parent via onChange only when value is complete.
 */
export function NumericInput({ value, onChange, w }) {
    // Local display string — keeps the comma/dot as the user types
    const [display, setDisplay] = useState(
        value === 0 || value == null ? "" : String(value).replace(".", ",")
    );

    // Sync when parent resets the value externally (e.g. loading data)
    useEffect(() => {
        // Only sync if there is no ongoing user edit (display is empty or numeric-complete)
        const parsed = parseDisplay(display);
        if (parsed !== value) {
            setDisplay(value === 0 || value == null ? "" : String(value).replace(".", ","));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    function parseDisplay(str) {
        if (!str || str === "" || str === "-") return 0;
        // Accept Brazilian style: 1.234,56  → remove dots, replace comma with dot
        // Accept US style: 1234.56
        const normalized = str
            .replace(/\./g, ",")           // normalize all dots to comma temporarily
            .replace(/,(?=.*,)/g, "")      // remove all but last comma
            .replace(",", ".");            // make last comma a dot
        return parseFloat(normalized) || 0;
    }

    function handleChange(e) {
        const raw = e.target.value;
        // Allow: digits, single comma, single dot, minus at start
        // Strip anything that isn't a digit, comma, dot, or leading minus
        const cleaned = raw.replace(/[^0-9,.]/g, "");
        setDisplay(cleaned);
        // Only propagate when it's a complete number (doesn't end with comma/dot)
        if (!cleaned.endsWith(",") && !cleaned.endsWith(".") && cleaned !== "") {
            onChange(parseDisplay(cleaned));
        } else if (cleaned === "") {
            onChange(0);
        }
    }

    function handleBlur() {
        // On blur, finalize: parse whatever is there and reformat display
        const num = parseDisplay(display);
        onChange(num);
        setDisplay(num === 0 ? "" : String(num).replace(".", ","));
    }

    return (
        <input
            type="text"
            inputMode="decimal"
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0"
            style={{
                width: w || "100%",
                padding: "3px 5px",
                background: COLORS.bg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 3,
                color: COLORS.accent2,
                fontSize: 14,
                fontFamily: FONTS.mono,
                outline: "none",
                textAlign: "right",
            }}
        />
    );
}

/**
 * TextInput — simple styled text input
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
                fontSize: 14,
                fontFamily: FONTS.sans,
                outline: "none",
            }}
        />
    );
}
