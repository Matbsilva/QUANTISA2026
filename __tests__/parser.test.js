import { parseComposition, parseMultipleCompositions } from "../lib/parser";

// ============================================
// PARSER UNIT TESTS
// ============================================

describe("parseComposition", () => {
    test("should return null for empty or very short text", () => {
        expect(parseComposition("")).toBeNull();
        expect(parseComposition("short")).toBeNull();
        expect(parseComposition(null)).toBeNull();
    });

    test("should extract código from header", () => {
        const text = `
**CÓDIGO:** COMP-001 | **TÍTULO:** Contrapiso com Tela Armada
**UNIDADE:** m² | **QUANTIDADE DE REFERÊNCIA:** 100 m²
**GRUPO:** Pisos | **TURNO:** Diurno (8h)
**COMPOSIÇÃO DA EQUIPE:** 1 Pedreiro + 1 Ajudante

### SEÇÃO 5: INDICADORES CHAVE

| Indicador | Und | Valor/m² | Total (100 m²) |
|---|---|---|---|
| Custo Material | R$ | R$ 49,20 | R$ 4.920,00 |
| Custo Equipamentos | R$ | R$ 6,25 | R$ 625,00 |
| Custo M.O. | R$ | R$ 3,98 | R$ 398,00 |
| HH Profissional | HH | 0,060 | 6,00 |
| HH Ajudante | HH | 0,050 | 5,00 |
        `.trim();
        const result = parseComposition(text);
        expect(result).not.toBeNull();
        expect(result.codigo).toBe("COMP-001");
        expect(result.titulo).toContain("Contrapiso");
        expect(result.unidade).toBe("m²");
        expect(result.grupo).toBe("Pisos");
        expect(result.turno).toBe("Diurno (8h)");
        expect(result.mat).toBeCloseTo(49.20, 1);
        expect(result.mo).toBeCloseTo(3.98, 1);
        expect(result.eq).toBeCloseTo(6.25, 1);
        expect(result.parsed).toBe(true);
    });

    test("should extract HH values from Section 5", () => {
        const text = `
**CÓDIGO:** TEST-002

### SEÇÃO 5: INDICADORES CHAVE

| Indicador | Und | Valor/m² | Total |
|---|---|---|---|
| Custo Material | R$ | R$ 30,00 | R$ 3.000 |
| Custo Equipamentos | R$ | R$ 5,00 | R$ 500 |
| Custo M.O. | R$ | R$ 10,00 | R$ 1.000 |
| HH Profissional | HH | 0,115 | 11,50 |
| HH Ajudante | HH | 0,050 | 5,00 |
        `.trim();
        const result = parseComposition(text);
        expect(result.hhp).toBeCloseTo(0.115, 3);
        expect(result.hha).toBeCloseTo(0.050, 3);
    });

    test("should extract quantity from reference", () => {
        const text = `
**CÓDIGO:** TEST-003
**QUANTIDADE DE REFERÊNCIA:** 250 m²

| Indicador | Und | Valor/m² | Total |
|---|---|---|---|
| Custo Material | R$ | R$ 20,00 | R$ 5.000 |
| Custo M.O. | R$ | R$ 8,00 | R$ 2.000 |
| Custo Equipamentos | R$ | R$ 2,00 | R$ 500 |
        `.trim();
        const result = parseComposition(text);
        expect(result.q).toBe(250);
    });
});

describe("parseMultipleCompositions", () => {
    test("should return empty for null/short text", () => {
        const result = parseMultipleCompositions("");
        expect(result.count).toBe(0);
        expect(result.compositions).toHaveLength(0);
    });

    test("should detect single composition", () => {
        const text = `
### SEÇÃO 1: PREMISSAS

**CÓDIGO:** COMP-001

### SEÇÃO 5: INDICADORES CHAVE

| Indicador | Und | Valor/m² | Total |
|---|---|---|---|
| Custo Material | R$ | R$ 10,00 | R$ 100 |
| Custo M.O. | R$ | R$ 5,00 | R$ 50 |
| Custo Equipamentos | R$ | R$ 2,00 | R$ 20 |
        `.trim();
        const result = parseMultipleCompositions(text);
        expect(result.count).toBe(1);
        expect(result.compositions[0].codigo).toBe("COMP-001");
    });

    test("should split and detect multiple compositions by SEÇÃO 1", () => {
        const text = `
### SEÇÃO 1: PREMISSAS
**CÓDIGO:** COMP-A

| Indicador | Und | Valor/m² | Total |
|---|---|---|---|
| Custo Material | R$ | R$ 10,00 | R$ 100 |
| Custo M.O. | R$ | R$ 5,00 | R$ 50 |
| Custo Equipamentos | R$ | R$ 2,00 | R$ 20 |

---

### SEÇÃO 1: PREMISSAS  
**CÓDIGO:** COMP-B

| Indicador | Und | Valor/m² | Total |
|---|---|---|---|
| Custo Material | R$ | R$ 20,00 | R$ 200 |
| Custo M.O. | R$ | R$ 8,00 | R$ 80 |
| Custo Equipamentos | R$ | R$ 3,00 | R$ 30 |
        `.trim();
        const result = parseMultipleCompositions(text);
        expect(result.count).toBe(2);
        expect(result.compositions[0].codigo).toBe("COMP-A");
        expect(result.compositions[1].codigo).toBe("COMP-B");
    });
});
