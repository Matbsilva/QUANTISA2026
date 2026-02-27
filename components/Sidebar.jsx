"use client";
import { useState } from "react";
import { COLORS, FONTS, TABS } from "@/lib/constants";
import { formatNumber } from "@/lib/calculos";
import { useStore } from "@/lib/store";

export default function Sidebar({ tab, setTab, onBack, isSaving }) {
    const { header, itens, tc } = useStore();
    const itensCount = itens.length;
    const orcamentoNome = header.nome;

    const [isPinned, setIsPinned] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const expanded = isPinned || isHovered;
    const sidebarWidth = expanded ? 220 : 64;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: sidebarWidth,
                transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                background: COLORS.surface,
                borderRight: `1px solid ${COLORS.border}`,
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                overflow: "hidden",
            }}
        >
            {/* Header / Logo */}
            <div
                style={{
                    padding: "16px 12px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 80,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {onBack && (
                            <button
                                onClick={onBack}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: COLORS.textDim,
                                    cursor: "pointer",
                                    fontSize: 22,
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                title="Voltar ao Dashboard"
                            >
                                ←
                            </button>
                        )}
                        <div
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                background: "linear-gradient(135deg,#F59E0B,#D97706)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: COLORS.bg,
                                fontSize: 20,
                                fontWeight: 800,
                                fontFamily: FONTS.mono,
                                flexShrink: 0,
                            }}
                        >
                            Q
                        </div>
                        <div style={{
                            opacity: expanded ? 1 : 0,
                            width: expanded ? "auto" : 0,
                            transition: "opacity 0.2s",
                            overflow: "hidden",
                            whiteSpace: "nowrap"
                        }}>
                            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: FONTS.mono, letterSpacing: "1px" }}>
                                QUANTISA
                            </div>
                            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: "1.5px" }}>
                                ORÇAMENTO
                            </div>
                        </div>
                    </div>
                    {/* Pin Button */}
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 16,
                            color: isPinned ? COLORS.accent : COLORS.textMuted,
                            opacity: expanded ? 1 : 0,
                            pointerEvents: expanded ? "auto" : "none",
                            transition: "opacity 0.2s, color 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 4,
                        }}
                        title={isPinned ? "Desafixar menu" : "Fixar menu"}
                    >
                        📌
                    </button>
                </div>

                {expanded && orcamentoNome && (
                    <div style={{ marginTop: 16, fontSize: 15, color: COLORS.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {orcamentoNome}
                    </div>
                )}
                {expanded && isSaving !== undefined && (
                    <div style={{ marginTop: 6, fontSize: 13, color: isSaving ? COLORS.accent : COLORS.green, fontFamily: FONTS.mono }}>
                        {isSaving ? "⏳ Salvando..." : "✓ Salvo"}
                    </div>
                )}
            </div>

            {/* Nav items */}
            <div style={{ padding: "10px 0", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                {TABS.map((t, idx) => {
                    const isActive = tab === t.id;
                    const isOptional = t.optional;

                    return (
                        <div key={t.id}>
                            {isOptional && idx > 0 && !TABS[idx - 1].optional && (
                                <div style={{
                                    borderTop: `1px solid ${COLORS.border}`,
                                    margin: "12px 12px 8px",
                                    position: "relative",
                                    height: 16
                                }}>
                                    <span style={{
                                        position: "absolute",
                                        top: -9,
                                        left: expanded ? 4 : -2,
                                        background: COLORS.surface,
                                        fontSize: 11,
                                        color: COLORS.textMuted,
                                        padding: "0 6px",
                                        letterSpacing: "1px",
                                        textTransform: "uppercase",
                                        opacity: expanded ? 1 : 0,
                                        transition: "opacity 0.2s",
                                        fontWeight: 600
                                    }}>
                                        Análise
                                    </span>
                                </div>
                            )}
                            <div
                                onClick={() => setTab(t.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    padding: "12px 16px",
                                    cursor: "pointer",
                                    color: isActive ? COLORS.accent : (isOptional ? COLORS.textMuted : COLORS.textDim),
                                    background: isActive ? "rgba(245,158,11,0.1)" : "transparent",
                                    borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent",
                                    fontSize: isOptional ? 14 : 16,
                                    fontWeight: isActive ? 600 : 400,
                                    whiteSpace: "nowrap",
                                    transition: "background 0.2s"
                                }}
                            >
                                <span style={{ fontSize: 20, width: 28, textAlign: "center", display: "inline-block" }}>{t.icon}</span>
                                <span style={{
                                    opacity: expanded ? 1 : 0,
                                    transition: "opacity 0.2s",
                                    flex: 1
                                }}>
                                    {t.label}
                                </span>
                                {expanded && t.id === "custo" && itensCount > 0 && (
                                    <span style={{ fontSize: 13, background: COLORS.accent, color: COLORS.bg, borderRadius: 12, padding: "2px 8px", fontFamily: FONTS.mono, fontWeight: 700 }}>
                                        {itensCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* HH footer */}
            {expanded && tc && tc.hp > 0 && (
                <div style={{ padding: "16px", borderTop: `1px solid ${COLORS.border}`, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, whiteSpace: "nowrap" }}>
                    HH P: {formatNumber(tc.hp)} (~{Math.ceil(tc.hp / 8)}d)
                    <br />
                    HH A: {formatNumber(tc.ha)} (~{Math.ceil(tc.ha / 8)}d)
                </div>
            )}
        </div>
    );
}
