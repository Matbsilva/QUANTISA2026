"use client";
import { useState, useMemo } from "react";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculos";

/**
 * Aba Engenharia de Valor — IA sugere alternativas para itens Classe A
 */
export default function TabEV({ ci, tc }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [evData, setEvData] = useState(null);

    // Get ranked items (Classe A = top 80% of cost)
    const classeA = useMemo(() => {
        if (!ci || ci.length === 0) return [];

        const sorted = [...ci]
            .map((it) => ({
                ...it,
                tot: (it.m + it.mo + it.e) * it.q,
            }))
            .sort((a, b) => b.tot - a.tot);

        const total = sorted.reduce((s, it) => s + it.tot, 0);
        if (total === 0) return [];

        let acc = 0;
        return sorted.filter((it) => {
            const pct = (it.tot / total) * 100;
            acc += pct;
            return acc <= 80;
        });
    }, [ci]);

    const gerarEV = async () => {
        if (classeA.length === 0) return;

        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/ia/ev", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itens: classeA.map((it) => ({
                        id: it.id,
                        n: it.n,
                        d: it.d,
                        u: it.u,
                        q: it.q,
                        m: it.m,
                        mo: it.mo,
                        e: it.e,
                        tot: it.tot,
                    })),
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro na API");
            }

            const data = await res.json();
            setEvData(data.alternativas || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!ci || ci.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💡</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Engenharia de Valor</div>
                <div style={{ fontSize: 11, marginTop: 6 }}>
                    Adicione itens na aba Custo para a IA sugerir alternativas.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, fontFamily: FONTS.mono }}>
                    💡 Engenharia de Valor
                </h2>
                <button
                    onClick={gerarEV}
                    disabled={loading || classeA.length === 0}
                    style={{
                        padding: "6px 18px",
                        borderRadius: 6,
                        border: "none",
                        background: loading ? COLORS.textMuted : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
                        color: COLORS.bg,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: loading ? "wait" : "pointer",
                    }}
                >
                    {loading ? "⏳ Analisando..." : `🤖 Analisar ${classeA.length} itens Classe A`}
                </button>
            </div>

            <div style={{
                padding: 10,
                background: "rgba(59,130,246,0.08)",
                border: `1px solid rgba(59,130,246,0.2)`,
                borderRadius: 8,
                marginBottom: 14,
                fontSize: 10,
                color: COLORS.textDim,
            }}>
                A Engenharia de Valor analisa os <b style={{ color: COLORS.red }}>{classeA.length} itens Classe A</b> (que representam ~80% do custo) e sugere 3 alternativas para cada: <b>Padrão</b>, <b>Econômico</b> e <b>Premium</b>.
            </div>

            {error && (
                <div style={{
                    padding: 8,
                    background: COLORS.red + "15",
                    border: `1px solid ${COLORS.red}40`,
                    borderRadius: 6,
                    marginBottom: 10,
                    fontSize: 10,
                    color: COLORS.red,
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Itens Classe A (always shown) */}
            <h3 style={{ fontSize: 11, fontWeight: 700, color: COLORS.red, fontFamily: FONTS.mono, marginBottom: 6 }}>
                Itens Classe A (foco da análise)
            </h3>
            <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden", marginBottom: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Item", "Descrição", "Custo Total"].map((h, i) => (
                                <th key={i} style={{
                                    padding: "5px 8px",
                                    textAlign: i === 2 ? "right" : "left",
                                    fontSize: 8,
                                    fontWeight: 700,
                                    color: COLORS.red,
                                    background: COLORS.surface,
                                    borderBottom: `1px solid ${COLORS.border}`,
                                    textTransform: "uppercase",
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {classeA.map((it) => (
                            <tr key={it.id}>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 10, fontFamily: FONTS.mono }}>{it.n}</td>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 10 }}>{it.d}</td>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 10, textAlign: "right", fontFamily: FONTS.mono, fontWeight: 600, color: COLORS.accent2 }}>{formatCurrency(it.tot)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* EV Results */}
            {evData && evData.length > 0 && (
                <div>
                    <h3 style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, fontFamily: FONTS.mono, marginBottom: 8 }}>
                        🤖 Alternativas Sugeridas pela IA
                    </h3>
                    {evData.map((item, idx) => (
                        <div key={idx} style={{
                            marginBottom: 14,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 8,
                            overflow: "hidden",
                        }}>
                            <div style={{
                                padding: "8px 12px",
                                background: "#1A1710",
                                fontSize: 11,
                                fontWeight: 700,
                                color: COLORS.accent,
                                fontFamily: FONTS.mono,
                            }}>
                                {item.item} — {item.descricao}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
                                {(item.alternativas || []).map((alt, aIdx) => {
                                    const altColors = [COLORS.blue, COLORS.green, COLORS.purple];
                                    const altLabels = ["PADRÃO", "ECONÔMICO", "PREMIUM"];
                                    return (
                                        <div
                                            key={aIdx}
                                            style={{
                                                padding: 10,
                                                borderRight: aIdx < 2 ? `1px solid ${COLORS.border}` : "none",
                                                fontSize: 9,
                                            }}
                                        >
                                            <div style={{ fontWeight: 700, color: altColors[aIdx], marginBottom: 6, fontSize: 10 }}>
                                                {alt.tipo || altLabels[aIdx]}
                                            </div>
                                            <div style={{ color: COLORS.textDim, marginBottom: 4 }}>{alt.especificacao}</div>
                                            <div style={{ fontFamily: FONTS.mono, fontWeight: 600, color: COLORS.accent2, marginBottom: 4 }}>
                                                {formatCurrency(alt.custo)}
                                                {alt.variacao && (
                                                    <span style={{ color: alt.variacao > 0 ? COLORS.red : COLORS.green, marginLeft: 6 }}>
                                                        {alt.variacao > 0 ? "+" : ""}{alt.variacao}%
                                                    </span>
                                                )}
                                            </div>
                                            {alt.vantagens && alt.vantagens.map((v, i) => (
                                                <div key={i} style={{ color: COLORS.green, fontSize: 8 }}>✅ {v}</div>
                                            ))}
                                            {alt.desvantagens && alt.desvantagens.map((d, i) => (
                                                <div key={i} style={{ color: COLORS.red, fontSize: 8 }}>❌ {d}</div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
