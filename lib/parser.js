// ============================================
// QUANTISA ORÇAMENTO — Composition V4 Parser
// ============================================

/**
 * Parse a markdown composition (V4 format, 7 sections)
 * Extracts: código, título, unidade, grupo, turno, equipe,
 *           mat, mo, eq (unit costs), hhp, hha (man-hours),
 *           insumos list, custoTotal, q (reference qty)
 *
 * Primary source: Section 5 table (Indicadores Chave)
 * Fallback 1: Section 5.1 text values
 * Fallback 2: Section 3 table (HH por função)
 * Fallback 3: TOTAL M.O. row in Section 3
 */
export function parseComposition(text) {
    if (!text || text.trim().length < 50) return null;

    const result = {
        mat: 0,
        mo: 0,
        eq: 0,
        hhp: 0,
        hha: 0,
        custoTotal: 0,
        insumos: [],
    };

    // Helper: extract numeric from R$ string
    const extractValue = (str) => {
        const m = (str || "").match(/R\$\s*([\d.,]+)/);
        return m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : 0;
    };

    // Helper: parse a decimal that may use comma or dot
    const parseNum = (str) => {
        if (!str) return 0;
        // Handle Brazilian thousands: 1.234,56  →  remove dots, comma→dot
        const s = str.trim().replace(/\./g, "").replace(",", ".");
        return parseFloat(s) || 0;
    };

    // ==========================================================
    // HEADER — Section 1 fields
    // ==========================================================
    const codMatch = text.match(/\*\*C[OÓ]DIGO:\*\*\s*([^|*\n]+)/i);
    result.codigo = codMatch ? codMatch[1].trim() : "";

    const titMatch = text.match(/\*\*T[IÍ]TULO:\*\*\s*([^|\n]+)/i);
    result.titulo = titMatch ? titMatch[1].replace(/\*+/g, "").trim() : "";

    const uniMatch = text.match(/\*\*UNIDADE:\*\*\s*([^|\n]+)/i);
    result.unidade = uniMatch ? uniMatch[1].trim() : "m²";

    const grpMatch = text.match(/\*\*GRUPO:\*\*\s*([^|\n]+)/i);
    result.grupo = grpMatch ? grpMatch[1].replace(/\*+/g, "").trim() : "";

    const turMatch = text.match(/\*\*TURNO:\*\*\s*([^|\n]+)/i);
    result.turno = turMatch ? turMatch[1].replace(/\*+/g, "").trim() : "";

    const eqpMatch = text.match(/\*\*COMPOSI[CÇ][AÃ]O DA EQUIPE:\*\*\s*([^|\n]+)/i);
    result.equipe = eqpMatch ? eqpMatch[1].replace(/\*+/g, "").trim() : "";

    // ==========================================================
    // REFERENCE QUANTITY from composition header
    // ==========================================================
    const qtyPatterns = [
        /\*\*QUANTIDADE DE REFER[EÊ]NCIA:\*\*\s*([0-9.,]+)/i,  // **QUANTIDADE DE REFERÊNCIA:** 100
        /QUANTIDADE DE REFER[EÊ]NCIA[^0-9]*([0-9.,]+)/i,       // QUANTIDADE DE REFERÊNCIA: 100
        /QTD\.?\s*(?:DE\s*)?REFER[EÊ]NCIA[^0-9]*([0-9.,]+)/i, // Qtd. Referência: 100
        /\*\*[AÁ]REA:\*\*\s*([0-9.,]+)/i,                      // **ÁREA:** 296,11
        /[AÁ]REA[^0-9A-Za-z]*([0-9.,]+)/i,                     // ÁREA: 296,11
        /QTD\.\s+PROJETO[^0-9]*([0-9.,]+)/i,                   // Qtd. Projeto: 296,11
    ];
    result.q = 1;
    for (const pattern of qtyPatterns) {
        const qMatch = text.match(pattern);
        if (qMatch) {
            const val = parseNum(qMatch[1]);
            if (val > 0) { result.q = val; break; }
        }
    }

    // ==========================================================
    // SECTION 5 TABLE — Primary source for costs
    // Pattern: | Custo de Materiais | ... | R$ XX,XX |
    // ==========================================================
    const matLine = text.match(/Custo (?:de )?Materi[a-z]+[^|]*\|[^|]*\|\s*(R\$[^|\n]+)/i);
    if (matLine) result.mat = extractValue(matLine[1]);

    const moLine = text.match(/Custo (?:de )?(?:M[aã]o[- ]de[- ]Obra|M\.?O\.?)[^|]*\|[^|]*\|\s*(R\$[^|\n]+)/i);
    if (moLine) result.mo = extractValue(moLine[1]);

    const eqLine = text.match(/Custo (?:de )?Equipament[^|]*\|[^|]*\|\s*(R\$[^|\n]+)/i);
    if (eqLine) result.eq = extractValue(eqLine[1]);

    // ==========================================================
    // FALLBACK Costs — Section 5.1 text
    // Pattern: Material: R$ 49,20/m²
    // ==========================================================
    if (!result.mat) {
        const m = text.match(/\*?\*?Material:?\*?\*?\s*R\$\s*([\d.,]+)/i);
        if (m) result.mat = parseNum(m[1]);
    }
    if (!result.mo) {
        const m = text.match(/\*?\*?M[aã]o[- ]de[- ]Obra:?\*?\*?\s*R\$\s*([\d.,]+)/i);
        if (m) result.mo = parseNum(m[1]);
    }
    if (!result.eq) {
        const m = text.match(/\*?\*?Equipamentos?:?\*?\*?\s*R\$\s*([\d.,]+)/i);
        if (m) result.eq = parseNum(m[1]);
    }

    // ==========================================================
    // HH — Section 5 table (preferred)
    // Looks for lines like: | — HH Profissional (Pedreiro) | HH | 0,060 | ...
    // Or: | HH Pedreiro | HH | 0,060 | ...
    // ==========================================================

    // Strategy: scan all table lines and look for HH professional / ajudante rows
    const tableLines = text.split("\n").filter((l) => l.includes("|"));

    for (const line of tableLines) {
        const cols = line.split("|").map((c) => c.trim());
        if (cols.length < 4) continue;
        const label = (cols[1] || "").toLowerCase();
        const isProf =
            label.includes("profissional") ||
            label.includes("pedreiro") ||
            label.includes("hh prof") ||
            label.includes("hhp") ||
            label.includes("oficial") ||
            (label.includes("hh") && !label.includes("ajudante") && !label.includes("total") && !label.includes("técnico") && !label.includes("tecnico"));
        const isAju =
            label.includes("ajudante") ||
            label.includes("hha") ||
            label.includes("hh aju");

        // Value can be in col 3 (value/m²) or col 4 (total), prefer col 3 (unit)
        const tryVal = (col) => {
            const num = parseNum(col);
            return num > 0 && num < 100 ? num : 0; // HH/m² should be < 100
        };

        if (isProf && !result.hhp) {
            result.hhp = tryVal(cols[3]) || tryVal(cols[2]) || tryVal(cols[4]) || 0;
        }
        if (isAju && !result.hha) {
            result.hha = tryVal(cols[3]) || tryVal(cols[2]) || tryVal(cols[4]) || 0;
        }
    }

    // ==========================================================
    // FALLBACK HH — Section 3 table
    // Pattern: | Profissional (Pedreiro) | 0,0600 | ×1,00 | **0,0600** | R$ 40,00 | ...
    // ==========================================================
    if (!result.hhp || !result.hha) {
        for (const line of tableLines) {
            const cols = line.split("|").map((c) => c.replace(/\*+/g, "").trim());
            if (cols.length < 5) continue;
            const label = (cols[1] || "").toLowerCase();

            const isProf3 =
                label.includes("profissional") ||
                label.includes("pedreiro") ||
                label.includes("oficial") ||
                label.includes("aplicador") ||
                label.includes("impermeabilizador") ||
                label.includes("azulejista") ||
                label.includes("ceramista") ||
                label.includes("carpinteiro") ||
                label.includes("gesseiro");

            const isAju3 =
                label.includes("ajudante") ||
                label.includes("servente") ||
                label.includes("auxiliar");

            // Section 3 col layout: | Função | HH Base | Fator | HH Ajustado | Custo HH |
            // HH Ajustado is col[4] (index 4)
            const tryHH3 = (col) => {
                const n = parseNum(col);
                return n > 0 && n < 50 ? n : 0;
            };

            if (isProf3 && !result.hhp) {
                // Try col 4 (HH Ajustado), then col 2 (HH Base), then col 3
                result.hhp = tryHH3(cols[4]) || tryHH3(cols[2]) || tryHH3(cols[3]) || 0;
            }
            if (isAju3 && !result.hha) {
                result.hha = tryHH3(cols[4]) || tryHH3(cols[2]) || tryHH3(cols[3]) || 0;
            }
        }
    }

    // ==========================================================
    // SECTION 2 — Insumos list
    // Pattern: | Mat | Cimento CP-II | saco | 0,368 | 0% | 0,3680 | R$ 33,87 | R$ 12,46 |
    // ==========================================================
    const lines = text.split("\n");
    lines.forEach((line) => {
        // Match lines starting with | Mat or | Equip category
        const m = line.match(
            /\|\s*(Mat|Equip)\b[^|]*\|\s*([^|]+)\|\s*(\w[\w²³/]*)\s*\|\s*([\d.,]+)\s*\|\s*[\d.,]+%?\s*\|\s*\**([\d.,]+)\**\s*\|\s*(R\$\s*[\d.,]+)\s*\|\s*(R\$\s*[\d.,]+)/i
        );
        if (m) {
            result.insumos.push({
                cat: m[1].trim(),
                desc: m[2].trim(),
                unid: m[3].trim(),
                qtd: parseNum(m[5]),
                preco: extractValue(m[6]),
                total: extractValue(m[7]),
            });
        }
    });

    result.custoTotal = result.mat + result.mo + result.eq;
    result.parsed = result.custoTotal > 0;
    return result;
}

/**
 * Split text containing multiple compositions and parse each one.
 * Detects composition boundaries by looking for repeated SEÇÃO 1 markers or **CÓDIGO:** patterns.
 * Returns { compositions: [ { raw, parsed } ], count }
 */
export function parseMultipleCompositions(text) {
    if (!text || text.trim().length < 50) return { compositions: [], count: 0 };

    // Split on patterns that indicate a new composition starts:
    // - "# 🛠️ COMPOSIÇÃO:" or similar headers
    const splitRegex = /(?=(?:^|\n)\s*#+\s*(?:🛠️\s*)?COMPOSI[CÇ][AÃ]O:?)/gi;
    const chunks = text.split(splitRegex).filter(c => c.trim().length > 50);

    // If only 1 chunk, try alternative split on "**CÓDIGO:**"
    if (chunks.length <= 1) {
        const altRegex = /(?=(?:^|\n)\s*\*\*C[oó]digo:\*\*)/gi;
        const altChunks = text.split(altRegex).filter(c => c.trim().length > 50);
        if (altChunks.length > 1) {
            return {
                compositions: altChunks.map(raw => ({
                    raw: raw.trim(),
                    ...parseComposition(raw.trim()),
                })),
                count: altChunks.length,
            };
        }
    }

    if (chunks.length <= 1) {
        // Single composition — still parse it
        const single = parseComposition(text);
        if (single && single.parsed) {
            return { compositions: [{ raw: text, ...single }], count: 1 };
        }
        return { compositions: [], count: 0 };
    }

    return {
        compositions: chunks.map(raw => ({
            raw: raw.trim(),
            ...parseComposition(raw.trim()),
        })),
        count: chunks.length,
    };
}
