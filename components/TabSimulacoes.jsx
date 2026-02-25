"use client";
import { useState } from "react";
import { COLORS, FONTS, DEFAULT_BDI_MO, DEFAULT_BDI_MAT } from "@/lib/constants";
import { formatCurrency, calcBDI } from "@/lib/calculos";
import { NumericInput } from "./Inputs";

const rateLabels = {
    ac: "Administração Central",
    cf: "Custos Financeiros",
    mi: "Margem de Incerteza",
    tm: "Tributos Municipais (ISS)",
    te: "Tributos Estaduais",
    tf: "Tributos Federais (PIS/COFINS)",
    lc: "Lucro",
};

export default function TabSimulacoes({ totalMatDireto, totalMODireto }) {
    const [bdiMO, setBdiMO] = useState({ ...DEFAULT_BDI_MO });
    const [bdiMat, setBdiMat] = useState({ ...DEFAULT_BDI_MAT });
    const [mix, setMix] = useState(50);

    const bdiMOVal = calcBDI(bdiMO);
    const bdiMatVal = calcBDI(bdiMat);
    const mixPercent = mix / 100;
    const bdiMix = bdiMOVal * mixPercent + bdiMatVal * (1 - mixPercent);

    const pvMat = totalMatDireto * (1 + bdiMatVal);
    const pvMO = totalMODireto * (1 + bdiMOVal);
    const pvTotal = pvMat + pvMO;
    const lucroMat = totalMatDireto * bdiMatVal;
    const lucroMO = totalMODireto * bdiMOVal;
    const lucroTotal = lucroMat + lucroMO;

    const renderRates = (rates, setRates, label, color) => (
        <div
            style={{
                flex: 1,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                padding: 10,
            }}
        >
            <div
                style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: color,
                    marginBottom: 8,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <span>{label}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 14 }}>
                    {(calcBDI(rates) * 100).toFixed(2)}%
                </span>
            </div>
            {Object.entries(rateLabels).map(([k, lb]) => (
                <div
                    key={k}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "3px 0",
                        borderBottom: `1px solid ${COLORS.border}`,
                    }}
                >
                    <span style={{ fontSize: 9, color: COLORS.textDim }}>{lb}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <NumericInput
                            value={rates[k]}
                            onChange={(v) => setRates((p) => ({ ...p, [k]: v }))}
                            w="45px"
                        />
                        <span style={{ fontSize: 8, color: COLORS.textMuted }}>%</span>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <h2
                style={{
                    fontSize: 15,
                    fontWeight: 700,
                    margin: "0 0 10px",
                    fontFamily: FONTS.mono,
                }}
            >
                Simulações BDI
            </h2>

            {/* BDI panels */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {renderRates(bdiMO, setBdiMO, "BDI Mão de Obra", COLORS.blue)}
                {renderRates(bdiMat, setBdiMat, "BDI Material", COLORS.accent)}
            </div>

            {/* Mix slider */}
            <div
                style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6,
                    padding: 10,
                    marginBottom: 12,
                }}
            >
                <div
                    style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: COLORS.green,
                        marginBottom: 5,
                    }}
                >
                    MIX MO / MATERIAL
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span style={{ fontSize: 9, color: COLORS.blue }}>MO {mix}%</span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={mix}
                        onChange={(e) => setMix(Number(e.target.value))}
                        style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: 9, color: COLORS.accent }}>
                        Mat {100 - mix}%
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 6,
                    }}
                >
                    <span style={{ fontSize: 9, color: COLORS.textMuted }}>
                        BDI Mix Ponderado
                    </span>
                    <span
                        style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: COLORS.green,
                            fontFamily: FONTS.mono,
                        }}
                    >
                        {(bdiMix * 100).toFixed(2)}%
                    </span>
                </div>
            </div>

            {/* Results */}
            <div
                style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6,
                    padding: 10,
                }}
            >
                <div
                    style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: COLORS.accent,
                        marginBottom: 8,
                    }}
                >
                    RESULTADO
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["", "Custo Direto", "BDI %", "Markup R$", "Preço Venda"].map(
                                (h, i) => (
                                    <th
                                        key={i}
                                        style={{
                                            padding: "4px",
                                            fontSize: 8,
                                            fontWeight: 700,
                                            color: COLORS.textMuted,
                                            textAlign: "right",
                                            borderBottom: `1px solid ${COLORS.border}`,
                                        }}
                                    >
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            [
                                "Material",
                                totalMatDireto,
                                bdiMatVal,
                                lucroMat,
                                pvMat,
                                COLORS.accent,
                            ],
                            [
                                "Mão de Obra",
                                totalMODireto,
                                bdiMOVal,
                                lucroMO,
                                pvMO,
                                COLORS.blue,
                            ],
                            [
                                "TOTAL",
                                totalMatDireto + totalMODireto,
                                bdiMix,
                                lucroTotal,
                                pvTotal,
                                COLORS.green,
                            ],
                        ].map(([l, cd, bdi, mk, pv, c], i) => (
                            <tr
                                key={i}
                                style={
                                    i === 2
                                        ? { background: "#1A1710", fontWeight: 700 }
                                        : {}
                                }
                            >
                                <td
                                    style={{
                                        padding: "5px",
                                        fontSize: 10,
                                        color: c,
                                        fontWeight: i === 2 ? 700 : 400,
                                        borderBottom: `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    {l}
                                </td>
                                <td
                                    style={{
                                        padding: "5px",
                                        textAlign: "right",
                                        fontSize: 10,
                                        fontFamily: FONTS.mono,
                                        color: COLORS.textDim,
                                        borderBottom: `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    {formatCurrency(cd)}
                                </td>
                                <td
                                    style={{
                                        padding: "5px",
                                        textAlign: "right",
                                        fontSize: 10,
                                        fontFamily: FONTS.mono,
                                        color: COLORS.textDim,
                                        borderBottom: `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    {(bdi * 100).toFixed(2)}%
                                </td>
                                <td
                                    style={{
                                        padding: "5px",
                                        textAlign: "right",
                                        fontSize: 10,
                                        fontFamily: FONTS.mono,
                                        color: COLORS.green,
                                        borderBottom: `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    {formatCurrency(mk)}
                                </td>
                                <td
                                    style={{
                                        padding: "5px",
                                        textAlign: "right",
                                        fontSize: i === 2 ? 14 : 11,
                                        fontFamily: FONTS.mono,
                                        fontWeight: 700,
                                        color: c,
                                        borderBottom: `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    {formatCurrency(pv)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
