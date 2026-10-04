import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [usersSnap, snapshotsSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "snapshots")),
        ]);

        const snapshots = {};
        let newestTimestamp = null;

        snapshotsSnap.forEach((doc) => {
          const data = doc.data();
          snapshots[data.userId] = data;

          const ts = data.createdAt?.toDate?.();
          if (ts && (!newestTimestamp || ts > newestTimestamp)) {
            newestTimestamp = ts;
          }
        });

        if (newestTimestamp) setLastSynced(newestTimestamp);

        const results = [];
        usersSnap.forEach((doc) => {
          const user = doc.data();
          const snap = snapshots[doc.id] || null;

          results.push({
            id: doc.id,
            name: user?.name || "Unknown Student",
            weeklyEasy:      snap?.weeklyEasy      || 0,
            weeklyMedium:    snap?.weeklyMedium    || 0,
            weeklyHard:      snap?.weeklyHard      || 0,
            totalSolved:     snap?.totalSolved     || 0,
            prevTotalSolved: snap?.prevTotalSolved ?? null,
            score:           snap?.score           || 0,
            problems:        snap?.weeklyProblems  || [],
          });
        });

        results.sort((a, b) => b.score - a.score);
        setLeaderboard(results.filter((r) => r.score > 0));
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const lastSyncedText = useMemo(() => {
    if (!lastSynced) return "Not available";
    return lastSynced.toLocaleString([], {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [lastSynced]);

  const toggleExpanded = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  const getRankTone = (rank) => {
    if (rank === 1) return styles.rankGold;
    if (rank === 2) return styles.rankSilver;
    if (rank === 3) return styles.rankBronze;
    return styles.rankDefault;
  };

  const getRowTone = (rank) => {
    if (rank === 1) return styles.rowGold;
    if (rank === 2) return styles.rowSilver;
    if (rank === 3) return styles.rowBronze;
    return {};
  };

  const getDifficultyChipStyle = (difficulty) => {
    if (difficulty === "Easy")   return { ...styles.problemMeta, ...styles.easyPill };
    if (difficulty === "Medium") return { ...styles.problemMeta, ...styles.mediumPill };
    if (difficulty === "Hard")   return { ...styles.problemMeta, ...styles.hardPill };
    return styles.problemMeta;
  };

  const getCountDot = (total, prev) => {
    if (prev === null || prev === undefined)
      return <span className="dot dot-gray" title="No previous data" />;
    if (total > prev)
      return <span className="dot dot-green" title={`+${total - prev} since last sync`} />;
    if (total === prev)
      return <span className="dot dot-yellow" title="No change since last sync" />;
    return <span className="dot dot-red" title={`-${prev - total} since last sync`} />;
  };

  const LegendDot = ({ color }) => <span className={`dot dot-${color}`} />;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.bgTexture} />
      <div style={styles.bgGlowLeft} />
      <div style={styles.bgGlowRight} />

      <div style={styles.container} className="lb-container">
        <div style={styles.pageHeader} className="lb-page-header">
          <div style={styles.pageHeaderMain} className="lb-page-header-main">
            <div style={styles.eyebrowWrap}>
              <span style={styles.eyebrowDash} />
              <span style={styles.eyebrow}>Performance Board</span>
            </div>

            <h1 style={styles.heading}>
              Weekly <em style={styles.headingEm}>Leaderboard</em>
            </h1>

            <p style={styles.subheading} className="lb-subheading">
              Ranking students by weekly coding score with live sync metadata and responsive table access.
            </p>
          </div>

          <div style={styles.metaBlock} className="lb-meta-block">
            <div style={styles.metaRow}>
              <div style={styles.metaLabel}>Last synced (Recent 7 days)</div>
              <div style={styles.metaValue}>{lastSyncedText}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingCard}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading leaderboard...</p>
          </div>
        ) : (
          <div style={styles.boardCard}>
            <div style={styles.boardTopBar} />

            <div style={styles.boardHeader} className="lb-board-header">
              <div>
                <div style={styles.boardTitle}>Top performers this week</div>
              </div>
              <div style={styles.boardHeaderRight} className="lb-board-header-right">
                <div style={styles.boardCount} className="lb-board-count">
                  {leaderboard.length} participants
                </div>
              </div>
            </div>

            <div style={styles.tableWrapper} className="leaderboard-scrollbar">
              <table style={styles.table} className="lb-table">
                <thead>
                  <tr>
                    <th style={styles.th}>Rank</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Solved</th>
                    <th style={styles.th}>Easy</th>
                    <th style={styles.th}>Medium</th>
                    <th style={styles.th}>Hard</th>
                    <th style={styles.th}>Score</th>
                    <th style={{ ...styles.th, textAlign: "center" }}>Count</th>
                    <th style={styles.thRight}>View</th>
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.map((row, i) => {
                    const rank = i + 1;
                    const isOpen = expandedRow === i;
                    const isCurrentUser = row.id === currentUserId;

                    return (
                      <React.Fragment key={row.id}>
                        <tr
                          style={{ ...styles.tr, ...getRowTone(rank) }}
                          onClick={() => toggleExpanded(i)}
                        >
                          <td style={styles.td}>
                            <span style={{ ...styles.rankBadge, ...getRankTone(rank) }}>
                              {String(rank).padStart(2, "0")}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <div style={styles.nameCell}>
                              <div style={rank <= 3 ? styles.nameTop : styles.name}>
                                {isCurrentUser ? (
                                  <span style={styles.youBadge}>Y🔥U</span>
                                ) : (
                                  row.name
                                )}
                              </div>
                            </div>
                          </td>

                          <td style={styles.tdStrong}>{row.totalSolved}</td>

                          <td style={styles.td}>
                            <span style={{ ...styles.statPill, ...styles.easyPill }}>
                              {row.weeklyEasy}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <span style={{ ...styles.statPill, ...styles.mediumPill }}>
                              {row.weeklyMedium}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <span style={{ ...styles.statPill, ...styles.hardPill }}>
                              {row.weeklyHard}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <span style={styles.scoreValue}>{row.score}</span>
                          </td>

                          <td style={{ ...styles.td, textAlign: "center" }}>
                            {getCountDot(row.totalSolved, row.prevTotalSolved)}
                          </td>

                          <td style={styles.tdRight}>
                            <button
                              type="button"
                              style={styles.expandBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(i);
                              }}
                              aria-label={isOpen ? "Collapse" : "Expand"}
                            >
                              {isOpen ? "−" : "+"}
                            </button>
                          </td>
                        </tr>

                        {isOpen && (
                          <tr>
                            <td colSpan="9" style={styles.expandTd}>
                              <div style={styles.expandCard}>
                                <div style={styles.expandHeader}>
                                  <div style={styles.expandLabel}>Problems solved this week</div>
                                  <div style={styles.expandCount}>
                                    {row.problems.length} problem
                                    {row.problems.length !== 1 ? "s" : ""}
                                  </div>
                                </div>

                                <div style={styles.chipContainer} className="lb-problem-container">
                                  {row.problems.length > 0 ? (
                                    row.problems.map((p, j) => (
                                      <div
                                        key={`${p.titleSlug || p.title}-${j}`}
                                        style={styles.problemChipCard}
                                        className="lb-problem-card"
                                      >
                                        <div style={styles.problemTitle}>{p.title}</div>
                                        <div style={styles.problemMetaRow}>
                                          <span style={getDifficultyChipStyle(p.difficulty)}>
                                            {p.difficulty || "Unknown"}
                                          </span>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <span style={styles.emptyState}>
                                      No problems solved this week.
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={styles.countLegend} className="lb-legend">
              <span style={styles.legendNote}>Compared To Previous Sync</span>
              <span style={styles.legendSep}>—</span>
              <span style={styles.legendItem}>
                <LegendDot color="green" /> Problem Count Increased
              </span>
              <span style={styles.legendItem}>
                <LegendDot color="yellow" /> No change in Problem Count
              </span>
              <span style={styles.legendItem}>
                <LegendDot color="red" /> Problem Count Decreased
              </span>
            </div>

          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-green  { background-color: #059669; }
        .dot-yellow { background-color: #D97706; }
        .dot-red    { background-color: #DC2626; }
        .dot-gray   { background-color: #C9C4BC; }

        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

          .dot-green  { background-color: #059669 !important; box-shadow: inset 0 0 0 10px #059669; }
          .dot-yellow { background-color: #D97706 !important; box-shadow: inset 0 0 0 10px #D97706; }
          .dot-red    { background-color: #DC2626 !important; box-shadow: inset 0 0 0 10px #DC2626; }
          .dot-gray   { background-color: #C9C4BC !important; box-shadow: inset 0 0 0 10px #C9C4BC; }

          button { display: none !important; }
        }

        .leaderboard-scrollbar::-webkit-scrollbar       { height: 9px; }
        .leaderboard-scrollbar::-webkit-scrollbar-track { background: #F5F3EE; border-radius: 999px; }
        .leaderboard-scrollbar::-webkit-scrollbar-thumb { background: rgba(196,77,24,0.28); border-radius: 999px; }
        .leaderboard-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(196,77,24,0.42); }

        @media (max-width: 960px) {
          .lb-page-header       { flex-direction: column !important; align-items: stretch !important; flex-wrap: nowrap !important; gap: 0.35rem !important; margin-bottom: 1rem !important; }
          .lb-page-header-main  { flex: 0 0 auto !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .lb-subheading        { margin: 0.35rem 0 0 !important; line-height: 1.5 !important; max-width: 100% !important; }
          .lb-meta-block        { width: 100% !important; min-width: 0 !important; padding: 0.7rem 0.9rem !important; }
          .lb-board-header      { flex-direction: column !important; align-items: flex-start !important; gap: 0.6rem !important; }
          .lb-board-header-right{ width: 100% !important; align-items: flex-start !important; }
        }

        @media (max-width: 700px) {
          .lb-container         { padding: 1.5rem 0.75rem 2.5rem !important; }
          .lb-table             { min-width: 560px !important; }
          .lb-problem-container { flex-direction: column !important; }
          .lb-problem-card      { min-width: 100% !important; flex: 1 1 100% !important; }
          .lb-legend            { flex-direction: column !important; align-items: flex-start !important; padding-left: 2rem !important; gap: 0.45rem !important; }
          .lb-legend > span     { width: 100% !important; display: inline-flex !important; align-items: center !important; }
        }

        @media (max-width: 520px) {
          .lb-board-count  { padding: 0.4rem 0.7rem !important; font-size: 0.62rem !important; }
          .lb-table        { min-width: 520px !important; }
          .lb-problem-card { padding: 0.7rem 0.8rem !important; }
          .lb-container    { padding: 1.25rem 0.65rem 2.25rem !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page:         { minHeight: "100vh", background: "#FAFAF8", fontFamily: "'DM Sans', sans-serif", color: "#1A1714", position: "relative", overflowX: "hidden" },
  bgTexture:    { position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, rgba(26,23,20,0.045) 1px, transparent 1px)", backgroundSize: "26px 26px", pointerEvents: "none", zIndex: 0 },
  bgGlowLeft:   { position: "fixed", inset: 0, background: "radial-gradient(ellipse 700px 500px at 5% 10%, rgba(232,100,42,0.05) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 },
  bgGlowRight:  { position: "fixed", inset: 0, background: "radial-gradient(ellipse 500px 400px at 95% 85%, rgba(232,100,42,0.04) 0%, transparent 55%)", pointerEvents: "none", zIndex: 0 },
  container:    { maxWidth: "1400px", margin: "0 auto", padding: "2.25rem 1.5rem 4rem", position: "relative", zIndex: 1 },
  pageHeader:   { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", marginBottom: "1.4rem", flexWrap: "wrap", animation: "fadeUp 0.6s ease both" },
  pageHeaderMain: { flex: "1 1 380px" },
  eyebrowWrap:  { display: "inline-flex", alignItems: "center", gap: "9px", marginBottom: "0.75rem" },
  eyebrowDash:  { width: "20px", height: "1.5px", background: "#E8642A", opacity: 0.55 },
  eyebrow:      { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.64rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#E8642A" },
  heading:      { margin: 0, fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 3.8vw, 2.9rem)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.03em" },
  headingEm:    { fontStyle: "italic", color: "#5C554A" },
  subheading:   { margin: "0.7rem 0 0", maxWidth: "44ch", fontSize: "0.92rem", lineHeight: 1.7, color: "#5C554A", fontWeight: 300 },
  metaBlock:    { display: "flex", flexDirection: "row", alignItems: "stretch", gap: "0.75rem", marginTop: "1rem", background: "rgba(255,255,255,0.68)", border: "1px solid rgba(26,23,20,0.07)", borderRadius: "18px", padding: "0.9rem 1rem", backdropFilter: "blur(10px)", flexShrink: 0, minWidth: "240px" },
  metaRow:      { display: "flex", flexDirection: "column", gap: "0.22rem", flex: 1, minWidth: 0 },
  metaLabel:    { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C9488" },
  metaValue:    { fontSize: "0.9rem", color: "#1A1714", fontWeight: 500, lineHeight: 1.3, wordBreak: "break-word" },
  boardCard:    { position: "relative", background: "#FFFFFF", border: "1px solid rgba(26,23,20,0.07)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 1px 3px rgba(26,23,20,0.05), 0 10px 30px rgba(26,23,20,0.06)", animation: "fadeUp 0.7s ease both" },
  boardTopBar:  { height: "3px", background: "linear-gradient(90deg, #C44D18, #F5A66E, #C44D18)" },
  boardHeader:  { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem 1rem", borderBottom: "1px solid rgba(26,23,20,0.07)", flexWrap: "wrap" },
  boardHeaderRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.45rem" },
  boardTitle:   { fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 400, letterSpacing: "-0.02em", color: "#1A1714" },
  boardCount:   { background: "rgba(232,100,42,0.08)", color: "#C44D18", border: "1px solid rgba(232,100,42,0.22)", borderRadius: "999px", padding: "0.45rem 0.8rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", alignSelf: "flex-start" },
  tableWrapper: { overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table:        { width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: "820px" },
  th:           { textAlign: "left", padding: "0.9rem 1rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C9488", fontWeight: 400, borderBottom: "1px solid rgba(26,23,20,0.07)", background: "#FFFDFC", position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap" },
  thRight:      { textAlign: "right", padding: "0.9rem 1rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C9488", fontWeight: 400, borderBottom: "1px solid rgba(26,23,20,0.07)", background: "#FFFDFC", position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap" },
  tr:           { cursor: "pointer", transition: "background 0.22s ease" },
  td:           { padding: "0.9rem 1rem", fontSize: "0.9rem", color: "#1A1714", borderBottom: "1px solid rgba(26,23,20,0.05)", whiteSpace: "nowrap", verticalAlign: "middle" },
  tdStrong:     { padding: "0.9rem 1rem", fontSize: "0.9rem", color: "#1A1714", fontWeight: 700, borderBottom: "1px solid rgba(26,23,20,0.05)", whiteSpace: "nowrap", verticalAlign: "middle" },
  tdRight:      { padding: "0.9rem 1rem", textAlign: "right", borderBottom: "1px solid rgba(26,23,20,0.05)", whiteSpace: "nowrap" },
  nameCell:     { display: "flex", flexDirection: "column", gap: "0.18rem" },
  name:         { fontSize: "0.94rem", fontWeight: 500, color: "#1A1714" },
  nameTop:      { fontSize: "0.98rem", fontWeight: 700, color: "#1A1714" },
  youBadge:     { fontWeight: 700, letterSpacing: "2px", color: "#1A1714" },
  rankBadge:    { minWidth: "40px", height: "40px", borderRadius: "999px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", letterSpacing: "0.08em", border: "1px solid rgba(26,23,20,0.09)" },
  rankGold:     { background: "rgba(217,119,6,0.09)",  color: "#B45309", border: "1px solid rgba(217,119,6,0.22)" },
  rankSilver:   { background: "#F5F3EE",               color: "#5C554A", border: "1px solid rgba(26,23,20,0.1)" },
  rankBronze:   { background: "rgba(232,100,42,0.08)", color: "#C44D18", border: "1px solid rgba(232,100,42,0.22)" },
  rankDefault:  { background: "#FFFFFF", color: "#5C554A" },
  rowGold:      { background: "linear-gradient(90deg, rgba(217,119,6,0.04), rgba(255,255,255,0))" },
  rowSilver:    { background: "linear-gradient(90deg, rgba(92,85,74,0.04), rgba(255,255,255,0))" },
  rowBronze:    { background: "linear-gradient(90deg, rgba(232,100,42,0.04), rgba(255,255,255,0))" },
  statPill:     { display: "inline-flex", minWidth: "40px", justifyContent: "center", padding: "0.38rem 0.62rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600 },
  easyPill:     { background: "rgba(5,150,105,0.08)",   color: "#059669", border: "1px solid rgba(5,150,105,0.2)" },
  mediumPill:   { background: "rgba(217,119,6,0.08)",   color: "#D97706", border: "1px solid rgba(217,119,6,0.2)" },
  hardPill:     { background: "rgba(220,38,38,0.08)",   color: "#DC2626", border: "1px solid rgba(220,38,38,0.18)" },
  scoreValue:   { fontWeight: 700, color: "#E8642A", fontSize: "0.95rem" },
  expandBtn:    { width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(26,23,20,0.13)", background: "#F5F3EE", color: "#5C554A", cursor: "pointer", fontSize: "1rem", transition: "all 0.2s ease" },
  expandTd:     { padding: "0 1rem 1rem", background: "#FFFFFF", borderBottom: "1px solid rgba(26,23,20,0.05)" },
  expandCard:   { background: "#F8F5F0", border: "1px solid rgba(26,23,20,0.07)", borderRadius: "16px", padding: "1rem", marginTop: "0.9rem" },
  expandHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "0.8rem", flexWrap: "wrap" },
  expandLabel:  { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C9488" },
  expandCount:  { fontSize: "0.78rem", color: "#5C554A" },
  chipContainer:   { display: "flex", flexWrap: "wrap", gap: "0.7rem" },
  problemChipCard: { display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.75rem 0.9rem", borderRadius: "14px", background: "#FFFFFF", border: "1px solid rgba(26,23,20,0.07)", minWidth: "200px", flex: "1 1 220px" },
  problemTitle:    { fontSize: "0.84rem", color: "#1A1714", fontWeight: 500, lineHeight: 1.45 },
  problemMetaRow:  { display: "flex", alignItems: "center", gap: "0.6rem" },
  problemMeta:     { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.28rem 0.55rem", borderRadius: "999px", fontSize: "0.68rem", fontWeight: 600 },
  emptyState:      { fontSize: "0.84rem", color: "#9C9488" },
  loadingCard:  { background: "#FFFFFF", border: "1px solid rgba(26,23,20,0.07)", borderRadius: "24px", padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem", boxShadow: "0 1px 3px rgba(26,23,20,0.05), 0 10px 30px rgba(26,23,20,0.06)" },
  spinner:      { width: "34px", height: "34px", border: "3px solid rgba(232,100,42,0.15)", borderTop: "3px solid #E8642A", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText:  { margin: 0, fontSize: "0.9rem", color: "#5C554A" },

  countLegend: { display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "1rem", padding: "0.85rem 1.5rem", borderTop: "1px solid rgba(26,23,20,0.06)" },
  legendItem:  { display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.08em", color: "#9C9488" },
  legendSep:   { color: "#C9C4BC", fontSize: "0.7rem" },
  legendNote:  { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", color: "#C9C4BC", letterSpacing: "0.06em" },
};

export default Leaderboard;