"use client";
import { useState } from "react";
import { COLORS, FONTS } from "@/lib/constants";

/* ────────────────────────────────────────────────
   ComposicaoModal — modal overlay que renderiza
   o markdown raw da composição com highlighting
   de seções, keywords (pills) e tabelas.
   ──────────────────────────────────────────────── */

const SECTION_COLORS = {
    "SEÇÃO 1": "#D4A843",
    "SEÇÃO 2": "#4ECDC4",
    "SEÇÃO 3": "#3B82F6",
    "SEÇÃO 4": "#A855F7",
    "SEÇÃO 5": "#F97316",
    "SEÇÃO 6": "#EF4444",
    "SEÇÃO 7": "#10B981",
};

const PILL_COLORS = {
    "DRIVER PRINCIPAL": { bg: "#F97316", fg: "#fff" },
    "SEGUNDO DRIVER": { bg: "#3B82F6", fg: "#fff" },
    "Economia": { bg: "#10B981", fg: "#fff" },
    "Trade-off": { bg: "#A855F7", fg: "#fff" },
    "NOTA": { bg: "#EF4444", fg: "#fff" },
    "CRÍTICO": { bg: "#EF4444", fg: "#fff" },
    "TOTAL": { bg: "#D4A843", fg: "#1a1a1a" },
};

function renderLine(line, idx) {
    // Section headers
    for (const [sec, col] of Object.entries(SECTION_COLORS)) {
        if (line.includes(sec)) {
            return (
                <div key={idx} style={{
                    padding: "8px 12px", margin: "12px 0 6px",
                    background: col + "18", borderLeft: `3px solid ${col}`,
                    fontWeight: 700, fontSize: 15, color: col,
                    fontFamily: FONTS.mono,
                }}>
                    {line}
                </div>
            );
        }
    }

    // Pill keywords (▸ DRIVER PRINCIPAL, etc.)
    for (const [kw, colors] of Object.entries(PILL_COLORS)) {
        if (line.includes(`▸ ${kw}`) || line.startsWith(kw)) {
            return (
                <div key={idx} style={{
                    display: "flex", gap: 8, alignItems: "flex-start",
                    margin: "4px 0", padding: "6px 10px",
                    background: colors.bg + "15", borderRadius: 6,
                    borderLeft: `3px solid ${colors.bg}`,
                }}>
                    <span style={{
                        background: colors.bg, color: colors.fg,
                        padding: "2px 8px", borderRadius: 12,
                        fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}>{kw}</span>
                    <span style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>
                        {line.replace(`▸ ${kw}:`, "").replace(`▸ ${kw}`, "").replace(`${kw}:`, "").trim()}
                    </span>
                </div>
            );
        }
    }

    // Table rows (starts with |)
    if (line.trim().startsWith("|")) {
        const cells = line.split("|").filter(Boolean).map(c => c.trim());
        const isSep = cells.every(c => /^[-:]+$/.test(c));
        if (isSep) return null; // skip separator rows
        const isHeader = idx > 0; // first table row after heading could be header
        return (
            <div key={idx} style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cells.length}, 1fr)`,
                gap: 1, fontSize: 12, fontFamily: FONTS.mono,
                background: COLORS.border,
            }}>
                {cells.map((c, ci) => (
                    <div key={ci} style={{
                        padding: "4px 6px",
                        background: c.includes("**") ? "#1A1710" : COLORS.surface,
                        fontWeight: c.includes("**") ? 700 : 400,
                        color: c.includes("R$") ? COLORS.accent2 : COLORS.text,
                        fontSize: 11,
                    }}>
                        {c.replace(/\*\*/g, "")}
                    </div>
                ))}
            </div>
        );
    }

    // Bold lines
    if (line.startsWith("**") && line.endsWith("**")) {
        return (
            <div key={idx} style={{
                fontWeight: 700, fontSize: 14, color: COLORS.text,
                margin: "6px 0 2px", padding: "2px 0",
            }}>
                {line.replace(/\*\*/g, "")}
            </div>
        );
    }

    // Checkmarks & bullets
    if (line.trim().startsWith("✅") || line.trim().startsWith("❌") || line.trim().startsWith("⚠️") || line.trim().startsWith("☑")) {
        return (
            <div key={idx} style={{
                fontSize: 13, color: COLORS.text, padding: "2px 0 2px 8px",
                borderLeft: `2px solid ${COLORS.border}`,
                margin: "2px 0",
            }}>
                {line}
            </div>
        );
    }

    // Cost lines (Material: R$ XX,XX/m²)
    if (/^(Material|Equipamentos?|Mão de Obra|TOTAL|Mo de Obra):?\s/.test(line.trim())) {
        return (
            <div key={idx} style={{
                fontSize: 13, fontFamily: FONTS.mono, color: COLORS.accent2,
                padding: "3px 8px", margin: "2px 0",
                background: "#1a1a1a", borderRadius: 4,
            }}>
                {line}
            </div>
        );
    }

    // Empty line
    if (line.trim() === "" || line.trim() === "---" || line.trim() === "* * *") {
        return <div key={idx} style={{ height: 8 }} />;
    }

    // Default text
    return (
        <div key={idx} style={{
            fontSize: 13, color: COLORS.textDim, padding: "1px 0",
            lineHeight: 1.6,
        }}>
            {line}
        </div>
    );
}

export default function ComposicaoModal({ raw, onClose, titulo }) {
    const [copied, setCopied] = useState(false);
    if (!raw) return null;

    const lines = raw.split("\n");

    const handleCopy = () => {
        navigator.clipboard.writeText(raw);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 9999,
                background: "rgba(0,0,0,0.75)",
                display: "flex", justifyContent: "center", alignItems: "center",
                backdropFilter: "blur(4px)",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "90vw", maxWidth: 900,
                    maxHeight: "85vh", overflow: "hidden",
                    background: COLORS.bg, borderRadius: 12,
                    border: `1px solid ${COLORS.border}`,
                    display: "flex", flexDirection: "column",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                }}
            >
                {/* Header */}
                <div style={{
                    padding: "14px 20px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#1A1710",
                    flexShrink: 0,
                }}>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.accent }}>
                            📋 Composição Completa
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                            {titulo || "Composição importada"}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={handleCopy}
                            style={{
                                padding: "6px 14px", borderRadius: 6, border: `1px solid ${COLORS.green}`,
                                background: copied ? COLORS.green + "30" : "transparent",
                                color: COLORS.green, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            }}
                        >
                            {copied ? "✅ Copiado!" : "📋 Copiar Markdown"}
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                padding: "6px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}`,
                                background: "transparent", color: COLORS.textMuted, fontSize: 16,
                                cursor: "pointer",
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body — scrollable */}
                <div style={{
                    flex: 1, overflow: "auto", padding: "16px 20px",
                }}>
                    {lines.map((line, idx) => renderLine(line, idx))}
                </div>
            </div>
        </div>
    );
}
