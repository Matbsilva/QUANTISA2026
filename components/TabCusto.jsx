"use client";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculos";
import { NumericInput, TextInput } from "./Inputs";

const thS = { padding: "5px 6px", textAlign: "left", fontSize: 8, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.3px", background: "#1A1710", borderBottom: "1px solid #2A2520", whiteSpace: "nowrap" };
const tdS = { padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 10 };
const tdrS = { ...tdS, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.accent2 };
const totR = { background: "#1A1710" };

export default function TabCusto({ header, setHeader, ci, tc, itens, setTab, addI, uI, dI }) {
    return (
        <div>
            {/* Header fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 10, padding: 8, background: COLORS.surface, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                {[["nome", "Obra"], ["cliente", "Cliente"], ["prop", "Proponente"], ["data", "Data"], ["rev", "Rev"]].map(([k, lb]) => (
                    <div key={k}>
                        <label style={{ fontSize: 7, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{lb}</label>
                        <TextInput value={header[k]} onChange={(v) => setHeader((p) => ({ ...p, [k]: v }))} />
                    </div>
                ))}
            </div>

            {/* Stats cards */}
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                {[["Material", formatCurrency(tc.m), COLORS.accent], ["M.O.", formatCurrency(tc.mo), COLORS.blue], ["Equip", formatCurrency(tc.e), COLORS.purple], ["Total", formatCurrency(tc.t), COLORS.green]].map(([l, v, c], i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", padding: 8, background: COLORS.surface, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: c, fontFamily: FONTS.mono }}>{v}</div>
                        <div style={{ fontSize: 7, color: COLORS.textMuted, textTransform: "uppercase" }}>{l}</div>
                    </div>
                ))}
            </div>

            {/* Table or empty state */}
            {itens.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", border: `1px dashed ${COLORS.border}`, borderRadius: 8, color: COLORS.textMuted }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>📥</div>
                    <div style={{ fontSize: 12, marginBottom: 4 }}>Nenhum item</div>
                    <div style={{ fontSize: 10, marginBottom: 12 }}>
                        Use a aba <b style={{ color: COLORS.accent }}>Importar</b> para colar composições ou adicione manualmente.
                    </div>
                    <button onClick={() => setTab("importar")} style={{ padding: "6px 16px", borderRadius: 5, border: "none", background: COLORS.accent, color: COLORS.bg, fontSize: 10, fontWeight: 600, cursor: "pointer", marginRight: 8 }}>Importar</button>
                    <button onClick={addI} style={{ padding: "6px 16px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 10, cursor: "pointer" }}>+ Manual</button>
                </div>
            ) : (
                <div>
                    <div style={{ overflowX: "auto", border: `1px solid ${COLORS.border}`, borderRadius: 6, marginBottom: 8 }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["#", "Descrição", "Un", "Qtd", "Mat/un", "MO/un", "Eq/un", "HH P", "HH A", "Mat Tot", "MO Tot", "Eq Tot", "TOTAL", ""].map((h, i) => (
                                        <th key={i} style={{ ...thS, minWidth: h === "Descrição" ? 130 : h === "" ? 16 : h === "#" ? 20 : 48 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ci.map((it) => (
                                    <tr key={it.id}>
                                        <td style={tdS}><TextInput value={it.n} onChange={(v) => uI(it.id, "n", v)} w="20px" /></td>
                                        <td style={tdS}><TextInput value={it.d} onChange={(v) => uI(it.id, "d", v)} placeholder="Descrição..." /></td>
                                        <td style={tdS}><TextInput value={it.u} onChange={(v) => uI(it.id, "u", v)} w="28px" /></td>
                                        <td style={tdS}><NumericInput value={it.q} onChange={(v) => uI(it.id, "q", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.m} onChange={(v) => uI(it.id, "m", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.mo} onChange={(v) => uI(it.id, "mo", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.e} onChange={(v) => uI(it.id, "e", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.hp} onChange={(v) => uI(it.id, "hp", v)} /></td>
                                        <td style={tdS}><NumericInput value={it.ha} onChange={(v) => uI(it.id, "ha", v)} /></td>
                                        <td style={tdrS}>{formatCurrency(it.mT)}</td>
                                        <td style={tdrS}>{formatCurrency(it.moT)}</td>
                                        <td style={tdrS}>{formatCurrency(it.eT)}</td>
                                        <td style={{ ...tdrS, fontWeight: 700, color: COLORS.accent }}>{formatCurrency(it.tot)}</td>
                                        <td style={tdS}><span onClick={() => dI(it.id)} style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 8 }}>✕</span></td>
                                    </tr>
                                ))}
                                <tr style={totR}>
                                    <td colSpan={9} style={{ ...tdS, textAlign: "right", fontWeight: 700, color: COLORS.accent, fontSize: 9 }}>TOTAL</td>
                                    <td style={{ ...tdrS, fontWeight: 700 }}>{formatCurrency(tc.m)}</td>
                                    <td style={{ ...tdrS, fontWeight: 700 }}>{formatCurrency(tc.mo)}</td>
                                    <td style={{ ...tdrS, fontWeight: 700 }}>{formatCurrency(tc.e)}</td>
                                    <td style={{ ...tdrS, fontWeight: 800, fontSize: 12, color: COLORS.accent }}>{formatCurrency(tc.t)}</td>
                                    <td style={tdS} />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button onClick={() => setTab("importar")} style={{ padding: "5px 12px", borderRadius: 5, border: "none", background: COLORS.accent, color: COLORS.bg, fontSize: 10, fontWeight: 600, cursor: "pointer", marginRight: 6 }}>Importar</button>
                    <button onClick={addI} style={{ padding: "5px 12px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 10, cursor: "pointer" }}>+ Manual</button>
                </div>
            )}
        </div>
    );
}
