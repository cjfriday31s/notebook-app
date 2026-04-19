import { useState } from "react";
import { updateEntry, deleteEntry, deleteHeading } from "../api/notebookApi";

export default function NoteCard({ heading, entries, onRefresh }) {
  const [expanded, setExpanded]   = useState(false);
  const [editing, setEditing]     = useState(null);   // index being edited
  const [editVal, setEditVal]     = useState("");

  const handleDelete = async (data) => {
    try {
      await deleteEntry(heading, data);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHeading = async () => {
    if (!window.confirm(`Delete the entire "${heading}" section?`)) return;
    try {
      await deleteHeading(heading);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (idx) => {
    setEditing(idx);
    setEditVal(entries[idx]);
  };

  const saveEdit = async (idx) => {
    if (!editVal.trim() || editVal === entries[idx]) { setEditing(null); return; }
    try {
      await updateEntry(heading, entries[idx], editVal.trim());
      setEditing(null);
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const count = entries.length;

  return (
    <div style={card}>
      {/* ── Header ── */}
      <div style={cardHeader} onClick={() => setExpanded((p) => !p)}>
        <div style={headerLeft}>
          <span style={chevron(expanded)}>›</span>
          <h3 style={headingStyle}>{heading}</h3>
          <span style={badge}>{count}</span>
        </div>
        <button
          style={dangerBtn}
          onClick={(e) => { e.stopPropagation(); handleDeleteHeading(); }}
          title="Delete section"
        >
          ✕
        </button>
      </div>

      {/* ── Entries ── */}
      {expanded && (
        <ul style={list}>
          {entries.map((entry, idx) => (
            <li key={idx} style={listItem}>
              {editing === idx ? (
                <div style={editRow}>
                  <input
                    style={editInput}
                    value={editVal}
                    autoFocus
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(idx);
                      if (e.key === "Escape") setEditing(null);
                    }}
                  />
                  <button style={saveBtn} onClick={() => saveEdit(idx)}>Save</button>
                  <button style={cancelBtn} onClick={() => setEditing(null)}>✕</button>
                </div>
              ) : (
                <div style={entryRow}>
                  <span style={bullet}>—</span>
                  <span style={entryText}>{entry}</span>
                  <div style={actions}>
                    <button style={iconBtn} title="Edit" onClick={() => startEdit(idx)}>✎</button>
                    <button style={{ ...iconBtn, color: "var(--danger)" }} title="Delete" onClick={() => handleDelete(entry)}>✕</button>
                  </div>
                </div>
              )}
            </li>
          ))}
          {count === 0 && <li style={empty}>No entries yet.</li>}
        </ul>
      )}
    </div>
  );
}

// ─── Inline styles ────────────────────────────────────────────────────────────
const card = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-light)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  boxShadow: "var(--shadow-sm)",
  transition: "box-shadow 0.2s ease",
};
const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 18px",
  cursor: "pointer",
  userSelect: "none",
  background: "var(--bg-card)",
  borderBottom: "1px solid var(--border-light)",
};
const headerLeft = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};
const chevron = (open) => ({
  fontSize: "18px",
  color: "var(--text-muted)",
  transform: open ? "rotate(90deg)" : "rotate(0deg)",
  transition: "transform 0.2s ease",
  lineHeight: 1,
});
const headingStyle = {
  fontFamily: "var(--font-serif)",
  fontWeight: 500,
  fontSize: "15px",
  color: "var(--text-primary)",
  letterSpacing: "0.01em",
};
const badge = {
  background: "var(--bg-hover)",
  color: "var(--text-muted)",
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  padding: "2px 8px",
  borderRadius: "var(--radius-pill)",
};
const dangerBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--text-muted)",
  fontSize: "12px",
  padding: "4px 8px",
  borderRadius: "var(--radius-sm)",
  transition: "var(--transition)",
};
const list = {
  listStyle: "none",
  padding: "8px 0",
};
const listItem = {
  padding: "4px 18px",
};
const entryRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 0",
  borderBottom: "1px solid var(--border-light)",
};
const bullet = {
  color: "var(--text-muted)",
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
  flexShrink: 0,
};
const entryText = {
  flex: 1,
  color: "var(--text-secondary)",
  fontFamily: "var(--font-serif)",
  fontSize: "14px",
  lineHeight: 1.5,
};
const actions = {
  display: "flex",
  gap: "4px",
  opacity: 0.4,
  transition: "opacity 0.15s ease",
};
const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--accent-soft)",
  fontSize: "13px",
  padding: "2px 6px",
  borderRadius: "var(--radius-sm)",
};
const editRow = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  padding: "4px 0",
};
const editInput = {
  flex: 1,
  padding: "6px 10px",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  fontFamily: "var(--font-serif)",
  fontSize: "14px",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
  outline: "none",
};
const saveBtn = {
  padding: "6px 14px",
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
};
const cancelBtn = {
  padding: "6px 10px",
  background: "var(--bg-hover)",
  color: "var(--text-secondary)",
  border: "none",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
};
const empty = {
  padding: "10px 18px",
  color: "var(--text-muted)",
  fontStyle: "italic",
  fontSize: "13px",
};
