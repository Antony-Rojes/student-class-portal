import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getSheetURL } from "../config";
import Papa from "papaparse";

function SocialMedia() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Papa.parse(getSheetURL("SocialMedia"), {
      download: true,
      header: true,
      complete: (results) => {
        const cleaned = results.data.filter(
          (row) => row["Name"] && row["Roll No"]
        );
        setStudents(cleaned);
        setLoading(false);
      },
    });
  }, []);

  const filtered = useMemo(() => {
    return students.filter(
      (s) =>
        s["Name"]?.toLowerCase().includes(search.toLowerCase()) ||
        s["Roll No"]?.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.bgGrid} />
      <div style={styles.bgGlowTop} />
      <div style={styles.bgGlowBottom} />

      <main style={styles.main} className="sm-main">
        <section style={styles.pageHeader} className="sm-page-header">
          <div style={styles.pageHeaderMain} className="sm-page-header-main">
            <div style={styles.eyebrowWrap}>
              <span style={styles.eyebrowDash} />
              <span style={styles.eyebrow}>Student Network</span>
            </div>

            <h1 style={styles.pageTitle}>
              Social <em style={styles.pageTitleEm}>Directory</em>
            </h1>

            <p style={styles.pageSub} className="sm-subheading">
              Search classmates, browse profiles, and jump directly to GitHub
              and LinkedIn from one clean directory.
            </p>
          </div>

          <div style={styles.metaBlock} className="sm-meta-block">
            <div style={styles.metaRow}>
              <div style={styles.metaLabel}>Directory Stats</div>
              <div style={styles.metaValue}>
                {loading ? "Loading..." : `${students.length} students`}
              </div>
            </div>
          </div>
        </section>

        <section style={styles.directoryCard}>
          <div style={styles.directoryTop} className="sm-directory-top">
            <div>
              <div style={styles.sectionKicker}>Class Contacts</div>
              <h3 style={styles.sectionTitle}>Browse the directory</h3>
            </div>

            <div style={styles.directoryTopRight} className="sm-directory-top-right">
              <div style={styles.searchWrap} className="sm-search-wrap">
                <span style={styles.searchIcon}>⌕</span>
                <input
                  style={styles.searchInput}
                  type="text"
                  placeholder="Search by name or roll no…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div style={styles.resultPill} className="sm-result-pill">
                {loading
                  ? "Loading…"
                  : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Loading directory…</p>
            </div>
          ) : (
            <div style={styles.tableShell}>
              <div
                style={styles.tableWrapper}
                className="sm-table-scroll"
              >
                <table style={styles.table} className="sm-table">
                  <thead>
                    <tr style={styles.theadRow}>
                      <th style={styles.th}>S.No</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Roll No</th>
                      <th style={styles.th}>GitHub</th>
                      <th style={styles.th}>LinkedIn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => (
                      <tr key={`${s["Roll No"]}-${i}`} style={styles.tr}>
                        <td style={{ ...styles.td, ...styles.indexCell }}>
                          {i + 1}
                        </td>

                        <td style={styles.td}>
                          <div style={styles.nameCell}>
                            <div style={styles.nameText}>{s["Name"]}</div>
                          </div>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.rollPill}>{s["Roll No"]}</span>
                        </td>

                        <td style={styles.td}>
                          {s["GitHub"] ? (
                            <a
                              href={s["GitHub"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.githubLink}
                              className="sm-link"
                            >
                              Open GitHub ↗
                            </a>
                          ) : (
                            <span style={styles.na}>Not added</span>
                          )}
                        </td>

                        <td style={styles.td}>
                          {s["LinkedIn"] ? (
                            <a
                              href={s["LinkedIn"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.linkedinLink}
                              className="sm-link"
                            >
                              Open LinkedIn ↗
                            </a>
                          ) : (
                            <span style={styles.na}>Not added</span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {!filtered.length && (
                      <tr>
                        <td colSpan={5} style={styles.emptyState}>
                          <div style={styles.emptyTitle}>No matching students</div>
                          <div style={styles.emptyText}>
                            Try a different name or roll number.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sm-table-scroll::-webkit-scrollbar { height: 9px; }
        .sm-table-scroll::-webkit-scrollbar-track { background: #F5F3EE; border-radius: 999px; }
        .sm-table-scroll::-webkit-scrollbar-thumb { background: rgba(196,77,24,0.28); border-radius: 999px; }
        .sm-table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(196,77,24,0.42); }

        .sm-link {
          transition: opacity 0.2s ease;
        }

        .sm-link:hover {
          opacity: 0.75;
        }

        @media (max-width: 960px) {
          .sm-page-header {
            flex-direction: column !important;
            align-items: stretch   !important;
            flex-wrap: nowrap      !important;
            gap: 0.35rem           !important;
            margin-bottom: 1rem    !important;
          }

          .sm-page-header-main {
            flex: 0 0 auto !important;
            width: 100%    !important;
            margin: 0      !important;
            padding: 0     !important;
          }

          .sm-subheading {
            margin: 0.35rem 0 0 !important;
            line-height: 1.5    !important;
            max-width: 100%     !important;
          }

          .sm-meta-block {
            width: 100%   !important;
            min-width: 0  !important;
            padding: 0.7rem 0.9rem !important;
          }

          .sm-directory-top {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }

          .sm-directory-top-right {
            width: 100% !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }

          .sm-search-wrap {
            flex: 1 1 180px !important;
          }
        }

        @media (max-width: 700px) {
          .sm-main {
            padding: 1.5rem 0.75rem 2.5rem !important;
          }

          .sm-table {
            min-width: 560px !important;
          }

          .sm-directory-top-right {
            flex-direction: column !important;
          }

          .sm-search-wrap {
            width: 100% !important;
            height: 36px !important;
            min-height: 36px !important;
            max-height: 36px !important;
            overflow: hidden !important;
          }

          .sm-result-pill {
            align-self: flex-start !important;
          }
        }

        @media (max-width: 520px) {
          .sm-main {
            padding: 1.25rem 0.65rem 2.25rem !important;
          }

          .sm-result-pill {
            padding: 0.4rem 0.7rem !important;
            font-size: 0.62rem     !important;
          }

          .sm-table {
            min-width: 520px !important;
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
    color: "#1A1714",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  bgGrid: {
    position: "fixed",
    inset: 0,
    backgroundImage: "radial-gradient(circle, rgba(26,23,20,0.045) 1px, transparent 1px)",
    backgroundSize: "26px 26px",
    pointerEvents: "none",
    zIndex: 0,
  },
  bgGlowTop: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse 700px 500px at 5% 10%, rgba(232,100,42,0.05) 0%, transparent 60%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  bgGlowBottom: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse 500px 400px at 95% 85%, rgba(232,100,42,0.04) 0%, transparent 55%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2.25rem 1.5rem 4rem",
    position: "relative",
    zIndex: 2,
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
  pageTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: "clamp(2rem, 3.8vw, 2.9rem)",
    fontWeight: 300,
    lineHeight: 1.08,
    letterSpacing: "-0.03em",
    margin: 0,
  },
  pageTitleEm: {
    fontStyle: "italic",
    color: "#5C554A",
  },
  pageSub: {
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
  directoryCard: {
    position: "relative",
    background: "#FFFFFF",
    border: "1px solid rgba(26,23,20,0.07)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(26,23,20,0.05), 0 10px 30px rgba(26,23,20,0.06)",
    animation: "fadeUp 0.7s ease both",
  },
  directoryTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    padding: "1.25rem 1.5rem 1rem",
    borderBottom: "1px solid rgba(26,23,20,0.07)",
    flexWrap: "wrap",
  },
  directoryTopRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexShrink: 0,
  },
  sectionKicker: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.62rem",
    letterSpacing: "0.13em",
    textTransform: "uppercase",
    color: "#9C9488",
    marginBottom: "0.35rem",
  },
  sectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: "1.1rem",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    color: "#1A1714",
    margin: 0,
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "#F5F3EE",
    border: "1px solid rgba(26,23,20,0.10)",
    borderRadius: "10px",
    padding: "0 0.75rem",
    height: "36px",
    minWidth: "200px",
    overflow: "hidden"
  },
  searchIcon: {
    color: "#9C9488",
    fontSize: "0.9rem",
    lineHeight: "36px",
    flexShrink: 0,
    userSelect: "none",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#1A1714",
    fontSize: "0.84rem",
    fontFamily: "'DM Sans', sans-serif",
    minWidth: 0,
  },
  resultPill: {
    background: "rgba(232,100,42,0.08)",
    color: "#C44D18",
    border: "1px solid rgba(232,100,42,0.22)",
    borderRadius: "999px",
    padding: "0.45rem 0.8rem",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.65rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  tableShell: {},
  tableWrapper: {
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    minWidth: "820px",
  },
  theadRow: {
    background: "#FFFDFC",
  },
  th: {
    textAlign: "left",
    padding: "0.9rem 1rem",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.68rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9C9488",
    fontWeight: 400,
    borderBottom: "1px solid rgba(26,23,20,0.07)",
    background: "#FFFDFC",
    position: "sticky",
    top: 0,
    zIndex: 1,
    whiteSpace: "nowrap",
  },
  tr: {
    transition: "background 0.2s ease",
  },
  td: {
    padding: "0.9rem 1rem",
    fontSize: "0.9rem",
    color: "#1A1714",
    whiteSpace: "nowrap",
    borderBottom: "1px solid rgba(26,23,20,0.05)",
    background: "#FFFFFF",
    verticalAlign: "middle",
  },
  indexCell: {
    color: "#9C9488",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.78rem",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  nameText: {
    fontSize: "0.94rem",
    color: "#1A1714",
    fontWeight: 500,
  },
  rollPill: {
    display: "inline-flex",
    alignItems: "center",
    background: "#F5F3EE",
    color: "#5C554A",
    border: "1px solid rgba(26,23,20,0.08)",
    borderRadius: "999px",
    padding: "0.38rem 0.65rem",
    fontSize: "0.78rem",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.04em",
  },
  githubLink: {
    color: "#E8642A",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.82rem",
  },
  linkedinLink: {
    color: "#0A66C2",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.82rem",
  },
  na: {
    color: "#B9B0A4",
    fontSize: "0.8rem",
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    gap: "12px",
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
    color: "#5C554A",
    fontSize: "0.9rem",
    margin: 0,
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1rem",
    background: "#FFFFFF",
  },
  emptyTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: "1.15rem",
    color: "#1A1714",
    marginBottom: "0.35rem",
  },
  emptyText: {
    fontSize: "0.88rem",
    color: "#5C554A",
  },
};

export default SocialMedia;