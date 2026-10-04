import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getSheetURL } from "../config";
import Papa from "papaparse";

function WhatsApp() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(getSheetURL("WhatsApp"), {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedGroups = (results?.data || [])
          .map((row) => ({
            name: row?.["Group Name"]?.trim?.() || "",
            link: row?.["Link"]?.trim?.() || "",
          }))
          .filter((row) => row.name && row.link);

        setGroups(parsedGroups);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error loading WhatsApp groups:", error);
        setGroups([]);
        setLoading(false);
      },
    });
  }, []);

  const totalGroupsText = useMemo(() => {
    return `${groups.length} group${groups.length !== 1 ? "s" : ""}`;
  }, [groups]);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.bgTexture} />
      <div style={styles.bgGlowLeft} />
      <div style={styles.bgGlowRight} />

      <div style={styles.container} className="wa-container">
        <div style={styles.pageHeader} className="wa-page-header">
          <div style={styles.pageHeaderMain} className="wa-page-header-main">
            <div style={styles.eyebrowWrap}>
              <span style={styles.eyebrowDash} />
              <span style={styles.eyebrow}>Student Connect</span>
            </div>

            <h1 style={styles.heading}>
              WhatsApp <em style={styles.headingEm}>Groups</em>
            </h1>

            <p style={styles.subheading} className="wa-subheading">
              Join your class groups, stay updated, and access invite links in one place.
            </p>
          </div>

          <div style={styles.metaBlock} className="wa-meta-block">
            <div style={styles.metaRow}>
              <div style={styles.metaLabel}>Available</div>
              <div style={styles.metaValue}>{loading ? "Loading..." : totalGroupsText}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingCard}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIconWrap}>
              <span style={styles.emptyIcon}>💬</span>
            </div>
            <h3 style={styles.emptyTitle}>Upcoming WhatsApp Groups</h3>
            <p style={styles.emptyText}>
              WhatsApp group links will be updated here.
            </p>
          </div>
        ) : (
          <div style={styles.grid} className="wa-grid">
            {groups.map((group, i) => (
              <div key={`${group.name}-${i}`} style={styles.card} className="wa-card">
                <div style={styles.cardTop}>
                  <div style={styles.iconWrap}>
                    <span style={styles.icon}>💬</span>
                  </div>
                  <span style={styles.cardTag}>Community</span>
                </div>

                <div style={styles.cardBody}>
                  <h3 style={styles.name}>{group.name}</h3>
                  <p style={styles.cardDesc}>
                    Join this WhatsApp group to stay connected with announcements and classmates.
                  </p>
                </div>

                <a
                  href={group.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.button}
                >
                  <span>Join Group</span>
                  <span style={styles.buttonArrow}>→</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 960px) {
          .wa-page-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0 !important; 
            margin-bottom: 1rem !important;
          }

          .wa-page-header-main {
            width: 100% !important;
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
          }

          .wa-subheading {
            max-width: 100% !important;
          }

          .wa-meta-block {
            width: 100% !important;
            min-width: 0 !important;
            margin-top: 0.5rem !important;
          }
        }

        @media (max-width: 700px) {
          .wa-container {
            padding: 1.5rem 0.8rem 2.5rem !important;
          }

          .wa-grid {
            grid-template-columns: 1fr !important;
            gap: 0.9rem !important;
          }

          .wa-card {
            padding: 1rem !important;
          }
        }

        @media (max-width: 520px) {
          .wa-container {
            padding: 1.25rem 0.65rem 2.2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FAFAF8",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1A1714",
    position: "relative",
    overflowX: "hidden",
  },
  bgTexture: {
    position: "fixed",
    inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(26,23,20,0.045) 1px, transparent 1px)",
    backgroundSize: "26px 26px",
    pointerEvents: "none",
    zIndex: 0,
  },
  bgGlowLeft: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse 700px 500px at 5% 10%, rgba(232,100,42,0.05) 0%, transparent 60%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  bgGlowRight: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse 500px 400px at 95% 85%, rgba(232,100,42,0.04) 0%, transparent 55%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2.25rem 1.5rem 4rem",
    position: "relative",
    zIndex: 1,
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "1rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    animation: "fadeUp 0.6s ease both",
  },
  pageHeaderMain: {
    flex: "1 1 auto",
  },
  eyebrowWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "0.75rem",
  },
  eyebrowDash: {
    width: "20px",
    height: "1.5px",
    background: "#E8642A",
    opacity: 0.55,
  },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.64rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#E8642A",
  },
  heading: {
    margin: 0,
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(2rem, 3.8vw, 2.9rem)",
    fontWeight: 300,
    lineHeight: 1.08,
    letterSpacing: "-0.03em",
  },
  headingEm: {
    fontStyle: "italic",
    color: "#5C554A",
  },
  subheading: {
    margin: "0.7rem 0 0",
    maxWidth: "46ch",
    fontSize: "0.92rem",
    lineHeight: 1.7,
    color: "#5C554A",
    fontWeight: 300,
  },
  metaBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: "0.75rem",
    background: "rgba(255,255,255,0.68)",
    border: "1px solid rgba(26,23,20,0.07)",
    borderRadius: "18px",
    padding: "0.9rem 1rem",
    backdropFilter: "blur(10px)",
    flexShrink: 0,
    minWidth: "220px",
  },
  metaRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.22rem",
    flex: 1,
    minWidth: 0,
  },
  metaLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.62rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9C9488",
  },
  metaValue: {
    fontSize: "0.9rem",
    color: "#1A1714",
    fontWeight: 500,
    lineHeight: 1.3,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid rgba(26,23,20,0.07)",
    borderRadius: "20px",
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "0 1px 3px rgba(26,23,20,0.05), 0 10px 26px rgba(26,23,20,0.05)",
    animation: "fadeUp 0.6s ease both",
    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.8rem",
  },
  iconWrap: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "rgba(37, 211, 102, 0.10)",
    border: "1px solid rgba(37, 211, 102, 0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  icon: {
    fontSize: "1.35rem",
  },
  cardTag: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.28rem 0.58rem",
    borderRadius: "999px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.58rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: "rgba(232,100,42,0.08)",
    color: "#C44D18",
    border: "1px solid rgba(232,100,42,0.22)",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
    flex: 1,
  },
  name: {
    margin: 0,
    fontFamily: "'Fraunces', serif",
    fontSize: "1.05rem",
    fontWeight: 400,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
    color: "#1A1714",
  },
  cardDesc: {
    margin: 0,
    fontSize: "0.82rem",
    lineHeight: 1.65,
    color: "#5C554A",
    fontWeight: 300,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.55rem",
    padding: "0.78rem 1rem",
    background: "#E8642A",
    color: "#FFFFFF",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "0.84rem",
    fontWeight: 600,
    boxShadow: "0 3px 12px rgba(232,100,42,0.13)",
    transition: "background 0.2s ease, transform 0.2s ease, gap 0.2s ease",
  },
  buttonArrow: {
    fontSize: "0.95rem",
    lineHeight: 1,
  },
  loadingCard: {
    background: "#FFFFFF",
    border: "1px solid rgba(26,23,20,0.07)",
    borderRadius: "24px",
    padding: "4rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.9rem",
    boxShadow: "0 1px 3px rgba(26,23,20,0.05), 0 10px 30px rgba(26,23,20,0.06)",
  },
  spinner: {
    width: "34px",
    height: "34px",
    border: "3px solid rgba(232,100,42,0.15)",
    borderTop: "3px solid #E8642A",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#5C554A",
  },
  emptyCard: {
    background: "#FFFFFF",
    border: "1px solid rgba(26,23,20,0.07)",
    borderRadius: "24px",
    padding: "3rem 1.5rem",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(26,23,20,0.05), 0 10px 30px rgba(26,23,20,0.06)",
  },
  emptyIconWrap: {
    width: "62px",
    height: "62px",
    margin: "0 auto 1rem",
    borderRadius: "18px",
    background: "#F5F3EE",
    border: "1px solid rgba(26,23,20,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: "1.5rem",
  },
  emptyTitle: {
    margin: 0,
    fontFamily: "'Fraunces', serif",
    fontSize: "1.2rem",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    color: "#1A1714",
  },
  emptyText: {
    margin: "0.55rem auto 0",
    maxWidth: "42ch",
    fontSize: "0.88rem",
    color: "#5C554A",
    lineHeight: 1.65,
    fontWeight: 300,
  },
};

export default WhatsApp;