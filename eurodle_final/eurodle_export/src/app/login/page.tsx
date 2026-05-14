"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", fontFamily: "'Barlow', sans-serif"
    }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src="/court.jpg" alt="Court" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }} />
      </div>

      <div style={{
        position: "relative", zIndex: 1, textAlign: "center",
        background: "rgba(0,0,0,0.6)", padding: "40px", borderRadius: "24px",
        border: "1px solid rgba(249,115,22,0.3)", maxWidth: "400px", width: "90%",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
      }}>
        <h1 style={{
          fontSize: "40px", fontWeight: 900, color: "#fff", marginBottom: "10px",
          letterSpacing: "4px", fontFamily: "'Barlow Condensed', sans-serif"
        }}>JOIN EURODLE</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "30px", fontSize: "14px" }}>
          Login to save your streaks and climb the leaderboard!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => signIn("google", { callbackUrl: "/game" })}
            style={{
              padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              background: "#fff", color: "#000", fontWeight: "bold", fontSize: "16px"
            }}>
            <img src="https://authjs.dev/img/providers/google.svg" width="20" alt="Google" />
            Continue with Google
          </button>

          <button
            onClick={() => signIn("discord", { callbackUrl: "/game" })}
            style={{
              padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              background: "#5865F2", color: "#fff", fontWeight: "bold", fontSize: "16px"
            }}>
            <img src="https://authjs.dev/img/providers/discord.svg" width="20" alt="Discord" />
            Continue with Discord
          </button>
        </div>

        <button
          onClick={() => window.location.href = "/game"}
          style={{ marginTop: "20px", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}>
          Play as Guest
        </button>
      </div>
    </div>
  );
}