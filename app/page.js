"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { COLORS, FONTS, GOOGLE_FONTS_URL } from "@/lib/constants";
import { listarOrcamentos, criarOrcamento, excluirOrcamento } from "@/lib/supabaseOrcamento";

export default function Dashboard() {
  const router = useRouter();
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newCliente, setNewCliente] = useState("");
  const [creating, setCreating] = useState(false);

  // Load list
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarOrcamentos();
      setOrcamentos(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar orçamentos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // Create new
  const handleCreate = async () => {
    if (!newNome.trim()) return;
    try {
      setCreating(true);
      const orc = await criarOrcamento({
        nome: newNome.trim(),
        cliente: newCliente.trim() || null,
      });
      router.push(`/orcamento/${orc.id}`);
    } catch (err) {
      alert("Erro ao criar: " + (err.message || err));
      setCreating(false);
    }
  };

  // Delete
  const handleDelete = async (id, nome) => {
    if (!confirm(`Excluir "${nome}"? Todos os dados serão perdidos.`)) return;
    try {
      await excluirOrcamento(id);
      setOrcamentos((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert("Erro ao excluir: " + (err.message || err));
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("pt-BR");
    } catch {
      return d;
    }
  };

  return (
    <>
      <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          color: COLORS.text,
          fontFamily: FONTS.sans,
          padding: "40px 24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: COLORS.bg,
                fontFamily: FONTS.mono,
              }}
            >
              Q
            </div>
            <div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  margin: 0,
                  background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent2})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                QUANTISA
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: COLORS.textDim, fontFamily: FONTS.mono }}>
                Sistema de Orçamentação
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {/* New Budget Button / Form */}
          {!showNew ? (
            <button
              onClick={() => setShowNew(true)}
              style={{
                width: "100%",
                padding: "18px 24px",
                background: COLORS.surface,
                border: `2px dashed ${COLORS.border}`,
                borderRadius: 12,
                color: COLORS.accent,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: FONTS.sans,
                cursor: "pointer",
                marginBottom: 24,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = COLORS.accent;
                e.target.style.background = COLORS.accent + "10";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = COLORS.border;
                e.target.style.background = COLORS.surface;
              }}
            >
              + Novo Orçamento
            </button>
          ) : (
            <div
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.accent}40`,
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
              }}
            >
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: COLORS.accent }}>
                Novo Orçamento
              </h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input
                  placeholder="Nome do orçamento *"
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  style={{
                    flex: "2 1 200px",
                    padding: "10px 14px",
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    color: COLORS.text,
                    fontSize: 14,
                    fontFamily: FONTS.sans,
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
                  onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  autoFocus
                />
                <input
                  placeholder="Cliente"
                  value={newCliente}
                  onChange={(e) => setNewCliente(e.target.value)}
                  style={{
                    flex: "1 1 150px",
                    padding: "10px 14px",
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    color: COLORS.text,
                    fontSize: 14,
                    fontFamily: FONTS.sans,
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
                  onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
                <button
                  onClick={handleCreate}
                  disabled={creating || !newNome.trim()}
                  style={{
                    padding: "10px 24px",
                    background: creating ? COLORS.textMuted : COLORS.accent,
                    border: "none",
                    borderRadius: 8,
                    color: COLORS.bg,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: FONTS.sans,
                    cursor: creating ? "wait" : "pointer",
                    opacity: !newNome.trim() ? 0.4 : 1,
                  }}
                >
                  {creating ? "Criando..." : "Criar"}
                </button>
                <button
                  onClick={() => {
                    setShowNew(false);
                    setNewNome("");
                    setNewCliente("");
                  }}
                  style={{
                    padding: "10px 16px",
                    background: "transparent",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    color: COLORS.textDim,
                    fontSize: 14,
                    fontFamily: FONTS.sans,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: COLORS.red + "15",
                border: `1px solid ${COLORS.red}40`,
                borderRadius: 8,
                color: COLORS.red,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              ⚠️ {error}
              <button
                onClick={loadList}
                style={{
                  marginLeft: 12,
                  padding: "4px 12px",
                  background: COLORS.red + "20",
                  border: "none",
                  borderRadius: 4,
                  color: COLORS.red,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: 60, color: COLORS.textDim }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: `3px solid ${COLORS.border}`,
                  borderTopColor: COLORS.accent,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              Carregando orçamentos...
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orcamentos.length === 0 && (
            <div style={{ textAlign: "center", padding: 80, color: COLORS.textMuted }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: COLORS.textDim }}>
                Nenhum orçamento cadastrado
              </p>
              <p style={{ fontSize: 13 }}>Clique em "Novo Orçamento" para começar.</p>
            </div>
          )}

          {/* Cards Grid */}
          {!loading && orcamentos.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {orcamentos.map((orc) => (
                <div
                  key={orc.id}
                  onClick={() => router.push(`/orcamento/${orc.id}`)}
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 12,
                    padding: 20,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.accent + "60";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.accent}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.border;
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(orc.id, orc.nome);
                    }}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: "transparent",
                      border: `1px solid transparent`,
                      color: COLORS.textMuted,
                      fontSize: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = COLORS.red + "15";
                      e.target.style.borderColor = COLORS.red + "40";
                      e.target.style.color = COLORS.red;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.borderColor = "transparent";
                      e.target.style.color = COLORS.textMuted;
                    }}
                    title="Excluir orçamento"
                  >
                    ✕
                  </button>

                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: COLORS.text,
                      paddingRight: 28,
                    }}
                  >
                    {orc.nome}
                  </h3>

                  {orc.cliente && (
                    <p style={{ margin: "0 0 12px", fontSize: 13, color: COLORS.textDim }}>
                      {orc.cliente}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: COLORS.textMuted, fontFamily: FONTS.mono }}>
                    <span>{formatDate(orc.data)}</span>
                    <span>Rev. {orc.revisao || "00"}</span>
                  </div>

                  {orc.proponente && (
                    <div style={{ marginTop: 12, fontSize: 11, color: COLORS.textMuted }}>
                      {orc.proponente}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Spin animation */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
