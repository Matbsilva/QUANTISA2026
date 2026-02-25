/**
 * Script para dropar tabelas existentes e criar o schema correto
 * no Supabase para o QUANTISA Orçamento.
 * 
 * Executa via: node scripts/setup-supabase.mjs
 */

const SUPABASE_URL = "https://lvabqvkobttckvshxptp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YWJxdmtvYnR0Y2t2c2h4cHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTY4MzgsImV4cCI6MjA4NzM3MjgzOH0.J-X-sb5x9QgDfs9peUkNK9e1GIk6wT4ew81nHRWFwvE";

async function executeSql(sql, label) {
    console.log(`\n🔧 ${label}...`);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ query: sql }),
    });

    if (!res.ok) {
        const text = await res.text();
        // Try the pgmeta endpoint instead
        console.log(`   ℹ️  RPC não disponível, tentando via SQL direto...`);
        return null;
    }
    console.log(`   ✅ ${label} — OK`);
    return true;
}

// Since anon key can't run raw SQL, let's test connectivity and list existing tables
async function testConnection() {
    console.log("🔌 Testando conexão com Supabase...");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
    });
    if (res.ok) {
        console.log("✅ Conexão OK!");
        const data = await res.json();
        console.log("📋 Endpoints disponíveis:", JSON.stringify(data).substring(0, 500));
        return true;
    } else {
        console.log("❌ Erro na conexão:", res.status, await res.text());
        return false;
    }
}

// Check what tables exist by trying to query them
async function checkTable(tableName) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=0`, {
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
    });
    return res.ok;
}

async function main() {
    const connected = await testConnection();
    if (!connected) {
        process.exit(1);
    }

    console.log("\n📋 Verificando tabelas existentes...");
    const tables = [
        "orcamentos", "orcamento_itens", "orcamento_materiais",
        "orcamento_equipes", "orcamento_equipe_linhas", "orcamento_simulacoes",
        "orcamento_outros_custos", "orcamento_resumo_fixos",
        "projetos", "composicoes"
    ];

    for (const t of tables) {
        const exists = await checkTable(t);
        console.log(`   ${exists ? "✅" : "❌"} ${t}`);
    }

    console.log("\n⚠️  IMPORTANTE: Para dropar e recriar as tabelas, execute o SQL abaixo");
    console.log("   diretamente no Supabase Dashboard → SQL Editor:");
    console.log("   https://supabase.com/dashboard/project/lvabqvkobttckvshxptp/sql/new\n");

    console.log("=".repeat(70));
    console.log(SETUP_SQL);
    console.log("=".repeat(70));

    console.log("\n💡 Copie o SQL acima e cole no SQL Editor do Supabase Dashboard.");
    console.log("   Ou... vou tentar executar via API automaticamente.\n");

    // Try to execute via the SQL endpoint that some Supabase projects have
    const sqlRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
    });
    console.log("RPC endpoint status:", sqlRes.status);
}

const SETUP_SQL = `
-- =============================================
-- QUANTISA ORÇAMENTO — Setup Completo
-- =============================================
-- 1. DROPAR tabelas existentes (ordem reversa por causa de FKs)
-- =============================================

DROP TABLE IF EXISTS orcamento_resumo_fixos CASCADE;
DROP TABLE IF EXISTS orcamento_outros_custos CASCADE;
DROP TABLE IF EXISTS orcamento_equipe_linhas CASCADE;
DROP TABLE IF EXISTS orcamento_equipes CASCADE;
DROP TABLE IF EXISTS orcamento_simulacoes CASCADE;
DROP TABLE IF EXISTS orcamento_materiais CASCADE;
DROP TABLE IF EXISTS orcamento_itens CASCADE;
DROP TABLE IF EXISTS orcamentos CASCADE;
DROP TABLE IF EXISTS projetos CASCADE;
DROP TABLE IF EXISTS composicoes CASCADE;

-- =============================================
-- 2. CRIAR tabelas novas
-- =============================================

-- Tabela principal de orçamentos
CREATE TABLE orcamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cliente TEXT,
  proponente TEXT DEFAULT 'GeForce Engenharia',
  data DATE DEFAULT CURRENT_DATE,
  revisao TEXT DEFAULT '00',
  area_total NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens de custo (aba Custo)
CREATE TABLE orcamento_itens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  numero TEXT,
  descricao TEXT,
  unidade TEXT DEFAULT 'm²',
  quantidade NUMERIC DEFAULT 0,
  mat_unitario NUMERIC DEFAULT 0,
  mo_unitario NUMERIC DEFAULT 0,
  equip_unitario NUMERIC DEFAULT 0,
  hh_prof NUMERIC DEFAULT 0,
  hh_aju NUMERIC DEFAULT 0,
  composicao_raw TEXT,
  ordem INT DEFAULT 0,
  mat_total NUMERIC GENERATED ALWAYS AS (mat_unitario * quantidade) STORED,
  mo_total NUMERIC GENERATED ALWAYS AS (mo_unitario * quantidade) STORED,
  equip_total NUMERIC GENERATED ALWAYS AS (equip_unitario * quantidade) STORED,
  total NUMERIC GENERATED ALWAYS AS ((mat_unitario + mo_unitario + equip_unitario) * quantidade) STORED
);

-- Materiais (aba Materiais)
CREATE TABLE orcamento_materiais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  numero TEXT,
  insumo TEXT,
  unidade TEXT,
  quantidade NUMERIC DEFAULT 0,
  preco_unitario NUMERIC DEFAULT 0,
  tipo TEXT DEFAULT 'fixo',
  justificativa TEXT,
  peso_unitario NUMERIC DEFAULT 0,
  ordem INT DEFAULT 0
);

-- Equipes (aba Histograma)
CREATE TABLE orcamento_equipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  grupo TEXT NOT NULL,
  ordem INT DEFAULT 0
);

CREATE TABLE orcamento_equipe_linhas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipe_id UUID REFERENCES orcamento_equipes(id) ON DELETE CASCADE,
  funcao TEXT,
  diaria NUMERIC DEFAULT 0,
  pessoas INT DEFAULT 1,
  dias NUMERIC DEFAULT 0,
  ordem INT DEFAULT 0
);

-- Outros custos MO
CREATE TABLE orcamento_outros_custos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  descricao TEXT,
  unidade TEXT,
  quantidade NUMERIC DEFAULT 0,
  valor_unitario NUMERIC DEFAULT 0
);

-- Simulações (aba Simulações)
CREATE TABLE orcamento_simulacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  tipo TEXT CHECK (tipo IN ('mo', 'material')),
  ac NUMERIC DEFAULT 0,
  cf NUMERIC DEFAULT 0,
  mi NUMERIC DEFAULT 0,
  tm NUMERIC DEFAULT 27,
  te NUMERIC DEFAULT 0,
  tf NUMERIC DEFAULT 0,
  lucro NUMERIC DEFAULT 32,
  mix_percentual NUMERIC DEFAULT 50
);

-- Resumo fixos (aba Resumo)
CREATE TABLE orcamento_resumo_fixos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  numero TEXT,
  descricao TEXT,
  unidade TEXT,
  quantidade NUMERIC DEFAULT 0,
  valor_unitario NUMERIC DEFAULT 0,
  ordem INT DEFAULT 0
);

-- =============================================
-- 3. RLS (Row Level Security)
-- =============================================

ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_equipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_equipe_linhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_outros_custos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_simulacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_resumo_fixos ENABLE ROW LEVEL SECURITY;

-- Policies: permitir tudo para anon (sem auth por enquanto)
CREATE POLICY "allow_all" ON orcamentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON orcamento_itens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON orcamento_materiais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON orcamento_equipes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON orcamento_equipe_linhas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON orcamento_outros_custos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON orcamento_simulacoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON orcamento_resumo_fixos FOR ALL USING (true) WITH CHECK (true);
`;

main().catch(console.error);
