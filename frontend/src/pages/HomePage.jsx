import { useState, useEffect, useCallback } from "react";
import { getAllData, addEntry } from "../api/notebookApi";
import ToggleSwitch from "../components/ToggleSwitch";
import InputBar from "../components/InputBar";
import NoteCard from "../components/NoteCard";
import Toast from "../components/Toast";

export default function HomePage() {
  const [mode, setMode]           = useState("store");   // "store" | "view"
  const [notebookData, setNotebook]  = useState({});     // { heading: [entries] }
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(false);
  const [selectedHeading, setSelectedHeading] = useState(null);

  // ── Fetch all data ─────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const res = await getAllData();
      setNotebook(res.data.data || {});
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Submit new entry ───────────────────────────────────────────────────────
  const handleSubmit = async (heading, data) => {
    setLoading(true);
    try {
      await addEntry(heading, data);
      await fetchData();
      showToast();
      return true;
    } catch (err) {
      console.error("Failed to add entry:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ── Toast flash ────────────────────────────────────────────────────────────
  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 1000);
  };

  // ── Mode toggle ────────────────────────────────────────────────────────────
  const handleToggle = (newMode) => {
    setMode(newMode);
    setSelectedHeading(null);
  };

  const headings = Object.keys(notebookData);

  return (
    <div style={page}>
      <Toast message="DATA STORED SUCCESSFULLY" visible={toast} />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header style={header}>
        <div style={logoArea}>
          <span style={logo}>📓</span>
          <span style={logoText}>Notebook</span>
        </div>
        <ToggleSwitch mode={mode} onToggle={handleToggle} />
        <div style={countArea}>
          <span style={countLabel}>{headings.length} section{headings.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main style={main}>

        {/* STORE mode */}
        {mode === "store" && (
          <div style={storePanel}>
            <h2 style={sectionTitle}>Store a Note</h2>
            <p style={sectionHint}>
              Type a <em>heading</em> and your <em>note</em> in the bar below, then press{" "}
              <kbd style={kbd}>Enter</kbd> or click <strong>Save</strong>.
            </p>

            {headings.length > 0 && (
              <>
                <h3 style={subTitle}>Existing Sections</h3>
                <div style={tagCloud}>
                  {headings.map((h) => (
                    <span key={h} style={tag}>{h} · {notebookData[h].length}</span>
                  ))}
                </div>
              </>
            )}

            {headings.length === 0 && (
              <div style={emptyState}>
                <span style={emptyIcon}>✦</span>
                <p>Your notebook is empty. Add your first note below.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW mode */}
        {mode === "view" && (
          <div style={viewPanel}>
            <h2 style={sectionTitle}>All Notes</h2>

            {headings.length === 0 ? (
              <div style={emptyState}>
                <span style={emptyIcon}>✦</span>
                <p>Nothing stored yet. Switch to <em>Store</em> to add notes.</p>
              </div>
            ) : (
              <div style={cardGrid}>
                {headings.map((h) => (
                  <NoteCard
                    key={h}
                    heading={h}
                    entries={notebookData[h]}
                    onRefresh={fetchData}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Bottom input bar ──────────────────────────────────────────────── */}
      <InputBar onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const page = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "var(--bg)",
  paddingBottom: "80px",
};
const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "18px 28px",
  borderBottom: "1px solid var(--border-light)",
  background: "var(--bg-input)",
  boxShadow: "var(--shadow-sm)",
  position: "sticky",
  top: 0,
  zIndex: 50,
  gap: "0",
};
const logoArea = {
  position: "absolute",
  left: "28px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};
const logo = { fontSize: "20px" };
const logoText = {
  fontFamily: "var(--font-serif)",
  fontWeight: 500,
  fontSize: "16px",
  fontStyle: "italic",
  color: "var(--text-primary)",
  letterSpacing: "-0.02em",
};
const countArea = {
  position: "absolute",
  right: "28px",
};
const countLabel = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  color: "var(--text-muted)",
  letterSpacing: "0.06em",
};
const main = {
  flex: 1,
  maxWidth: "780px",
  margin: "0 auto",
  width: "100%",
  padding: "36px 24px",
};
const sectionTitle = {
  fontFamily: "var(--font-serif)",
  fontSize: "26px",
  fontWeight: 400,
  fontStyle: "italic",
  color: "var(--text-primary)",
  marginBottom: "10px",
  letterSpacing: "-0.02em",
};
const sectionHint = {
  color: "var(--text-muted)",
  fontSize: "14px",
  marginBottom: "28px",
  lineHeight: 1.6,
};
const subTitle = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: "12px",
};
const storePanel = {};
const viewPanel  = {};
const tagCloud = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};
const tag = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-pill)",
  padding: "5px 14px",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  color: "var(--text-secondary)",
  letterSpacing: "0.04em",
};
const cardGrid = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
const emptyState = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "14px",
  padding: "60px 24px",
  color: "var(--text-muted)",
  textAlign: "center",
  fontSize: "14px",
};
const emptyIcon = {
  fontSize: "32px",
  opacity: 0.3,
};
const kbd = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  padding: "1px 6px",
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
  color: "var(--text-secondary)",
};
