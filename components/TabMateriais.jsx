"use client";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculos";
import { NumericInput, TextInput } from "./Inputs";
import { exportCSV, exportXLSX } from "@/lib/exportUtils";
import { useStore } from "@/lib/store";

const thS = { padding: "5px 6px", textAlign: "left", fontSize: 12, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.3px", background: "#1A1710", borderBottom: "1px solid #2A2520", whiteSpace: "nowrap" };
const tdS = { padding: "3px 5px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 14 };
const tdrS = { ...tdS, textAlign: "right", fontFamily: FONTS.mono, color: COLORS.accent2 };
const totR = { background: "#1A1710" };

export default function TabMateriais({ tmf }) {
    const { matFix, setMatFix, addMF, dMF, header } = useStore();
    const handleExportXLSX = () => {
        const data = [
            ["MATERIAIS FIXOS"],
            [],
            ["#", "Insumo", "Un", "Qtd", "Preço Un", "Total"],
            ...matFix.map(m => [m.n, m.i, m.u, m.q, m.p, m.q * m.p]),
            [],
            ["", "", "", "", "TOTAL", tmf],
        ];
        exportXLSX([{ name: "Materiais", data, cols: [{ wch: 8 }, { wch: 35 }, { wch: 6 }, { wch: 8 }, { wch: 12 }, { wch: 14 }] }],
            `${(header?.nome || "orcamento").replace(/\s+/g, "_")}_materiais`);
    };
    const handleExportCSV = () => {
        const rows = [
            ["#", "Insumo", "Un", "Qtd", "Preço Un", "Total"],
            ...matFix.map(m => [m.n, m.i, m.u, m.q, m.p.toFixed(2), (m.q * m.p).toFixed(2)]),
            ["", "", "", "", "TOTAL", tmf.toFixed(2)],
        ];
        exportCSV(rows, `${(header?.nome || "orcamento").replace(/\s+/g, "_")}_materiais`);
    };
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0, fontFamily: FONTS.mono }}>Materiais</h2>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.accent, fontFamily: FONTS.mono }}>{formatCurrency(tmf)}</div>
                    <button onClick={handleExportXLSX} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${COLORS.green}`, background: "transparent", color: COLORS.green, fontSize: 11, cursor: "pointer" }}>⬇ xlsx</button>
                    <button onClick={handleExportCSV} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textMuted, fontSize: 11, cursor: "pointer" }}>⬇ csv</button>
                </div>
            </div>
            <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, marginBottom: 8, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["#", "Insumo", "Un", "Qtd", "Preço Un", "Total", ""].map((h, i) => (
                                <th key={i} style={{ ...thS, minWidth: h === "Insumo" ? 150 : h === "" ? 16 : 45 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matFix.map((m) => (
                            <tr key={m.id}>
                                <td style={tdS}><TextInput value={m.n} onChange={(v) => setMatFix((p) => p.map((x) => x.id === m.id ? { ...x, n: v } : x))} w="40px" /></td>
                                <td style={tdS}><TextInput value={m.i} onChange={(v) => setMatFix((p) => p.map((x) => x.id === m.id ? { ...x, i: v } : x))} /></td>
                                <td style={tdS}><TextInput value={m.u} onChange={(v) => setMatFix((p) => p.map((x) => x.id === m.id ? { ...x, u: v } : x))} w="35px" /></td>
                                <td style={tdS}><NumericInput value={m.q} onChange={(v) => setMatFix((p) => p.map((x) => x.id === m.id ? { ...x, q: v } : x))} /></td>
                                <td style={tdS}><NumericInput value={m.p} onChange={(v) => setMatFix((p) => p.map((x) => x.id === m.id ? { ...x, p: v } : x))} /></td>
                                <td style={tdrS}>{formatCurrency(m.q * m.p)}</td>
                                <td style={tdS}><span onClick={() => dMF(m.id)} style={{ cursor: "pointer", color: COLORS.textMuted, fontSize: 12 }}>✕</span></td>
                            </tr>
                        ))}
                        <tr style={totR}>
                            <td colSpan={5} style={{ ...tdS, textAlign: "right", fontWeight: 700, color: COLORS.accent, fontSize: 13 }}>Total</td>
                            <td style={{ ...tdrS, fontWeight: 700 }}>{formatCurrency(tmf)}</td>
                            <td style={tdS} />
                        </tr>
                    </tbody>
                </table>
            </div>
            <button onClick={addMF} style={{ padding: "5px 12px", borderRadius: 5, border: "none", background: COLORS.accent, color: COLORS.bg, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Item</button>
        </div >
    );
}
