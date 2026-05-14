import React from "react";

// Χρώματα ομάδων Euroleague
const TEAM_COLORS: Record<string, { primary: string; secondary: string; text: string }> = {
  "OLY": { primary: "#ce1126", secondary: "#ffffff", text: "#ffffff" }, 
  "PAO": { primary: "#005538", secondary: "#ffffff", text: "#ffffff" }, 
  "RMB": { primary: "#ffffff", secondary: "#000000", text: "#000000" }, 
  "FCB": { primary: "#004d98", secondary: "#a50044", text: "#fdb913" }, 
  "FNB": { primary: "#001a35", secondary: "#ffed00", text: "#ffffff" }, 
  "EFS": { primary: "#004b87", secondary: "#ffffff", text: "#ffffff" }, 
  "PAR": { primary: "#000000", secondary: "#ffffff", text: "#ffffff" }, 
  "CZV": { primary: "#ee3224", secondary: "#ffffff", text: "#ffffff" }, 
  "MON": { primary: "#e1001a", secondary: "#d8b56d", text: "#ffffff" }, 
  "BKN": { primary: "#005043", secondary: "#e3000f", text: "#ffffff" }, 
  "EA7": { primary: "#cc0000", secondary: "#ffffff", text: "#ffffff" }, 
  "MAC": { primary: "#ffe600", secondary: "#001b54", text: "#001b54" }, 
  "VIR": { primary: "#000000", secondary: "#ffffff", text: "#ffffff" }, 
  "ZAL": { primary: "#005a3c", secondary: "#ffffff", text: "#ffffff" }, 
  "BAY": { primary: "#dc052d", secondary: "#ffffff", text: "#ffffff" }, 
  "ALB": { primary: "#ffed00", secondary: "#002d74", text: "#002d74" }, 
  "ASV": { primary: "#000000", secondary: "#ffffff", text: "#ffffff" }, 
  "PFC": { primary: "#005087", secondary: "#ffb81c", text: "#ffffff" },
  // Νέες Ομάδες:
  "DUB": { primary: "#00204a", secondary: "#d4af37", text: "#ffffff" }, // Dubai: Navy Blue & Gold
  "HTA": { primary: "#e0001a", secondary: "#ffffff", text: "#ffffff" }, // Hapoel Tel Aviv: Red & White
  "VBC": { primary: "#f26f21", secondary: "#000000", text: "#ffffff" }  // Valencia: Orange & Black
};

export interface PlayerCardProps {
  teamCode: string;
  name: string;
  dorsal: string; // νούμερο
}

export default function PlayerCard({ teamCode, name, dorsal }: PlayerCardProps) {
  const colors = TEAM_COLORS[teamCode] || { primary: "#475569", secondary: "#cbd5e1", text: "#ffffff" };

  // Παίρνουμε μόνο το επίθετο του παίκτη (την τελευταία λέξη του ονόματος) για να χωράει όμορφα
  const lastName = name ? name.split(" ").pop() : "PLAYER";

  return (
    <div style={{
      width: "130px",
      height: "170px",
      background: `linear-gradient(145deg, ${colors.primary}, ${colors.primary}dd)`,
      border: `4px solid ${colors.secondary}`,
      borderRadius: "12px 12px 6px 6px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 10px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
      fontFamily: "'Barlow Condensed', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Λεπτομέρεια στην κορυφή (σαν το κολάρο της φανέλας) */}
      <div style={{
        position: "absolute",
        top: 0,
        width: "35%",
        height: "12px",
        background: colors.secondary,
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px"
      }} />

      {/* Όνομα / Επίθετο */}
      <div style={{ 
        color: colors.text, 
        fontSize: lastName && lastName.length > 9 ? "14px" : "18px", 
        fontWeight: 800, 
        textTransform: "uppercase", 
        letterSpacing: "1px", 
        textAlign: "center", 
        marginTop: "12px",
        zIndex: 1
      }}>
        {lastName}
      </div>

      {/* Νούμερο Παίκτη */}
      <div style={{ 
        color: colors.text, 
        fontSize: "68px", // Το μεγαλώνουμε ελάχιστα
        fontWeight: 800, // Κατεβάζουμε λίγο το πάχος της γραμματοσειράς
        lineHeight: 1, 
        // Αντί για παχύ περίγραμμα, βάζουμε μια ωραία απαλή σκιά για να ξεχωρίζει
        textShadow: "2px 4px 8px rgba(0, 0, 0, 0.4)",
        zIndex: 1,
        margin: "5px 0"
      }}>
        {dorsal || "0"}
      </div>

      {/* Κωδικός Ομάδας */}
      <div style={{ 
        color: colors.primary, 
        backgroundColor: colors.text,
        fontSize: "14px", 
        fontWeight: 900, 
        padding: "2px 12px", 
        borderRadius: "6px",
        letterSpacing: "2px",
        border: `2px solid ${colors.secondary}`,
        zIndex: 1
      }}>
        {teamCode || "UNK"}
      </div>
    </div>
  );
}