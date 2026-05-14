import React from "react";

// Χρώματα ομάδων Euroleague
const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  "OLY": { primary: "#ce1126", secondary: "#ffffff" }, // Ολυμπιακός
  "PAO": { primary: "#005538", secondary: "#ffffff" }, // Παναθηναϊκός
  "RMB": { primary: "#ffffff", secondary: "#000000" }, // Ρεάλ Μαδρίτης
  "FCB": { primary: "#004d98", secondary: "#a50044" }, // Μπαρτσελόνα
  "FNB": { primary: "#001a35", secondary: "#ffed00" }, // Φενέρμπαχτσε
  "EFS": { primary: "#004b87", secondary: "#ffffff" }, // Αναντολού Εφές
  "PAR": { primary: "#000000", secondary: "#ffffff" }, // Παρτιζάν
  "CZV": { primary: "#ee3224", secondary: "#ffffff" }, // Ερυθρός Αστέρας
  "MON": { primary: "#e1001a", secondary: "#ffffff" }, // Μονακό
  "BKN": { primary: "#005043", secondary: "#e3000f" }, // Μπασκόνια
  "EA7": { primary: "#cc0000", secondary: "#ffffff" }, // Αρμάνι Μιλάνο
  "MAC": { primary: "#ffe600", secondary: "#001b54" }, // Μακάμπι
  "VIR": { primary: "#000000", secondary: "#ffffff" }, // Βίρτους Μπολόνια
  "ZAL": { primary: "#005a3c", secondary: "#ffffff" }, // Ζαλγκίρις
  "BAY": { primary: "#dc052d", secondary: "#ffffff" }, // Μπάγερν Μονάχου
  "ALB": { primary: "#ffed00", secondary: "#002d74" }, // Άλμπα Βερολίνου
  "ASV": { primary: "#000000", secondary: "#ffffff" }, // Βιλερμπάν
  "PFC": { primary: "#005087", secondary: "#ffb81c" }, // Παρί
};

export interface JerseyProps {
  teamCode: string;
  size?: number;  // Το μέγεθος σε pixels (default: 100)
}

export default function Jersey({ teamCode, size = 100 }: JerseyProps) {
  // Αν η ομάδα δεν υπάρχει, χρησιμοποιεί ένα default γκρι χρώμα
  const colors = TEAM_COLORS[teamCode] || { primary: "#475569", secondary: "#cbd5e1" };

  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Κορμός Φανέλας */}
        <path 
          d="M25 15 L35 5 L65 5 L75 15 L95 25 L85 40 L80 35 L80 95 L20 95 L20 35 L15 40 L5 25 Z" 
          fill={colors.primary} 
          stroke={colors.secondary} 
          strokeWidth="3" 
          strokeLinejoin="round" 
        />
        
        {/* Κολάρο */}
        <path d="M35 5 Q 50 20 65 5" fill="none" stroke={colors.secondary} strokeWidth="4" />
        
        {/* Λεπτομέρειες / Γραμμές στα πλάγια */}
        <rect x="20" y="35" width="5" height="60" fill={colors.secondary} opacity="0.5" />
        <rect x="75" y="35" width="5" height="60" fill={colors.secondary} opacity="0.5" />
      </svg>
    </div>
  );
}