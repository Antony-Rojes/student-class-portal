import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const detailRows = [
    {
      label: "Full Name",
      value: profile?.name || "—",
      type: "text",
    },
    {
      label: "Roll Number",
      value: profile?.rollNo || "—",
      type: "pill",
    },
    {
      label: "Email",
      value: auth.currentUser?.email || "—",
      type: "text",
    },
    {
      label: "LeetCode",
      value: profile?.leetcodeUsername || "—",
      type: "pillSoft",
    },
    {
      label: "GitHub",
      value: profile?.github || "",
      type: "link",
      linkText: profile?.github ? "Open GitHub ↗" : "—",
      linkColor: "#C44D18",
    },
    {
      label: "LinkedIn",
      value: profile?.linkedin || "",
      type: "link",
      linkText: profile?.linkedin ? "Open LinkedIn ↗" : "—",
      linkColor: "#0A66C2",
    },
  ];

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.bgTexture} />
      <div style={styles.bgGlowLeft} />
      <div style={styles.bgGlowRight} />

      <main style={styles.main} className="profile-main">
        <section style={styles.pageHeader} className="profile-page-header">
          <div style={styles.pageHeaderMain} className="profile-page-header-main">
            <div style={styles.eyebrowWrap}>
              <span style={styles.eyebrowDash} />
              <span style={styles.eyebrow}>Student Account</span>
            </div>

            <h1 style={styles.heading}>
              Personal <em style={styles.headingEm}>Profile</em>
            </h1>

            <p style={styles.subheading} className="profile-subheading">
              View your core academic identity, coding handles, and public
              profile links in one clean space.
            </p>
          </div>

          <div style={styles.metaBlock} className="profile-meta-block">
            <div style={styles.metaLabel}>Account Status</div>
            <div style={styles.metaValue}>
              {loading ? "Loading..." : profile ? "Active profile" : "No data"}
            </div>
          </div>
        </section>

        {loading ? (
          <div style={styles.loadingCard}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading profile...</p>
          </div>
        ) : (
          <section style={styles.infoCard}>
            <div style={styles.infoHeader}>
              <div>
                <div style={styles.infoKicker}>Account Overview</div>
                <h3 style={styles.sectionTitle}>Profile details</h3>
              </div>
            </div>

            <table style={styles.infoTable} className="profile-info-table">
              <tbody className="profile-info-tbody">
                {detailRows.map((item, index) => {
                  const isLast = index === detailRows.length - 1;
                  return (
                    <tr key={item.label} className="profile-info-row">
                      <td 
                        style={{ ...styles.infoLabelTd, ...(isLast ? styles.noBorder : {}) }} 
                        className="profile-info-label"
                      >
                        {item.label}
                      </td>

                      <td 
                        style={{ ...styles.infoValueTd, ...(isLast ? styles.noBorder : {}) }} 
                        className="profile-info-value"
                      >
                        {item.type === "link" ? (
                          item.value ? (
                            <a
                              href={item.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="profile-link-pill profile-value-item"
                              style={{ ...styles.linkPill, color: item.linkColor }}
                            >
                              {item.linkText}
                            </a>
                          ) : (
                            <span style={styles.valueText} className="profile-value-item">—</span>
                          )
                        ) : item.type === "pill" ? (
                          <span style={styles.valuePill} className="profile-value-item">{item.value}</span>
                        ) : item.type === "pillSoft" ? (
                          <span style={styles.valuePillSoft} className="profile-value-item">{item.value}</span>
                        ) : (
                          <span style={styles.valueText} className="profile-value-item">{item.value}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-link-pill {
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }

        .profile-link-pill:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26,23,20,0.06) !important;
        }

        @media (max-width: 960px) {
          .profile-page-header {
            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            gap: 0.5rem !important;
            margin-bottom: 1rem !important;
          }

          .profile-page-header-main {
            width: 100% !important;
            flex: unset !important;
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
          }

          .profile-subheading {
            max-width: 100% !important;
          }

          .profile-meta-block {
            width: 100% !important;
            min-width: 0 !important;
            margin-top: 0.25rem !important;
          }
        }

        @media (max-width: 640px) {
          .profile-main {
            padding: 1.5rem 0.8rem 2.5rem !important;
          }

          /* Responsive Table Styling */
          .profile-info-table, .profile-info-tbody {
            display: block !important;
            width: 100% !important;
          }

          .profile-info-row {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.4rem !important;
            padding: 0.85rem 0 !important;
            border-bottom: 1px solid rgba(26,23,20,0.06) !important;
          }

          .profile-info-row:last-child {
            border-bottom: none !important;
          }

          .profile-info-label, .profile-info-value {
            display: block !important;
            width: 100% !important;
            text-align: left !important;
            padding: 0 !important;
            border-bottom: none !important; /* Border is handled by the row now */
          }

          .profile-value-item {
            text-align: left !important;
            max-width: 100% !important;
            word-break: break-word !important;
            white-space: normal !important;
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
  main: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "2.25rem 1.5rem 4rem",
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.15rem",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: "1rem",
    flexWrap: "wrap",
    animation: "fadeUp 0.6s ease both",
  },
  pageHeaderMain: {
    flex: "1 1 380px",
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
    maxWidth: "42ch",
    fontSize: "0.92rem",
    lineHeight: 1.7,
    color: "#5C554A",
    fontWeight: 300,
  },
  metaBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "0.22rem",
    background: "rgba(255,255,255,0.68)",
    border: "1px solid rgba(26,23,20,0.07)",
    borderRadius: "18px",
    padding: "0.9rem 1rem",
    backdropFilter: "blur(10px)",
    flexShrink: 0,
    minWidth: "220px",
  },
  metaLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.58rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9C9488",
  },
  metaValue: {
    fontSize: "0.84rem",
    color: "#1A1714",
    fontWeight: 500,
    lineHeight: 1.3,
  },
  infoCard: {
    background: "#FFFFFF",
    border: "1px solid rgba(26,23,20,0.07)",
    borderRadius: "24px",
    padding: "1.4rem",
    boxShadow: "0 1px 3px rgba(26,23,20,0.05), 0 10px 30px rgba(26,23,20,0.06)",
    animation: "fadeUp 0.8s ease both",
  },
  infoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  },
  infoKicker: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.58rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#E8642A",
    marginBottom: "0.45rem",
  },
  sectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: "1.15rem",
    fontWeight: 400,
    color: "#1A1714",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  infoTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  infoLabelTd: {
    padding: "0.95rem 0",
    color: "#8E877C",
    fontWeight: 500,
    fontSize: "0.84rem",
    verticalAlign: "middle",
    borderBottom: "1px solid rgba(26,23,20,0.06)",
    width: "35%", // Keeps the labels cleanly aligned on desktop
  },
  infoValueTd: {
    padding: "0.95rem 0",
    textAlign: "right",
    verticalAlign: "middle",
    borderBottom: "1px solid rgba(26,23,20,0.06)",
  },
  noBorder: {
    borderBottom: "none",
  },
  valueText: {
    color: "#1A1714",
    fontWeight: 500,
    fontSize: "0.84rem",
    wordBreak: "break-word",
  },
  valuePill: {
    display: "inline-flex",
    alignItems: "center",
    background: "#F5F3EE",
    color: "#5C554A",
    border: "1px solid rgba(26,23,20,0.08)",
    borderRadius: "999px",
    padding: "0.4rem 0.7rem",
    fontSize: "0.72rem",
    fontFamily: "'JetBrains Mono', monospace",
  },
  valuePillSoft: {
    display: "inline-flex",
    alignItems: "center",
    background: "rgba(232,100,42,0.08)",
    color: "#C44D18",
    border: "1px solid rgba(232,100,42,0.2)",
    borderRadius: "999px",
    padding: "0.4rem 0.7rem",
    fontSize: "0.72rem",
    fontFamily: "'JetBrains Mono', monospace",
  },
  linkPill: {
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.75rem",
    padding: "0.45rem 0.75rem",
    borderRadius: "999px",
    border: "1px solid rgba(26,23,20,0.08)",
    background: "#FFFDFC",
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
};

export default Profile;