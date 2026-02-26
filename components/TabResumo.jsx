"use client";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculos";
import { NumericInput, TextInput } from "./Inputs";

export default function TabResumo({ resumoFix, setResumoFix, tc, tmf, equipes, oc }) {
    const moTotal = equipes.reduce((s, g) => s + g.l.reduce((s2, f) => s2 + f.d * f.p * f.di, 0), 0);
    const tOc = oc.reduce((s, o) => s + o.q * o.v, 0);
    const rFix = resumoFix.reduce((s, o) => s + o.q * o.v, 0);

    // Proportional distribution of fix costs
    const base = tc.t > 0 ? tc.t : 1;
    const itensRes = tc.ci ? tc.ci.map((it) => ({
        ...it,
        propFix: tc.t > 0 ? (it.tot / base) * rFix : 0,
        propMOH: tc.t > 0 ? (it.tot / base) * (moTotal + tOc) : 0,
        propMat: tc.t > 0 ? (it.tot / base) * tmf : 0,
    })) : [];

    const gTotal = tc.t + rFix + moTotal + tOc + tmf;

    const addRF = () =>
        setResumoFix((p) => [
            ...p,
            { id: "r" + Date.now(), n: "", d: "", u: "un", q: 1, v: 0 },
        ]);
    const dRF = (id) => setResumoFix((p) => p.filter((x) => x.id !== id));

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0, fontFamily: FONTS.mono }}>Resumo</h2>
                <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.accent, fontFamily: FONTS.mono }}>
                    {formatCurrency(gTotal)}
                </div>
            </div>

            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 12 }}>
                {[
                    ["Composições", tc.t, COLORS.accent],
                    ["Materiais Fix", tmf, COLORS.accent2],
                    ["M.O. Equipes", moTotal + tOc, COLORS.blue],
                    ["Itens Resumo", rFix, COLORS.purple],
                ].map(([l, v, c], i) => (
                    <div key={i} style={{ textAlign: "center", padding: 8, background: COLORS.surface, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: c, fontFamily: FONTS.mono }}>{formatCurrency(v)}</div>
                        <div style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase" }}>{l}</div>
                    </div>
                ))}
            </div>

            {/* Fixed items */}
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: COLORS.purple }}>Itens Fixos Resumo</h3>
            <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, marginBottom: 8, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["#", "Descrição", "Un", "Qtd", "Valor", "Total", ""].map((h, i) => (
                                <th key={i} style={{ padding: "4px 5px", textAlign: "left", fontSize: 12, fontWeight: 700, color: COLORS.purple, background: "#1A1710", borderBottom: `1px solid ${COLORS.border}`, textTransform: "uppercase" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {resumoFix.map((r) => (
                            <tr key={r.id}>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><TextInput value={r.n} onChange={(v) => setResumoFix((p) => p.map((x) => x.id === r.id ? { ...x, n: v } : x))} w="40px" /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><TextInput value={r.d} onChange={(v) => setResumoFix((p) => p.map((x) => x.id === r.id ? { ...x, d: v } : x))} /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><TextInput value={r.u} onChange={(v) => setResumoFix((p) => p.map((x) => x.id === r.id ? { ...x, u: v } : x))} w="35px" /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><NumericInput value={r.q} onChange={(v) => setResumoFix((p) => p.map((x) => x.id === r.id ? { ...x, q: v } : x))} /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><NumericInput value={r.v} onChange={(v) => setResumoFix((p) => p.map((x) => x.id === r.id ? { ...x, v: v } : x))} /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.accent2, fontSize: 14 }}>{formatCurrency(r.q * r.v)}</td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><span onClick={() => dRF(r.id)} style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 12 }}>✕</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={addRF} style={{ padding: "5px 12px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 14, cursor: "pointer", marginBottom: 12 }}>+ Item</button>

            {/* Proportional distribution table */}
            {itensRes.length > 0 && (
                <>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: COLORS.accent }}>Distribuição Proporcional</h3>
                    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["Item", "Descrição", "Custo Dir.", "Fix Prop.", "M.O. Prop.", "Mat Prop.", "TOTAL"].map((h, i) => (
                                        <th key={i} style={{ padding: "4px 5px", textAlign: i > 1 ? "right" : "left", fontSize: 12, fontWeight: 700, color: COLORS.accent, background: "#1A1710", borderBottom: `1px solid ${COLORS.border}`, textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {itensRes.map((it) => (
                                    <tr key={it.id}>
                                        <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13, fontFamily: FONTS.mono, color: COLORS.accent }}>{it.n}</td>
                                        <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>{it.d?.substring(0, 40)}</td>
                                        <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontSize: 13, fontFamily: FONTS.mono, color: COLORS.textDim }}>{formatCurrency(it.tot)}</td>
                                        <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontSize: 13, fontFamily: FONTS.mono, color: COLORS.purple }}>{formatCurrency(it.propFix)}</td>
                                        <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontSize: 13, fontFamily: FONTS.mono, color: COLORS.blue }}>{formatCurrency(it.propMOH)}</td>
                                        <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontSize: 13, fontFamily: FONTS.mono, color: COLORS.accent2 }}>{formatCurrency(it.propMat)}</td>
                                        <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontSize: 14, fontFamily: FONTS.mono, fontWeight: 700, color: COLORS.accent }}>{formatCurrency(it.tot + it.propFix + it.propMOH + it.propMat)}</td>
                                    </tr>
                                ))}
                                <tr style={{ background: "#1A1710" }}>
                                    <td colSpan={2} style={{ padding: "5px", fontSize: 14, fontWeight: 700, color: COLORS.accent }}>TOTAL</td>
                                    <td style={{ padding: "5px", textAlign: "right", fontSize: 14, fontFamily: FONTS.mono, fontWeight: 700 }}>{formatCurrency(tc.t)}</td>
                                    <td style={{ padding: "5px", textAlign: "right", fontSize: 14, fontFamily: FONTS.mono, fontWeight: 700, color: COLORS.purple }}>{formatCurrency(rFix)}</td>
                                    <td style={{ padding: "5px", textAlign: "right", fontSize: 14, fontFamily: FONTS.mono, fontWeight: 700, color: COLORS.blue }}>{formatCurrency(moTotal + tOc)}</td>
                                    <td style={{ padding: "5px", textAlign: "right", fontSize: 14, fontFamily: FONTS.mono, fontWeight: 700, color: COLORS.accent2 }}>{formatCurrency(tmf)}</td>
                                    <td style={{ padding: "5px", textAlign: "right", fontSize: 16, fontFamily: FONTS.mono, fontWeight: 800, color: COLORS.accent }}>{formatCurrency(gTotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
