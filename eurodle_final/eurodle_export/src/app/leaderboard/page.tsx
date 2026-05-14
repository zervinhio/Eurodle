"use client";

import { useEffect, useState } from "react";

interface Player {
  _id: string;
  name: string;
  image: string;
  score: number;
  streak: number;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <img src="/court.jpg" alt="Court" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(5px)" }} />
      </div>

      <main style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>

        {/* Header & Back Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <button
            onClick={() => window.location.href = '/game'}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
            ← BACK TO GAME
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 56, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 4, background: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            🏆 LEADERBOARD
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 2, fontSize: 14 }}>Top 50 Eurodle Players</p>
        </div>

        {/* Players List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#f97316", padding: 40, fontSize: 24, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif" }}>LOADING...</div>
          ) : (
            players.map((player, index) => {
              const rank = index + 1;
              let medal = "";
              let bg = "rgba(0,0,0,0.6)";
              let border = "1px solid rgba(255,255,255,0.1)";

              if (rank === 1) { medal = "🥇"; bg = "rgba(251,191,36,0.15)"; border = "1px solid #fbbf24"; }
              else if (rank === 2) { medal = "🥈"; bg = "rgba(148,163,184,0.15)"; border = "1px solid #94a3b8"; }
              else if (rank === 3) { medal = "🥉"; bg = "rgba(180,83,9,0.15)"; border = "1px solid #b45309"; }

              return (
                <div key={player._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: bg, border: border, padding: "12px 20px", borderRadius: 16, backdropFilter: "blur(10px)", animation: `fadeIn 0.3s ease ${index * 0.05}s both` }}>

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 30, textAlign: "center", fontSize: rank <= 3 ? 24 : 18, fontWeight: 900, color: rank <= 3 ? "#fff" : "rgba(255,255,255,0.3)", fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {rank <= 3 ? medal : `#${rank}`}
                    </div>
                    {player.image ? (
                      <img src={player.image} alt={player.name} style={{ width: 40, height: 40, borderRadius: "50%", border: rank <= 3 ? border : "none" }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                    )}
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>{player.name}</div>
                  </div>

                  <div style={{ display: "flex", gap: 20, textAlign: "right" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Streak</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#16a34a", fontFamily: "'Barlow Condensed', sans-serif" }}>{player.streak} 🔥</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 60 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Score</span>
                      <span style={{ fontSize: 20, fontWeight: 900, color: rank <= 3 ? "#fbbf24" : "#fff", fontFamily: "'Barlow Condensed', sans-serif" }}>{player.score}</span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </main>
    </div>
  );
}