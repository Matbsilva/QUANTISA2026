"use client";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/calculos";
import { NumericInput, TextInput } from "./Inputs";

const thS = { padding: "5px 6px", textAlign: "left", fontSize: 12, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.3px", background: "#1A1710", borderBottom: "1px solid #2A2520", whiteSpace: "nowrap" };
const tdS = { padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 };
const tdrS = { ...tdS, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.accent2 };
const totR = { background: "#1A1710" };

function exportCostCSV(ci, header) {
    const rows = [
        ["#", "Descrição", "Un", "Qtd", "Mat/un", "MO/un", "Eq/un", "HH Prof", "HH Aju", "Mat Total", "MO Total", "Eq Total", "HH Prof Total", "HH Aju Total", "TOTAL"],
    ];
    ci.forEach((it, i) => {
        rows.push([
            i + 1,
            it.d,
            it.u,
            it.q,
            it.m.toFixed(2),
            it.mo.toFixed(2),
            it.e.toFixed(2),
            it.hp.toFixed(2),
            it.ha.toFixed(2),
            it.mT.toFixed(2),
            it.moT.toFixed(2),
            it.eT.toFixed(2),
            (it.hp * it.q).toFixed(2),
            (it.ha * it.q).toFixed(2),
            it.tot.toFixed(2),
        ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `custo-${header.nome || "orcamento"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function TabCusto({ header, setHeader, ci, tc, itens, setTab, addI, uI, dI }) {
    return (
        <div>
            {/* Header fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 10, padding: 8, background: COLORS.surface, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                {[["nome", "Obra"], ["cliente", "Cliente"], ["prop", "Proponente"], ["data", "Data"], ["rev", "Rev"]].map(([k, lb]) => (
                    <div key={k}>
                        <label style={{ fontSize: 9, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{lb}</label>
                        <TextInput value={header[k]} onChange={(v) => setHeader((p) => ({ ...p, [k]: v }))} />
                    </div>
                ))}
            </div>

            {/* Stats cards */}
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                {[["Material", formatCurrency(tc.m), COLORS.accent], ["M.O.", formatCurrency(tc.mo), COLORS.blue], ["Equip", formatCurrency(tc.e), COLORS.purple], ["HH Prof", formatNumber(tc.hp) + " hh", COLORS.green], ["HH Aju", formatNumber(tc.ha) + " hh", COLORS.green], ["Total", formatCurrency(tc.t), COLORS.accent]].map(([l, v, c], i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", padding: 8, background: COLORS.surface, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: i === 5 ? 17 : 15, fontWeight: 700, color: c, fontFamily: FONTS.mono }}>{v}</div>
                        <div style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase" }}>{l}</div>
                    </div>
                ))}
            </div>

            {/* Table or empty state */}
            {itens.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", border: `1px dashed ${COLORS.border}`, borderRadius: 8, color: COLORS.textMuted }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>📥</div>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>Nenhum item</div>
                    <div style={{ fontSize: 14, marginBottom: 12 }}>
                        Use a aba <b style={{ color: COLORS.accent }}>Importar</b> para colar composições ou adicione manualmente.
                    </div>
                    <button onClick={() => setTab("importar")} style={{ padding: "6px 16px", borderRadius: 5, border: "none", background: COLORS.accent, color: COLORS.bg, fontSize: 14, fontWeight: 600, cursor: "pointer", marginRight: 8 }}>Importar</button>
                    <button onClick={addI} style={{ padding: "6px 16px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 14, cursor: "pointer" }}>+ Manual</button>
                </div>
            ) : (
                <div>
                    {/* Wide scrollable table */}
                    <div style={{ overflowX: "auto", border: `1px solid ${COLORS.border}`, borderRadius: 6, marginBottom: 8 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1200 }}>
                            <thead>
                                <tr>
                                    {[
                                        ["#", 28],
                                        ["Descrição", 280],   // ← wider
                                        ["Un", 34],
                                        ["Qtd", 55],
                                        ["Mat/un", 60],    // ← narrower
                                        ["MO/un", 60],
                                        ["Eq/un", 60],
                                        ["HH P", 55],
                                        ["HH A", 55],
                                        ["Mat Tot", 95],    // ← wider totals
                                        ["MO Tot", 95],
                                        ["Eq Tot", 85],
                                        ["HH P Tot", 80],
                                        ["HH A Tot", 80],
                                        ["TOTAL", 110],
                                        ["", 20],
                                    ].map(([h, w], i) => (
                                        <th key={i} style={{ ...thS, minWidth: w, width: w }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ci.map((it, idx) => (
                                    <tr key={it.id}>
                                        {/* # auto-numbered */}
                                        <td style={{ ...tdS, color: COLORS.textMuted, textAlign: "center", fontSize: 12 }}>{idx + 1}</td>
                                        <td style={tdS}><TextInput value={it.d} onChange={(v) => uI(it.id, "d", v)} placeholder="Descrição..." /></td>
                                        <td style={tdS}><TextInput value={it.u} onChange={(v) => uI(it.id, "u", v)} w="34px" /></td>
                                        <td style={tdS}><NumericInput value={it.q} onChange={(v) => uI(it.id, "q", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.m} onChange={(v) => uI(it.id, "m", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.mo} onChange={(v) => uI(it.id, "mo", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.e} onChange={(v) => uI(it.id, "e", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.hp} onChange={(v) => uI(it.id, "hp", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.ha} onChange={(v) => uI(it.id, "ha", v)} /></td>
                                        {/* Totals */}
                                        <td style={tdrS}>{formatCurrency(it.mT)}</td>
                                        <td style={tdrS}>{formatCurrency(it.moT)}</td>
                                        <td style={tdrS}>{formatCurrency(it.eT)}</td>
                                        <td style={{ ...tdrS, color: COLORS.green }}>{formatNumber(it.hp * it.q)}</td>
                                        <td style={{ ...tdrS, color: COLORS.green }}>{formatNumber(it.ha * it.q)}</td>
                                        <td style={{ ...tdrS, fontWeight: 700, color: COLORS.accent }}>{formatCurrency(it.tot)}</td>
                                        <td style={tdS}><span onClick={() => dI(it.id)} style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 12 }}>✕</span></td>
                                    </tr>
                                ))}
                                {/* Totals row */}
                                <tr style={totR}>
                                    <td colSpan={9} style={{ ...tdS, textAlign: "right", fontWeight: 700, color: COLORS.accent, fontSize: 13 }}>TOTAL</td>
                                    <td style={{ ...tdrS, fontWeight: 700 }}>{formatCurrency(tc.m)}</td>
                                    <td style={{ ...tdrS, fontWeight: 700 }}>{formatCurrency(tc.mo)}</td>
                                    <td style={{ ...tdrS, fontWeight: 700 }}>{formatCurrency(tc.e)}</td>
                                    <td style={{ ...tdrS, fontWeight: 700, color: COLORS.green }}>{formatNumber(tc.hp)}</td>
                                    <td style={{ ...tdrS, fontWeight: 700, color: COLORS.green }}>{formatNumber(tc.ha)}</td>
                                    <td style={{ ...tdrS, fontWeight: 800, fontSize: 16, color: COLORS.accent }}>{formatCurrency(tc.t)}</td>
                                    <td style={tdS} />
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Action buttons row */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <button onClick={() => setTab("importar")} style={{ padding: "5px 12px", borderRadius: 5, border: "none", background: COLORS.accent, color: COLORS.bg, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Importar</button>
                        <button onClick={addI} style={{ padding: "5px 12px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 14, cursor: "pointer" }}>+ Manual</button>
                        {/* Export custo button */}
                        <button
                            onClick={() => exportCostCSV(ci, header)}
                            style={{ padding: "5px 12px", borderRadius: 5, border: `1px solid ${COLORS.green}`, background: "transparent", color: COLORS.green, fontSize: 14, cursor: "pointer", marginLeft: "auto" }}
                        >
                            ⬇ Exportar CSV Custo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
