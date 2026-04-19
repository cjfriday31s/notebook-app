import { useEffect, useState } from "react";

const styles = {
  toast: {
    position: "fixed",
    top: "28px",
    left: "50%",
    transform: "translateX(-50%) translateY(-8px)",
    background: "var(--success-bg)",
    color: "var(--success)",
    border: "1px solid #b2d9b8",
    borderRadius: "var(--radius-pill)",
    padding: "10px 24px",
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    boxShadow: "var(--shadow-md)",
    zIndex: 9999,
    opacity: 0,
    transition: "opacity 0.25s ease, transform 0.25s ease",
    pointerEvents: "none",
  },
  visible: {
    opacity: 1,
    transform: "translateX(-50%) translateY(0px)",
  },
};

export default function Toast({ message, visible }) {
  return (
    <div style={{ ...styles.toast, ...(visible ? styles.visible : {}) }}>
      ✓ &nbsp;{message}
    </div>
  );
}
