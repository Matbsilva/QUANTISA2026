"use client";
import { COLORS, FONTS, TABS } from "@/lib/constants";
import { formatNumber } from "@/lib/calculos";

export default function Sidebar({ tab, setTab, itensCount, tc }) {
    return (
        <div
            style={{
                width: 150,
                background: COLORS.surface,
                borderRight: `1px solid ${COLORS.border}`,
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
            }}
        >
            {/* Logo */}
            <div
                style={{
                    padding: "10px 8px",
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                }}
            >
                <div
                    style={{
                        width: 22,
                        height: 22,
                        borderRadius: 4,
                        background: "linear-gradient(135deg,#F59E0B,#D97706)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: COLORS.bg,
                        fontSize: 10,
                        fontWeight: 800,
                        fontFamily: FONTS.mono,
                    }}
                >
                    Q
                </div>
                <div>
                    <div
                        style={{
                            fontSize: 10,
                            fontWeight: 800,
                            fontFamily: FONTS.mono,
                            letterSpacing: "1px",
                        }}
                    >
                        QUANTISA
                    </div>
                    <div
                        style={{
                            fontSize: 6,
                            color: COLORS.textMuted,
                            letterSpacing: "1.5px",
                        }}
                    >
                        ORÇAMENTO
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <div style={{ padding: "4px 0", flex: 1 }}>
                {TABS.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "7px 8px",
                            cursor: "pointer",
                            color: tab === t.id ? COLORS.accent : COLORS.textDim,
                            background:
                                tab === t.id ? "rgba(245,158,11,0.1)" : "transparent",
                            borderLeft:
                                tab === t.id
                                    ? `2px solid ${COLORS.accent}`
                                    : "2px solid transparent",
                            fontSize: 10,
                            fontWeight: tab === t.id ? 600 : 400,
                        }}
                    >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                        {t.id === "custo" && itensCount > 0 && (
                            <span
                                style={{
                                    marginLeft: "auto",
                                    fontSize: 8,
                                    background: COLORS.accent,
                                    color: COLORS.bg,
                                    borderRadius: 8,
                                    padding: "0 4px",
                                    fontFamily: FONTS.mono,
                                }}
                            >
                                {itensCount}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* HH footer */}
            {tc && tc.hp > 0 && (
                <div
                    style={{
                        padding: "6px 8px",
                        borderTop: `1px solid ${COLORS.border}`,
                        fontSize: 7,
                        color: COLORS.textMuted,
                        lineHeight: 1.6,
                    }}
                >
                    HH P: {formatNumber(tc.hp)} (~{Math.ceil(tc.hp / 8)}d)
                    <br />
                    HH A: {formatNumber(tc.ha)} (~{Math.ceil(tc.ha / 8)}d)
                </div>
            )}
        </div>
    );
}
