"use client";
import { useState, useMemo } from "react";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculos";

/**
 * Aba Exportar — Gera planilha de preço de venda em Excel (CSV)
 */
export default function TabExportar({ ci, tc, tmf, equipes, oc, header }) {
    const [markupMode, setMarkupMode] = useState("proporcional"); // proporcional | uniforme | abc
    const [markupUniforme, setMarkupUniforme] = useState(25);

    // Compute ABC ranking for ABC-based markup
    const ranked = useMemo(() => {
        if (!ci || ci.length === 0) return [];
        const sorted = [...ci]
            .map((it) => ({ ...it, tot: (it.m + it.mo + it.e) * it.q }))
            .sort((a, b) => b.tot - a.tot);
        const total = sorted.reduce((s, it) => s + it.tot, 0);
        if (total === 0) return [];
        let acc = 0;
        return sorted.map((it) => {
            const pct = (it.tot / total) * 100;
            acc += pct;
            let classe = "C";
            if (acc <= 80) classe = "A";
            else if (acc <= 95) classe = "B";
            return { ...it, classe };
        });
    }, [ci]);

    // Markup per item based on mode
    const getMarkup = (item) => {
        if (markupMode === "uniforme") return markupUniforme;
        if (markupMode === "abc") {
            const r = ranked.find((x) => x.id === item.id);
            if (!r) return 25;
            if (r.classe === "A") return 23;
            if (r.classe === "B") return 35;
            return 40; // Classe C
        }
        // Proporcional (default)
        const r = ranked.find((x) => x.id === item.id);
        if (!r) return 25;
        if (r.classe === "A") return 23;
        if (r.classe === "B") return 35;
        return 40;
    };

    // Build pricing table
    const pricing = useMemo(() => {
        return ci.map((it) => {
            const custo = (it.m + it.mo + it.e) * it.q;
            const mkp = getMarkup(it);
            const mkpVal = custo * (mkp / 100);
            const venda = custo + mkpVal;
            return { ...it, custo, mkp, mkpVal, venda };
        });
    }, [ci, markupMode, markupUniforme, ranked]);

    const totalCusto = pricing.reduce((s, p) => s + p.custo, 0);
    const totalVenda = pricing.reduce((s, p) => s + p.venda, 0);
    const markupMedio = totalCusto > 0 ? ((totalVenda - totalCusto) / totalCusto) * 100 : 0;

    // MO total from equipes
    const moEquipes = equipes.reduce((s, g) => s + g.l.reduce((s2, f) => s2 + f.d * f.p * f.di, 0), 0);
    const tOc = oc.reduce((s, o) => s + o.q * o.v, 0);

    // Export CSV
    const exportCSV = () => {
        const BOM = "\uFEFF";
        let csv = BOM;
        csv += `PLANILHA DE PREÇO DE VENDA\n`;
        csv += `Projeto:;${header?.nome || ""}\n`;
        csv += `Cliente:;${header?.cliente || ""}\n`;
        csv += `Data:;${header?.data || ""}\n`;
        csv += `Revisão:;${header?.rev || ""}\n\n`;
        csv += `Item;Descrição;Un;Qtd;Mat/Un;MO/Un;Eq/Un;Custo Unit;Custo Total;Markup %;Markup R$;PREÇO VENDA\n`;

        pricing.forEach((p) => {
            const custoUnit = p.m + p.mo + p.e;
            csv += `${p.n};${p.d};${p.u};${p.q};${p.m.toFixed(2)};${p.mo.toFixed(2)};${p.e.toFixed(2)};${custoUnit.toFixed(2)};${p.custo.toFixed(2)};${p.mkp}%;${p.mkpVal.toFixed(2)};${p.venda.toFixed(2)}\n`;
        });

        csv += `\n;;;;;;;;;TOTAL ITENS:;${(totalVenda - totalCusto).toFixed(2)};${totalVenda.toFixed(2)}\n`;
        csv += `\n`;
        csv += `RESUMO FINANCEIRO\n`;
        csv += `Custo Direto Itens;${totalCusto.toFixed(2)}\n`;
        csv += `M.O. Equipes;${moEquipes.toFixed(2)}\n`;
        csv += `Outros Custos;${tOc.toFixed(2)}\n`;
        csv += `Materiais Fixos;${tmf.toFixed(2)}\n`;
        csv += `CUSTO TOTAL;${(totalCusto + moEquipes + tOc + tmf).toFixed(2)}\n`;
        csv += `Markup Médio;${markupMedio.toFixed(1)}%\n`;
        csv += `PREÇO DE VENDA;${totalVenda.toFixed(2)}\n`;

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(header?.nome || "orcamento").replace(/\s+/g, "_")}_preco_venda.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (ci.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📤</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Exportar</div>
                <div style={{ fontSize: 15, marginTop: 6 }}>Adicione itens na aba Custo primeiro.</div>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0, fontFamily: FONTS.mono }}>
                    📤 Exportar — Preço de Venda
                </h2>
                <button
                    onClick={exportCSV}
                    style={{
                        padding: "8px 20px",
                        borderRadius: 6,
                        border: "none",
                        background: `linear-gradient(135deg, ${COLORS.green}, #16A34A)`,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    📥 Baixar Excel (CSV)
                </button>
            </div>

            {/* Markup Mode Selector */}
            <div style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                padding: 10,
                background: COLORS.surface,
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                alignItems: "center",
            }}>
                <span style={{ fontSize: 14, color: COLORS.textDim, marginRight: 4 }}>Modo de Markup:</span>
                {[
                    { id: "proporcional", label: "ABC Proporcional", desc: "A=23% B=35% C=40%" },
                    { id: "uniforme", label: "Uniforme", desc: `${markupUniforme}% tudo` },
                    { id: "abc", label: "ABC Inverso", desc: "A=23% B=35% C=40%" },
                ].map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setMarkupMode(mode.id)}
                        style={{
                            padding: "4px 12px",
                            borderRadius: 4,
                            border: markupMode === mode.id ? `1px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`,
                            background: markupMode === mode.id ? COLORS.accent + "20" : "transparent",
                            color: markupMode === mode.id ? COLORS.accent : COLORS.textDim,
                            fontSize: 13,
                            fontWeight: markupMode === mode.id ? 700 : 400,
                            cursor: "pointer",
                        }}
                    >
                        {mode.label}
                    </button>
                ))}
                {markupMode === "uniforme" && (
                    <input
                        type="number"
                        value={markupUniforme}
                        onChange={(e) => setMarkupUniforme(Number(e.target.value))}
                        style={{
                            width: 50,
                            padding: "3px 6px",
                            background: COLORS.bg,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 4,
                            color: COLORS.text,
                            fontSize: 14,
                            fontFamily: FONTS.mono,
                            textAlign: "center",
                        }}
                    />
                )}
            </div>

            {/* Pricing Table */}
            <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Item", "Descrição", "Custo Direto", "Markup %", "Markup R$", "PREÇO VENDA", "% Total"].map((h, i) => (
                                <th key={i} style={{
                                    padding: "6px 8px",
                                    textAlign: i >= 2 ? "right" : "left",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: COLORS.accent,
                                    background: COLORS.surface,
                                    borderBottom: `1px solid ${COLORS.border}`,
                                    textTransform: "uppercase",
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pricing.map((p) => (
                            <tr key={p.id}>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, fontFamily: FONTS.mono }}>{p.n}</td>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 }}>{p.d}</td>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.textDim }}>{formatCurrency(p.custo)}</td>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.blue }}>{p.mkp}%</td>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.green }}>{formatCurrency(p.mkpVal)}</td>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 15, textAlign: "right", fontFamily: FONTS.mono, fontWeight: 700, color: COLORS.accent }}>{formatCurrency(p.venda)}</td>
                                <td style={{ padding: "4px 8px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.textMuted }}>
                                    {totalVenda > 0 ? ((p.venda / totalVenda) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                        ))}
                        <tr style={{ background: COLORS.surface }}>
                            <td colSpan={2} style={{ padding: "6px 8px", fontSize: 14, fontWeight: 700, borderTop: `2px solid ${COLORS.accent}` }}>TOTAL</td>
                            <td style={{ padding: "6px 8px", fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, fontWeight: 600, borderTop: `2px solid ${COLORS.accent}` }}>{formatCurrency(totalCusto)}</td>
                            <td style={{ padding: "6px 8px", fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, fontWeight: 600, color: COLORS.blue, borderTop: `2px solid ${COLORS.accent}` }}>{markupMedio.toFixed(1)}%</td>
                            <td style={{ padding: "6px 8px", fontSize: 14, textAlign: "right", fontFamily: FONTS.mono, fontWeight: 600, color: COLORS.green, borderTop: `2px solid ${COLORS.accent}` }}>{formatCurrency(totalVenda - totalCusto)}</td>
                            <td style={{ padding: "6px 8px", fontSize: 16, textAlign: "right", fontFamily: FONTS.mono, fontWeight: 800, color: COLORS.accent, borderTop: `2px solid ${COLORS.accent}` }}>{formatCurrency(totalVenda)}</td>
                            <td style={{ padding: "6px 8px", fontSize: 14, textAlign: "right", fontWeight: 700, borderTop: `2px solid ${COLORS.accent}` }}>100%</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
            }}>
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Custo Direto</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.textDim, fontFamily: FONTS.mono }}>{formatCurrency(totalCusto)}</div>
                </div>
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.green}30`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Lucro Bruto</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.green, fontFamily: FONTS.mono }}>{formatCurrency(totalVenda - totalCusto)}</div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted }}>{markupMedio.toFixed(1)}%</div>
                </div>
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.accent}30`, borderRadius: 8, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 4 }}>Preço de Venda</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent, fontFamily: FONTS.mono }}>{formatCurrency(totalVenda)}</div>
                </div>
            </div>
        </div>
    );
}
