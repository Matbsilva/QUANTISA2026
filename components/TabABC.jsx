"use client";
import { useMemo, useState } from "react";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/calculos";
import ReactMarkdown from "react-markdown";

/**
 * Aba ABC — Análise Pareto 80/20 automática
 * Classifica itens em A (80%), B (15%), C (5%) por custo
 */
export default function TabABC({ ci, tc }) {
    // Sort items by total cost descending
    const ranked = useMemo(() => {
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
        return sorted.map((it, idx) => {
            const pct = (it.tot / total) * 100;
            acc += pct;
            let classe = "C";
            if (acc <= 80) classe = "A";
            else if (acc <= 95) classe = "B";

            return { ...it, rank: idx + 1, pct, accPct: acc, classe };
        });
    }, [ci]);

    const classeA = ranked.filter((r) => r.classe === "A");
    const classeB = ranked.filter((r) => r.classe === "B");
    const classeC = ranked.filter((r) => r.classe === "C");
    const total = ranked.reduce((s, r) => s + r.tot, 0);

    const classeColors = { A: COLORS.red, B: COLORS.accent, C: COLORS.green };
    const classeBg = { A: "#EF444415", B: "#F59E0B15", C: "#22C55E15" };

    const [loadingAI, setLoadingAI] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [aiError, setAiError] = useState(null);

    const handleGenerate = async () => {
        try {
            setLoadingAI(true);
            setAiError(null);

            const res = await fetch("/api/ia/abc-riscos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    header: { nome: "Orçamento" },
                    tc,
                    equipes: [], // Passed for Cronograma sizing base (could be dynamic later)
                    itens: ranked
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro na API de ABC/Riscos");
            }

            const data = await res.json();
            setAiResult(data);
        } catch (error) {
            setAiError(error.message);
        } finally {
            setLoadingAI(false);
        }
    };

    if (ranked.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Análise ABC</div>
                <div style={{ fontSize: 15, marginTop: 6 }}>
                    Adicione itens na aba Custo para gerar a análise Pareto 80/20.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0, fontFamily: FONTS.mono }}>
                    🎯 Análise ABC — Pareto 80/20
                </h2>
                <button
                    onClick={handleGenerate}
                    disabled={loadingAI}
                    style={{
                        padding: "8px 16px", borderRadius: 6, border: "none",
                        background: loadingAI ? COLORS.border : COLORS.accent,
                        color: COLORS.bg, fontSize: 13, fontWeight: 700,
                        cursor: loadingAI ? "wait" : "pointer", transition: "all 0.2s"
                    }}
                >
                    {loadingAI ? "⏳ Gerando Análise..." : "🤖 Gerar Análise IA, Riscos e EV (Prompt 4)"}
                </button>
            </div>

            {aiError && (
                <div style={{ marginBottom: 15, padding: 15, background: COLORS.red + "15", border: `1px solid ${COLORS.red}40`, borderRadius: 6, color: COLORS.red }}>
                    ⚠️ Erro: {aiError}
                </div>
            )}

            {/* AI RESULTS */}
            {aiResult && (
                <div style={{ marginBottom: 30, display: "flex", flexDirection: "column", gap: 15 }}>
                    <div style={{ padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.red}`, borderRadius: 8 }}>
                        <h3 style={{ color: COLORS.red, margin: "0 0 10px" }}>🚨 Engenharia de Valor (Itens Classe A)</h3>
                        <div style={{ fontSize: 13 }}><ReactMarkdown>{aiResult.engenharia_valor || ""}</ReactMarkdown></div>
                    </div>

                    <div style={{ display: "flex", gap: 15 }}>
                        <div style={{ flex: 1, padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.blue}`, borderRadius: 8 }}>
                            <h3 style={{ color: COLORS.blue, margin: "0 0 10px" }}>📅 Sugestão de Cronograma</h3>
                            <div style={{ fontSize: 13 }}><ReactMarkdown>{aiResult.cronograma || ""}</ReactMarkdown></div>
                        </div>

                        <div style={{ flex: 1, padding: 20, background: COLORS.surface, border: `1px solid ${COLORS.green}`, borderRadius: 8 }}>
                            <h3 style={{ color: COLORS.green, margin: "0 0 10px" }}>👥 Análise de Equipe (Cenários)</h3>
                            <div style={{ fontSize: 13 }}><ReactMarkdown>{aiResult.analise_equipes || ""}</ReactMarkdown></div>
                        </div>
                    </div>

                    <div style={{ padding: 20, background: COLORS.surface, border: `2px dashed ${COLORS.accent2}`, borderRadius: 8 }}>
                        <h3 style={{ color: COLORS.accent2, margin: "0 0 10px" }}>⚠️ Checklist de Riscos</h3>
                        <div style={{ fontSize: 14 }}><ReactMarkdown>{aiResult.riscos_checklist || ""}</ReactMarkdown></div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                {[
                    { label: "CLASSE A", items: classeA, color: COLORS.red, desc: "80% custo — MÁXIMA atenção" },
                    { label: "CLASSE B", items: classeB, color: COLORS.accent, desc: "15% custo — ATENÇÃO normal" },
                    { label: "CLASSE C", items: classeC, color: COLORS.green, desc: "5% custo — MONITORAR" },
                ].map((c) => {
                    const cTotal = c.items.reduce((s, r) => s + r.tot, 0);
                    const cPct = total > 0 ? ((cTotal / total) * 100).toFixed(1) : 0;
                    return (
                        <div
                            key={c.label}
                            style={{
                                background: COLORS.surface,
                                border: `1px solid ${c.color}30`,
                                borderRadius: 8,
                                padding: 12,
                            }}
                        >
                            <div style={{ fontSize: 14, fontWeight: 700, color: c.color, fontFamily: FONTS.mono }}>
                                {c.label}
                            </div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, fontFamily: FONTS.mono, margin: "4px 0" }}>
                                {c.items.length} {c.items.length === 1 ? "item" : "itens"}
                            </div>
                            <div style={{ fontSize: 15, color: COLORS.accent2, fontFamily: FONTS.mono }}>
                                {formatCurrency(cTotal)} ({cPct}%)
                            </div>
                            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                                {c.desc}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Ranking Table */}
            <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Rank", "Classe", "Item", "Descrição", "Custo Total", "% Unit.", "% Acum."].map((h, i) => (
                                <th
                                    key={i}
                                    style={{
                                        padding: "6px 8px",
                                        textAlign: i >= 4 ? "right" : "left",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: COLORS.accent,
                                        background: COLORS.surface,
                                        borderBottom: `1px solid ${COLORS.border}`,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ranked.map((r) => (
                            <tr key={r.id} style={{ background: classeBg[r.classe] }}>
                                <td style={{ padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, fontFamily: FONTS.mono, fontWeight: 700 }}>
                                    {r.rank}º
                                </td>
                                <td style={{ padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}` }}>
                                    <span style={{
                                        fontSize: 13,
                                        fontWeight: 800,
                                        color: classeColors[r.classe],
                                        background: classeColors[r.classe] + "20",
                                        padding: "2px 8px",
                                        borderRadius: 4,
                                        fontFamily: FONTS.mono,
                                    }}>
                                        {r.classe}
                                    </span>
                                </td>
                                <td style={{ padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, fontFamily: FONTS.mono, color: COLORS.textDim }}>
                                    {r.n}
                                </td>
                                <td style={{ padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 }}>
                                    {r.d}
                                </td>
                                <td style={{ padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, fontWeight: 600, color: COLORS.accent2 }}>
                                    {formatCurrency(r.tot)}
                                </td>
                                <td style={{ padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.textDim }}>
                                    {r.pct.toFixed(1)}%
                                </td>
                                <td style={{ padding: "5px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, fontWeight: r.accPct <= 80 ? 700 : 400, color: r.accPct <= 80 ? COLORS.red : COLORS.textDim }}>
                                    {r.accPct.toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                        <tr style={{ background: COLORS.surface }}>
                            <td colSpan={4} style={{ padding: "6px 8px", fontSize: 14, fontWeight: 700, borderTop: `2px solid ${COLORS.accent}` }}>TOTAL</td>
                            <td style={{ padding: "6px 8px", fontSize: 15, fontWeight: 800, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.accent, borderTop: `2px solid ${COLORS.accent}` }}>
                                {formatCurrency(total)}
                            </td>
                            <td colSpan={2} style={{ padding: "6px 8px", fontSize: 14, fontWeight: 700, textAlign: "right", borderTop: `2px solid ${COLORS.accent}` }}>100%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Recommendations */}
            <div style={{ marginTop: 12, padding: 10, background: "rgba(59,130,246,0.08)", border: `1px solid rgba(59,130,246,0.2)`, borderRadius: 8, fontSize: 13, color: COLORS.textDim, lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: COLORS.blue, marginBottom: 4, fontSize: 14 }}>📌 Recomendações</div>
                <div>• <b>Classe A</b> ({classeA.length} itens = {total > 0 ? ((classeA.reduce((s, r) => s + r.tot, 0) / total) * 100).toFixed(0) : 0}%): Focar 50% do tempo técnico, qualidade máxima, inspeção rigorosa</div>
                <div>• <b>Classe B</b> ({classeB.length} itens): Atenção normal, 30% do tempo técnico</div>
                <div>• <b>Classe C</b> ({classeC.length} itens): Monitorar, 20% do tempo técnico, processo mais ágil</div>
            </div>
        </div>
    );
}
