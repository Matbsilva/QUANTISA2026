// ============================================
// QUANTISA ORÇAMENTO — Design Tokens & Defaults
// ============================================

// Color Palette (Dark Industrial Theme)
export const COLORS = {
    accent: "#F59E0B",
    accent2: "#FBBF24",
    bg: "#0C0A09",
    surface: "#141210",
    border: "#1E1C1A",
    text: "#F5F5F4",
    textDim: "#A8A29E",
    textMuted: "#78716C",
    blue: "#3B82F6",
    green: "#22C55E",
    red: "#EF4444",
    purple: "#A855F7",
};

// Typography
export const FONTS = {
    mono: "'JetBrains Mono', monospace",
    sans: "'DM Sans', sans-serif",
};

// Google Fonts URL
export const GOOGLE_FONTS_URL =
    "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap";

// Tabs configuration
export const TABS = [
    { id: "importar", icon: "📥", label: "Importar" },
    { id: "custo", icon: "📊", label: "Custo" },
    { id: "materiais", icon: "📦", label: "Materiais" },
    { id: "histograma", icon: "👷", label: "Histograma" },
    { id: "consolidacao", icon: "⚙️", label: "Consolidação", optional: true },
    { id: "simulacoes", icon: "💰", label: "Simulações" },
    { id: "resumo", icon: "📋", label: "Resumo" },
    { id: "memorial", icon: "📚", label: "Memorial", optional: true },
    { id: "abc", icon: "🎯", label: "ABC", optional: true },
    { id: "ev", icon: "💡", label: "Eng. Valor", optional: true },
    { id: "exportar", icon: "📤", label: "Exportar", optional: true },
];

// Default BDI rates
export const DEFAULT_BDI_MO = {
    ac: 0,
    cf: 0,
    mi: 0,
    tm: 27,
    te: 0,
    tf: 0,
    lc: 32,
};

export const DEFAULT_BDI_MAT = {
    ac: 0,
    cf: 0,
    mi: 0,
    tm: 13,
    te: 0,
    tf: 0,
    lc: 32,
};

// Default header
export const DEFAULT_HEADER = {
    nome: "",
    cliente: "",
    prop: "GeForce Engenharia",
    data: new Date().toISOString().split("T")[0],
    rev: "00",
};

// Default fixed materials
export const DEFAULT_MAT_FIX = [
    { id: "f1", n: "009.1", i: "Mobilização", u: "un", q: 1, p: 0 },
    { id: "f2", n: "009.2", i: "ART", u: "un", q: 1, p: 0 },
    { id: "f3", n: "009.3", i: "Equipamentos", u: "mês", q: 1, p: 0 },
    { id: "f4", n: "009.4", i: "Consumíveis", u: "mês", q: 1, p: 0 },
    { id: "f5", n: "009.5", i: "Fretes", u: "un", q: 1, p: 0 },
];

// Default team
export const DEFAULT_EQUIPES = [
    {
        id: "e1",
        g: "CIVIL",
        l: [
            { f: "Encarregado", d: 235, p: 1, di: 0 },
            { f: "Profissional", d: 185, p: 1, di: 0 },
            { f: "Ajudante", d: 165, p: 1, di: 0 },
        ],
    },
];

// Default other costs
export const DEFAULT_OUTROS_CUSTOS = [
    { id: "o1", d: "Aluguel Veículo", u: "mês", q: 0, v: 0 },
    { id: "o2", d: "Deslocamento", u: "diária", q: 0, v: 0 },
    { id: "o3", d: "Estadia", u: "diária", q: 0, v: 0 },
];

// Default resume fixed items
export const DEFAULT_RESUMO_FIX = [
    { id: "r1", n: "009.1", d: "Mobilização", u: "un", q: 1, v: 0 },
    { id: "r2", n: "009.2", d: "ART", u: "un", q: 1, v: 0 },
    { id: "r3", n: "009.3", d: "Equipamentos", u: "mês", q: 1, v: 0 },
    { id: "r4", n: "009.4", d: "Fretes", u: "un", q: 1, v: 0 },
];
