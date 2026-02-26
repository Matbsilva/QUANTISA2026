"use client";
import { useState } from "react";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculos";
import { NumericInput, TextInput } from "./Inputs";

export default function TabHistograma({ equipes, setEquipes, tc, oc, setOc, addOC, dOC, itens }) {
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [aiCenarios, setAiCenarios] = useState(null);

    // --- Equipe Handlers ---
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

    // --- Computed ---
    const moTotal = equipes.reduce(
        (s, g) => s + g.l.reduce((s2, f) => s2 + f.d * f.p * f.di, 0),
        0
    );
    const tOc = oc.reduce((s, o) => s + o.q * o.v, 0);

    // --- Equipe Padrão Auto-Calc ---
    const diasProfPadrao = tc.hp > 0 ? Math.ceil(tc.hp / (2 * 8)) : 0; // 2 profissionais × 8h
    const diasAjuPadrao = tc.ha > 0 ? Math.ceil(tc.ha / (2 * 8)) : 0; // 2 ajudantes × 8h
    const diasPadrao = Math.max(diasProfPadrao, diasAjuPadrao);
    const custoPadrao = diasPadrao > 0
        ? (185 * 2 * diasPadrao) + (165 * 2 * diasPadrao)
        : 0;

    // --- Apply Equipe Padrão ---
    const applyPadrao = () => {
        if (diasPadrao <= 0) return;
        setEquipes([
            {
                id: "ep_" + Date.now(),
                g: "EQUIPE PADRÃO",
                l: [
                    { f: "Profissional", d: 185, p: 2, di: diasPadrao },
                    { f: "Ajudante", d: 165, p: 2, di: diasPadrao },
                ],
            },
        ]);
    };

    // --- AI Suggestion ---
    const sugerirComIA = async () => {
        if (tc.hp <= 0 && tc.ha <= 0) {
            setAiError("Adicione itens na aba Custo primeiro (com HH).");
            return;
        }

        try {
            setAiLoading(true);
            setAiError(null);
            setAiCenarios(null);

            const res = await fetch("/api/ia/histograma", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    totalHHP: tc.hp,
                    totalHHA: tc.ha,
                    itens: (itens || []).map((i) => ({
                        d: i.d,
                        q: i.q,
                        u: i.u,
                        hp: i.hp,
                        ha: i.ha,
                    })),
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro na API");
            }

            const data = await res.json();
            setAiCenarios(data.cenarios || []);
        } catch (err) {
            setAiError(err.message || "Erro ao consultar IA");
        } finally {
            setAiLoading(false);
        }
    };

    // --- Apply AI Cenário ---
    const applyCenario = (cenario) => {
        const newEquipes = cenario.equipes.map((eq, idx) => ({
            id: "ai_" + Date.now() + "_" + idx,
            g: eq.grupo,
            l: eq.linhas.map((l) => ({
                f: l.funcao,
                d: l.diaria,
                p: l.pessoas,
                di: l.dias,
            })),
        }));
        setEquipes(newEquipes);
        setAiCenarios(null); // Close the panel
    };

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

            {/* Equipe Padrão Auto-Calc */}
            {tc.hp > 0 && (
                <div style={{
                    padding: 10,
                    background: "rgba(59,130,246,0.08)",
                    border: `1px solid rgba(59,130,246,0.2)`,
                    borderRadius: 8,
                    marginBottom: 10,
                    fontSize: 10,
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, color: COLORS.blue, fontFamily: FONTS.mono, fontSize: 11 }}>
                            📊 EQUIPE PADRÃO (2 Prof + 2 Aju)
                        </span>
                        <button
                            onClick={applyPadrao}
                            style={{
                                padding: "4px 12px",
                                background: COLORS.blue,
                                border: "none",
                                borderRadius: 4,
                                color: "#fff",
                                fontSize: 9,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Aplicar Padrão
                        </button>
                    </div>
                    <div style={{ color: COLORS.textDim, lineHeight: 1.6 }}>
                        HH Prof: <b style={{ color: COLORS.text }}>{tc.hp.toFixed(1)}</b> →{" "}
                        2 profissionais × <b style={{ color: COLORS.text }}>{diasProfPadrao}</b> dias
                        &nbsp;|&nbsp;
                        HH Aju: <b style={{ color: COLORS.text }}>{tc.ha.toFixed(1)}</b> →{" "}
                        2 ajudantes × <b style={{ color: COLORS.text }}>{diasAjuPadrao}</b> dias
                        <br />
                        Prazo: <b style={{ color: COLORS.accent }}>{diasPadrao} dias</b> &nbsp;|&nbsp;
                        Custo MO estimado: <b style={{ color: COLORS.accent }}>{formatCurrency(custoPadrao)}</b>
                    </div>
                </div>
            )}

            {/* AI Suggestion Button */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <button
                    onClick={sugerirComIA}
                    disabled={aiLoading || (tc.hp <= 0 && tc.ha <= 0)}
                    style={{
                        padding: "6px 16px",
                        borderRadius: 6,
                        border: "none",
                        background: aiLoading ? COLORS.textMuted : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
                        color: COLORS.bg,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: aiLoading ? "wait" : "pointer",
                        fontFamily: FONTS.sans,
                        opacity: (tc.hp <= 0 && tc.ha <= 0) ? 0.4 : 1,
                    }}
                >
                    {aiLoading ? "⏳ Gerando cenários..." : "🤖 Sugerir com IA (2 cenários)"}
                </button>
                <button onClick={addG} style={{ padding: "6px 12px", borderRadius: 5, border: "none", background: COLORS.blue, color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>+ Grupo</button>
            </div>

            {/* AI Error */}
            {aiError && (
                <div style={{
                    padding: 8,
                    background: COLORS.red + "15",
                    border: `1px solid ${COLORS.red}40`,
                    borderRadius: 6,
                    marginBottom: 10,
                    fontSize: 10,
                    color: COLORS.red,
                }}>
                    ⚠️ {aiError}
                </div>
            )}

            {/* AI Cenários Cards */}
            {aiCenarios && aiCenarios.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                    <h3 style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, fontFamily: FONTS.mono, marginBottom: 8 }}>
                        🤖 Cenários Sugeridos pela IA
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
                        {aiCenarios.map((c, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: COLORS.surface,
                                    border: `1px solid ${COLORS.border}`,
                                    borderRadius: 8,
                                    padding: 12,
                                }}
                            >
                                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, marginBottom: 6 }}>
                                    {c.nome}
                                </div>
                                {c.descricao && (
                                    <div style={{ fontSize: 9, color: COLORS.textDim, marginBottom: 8 }}>
                                        {c.descricao}
                                    </div>
                                )}
                                {c.equipes && c.equipes.map((eq, eIdx) => (
                                    <div key={eIdx} style={{ marginBottom: 6 }}>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: COLORS.blue, marginBottom: 3 }}>{eq.grupo}</div>
                                        {eq.linhas && eq.linhas.map((l, lIdx) => (
                                            <div key={lIdx} style={{ fontSize: 9, color: COLORS.textDim, paddingLeft: 8 }}>
                                                {l.funcao}: {l.pessoas}p × {l.dias}d × R${l.diaria}/d = <span style={{ color: COLORS.accent2, fontFamily: FONTS.mono }}>{formatCurrency(l.pessoas * l.dias * l.diaria)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: 8,
                                    paddingTop: 8,
                                    borderTop: `1px solid ${COLORS.border}`,
                                }}>
                                    <div style={{ fontSize: 10 }}>
                                        <span style={{ color: COLORS.accent, fontWeight: 700, fontFamily: FONTS.mono }}>
                                            {formatCurrency(c.total || 0)}
                                        </span>
                                        <span style={{ color: COLORS.textMuted, marginLeft: 8, fontSize: 9 }}>
                                            {c.prazo_dias || "?"} dias
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => applyCenario(c)}
                                        style={{
                                            padding: "4px 14px",
                                            background: COLORS.accent,
                                            border: "none",
                                            borderRadius: 4,
                                            color: COLORS.bg,
                                            fontSize: 9,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                    >
                                        SELECIONAR
                                    </button>
                                </div>
                                {/* Vantagens / Desvantagens */}
                                {(c.vantagens || c.desvantagens) && (
                                    <div style={{ marginTop: 6, fontSize: 8, color: COLORS.textMuted }}>
                                        {c.vantagens && c.vantagens.map((v, i) => (
                                            <div key={"v" + i} style={{ color: COLORS.green }}>✅ {v}</div>
                                        ))}
                                        {c.desvantagens && c.desvantagens.map((d, i) => (
                                            <div key={"d" + i} style={{ color: COLORS.red }}>❌ {d}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Equipes (existing) */}
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
