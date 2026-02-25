"use client";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculos";
import { NumericInput, TextInput } from "./Inputs";

export default function TabHistograma({ equipes, setEquipes, tc, oc, setOc, addOC, dOC }) {
    const addG = () => {
        setEquipes((p) => [
            ...p,
            { id: "e" + Date.now(), g: "NOVO GRUPO", l: [{ f: "Função", d: 0, p: 0, di: 0 }] },
        ]);
    };
    const addF = (gid) => {
        setEquipes((p) =>
            p.map((g) =>
                g.id === gid
                    ? { ...g, l: [...g.l, { f: "Nova Função", d: 0, p: 0, di: 0 }] }
                    : g
            )
        );
    };
    const delG = (gid) => setEquipes((p) => p.filter((g) => g.id !== gid));
    const delF = (gid, fi) => {
        setEquipes((p) =>
            p.map((g) =>
                g.id === gid ? { ...g, l: g.l.filter((_, i) => i !== fi) } : g
            )
        );
    };
    const uF = (gid, fi, key, val) => {
        setEquipes((p) =>
            p.map((g) =>
                g.id === gid
                    ? { ...g, l: g.l.map((f, i) => (i === fi ? { ...f, [key]: val } : f)) }
                    : g
            )
        );
    };
    const uG = (gid, val) =>
        setEquipes((p) => p.map((g) => (g.id === gid ? { ...g, g: val } : g)));

    const moTotal = equipes.reduce(
        (s, g) => s + g.l.reduce((s2, f) => s2 + f.d * f.p * f.di, 0),
        0
    );
    const tOc = oc.reduce((s, o) => s + o.q * o.v, 0);
    const hhSug = tc.hp > 0 ? Math.ceil(tc.hp / 8) : null;

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, fontFamily: FONTS.mono }}>Histograma de Equipe</h2>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.blue, fontFamily: FONTS.mono }}>{formatCurrency(moTotal)}</div>
                        <div style={{ fontSize: 7, color: COLORS.textMuted }}>M.O. EQUIPES</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.purple, fontFamily: FONTS.mono }}>{formatCurrency(tOc)}</div>
                        <div style={{ fontSize: 7, color: COLORS.textMuted }}>OUTROS CUSTOS</div>
                    </div>
                </div>
            </div>

            {/* HH suggestion */}
            {hhSug && (
                <div style={{ padding: 8, background: "rgba(59,130,246,0.08)", border: `1px solid rgba(59,130,246,0.2)`, borderRadius: 6, marginBottom: 10, fontSize: 9, color: COLORS.blue }}>
                    💡 A aba Custo indica <b>{tc.hp.toFixed(2)} HH Prof</b> e <b>{tc.ha.toFixed(2)} HH Aju</b>.
                    Sugestão: ~{hhSug} dias para 1 profissional.
                </div>
            )}

            {/* Equipes */}
            {equipes.map((g) => (
                <div key={g.id} style={{ marginBottom: 12, border: `1px solid ${COLORS.border}`, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", background: "#1A1710" }}>
                        <TextInput value={g.g} onChange={(v) => uG(g.id, v)} w="150px" />
                        <span onClick={() => delG(g.id)} style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 9 }}>✕ Grupo</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {["Função", "Diária R$", "Pessoas", "Dias", "Total", ""].map((h, i) => (
                                    <th key={i} style={{ padding: "4px 5px", textAlign: "left", fontSize: 8, fontWeight: 700, color: COLORS.accent, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {g.l.map((f, fi) => (
                                <tr key={fi}>
                                    <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><TextInput value={f.f} onChange={(v) => uF(g.id, fi, "f", v)} w="120px" /></td>
                                    <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><NumericInput value={f.d} onChange={(v) => uF(g.id, fi, "d", v)} /></td>
                                    <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><NumericInput value={f.p} onChange={(v) => uF(g.id, fi, "p", v)} /></td>
                                    <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><NumericInput value={f.di} onChange={(v) => uF(g.id, fi, "di", v)} /></td>
                                    <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.accent2, fontSize: 10 }}>{formatCurrency(f.d * f.p * f.di)}</td>
                                    <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><span onClick={() => delF(g.id, fi)} style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 8 }}>✕</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ padding: "4px 8px" }}>
                        <button onClick={() => addF(g.id)} style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 9, cursor: "pointer" }}>+ Função</button>
                    </div>
                </div>
            ))}
            <button onClick={addG} style={{ padding: "5px 12px", borderRadius: 5, border: "none", background: COLORS.blue, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>+ Grupo</button>

            {/* Outros Custos */}
            <h3 style={{ fontSize: 12, fontWeight: 700, margin: "16px 0 6px", fontFamily: FONTS.mono, color: COLORS.purple }}>Outros Custos de M.O.</h3>
            <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, marginBottom: 8 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Descrição", "Un", "Qtd", "Valor Un", "Total", ""].map((h, i) => (
                                <th key={i} style={{ padding: "4px 5px", textAlign: "left", fontSize: 8, fontWeight: 700, color: COLORS.purple, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, textTransform: "uppercase" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {oc.map((o) => (
                            <tr key={o.id}>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><TextInput value={o.d} onChange={(v) => setOc((p) => p.map((x) => x.id === o.id ? { ...x, d: v } : x))} /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><TextInput value={o.u} onChange={(v) => setOc((p) => p.map((x) => x.id === o.id ? { ...x, u: v } : x))} w="40px" /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><NumericInput value={o.q} onChange={(v) => setOc((p) => p.map((x) => x.id === o.id ? { ...x, q: v } : x))} /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><NumericInput value={o.v} onChange={(v) => setOc((p) => p.map((x) => x.id === o.id ? { ...x, v: v } : x))} /></td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.accent2, fontSize: 10 }}>{formatCurrency(o.q * o.v)}</td>
                                <td style={{ padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}` }}><span onClick={() => dOC(o.id)} style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 8 }}>✕</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={addOC} style={{ padding: "5px 12px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 10, cursor: "pointer" }}>+ Custo</button>
        </div>
    );
}
