import { useState } from "react";

export default function InputBar({ onSubmit, loading }) {
  const [heading, setHeading] = useState("");
  const [data, setData]       = useState("");

  const handleSubmit = async () => {
    if (!heading.trim() || !data.trim()) return;
    const success = await onSubmit(heading.trim(), data.trim());
    if (success) {
      setHeading("");
      setData("");
    }
  };

  const canSubmit = !loading && heading.trim() && data.trim();

  return (
    <div style={bar}>
      <div style={pill}>
        <input
          style={headingInput}
          placeholder="Heading…"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={40}
        />
        <div style={divider} />
        <input
          style={dataInput}
          placeholder="Write your note here…"
          value={data}
          onChange={(e) => setData(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          style={{ ...saveBtn, ...(!canSubmit ? saveBtnDisabled : {}) }}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? "…" : "Save"}
        </button>
      </div>
      <p style={hint}>Press Enter or click Save</p>
    </div>
  );
}

const bar = {
  position: "fixed",
  bottom: 0, left: 0, right: 0,
  background: "var(--bg-input)",
  borderTop: "1px solid var(--border-light)",
  boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
  padding: "14px 24px 10px",
  zIndex: 100,
};
const pill = {
  display: "flex",
  alignItems: "center",
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: "999px",
  padding: "4px 4px 4px 22px",
  maxWidth: "860px",
  margin: "0 auto",
};
const baseInput = {
  border: "none", outline: "none", background: "transparent",
  fontFamily: "var(--font-serif)", fontSize: "14px",
  color: "var(--text-primary)", padding: "7px 0",
};
const headingInput = {
  ...baseInput,
  width: "140px", flexShrink: 0,
  fontStyle: "italic", fontWeight: 500, color: "var(--accent)",
};
const dataInput = { ...baseInput, flex: 1, minWidth: 0, padding: "7px 12px" };
const divider = { width: "1px", height: "20px", background: "var(--border)", flexShrink: 0 };
const saveBtn = {
  marginLeft: "8px", padding: "8px 24px",
  background: "var(--accent)", color: "#fff",
  border: "none", borderRadius: "999px",
  fontFamily: "var(--font-mono)", fontSize: "11px",
  fontWeight: 500, letterSpacing: "0.07em",
  textTransform: "uppercase", cursor: "pointer",
  flexShrink: 0, transition: "opacity 0.15s ease",
};
const saveBtnDisabled = { opacity: 0.35, cursor: "not-allowed" };
const hint = {
  textAlign: "center", fontSize: "11px",
  color: "var(--text-muted)", margin: "7px 0 0",
  fontFamily: "var(--font-mono)", letterSpacing: "0.04em",
};
