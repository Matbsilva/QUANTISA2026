// ============================================
// QUANTISA ORÇAMENTO — Composition V4 Parser
// ============================================

/**
 * Parse a markdown composition (V4 format, 7 sections)
 * Extracts: código, título, unidade, grupo, turno, equipe,
 *           mat, mo, eq (unit costs), hhp, hha (man-hours),
 *           insumos list, custoTotal
 *
 * Primary source: Section 5 table
 * Fallback: Section 5.1 text, Section 3 table
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

    // Helper: extract R$ value from string
    const extractValue = (str) => {
        const m = (str || "").match(/R\$\s*([\d.,]+)/);
        return m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : 0;
    };

    // === HEADER ===
    const codMatch = text.match(/\*\*C[OÓ]DIGO:\*\*\s*([^|*\n]+)/i);
    result.codigo = codMatch ? codMatch[1].trim() : "";

    const titMatch = text.match(/\*\*T[IÍ]TULO:\*\*\s*([^\n]+)/i);
    result.titulo = titMatch ? titMatch[1].replace(/\*+/g, "").trim() : "";

    const uniMatch = text.match(/\*\*UNIDADE:\*\*\s*([^\n|]+)/i);
    result.unidade = uniMatch ? uniMatch[1].trim() : "m²";

    const grpMatch = text.match(/\*\*GRUPO:\*\*\s*([^\n]+)/i);
    result.grupo = grpMatch ? grpMatch[1].replace(/\*+/g, "").trim() : "";

    const turMatch = text.match(/\*\*TURNO:\*\*\s*([^\n]+)/i);
    result.turno = turMatch ? turMatch[1].replace(/\*+/g, "").trim() : "";

    const eqpMatch = text.match(
        /\*\*COMPOSI[CÇ][AÃ]O DA EQUIPE:\*\*\s*([^\n]+)/i
    );
    result.equipe = eqpMatch ? eqpMatch[1].replace(/\*+/g, "").trim() : "";

    // === SECTION 5 TABLE (Primary Source) ===
    const matLine = text.match(
        /Custo de Materiais[^|]*\|[^|]*\|\s*(R\$[^|]+)/i
    );
    if (matLine) result.mat = extractValue(matLine[1]);

    const moLine = text.match(
        /Custo de M[aã]o de Obra[^|]*\|[^|]*\|\s*(R\$[^|]+)/i
    );
    if (moLine) result.mo = extractValue(moLine[1]);

    const eqLine = text.match(
        /Custo de Equipamentos[^|]*\|[^|]*\|\s*(R\$[^|]+)/i
    );
    if (eqLine) result.eq = extractValue(eqLine[1]);

    // === FALLBACK: Section 5.1 text ===
    if (!result.mat) {
        const m = text.match(/Material:\s*R\$\s*([\d.,]+)\/m/i);
        if (m) result.mat = parseFloat(m[1].replace(",", "."));
    }
    if (!result.mo) {
        const m = text.match(/M[aã]o de Obra:\s*R\$\s*([\d.,]+)\/m/i);
        if (m) result.mo = parseFloat(m[1].replace(",", "."));
    }
    if (!result.eq) {
        const m = text.match(/Equipamentos?:\s*R\$\s*([\d.,]+)\/m/i);
        if (m) result.eq = parseFloat(m[1].replace(",", "."));
    }

    // === HH from Section 5 ===
    const hhpLine = text.match(
        /HH\s+(?:Pedreiro|Prof)[^|]*\|[^|]*\|\s*([\d.,]+)/i
    );
    if (hhpLine) result.hhp = parseFloat(hhpLine[1].replace(",", "."));

    const hhaLine = text.match(/HH\s+Ajudante[^|]*\|[^|]*\|\s*([\d.,]+)/i);
    if (hhaLine) result.hha = parseFloat(hhaLine[1].replace(",", "."));

    // === FALLBACK: Section 3 — HH Ajustado column ===
    if (!result.hhp) {
        const m = text.match(
            /Pedreiro[^|]*\|[^|]*\|[^|]*\|\s*\**([\\d.,]+)\**/i
        );
        if (m) result.hhp = parseFloat(m[1].replace(",", "."));
    }
    if (!result.hha) {
        const m = text.match(
            /Ajudante[^|]*\|[^|]*\|[^|]*\|\s*\**([\\d.,]+)\**/i
        );
        if (m) result.hha = parseFloat(m[1].replace(",", "."));
    }

    // === SECTION 2: Insumos ===
    const lines = text.split("\n");
    lines.forEach((line) => {
        const m = line.match(
            /\|\s*(Mat|Equip)[^|]*\|\s*([^|]+)\|\s*(\w+)\s*\|\s*([\d.,]+)\s*\|\s*[\d.,]+%?\s*\|\s*\**([\d.,]+)\**\s*\|\s*(R\$\s*[\d.,]+)\s*\|\s*(R\$\s*[\d.,]+)/i
        );
        if (m) {
            result.insumos.push({
                cat: m[1].trim(),
                desc: m[2].trim(),
                unid: m[3].trim(),
                qtd: parseFloat(m[5].replace(",", ".")),
                preco: extractValue(m[6]),
                total: extractValue(m[7]),
            });
        }
    });

    result.custoTotal = result.mat + result.mo + result.eq;
    result.parsed = result.custoTotal > 0;
    return result;
}
