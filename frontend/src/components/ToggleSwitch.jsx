const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-pill)",
    padding: "4px",
    gap: "2px",
    boxShadow: "var(--shadow-sm)",
  },
  pill: {
    padding: "7px 22px",
    borderRadius: "var(--radius-pill)",
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "none",
    transition: "var(--transition)",
    userSelect: "none",
  },
  active: {
    background: "var(--bg-input)",
    color: "var(--text-primary)",
    boxShadow: "var(--shadow-sm)",
  },
  inactive: {
    background: "transparent",
    color: "var(--text-muted)",
  },
};

export default function ToggleSwitch({ mode, onToggle }) {
  return (
    <div style={styles.wrapper}>
      <button
        style={{ ...styles.pill, ...(mode === "store" ? styles.active : styles.inactive) }}
        onClick={() => onToggle("store")}
      >
        Store
      </button>
      <button
        style={{ ...styles.pill, ...(mode === "view" ? styles.active : styles.inactive) }}
        onClick={() => onToggle("view")}
      >
        View All
      </button>
    </div>
  );
}
