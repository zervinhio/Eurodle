"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import PlayerCard from "@/components/PlayerCard";
// --- CONFIGURATION & ICONS ---
const PLAYER_ICONS = [
  { id: "vezenkov", name: "Vezenkov", url: "/icons/sasha-vezenkov-image.jpg" },
  { id: "nunn", name: "Nunn", url: "/icons/kendrick-nunn-image.jpg" },
  { id: "punter", name: "Punter", url: "/icons/kevin-punter-image.jpg" },
  { id: "moneke", name: "Moneke", url: "/icons/chima-moneke-image.jpg" },
  { id: "tavares", name: "Tavares", url: "/icons/walter-tavares-image.jpg" },
  { id: "baldwin", name: "Baldwin", url: "/icons/wade-baldwin-image.jpg" },
  { id: "francisco", name: "Francisco", url: "/icons/sylvain-francisco-image.jpg" },
  { id: "montero", name: "Montero", url: "/icons/jean-montero-image.jpg" },
  { id: "washington", name: "Washington", url: "/icons/duane-washington-image.jpg" },
];

const DEFAULT_GUEST_ICON = "https://cdn-icons-png.flaticon.com/512/3501/3501007.png";
const ICON_STORAGE_KEY_BASE = "eurodle_custom_icon";
const STORAGE_KEY_BASE = "eurodle_state_v5";

type Color = "green" | "yellow" | "red";
type GameMode = "menu" | "classic" | "higher_lower" | "player_id";

interface SearchResult { playerId: string; name: string; team: string; position: string; imageUrl: string; }
interface Guess { name: string; team: string; position: string; nationality: string; height: number; imageUrl: string; isCorrect: boolean; feedback: { team: Color; position: Color; nationality: Color; height: Color; heightArrow: "up" | "down" | null; }; }
// --- HIGHER/LOWER CONFIG ---
type StatCategory = "ppg" | "rpg" | "apg";

interface StatPlayer {
  id: string;
  name: string;
  imageUrl: string;
  stats: Record<StatCategory, number>;
}

const STAT_LABELS: Record<StatCategory, string> = {
  ppg: "Points Per Game",
  rpg: "Rebounds Per Game",
  apg: "Assists Per Game",
};

// Προσωρινά δεδομένα για δοκιμή (μετά θα τα τραβάς από το API σου)
const MOCK_HL_PLAYERS: StatPlayer[] = [
  { id: "vezenkov", name: "Sasha Vezenkov", imageUrl: "/icons/sasha-vezenkov-image.jpg", stats: { ppg: 17.6, rpg: 6.8, apg: 1.9 } },
  { id: "nunn", name: "Kendrick Nunn", imageUrl: "/icons/kendrick-nunn-image.jpg", stats: { ppg: 15.4, rpg: 2.5, apg: 3.1 } },
  { id: "tavares", name: "Walter Tavares", imageUrl: "/icons/walter-tavares-image.jpg", stats: { ppg: 10.3, rpg: 7.2, apg: 1.5 } },
  { id: "moneke", name: "Chima Moneke", imageUrl: "/icons/chima-moneke-image.jpg", stats: { ppg: 14.2, rpg: 6.5, apg: 1.8 } },
  { id: "punter", name: "Kevin Punter", imageUrl: "/icons/kevin-punter-image.jpg", stats: { ppg: 15.0, rpg: 2.6, apg: 2.6 } },
];
function getPoints(guessNumber: number): number {
  if (guessNumber <= 5) return 100; if (guessNumber <= 8) return 80; if (guessNumber <= 11) return 70;
  if (guessNumber <= 14) return 60; if (guessNumber <= 17) return 40; if (guessNumber <= 20) return 20; return 10;
}

function colorBg(c: Color): string { return c === "green" ? "#16a34a" : c === "yellow" ? "#d97706" : "#dc2626"; }

function shortTeam(team: string): string {
  return team.replace("Emporio Armani ", "").replace(" Vitoria-Gasteiz", "").replace(" Beko", "").replace(" Istanbul", "").replace(" Piraeus", "").replace(" Belgrade", "").replace(" Athens", "").replace(" Kaunas", "").replace(" Bologna", "").replace("LDLC ", "").replace(" Villeurbanne", "").replace(" Tel Aviv", "").replace(" IBI", "").replace(" Rapyd", "").replace(" AKTOR", "").replace(" Mozzart Bet", "").replace("Kosner ", "").replace("Panathinaikos", "PAO").trim();
}

// --- COMPONENTS ---
function CountdownTimer({ minimal = false }: { minimal?: boolean }) {
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const athensStr = now.toLocaleString("en-US", { timeZone: "Europe/Athens" });
      const athensTime = new Date(athensStr);
      const nextMidnight = new Date(athensTime);
      nextMidnight.setHours(24, 0, 0, 0);
      const diff = nextMidnight.getTime() - athensTime.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (minimal) {
    return (
      <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "6px 14px", borderRadius: "20px", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Barlow Condensed', sans-serif" }}>
        <span style={{ fontSize: "14px" }}>⏱️</span>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff", letterSpacing: "1px" }}>{countdown}</span>
      </div>
    );
  }
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", padding: "10px 20px", borderRadius: 12, display: "inline-block", margin: "10px 0" }}>
      <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>NEXT PLAYER IN</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: 2 }}>⏱️ {countdown}</div>
    </div>
  );
}

function IconSelector({ onSelect, onClose }: { onSelect: (url: string) => void, onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)" }} onClick={onClose}>
      <div style={{ background: "#111", border: "2px solid #f97316", borderRadius: 20, padding: 24, maxWidth: 400, width: "90%" }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "white", marginBottom: 20, textAlign: "center" }}>SELECT YOUR PLAYER ICON</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15 }}>
          {PLAYER_ICONS.map(icon => (
            <div key={icon.id} onClick={() => { onSelect(icon.url); onClose(); }} style={{ cursor: "pointer", textAlign: "center" }}>
              <img src={icon.url} alt={icon.name} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "50%", border: "2px solid transparent", backgroundColor: "#475569" }} onMouseEnter={e => e.currentTarget.style.borderColor = "#f97316"} onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"} />
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 5 }}>{icon.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePopup({ session, localStreak, localScore, currentIcon, onLogout, onChangeIcon }: { session: any, localStreak: number, localScore: number, currentIcon: string, onLogout: () => void, onChangeIcon: () => void }) {
  return (
    <div style={{ position: "absolute", top: "65px", right: "0", background: "rgba(10,15,20,0.98)", border: "1px solid rgba(249,115,22,0.5)", borderRadius: 20, padding: 24, width: 300, backdropFilter: "blur(25px)", boxShadow: "0 20px 60px rgba(0,0,0,0.9)", zIndex: 200, animation: "slideIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", alignItems: "center", gap: 15, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 20, marginBottom: 20 }}>
        <div onClick={onChangeIcon} style={{ position: "relative", cursor: "pointer" }} title="Change Icon">
          <img src={currentIcon} alt="Profile" style={{ width: 54, height: 54, borderRadius: "50%", border: "2px solid #f97316", objectFit: "cover", backgroundColor: "#475569" }} />
          <div style={{ position: "absolute", bottom: -2, right: -2, background: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, border: "2px solid #f97316", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>✏️</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", color: "#fff", textTransform: "uppercase" }}>{session?.user?.name || "GUEST"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{session?.user?.email || "Local Progress Only"}</div>
          {session?.user && (
            <div style={{ fontSize: 9, color: "#16a34a", marginTop: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
              ✓ Account Linked & Secured
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 8px", borderRadius: 12, textAlign: "center" }}><div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Total Score</div><div style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24", fontFamily: "'Barlow Condensed', sans-serif" }}>{localScore}</div></div>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px 8px", borderRadius: 12, textAlign: "center" }}><div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>Current Streak</div><div style={{ fontSize: 22, fontWeight: 900, color: "#16a34a", fontFamily: "'Barlow Condensed', sans-serif" }}>{localStreak} 🔥</div></div>
      </div>
      <button onClick={() => window.location.href = '/leaderboard'} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.4)", color: "#f97316", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, cursor: "pointer", marginBottom: 12, textTransform: "uppercase" }}>🏆 Leaderboard</button>
      {session ? <button onClick={onLogout} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#dc2626", border: "none", color: "#fff", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, cursor: "pointer", textTransform: "uppercase" }}>Log Out</button> : <button onClick={() => window.location.href = '/login'} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#f97316", border: "none", color: "#000", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, cursor: "pointer", textTransform: "uppercase" }}>Login</button>}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function EurodlePage() {
  const { data: session } = useSession();

  // Game Modes & Navigation
  const [activeMode, setActiveMode] = useState<GameMode>("menu");

  // Classic Mode States
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [wonAtGuess, setWonAtGuess] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [todayDate, setTodayDate] = useState(() => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date()));
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  // --- Player Path States ---
  const [pathPlayer, setPathPlayer] = useState<any>(null);
  const [pathGuesses, setPathGuesses] = useState<string[]>([]);
  const [pathGameOver, setPathGameOver] = useState(false);
  const [pathWon, setPathWon] = useState(false);
  const [pathPoints, setPathPoints] = useState(0); // <--- ΝΕΟ STATE
  const [showPathCelebration, setShowPathCelebration] = useState(false); // <--- ΝΕΟ STATE
  const [pathQuery, setPathQuery] = useState("");
  const [pathSuggestions, setPathSuggestions] = useState<SearchResult[]>([]);
  const [pathSelected, setPathSelected] = useState<SearchResult | null>(null);
  const [pathHasPlayedToday, setPathHasPlayedToday] = useState(false); // <--- ΝΕΟ STATE
  const [pathUnlockedHints, setPathUnlockedHints] = useState<number[]>([]); // <--- ΝΕΟ STATE ΓΙΑ HINTS
  const pathInputRef = useRef<HTMLInputElement>(null); // <--- ΝΕΟ (πρόσθεσε αυτό)

  // Global App States
  const [showProfile, setShowProfile] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [localStreak, setLocalStreak] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const [customIcon, setCustomIcon] = useState("");
  const [globalAverage, setGlobalAverage] = useState<string | null>(null);

  // --- Dynamic Storage Keys ---
  const userEmail = session?.user?.email || "guest";
  const USER_STORAGE_KEY = `${STORAGE_KEY_BASE}_${userEmail}`;
  const USER_PATH_KEY = `eurodle_path_state_${userEmail}`;
  const USER_HL_KEY = `eurodle_hl_state_${userEmail}`;
  const USER_ICON_KEY = `${ICON_STORAGE_KEY_BASE}_${userEmail}`;

  // Use a ref to track the last user we loaded state for
  const lastUserRef = useRef<string | null>(null);

  // Reset state when user changes
  useEffect(() => {
    // Only reset if the user has actually changed from the last one we handled
    if (lastUserRef.current !== userEmail) {
      // Reset all game states to default before loading new ones
      setGuesses([]); setWon(false); setGameOver(false); setWonAtGuess(null);
      setPathGuesses([]); setPathGameOver(false); setPathWon(false); setPathPoints(0); setPathHasPlayedToday(false); setPathUnlockedHints([]);
      setHlScore(0); setHlGameOver(false); setHlGameStarted(false); setHlHasPlayedToday(false);
      
      lastUserRef.current = userEmail;
    }
    
    // Load User Icon
    const savedIcon = localStorage.getItem(USER_ICON_KEY);
    if (savedIcon) setCustomIcon(savedIcon);
    else setCustomIcon("");

    // Load Scores/Streaks
    if (session?.user) {
      const u = session.user as any;
      setLocalStreak(u.streak || 0);
      setLocalScore(u.score || 0);

      // --- SERVER-SIDE LOCKDOWN ---
      // Αν ο server λέει ότι έχουμε παίξει, κλειδώνουμε τα modes αμέσως
      // ΑΛΛΑ: Δεν δείχνουμε τα popups αυτόματα στο refresh (setShowCelebration(false))
      if (u.playedClassic) {
        setGameOver(true);
        setWon(true);
        if (u.lastClassicGuesses) setWonAtGuess(u.lastClassicGuesses);
        // setShowCelebration(true); <-- ΑΦΑΙΡΕΣΗ
      }
      if (u.playedHL) {
        setHlHasPlayedToday(true);
        setHlGameOver(true);
        // Χρησιμοποιούμε τους πόντους αν υπάρχουν για να μην δείχνει 0
        // Στο HL οearnedPoints υπολογίζεται από το hlScore * 5
        if (u.lastHLPoints) setHlScore(u.lastHLPoints / 5); 
        // setShowHLCelebration(true); <-- ΑΦΑΙΡΕΣΗ
      }
      if (u.playedPath) {
        setPathHasPlayedToday(true);
        setPathGameOver(true);
        setPathWon(true);
        if (u.lastPathPoints) setPathPoints(u.lastPathPoints);
        // setShowPathCelebration(true); <-- ΑΦΑΙΡΕΣΗ
      }
    } else {
      setLocalStreak(0);
      setLocalScore(0);
    }
  }, [userEmail, session]);

  const searchTimeout = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // --- Higher/Lower States ---
  const [hlScore, setHlScore] = useState(0);
  const [hlPlayer1, setHlPlayer1] = useState<any>(null);
  const [hlPlayer2, setHlPlayer2] = useState<any>(null);
  const [hlStat, setHlStat] = useState<"ppg" | "rpg" | "apg">("ppg");
  const [hlGameOver, setHlGameOver] = useState(false);
  const [hlAnimating, setHlAnimating] = useState(false);
  const [hlGameStarted, setHlGameStarted] = useState(false);
  const [hlLoading, setHlLoading] = useState(false);

  const STAT_LABELS = { ppg: "Points Per Game", rpg: "Rebounds Per Game", apg: "Assists Per Game" };
  const [hlHasPlayedToday, setHlHasPlayedToday] = useState(false);
  const [showHLCelebration, setShowHLCelebration] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  // --- Higher/Lower Logic ---
  const startHlGame = useCallback(async () => {
    setHlLoading(true);
    try {
      const res = await fetch("/api/higher-lower");
      const players = await res.json();
      
      const stats: ("ppg" | "rpg" | "apg")[] = ["ppg", "rpg", "apg"];
      setHlStat(stats[Math.floor(Math.random() * stats.length)]);
      
      setHlPlayer1(players[0]);
      setHlPlayer2(players[1]);
      setHlScore(0);
      setHlGameOver(false);
      setHlGameStarted(true);
    } catch (error) {
      console.error("Error loading players:", error);
    } finally {
      setHlLoading(false);
    }
  }, []);

  const handleHlGuess = async (guess: "higher" | "lower") => {
    // Αν προσπαθήσει να παίξει ενώ έχει τελειώσει ή έχει παίξει ήδη, τον σταματάμε
    if (!hlPlayer1 || !hlPlayer2 || hlAnimating || hlHasPlayedToday) return;

    const val1 = hlPlayer1.stats[hlStat];
    const val2 = hlPlayer2.stats[hlStat];
    
    const isCorrect = (guess === "higher" && val2 >= val1) || (guess === "lower" && val2 <= val1);

    setHlAnimating(true);

    if (isCorrect) {
      setTimeout(async () => {
        setHlScore(prev => prev + 1);
        setHlPlayer1(hlPlayer2); 
        
        try {
            const res = await fetch("/api/higher-lower");
            const players = await res.json();
            const newP2 = players.find((p: any) => p.id !== hlPlayer2.id) || players[0];
            setHlPlayer2(newP2);
        } catch(e) {
            console.error("Error fetching next player");
        }
        
        setHlAnimating(false);
      }, 1000);
    } else {
      // --- ΛΑΘΟΣ ΑΠΑΝΤΗΣΗ: GAME OVER ΓΙΑ ΣΗΜΕΡΑ ---
      setTimeout(async () => {
        setHlGameOver(true);
        setHlHasPlayedToday(true); // Τον κλειδώνει για να μην ξαναπαίξει
        setShowHLCelebration(true); // Πετάει το popup πανηγυρισμού/σκορ!

        // Παίρνουμε τη σημερινή ημερομηνία σε ώρα Ελλάδος
        const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
        
        // Κλειδώνει τοπικά
        localStorage.setItem(USER_HL_KEY, JSON.stringify({ 
          date: todayStr, 
          score: hlScore, 
          gameOver: true, 
          stat: hlStat 
        }));

        // Αποθήκευση στη βάση αν είναι συνδεδεμένος
        if (session?.user) {
          try {
            const pointsEarned = hlScore * 5; // 5 πόντοι για κάθε σωστή μαντεψιά (μισοί από πριν)
            
            const res = await fetch("/api/save-hl-game", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                finalScore: hlScore
              })
            });
            
            const data = await res.json();

            // Αν το API απαντήσει θετικά, ανανεώνουμε το σκορ πάνω δεξιά
            if (data.success) {
              setLocalScore(data.newTotalScore); 
            } else {
              console.log("Ενημέρωση:", data.error); // Το κάνουμε απλό log για να μην πετάει κόκκινη οθόνη το Next.js
            } 
          } catch (error) {
            console.error("Σφάλμα κατά την αποθήκευση", error);
          }
        }
        
        setHlAnimating(false);
      }, 1000);
    }
  };
  // Initialize Data
  useEffect(() => {
    if (activeMode === "player_id" && !pathPlayer) {
      fetch("/api/player-id")
        .then(res => res.json())
        .then(data => setPathPlayer(data))
        .catch(err => console.error("Error fetching player path:", err));
    }
  }, [activeMode, pathPlayer]); 

  useEffect(() => {
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
    const rawPath = localStorage.getItem(USER_PATH_KEY);

    // Clean up sync flags if it's a new day
    const lastSyncDate = localStorage.getItem("eurodle_last_sync_date");
    if (lastSyncDate !== todayStr) {
      localStorage.removeItem("eurodle_classic_synced");
      localStorage.removeItem("eurodle_path_synced");
      localStorage.setItem("eurodle_last_sync_date", todayStr);
    }

    if (rawPath) {
      const savedPath = JSON.parse(rawPath);
      if (savedPath.date === todayStr && savedPath.gameOver) {
        setPathHasPlayedToday(true);
        setPathWon(savedPath.won ?? false);
        setPathGuesses(savedPath.guesses ?? []);
        setPathPlayer(savedPath.player ?? null);
        setPathUnlockedHints(savedPath.unlockedHints ?? []);
        setPathPoints(savedPath.points ?? 0);
        setPathGameOver(true);
        // setShowPathCelebration(true); // <--- ΑΦΑΙΡΕΣΗ
      } else if (savedPath.date === todayStr) {
        // Αν δεν έχει τελειώσει αλλά έχει ξεκινήσει
        setPathGuesses(savedPath.guesses ?? []);
        setPathUnlockedHints(savedPath.unlockedHints ?? []);
        setPathPlayer(savedPath.player ?? null);
      } else {
        // Παλιά ημερομηνία - καθαρισμός για την επόμενη μέρα
        localStorage.removeItem(USER_PATH_KEY);
      }
    }
  }, [userEmail, USER_PATH_KEY]);

  useEffect(() => {
    if (session?.user) {
      setLocalStreak((session.user as any).streak || 0);
      setLocalScore((session.user as any).score || 0);

      // --- PROGRESS SYNC: GUEST TO USER ---
      const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());

      // 1. Sync Classic Mode
      const rawClassic = localStorage.getItem(`${STORAGE_KEY_BASE}_guest`);
      if (rawClassic && userEmail !== "guest") {
        const saved = JSON.parse(rawClassic);
        if (saved.date === todayStr && saved.won && !localStorage.getItem("eurodle_classic_synced")) {
          const pts = getPoints(saved.guesses.length);
          fetch("/api/save-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ points: pts, guessesCount: saved.guesses.length, mode: 'classic' })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setLocalScore(data.score);
              setLocalStreak(data.streak);
              localStorage.setItem("eurodle_classic_synced", "true");
            }
          });
        }
      }

      // 2. Sync Player ID (Path) Mode
      const rawPath = localStorage.getItem(`eurodle_path_state_guest`);
      if (rawPath && userEmail !== "guest") {
        const savedPath = JSON.parse(rawPath);
        if (savedPath.date === todayStr && savedPath.won && !localStorage.getItem("eurodle_path_synced")) {
          fetch("/api/save-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ points: savedPath.points, mode: 'player_id' })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setLocalScore(data.score);
              localStorage.setItem("eurodle_path_synced", "true");
            }
          });
        }
      }
    }
  }, [session, todayDate]);

  useEffect(() => {
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.date === todayStr) {
        setGuesses(saved.guesses ?? []); setWon(saved.won ?? false); setGameOver(saved.gameOver ?? false); setWonAtGuess(saved.wonAtGuess ?? null);
      }
    }
    fetch("/api/daily").then(r => r.json()).then(({ date }) => {
      setTodayDate(date);
    }).catch(() => { });
  }, [userEmail, USER_STORAGE_KEY]);

  useEffect(() => {
    if (!todayDate) return;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ date: todayDate, guesses, won, gameOver, wonAtGuess }));
  }, [guesses, won, gameOver, todayDate, wonAtGuess, USER_STORAGE_KEY]);

  useEffect(() => {
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
    const rawHL = localStorage.getItem(USER_HL_KEY);
    if (rawHL) {
      const savedHL = JSON.parse(rawHL);
      if (savedHL.date === todayStr) {
        setHlHasPlayedToday(savedHL.gameOver ?? false);
        setHlScore(savedHL.score ?? 0);
        if (savedHL.stat) setHlStat(savedHL.stat);
        setHlGameOver(savedHL.gameOver ?? false);
        if (savedHL.player1) setHlPlayer1(savedHL.player1);
        if (savedHL.player2) setHlPlayer2(savedHL.player2);
        if (savedHL.gameStarted) setHlGameStarted(savedHL.gameStarted);
      }
    }
  }, [userEmail, USER_HL_KEY]);

  useEffect(() => {
    if ((!hlGameStarted && !hlGameOver) || !hlPlayer1 || !hlPlayer2) return;
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
    localStorage.setItem(USER_HL_KEY, JSON.stringify({
      date: todayStr,
      score: hlScore,
      player1: hlPlayer1,
      player2: hlPlayer2,
      stat: hlStat,
      gameOver: hlGameOver,
      gameStarted: hlGameStarted
    }));
  }, [hlScore, hlPlayer1, hlPlayer2, hlStat, hlGameOver, hlGameStarted, USER_HL_KEY]);

  // Classic Game Handlers
  const handleQueryChange = useCallback((val: string) => {
    setQuery(val); setSelected(null);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        const guessedNames = new Set(guesses.map(g => g.name));
        setSuggestions(data.filter((p: SearchResult) => !guessedNames.has(p.name)));
        setShowDropdown(val.length >= 2);
      } catch { }
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [guesses]);

  async function handleGuess(overrideSelection?: SearchResult) {
    const playerToGuess = overrideSelection || selected;
    if (!playerToGuess || gameOver) return;

    setLoading(true); setError("");
    try {
      const res = await fetch("/api/guess", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ playerId: playerToGuess.playerId }) });
      if (!res.ok) { setError("Player not found"); return; }

      const result: Guess = await res.json();
      const newGuesses = [...guesses, result];
      setGuesses(newGuesses);
      setQuery(""); setSuggestions([]); setSelected(null); setShowDropdown(false);

      if (result.isCorrect) {
        setWon(true); setGameOver(true); setWonAtGuess(newGuesses.length);
        const pts = getPoints(newGuesses.length);
        if (session?.user) {
          fetch("/api/save-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guessesCount: newGuesses.length, mode: 'classic' })
          })
            .then(res => res.json())
            .then(data => {
              if (data.success || data.error === "Already played today") {
                setLocalStreak(data.streak);
                setLocalScore(data.score);
                if (data.globalAverage) setGlobalAverage(data.globalAverage);
              }
            });
        }
        setTimeout(() => setShowCelebration(true), 400);
      } else {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    } catch { setError("Network error"); } finally { setLoading(false); }
  }

  const handlePathQueryChange = useCallback((val: string) => {
    setPathQuery(val); setPathSelected(null);
    const timeoutId = setTimeout(async () => {
      if (val.length < 2) { setPathSuggestions([]); return; }
      try {
        const res = await fetch(`/api/search-path?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        // Εξαιρούμε όσους έχει ήδη μαντέψει
        setPathSuggestions(data.filter((p: SearchResult) => !pathGuesses.includes(p.name)));
      } catch {}
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [pathGuesses]);

  const executePathGuess = (guessedPlayer: SearchResult) => {
    if (pathGameOver) return;
    
    const isCorrect = guessedPlayer.name.toLowerCase() === pathPlayer?.name.toLowerCase();
    const newGuesses = [...pathGuesses, guessedPlayer.name];
    
    setPathGuesses(newGuesses);
    setPathQuery(""); 
    setPathSuggestions([]); 
    setPathSelected(null);

    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());

    // Έλεγχος αν τελείωσε
    if (isCorrect || newGuesses.length >= 10) {
      let earnedPoints = 0;
      if (isCorrect) {
        // Logic: 100 max, -20 per unlocked hint
        earnedPoints = 100 - (pathUnlockedHints.length * 20);
        if (earnedPoints < 20) earnedPoints = 20; // Minimum 20 points for winning
      }
      
      setPathPoints(earnedPoints);
      setPathWon(isCorrect);
      setPathGameOver(true);
      setPathHasPlayedToday(true);

      if (isCorrect) {
        setTimeout(() => setShowPathCelebration(true), 400);
        
        // Save points if logged in
        if (session?.user) {
          fetch("/api/save-game", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guessesCount: pathUnlockedHints.length, mode: 'player_id' })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setLocalScore(data.score);
              setLocalStreak(data.streak);
            }
          });
        }
      }

      localStorage.setItem(USER_PATH_KEY, JSON.stringify({
        date: todayStr, gameOver: true, won: isCorrect, guesses: newGuesses, player: pathPlayer, unlockedHints: pathUnlockedHints, points: earnedPoints
      }));
    } else {
      // Σώζουμε την κατάσταση ακόμα και αν δεν τελείωσε για να μην χάνονται τα hints/μαντεψιές
      localStorage.setItem(USER_PATH_KEY, JSON.stringify({
        date: todayStr, gameOver: false, won: false, guesses: newGuesses, player: pathPlayer, unlockedHints: pathUnlockedHints
      }));
      // Αν συνεχίζεται το παιχνίδι, ξαναβάζει αυτόματα τον κέρσορα στο Search Bar!
      setTimeout(() => pathInputRef.current?.focus(), 10);
    }
  };

  const handleUnlockHint = (index: number) => {
    if (pathUnlockedHints.includes(index)) return;
    
    const newUnlocked = [...pathUnlockedHints, index];
    setPathUnlockedHints(newUnlocked);
    
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
    localStorage.setItem(USER_PATH_KEY, JSON.stringify({
      date: todayStr, gameOver: pathGameOver, won: pathWon, guesses: pathGuesses, player: pathPlayer, unlockedHints: newUnlocked
    }));
  };

  const handlePathGuess = () => {
    if (pathSelected) executePathGuess(pathSelected);
  };

  // Όταν πατάει Enter
  const handlePathKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Αν έχει προτάσεις, μαντεύει αυτόματα τον 1ο της λίστας
      if (pathSuggestions.length > 0) {
        executePathGuess(pathSuggestions[0]);
      } 
      // Διαφορετικά, αν έχει ήδη επιλέξει κάποιον
      else if (pathSelected) {
        executePathGuess(pathSelected);
      }
    }
  };

  const renderPathCelebration = () => {
    let title = "BASKET!"; let subText = "You identified the path!";
    if (pathPoints === 100) { title = "SCOUTING PRO 🏆"; subText = "Zero hints needed. Mastermind!"; }
    else if (pathPoints >= 80) { title = "ANALYST ⭐"; subText = "Solid identification with minimal help."; }
    else if (pathPoints >= 60) { title = "VETERAN 🏀"; subText = "You know your Euroleague history."; }
    else if (pathPoints >= 40)  { title = "ROLE PLAYER 📉"; subText = "Needed a few clues, but got there."; }
    else { title = "BENCHWARMER"; subText = "Barely made the cut!"; } 

    const confettiPieces = Array.from({ length: 80 }).map((_, i) => {
      const size = Math.random() * 8 + 6;
      const colors = ["#a855f7", "#fff", "#fbbf24", "#ea580c", "#16a34a", "#3b82f6"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;
      const tx = (Math.random() - 0.5) * 600;
      const ty = -(Math.random() * 200 + 100);
      const fallY = Math.random() * 200 + 300;
      const rotation = Math.random() * 720 - 360;
      const delay = Math.random() * 0.2;
      const duration = 1.5 + Math.random() * 1.5;

      return (
        <div key={`conf-path-${i}`} style={{
          position: 'absolute', width: `${size}px`, height: `${size}px`,
          backgroundColor: color, borderRadius: isCircle ? '50%' : '2px',
          left: '50%', top: '40%', opacity: 0,
          '--tx': `${tx}px`, '--ty': `${ty}px`, '--fall': `${fallY}px`, '--r': `${rotation}deg`,
          animation: `confettiBurst ${duration}s ease-in-out ${delay}s forwards`,
          zIndex: 5
        } as React.CSSProperties} />
      );
    });

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", animation: "fadeIn 0.3s ease" }} onClick={() => setShowPathCelebration(false)}>
        <div style={{ background: "linear-gradient(135deg, #2e1065, #0f172a)", border: "2px solid #a855f7", borderRadius: 24, padding: "40px 30px", textAlign: "center", maxWidth: 380, width: "90%", position: "relative" }} onClick={e => e.stopPropagation()}>
          {confettiPieces}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontSize: 60, marginBottom: 10 }}>🏆</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#a855f7", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>{title}</div>
            <p style={{ fontSize: 15, color: "#fff", marginBottom: 20, fontStyle: "italic" }}>"{subText}"</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 25, marginBottom: 25, background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "16px" }}>
              <div><div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Score</div><div style={{ fontSize: 32, fontWeight: 900, color: "#fbbf24", fontFamily: "'Barlow Condensed', sans-serif" }}>+{pathPoints}</div></div>
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}></div>
              <div><div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Guesses</div><div style={{ fontSize: 32, fontWeight: 900, color: "#16a34a", fontFamily: "'Barlow Condensed', sans-serif" }}>{pathGuesses.length}</div></div>
            </div>

            <CountdownTimer />

            <button onClick={() => { setShowPathCelebration(false); setActiveMode("classic"); }} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg, #a855f7, #7e22ce)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", marginTop: 10 }}>
              CONTINUE ➔
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = async () => {
    localStorage.removeItem(USER_STORAGE_KEY); localStorage.removeItem("temp_score"); localStorage.removeItem("temp_streak");
    setGuesses([]); setWon(false); setGameOver(false); setWonAtGuess(null);
    await signOut({ callbackUrl: '/game' });
  };

  const updateIcon = async (url: string) => { 
    setCustomIcon(url); 
    localStorage.setItem(USER_ICON_KEY, url); 
    if (session?.user) {
      try {
        await fetch("/api/update-icon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: url })
        });
      } catch (err) {
        console.error("Failed to update icon in DB:", err);
      }
    }
  };

  const points = wonAtGuess ? getPoints(wonAtGuess) : 0;
  const winningImage = won && guesses.length > 0 ? guesses[guesses.length - 1].imageUrl : "";
  const displayIcon = customIcon || session?.user?.image || DEFAULT_GUEST_ICON;

  // --- CELEBRATION POPUP INNER RENDER ---
  const renderCelebration = () => {
    let title = "BASKET!"; let subText = "You found him!";
    if (points === 100) { title = "MVP PERFORMANCE 🏆"; subText = "Nothing but net. Pure basketball IQ."; }
    else if (points >= 80) { title = "ALL-EUROLEAGUE ⭐"; subText = "Great scouting report. Solid win."; }
    else if (points >= 60) { title = "CLUTCH PLAYER 🧊"; subText = "Stepped up when it mattered most."; }
    else if (points >= 40)  { title = "ROOKIE NUMBERS 📉"; subText = "Bad performance, back to the gym tomorrow."; }
    else { title = "BENCHWARMER"; subText = "Good job,you kept our bench warm"; } 

    const confettiPieces = Array.from({ length: 80 }).map((_, i) => {
      const size = Math.random() * 8 + 6;
      const colors = ["#f97316", "#fff", "#fbbf24", "#ea580c", "#16a34a", "#3b82f6"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;
      const tx = (Math.random() - 0.5) * 600;
      const ty = -(Math.random() * 200 + 100);
      const fallY = Math.random() * 200 + 300;
      const rotation = Math.random() * 720 - 360;
      const delay = Math.random() * 0.2;
      const duration = 1.5 + Math.random() * 1.5;

      return (
        <div key={`conf-${i}`} style={{
          position: 'absolute', width: `${size}px`, height: `${size}px`,
          backgroundColor: color, borderRadius: isCircle ? '50%' : '2px',
          left: '50%', top: '40%', opacity: 0,
          '--tx': `${tx}px`, '--ty': `${ty}px`, '--fall': `${fallY}px`, '--r': `${rotation}deg`,
          animation: `confettiBurst ${duration}s ease-in-out ${delay}s forwards`,
          zIndex: 5
        } as React.CSSProperties} />
      );
    });

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", animation: "fadeIn 0.3s ease" }} onClick={() => setShowCelebration(false)}>
        <div style={{ background: "linear-gradient(135deg, #1a2a1a, #0a1a0a)", border: "2px solid #f97316", borderRadius: 24, padding: "40px 30px", textAlign: "center", maxWidth: 380, width: "90%", position: "relative" }} onClick={e => e.stopPropagation()}>
          {confettiPieces}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#f97316", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>{title}</div>
            <p style={{ fontSize: 15, color: "#fff", marginBottom: 20, fontStyle: "italic" }}>"{subText}"</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 25, marginBottom: 25, background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "16px" }}>
              <div><div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Score</div><div style={{ fontSize: 32, fontWeight: 900, color: "#fbbf24", fontFamily: "'Barlow Condensed', sans-serif" }}>+{points}</div></div>
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}></div>
              <div><div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Streak</div><div style={{ fontSize: 32, fontWeight: 900, color: "#16a34a", fontFamily: "'Barlow Condensed', sans-serif" }}>+1 🔥</div></div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px", marginBottom: 25, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>🌍 Global Stats</div>
              <div style={{ fontSize: 14, color: "#fff" }}>
                Average guesses today: <span style={{ fontWeight: "bold", color: "#fbbf24" }}>{globalAverage || "..."}</span>
              </div>
              {globalAverage && wonAtGuess !== null && wonAtGuess < parseFloat(globalAverage) && (
                <div style={{ fontSize: 12, color: "#22c55e", fontWeight: "bold" }}>
                  🌟 You beat the average!
                </div>
              )}
              {!session?.user && (
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, fontStyle: "italic" }}>Log in to compare with others!</div>
              )}
            </div>

            <CountdownTimer />

            <button onClick={() => { setShowCelebration(false); setActiveMode("higher_lower"); }} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", marginTop: 10 }}>
              NEXT GAME➔
            </button>
          </div>
        </div>
      </div>
    );
  };

 const renderHLResult = () => {
    const earnedPoints = hlScore * 5;
    let title = "GAME OVER";
    let subText = "Better luck tomorrow!";
    if (hlScore >= 10) { title = "LEGENDARY! 🏆"; subText = "You know your Euroleague stats!"; }
    else if (hlScore >= 5) { title = "GREAT STREAK! 🔥"; subText = "Solid performance!"; }

    // --- ΔΗΜΙΟΥΡΓΙΑ ΚΟΜΦΕΤΙ ---
    const confettiPieces = Array.from({ length: 80 }).map((_, i) => {
      const size = Math.random() * 8 + 6;
      const colors = ["#f97316", "#fff", "#fbbf24", "#ea580c", "#16a34a", "#3b82f6"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;
      const tx = (Math.random() - 0.5) * 600;
      const ty = -(Math.random() * 200 + 100);
      const fallY = Math.random() * 200 + 300;
      const rotation = Math.random() * 720 - 360;
      const delay = Math.random() * 0.2;
      const duration = 1.5 + Math.random() * 1.5;

      return (
        <div key={`conf-${i}`} style={{
          position: 'absolute', width: `${size}px`, height: `${size}px`,
          backgroundColor: color, borderRadius: isCircle ? '50%' : '2px',
          left: '50%', top: '40%', opacity: 0,
          '--tx': `${tx}px`, '--ty': `${ty}px`, '--fall': `${fallY}px`, '--r': `${rotation}deg`,
          animation: `confettiBurst ${duration}s ease-in-out ${delay}s forwards`,
          zIndex: 5
        } as React.CSSProperties} />
      );
    });

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", animation: "fadeIn 0.3s ease" }} onClick={() => setShowHLCelebration(false)}>
        <div style={{ background: "linear-gradient(135deg, #1e1b4b, #0f172a)", border: "2px solid #fbbf24", borderRadius: 24, padding: "40px 30px", textAlign: "center", maxWidth: 380, width: "90%", position: "relative" }} onClick={e => e.stopPropagation()}>
          
          {/* ΕΜΦΑΝΙΣΗ ΚΟΜΦΕΤΙ */}
          {confettiPieces} 
          
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ fontSize: 50, marginBottom: 10 }}>⚖️</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fbbf24", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 4 }}>{title}</div>
            <p style={{ fontSize: 15, color: "#fff", marginBottom: 20, fontStyle: "italic" }}>"{subText}"</p>
            
            <div style={{ display: "flex", justifyContent: "center", gap: 25, marginBottom: 25, background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "16px" }}>
              <div><div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Streak</div><div style={{ fontSize: 32, fontWeight: 900, color: "#16a34a", fontFamily: "'Barlow Condensed', sans-serif" }}>{hlScore}</div></div>
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}></div>
              <div><div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Points</div><div style={{ fontSize: 32, fontWeight: 900, color: "#fbbf24", fontFamily: "'Barlow Condensed', sans-serif" }}>+{earnedPoints}</div></div>
            </div>

            <CountdownTimer />

            <button onClick={() => { setShowHLCelebration(false); setActiveMode("player_id"); }} style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg, #fbbf24, #d97706)", color: "#111", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", marginTop: 20 }}>
              NEXT GAME ➔
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div onClick={() => { setShowProfile(false); setShowDropdown(false); }} style={{ minHeight: "100vh", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a1f0a; font-family: 'Barlow', sans-serif; color: white; overflow-x: hidden; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 150%; }
        }

        @keyframes confettiBurst {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 1; }
          35% { transform: translate3d(calc(var(--tx) * 0.6), var(--ty), 0) rotate(calc(var(--r) * 0.5)); opacity: 1; }
          100% { transform: translate3d(var(--tx), calc(var(--ty) + var(--fall)), 0) rotate(var(--r)); opacity: 0; }
        }

        .main-container {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          padding: 80px 16px 60px;
          width: 100%;
        }

        @media (min-width: 1200px) {
          .main-container {
            max-width: 1000px;
            padding-top: 100px;
          }
          h1 { font-size: 64px !important; }
        }

        @media (max-width: 600px) {
          .main-container {
            padding-top: 60px;
          }
          h1 { font-size: 36px !important; letter-spacing: 5px !important; }
          .guess-grid {
             grid-template-columns: 1.5fr 1fr 0.8fr 1fr 1fr !important;
             gap: 4px !important;
          }
          .guess-item {
             font-size: 9px !important;
             min-height: 50px !important;
          }
          .menu-btn {
            max-width: 100% !important;
          }
        }

        .menu-btn { display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.6); border: 1px solid #0891b2; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s; width: 100%; max-width: 400px; margin: 0 auto 16px; backdrop-filter: blur(8px); }
        .menu-btn:hover { background: rgba(8, 145, 178, 0.2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(8, 145, 178, 0.3); }
        .menu-btn.gold { border-color: #fbbf24; }
        .menu-btn.gold:hover { background: rgba(251, 191, 36, 0.2); box-shadow: 0 8px 24px rgba(251, 191, 36, 0.3); }
        .menu-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid; flex-shrink: 0; }
        
        .top-nav { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 30px; position: relative; }
        .top-nav::before { content: ''; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 200px; height: 2px; background: rgba(8, 145, 178, 0.4); z-index: 0; }
        .nav-icon { width: 50px; height: 50px; border-radius: 50%; background: #111; border: 2px solid #0891b2; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; position: relative; z-index: 1; transition: 0.2s; }
        .nav-icon.active { border-color: #fbbf24; transform: scale(1.1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.5); }
        .nav-icon:hover { transform: scale(1.1); }

        .guess-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 0.7fr 1fr 1fr;
          gap: 6px;
          margin-bottom: 6px;
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <img src="/court.jpg" alt="Background" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} />
      </div>

      {showIconSelector && <IconSelector onSelect={updateIcon} onClose={() => setShowIconSelector(false)} />}
      {showCelebration && wonAtGuess && renderCelebration()}
      {showPathCelebration && renderPathCelebration()}

      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 100, display: "flex", gap: 12, alignItems: "center" }} onClick={e => e.stopPropagation()}>
        <CountdownTimer minimal={true} />
        <div style={{ position: "relative" }}>
          <div onClick={() => setShowProfile(!showProfile)} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.65)", padding: "6px 16px 6px 6px", borderRadius: 30, border: "1px solid rgba(249,115,22,0.3)", backdropFilter: "blur(8px)", cursor: "pointer" }}>
            <img src={displayIcon} alt="Profile" style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid #f97316", objectFit: "cover", backgroundColor: "#475569" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>{session?.user?.name || "GUEST"}</span>
              <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>Streak: {localStreak} 🔥</span>
            </div>
          </div>
          {showProfile && <ProfilePopup session={session} localStreak={localStreak} localScore={localScore} currentIcon={displayIcon} onLogout={handleLogout} onChangeIcon={() => setShowIconSelector(true)} />}
        </div>
      </div>

      <main className="main-container">

        {!session?.user && activeMode !== "menu" && (
          <div style={{ 
            background: "rgba(249, 115, 22, 0.1)", 
            border: "1px solid #f97316", 
            borderRadius: 12, 
            padding: "12px 16px", 
            marginBottom: 20, 
            textAlign: "center",
            animation: "slideIn 0.4s ease"
          }}>
            <p style={{ color: "#f97316", fontSize: 14, fontWeight: "bold", margin: 0 }}>
              ⚠️ PLAYING AS GUEST: <span style={{ fontWeight: "normal", color: "#fff" }}>Log in to save your points and climb the leaderboard!</span>
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "0 0 20px", cursor: activeMode !== "menu" ? "pointer" : "default" }} onClick={() => setActiveMode("menu")}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: "clamp(24px, 5vw, 32px)" }}>🏀</span>
            <h1 style={{ fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 900, letterSpacing: "clamp(5px, 2vw, 10px)", fontFamily: "'Barlow Condensed', sans-serif", background: "linear-gradient(135deg, #fff 0%, #f97316 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>EURODLE</h1>
            <span style={{ fontSize: "clamp(24px, 5vw, 32px)" }}>🏀</span>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 3, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
            {activeMode === "menu" ? "CHOOSE YOUR DAILY CHALLENGE" : "GUESS TODAY'S EUROLEAGUE PLAYER"}
          </p>
        </div>

        {activeMode !== "menu" && (
          <div className="top-nav">
            <div className={`nav-icon ${activeMode === "classic" ? "active" : ""}`} onClick={() => setActiveMode("classic")} title="Classic Mode">
              <span style={{ color: activeMode === "classic" ? "#fbbf24" : "#0891b2" }}>❓</span>
              {won && (
                <div style={{ position: "absolute", bottom: -6, right: -6, background: "#22c55e", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: "bold", border: "2px solid #0a1f0a" }}>✓</div>
              )}
            </div>

            <div className={`nav-icon ${activeMode === "higher_lower" ? "active" : ""}`} onClick={() => setActiveMode("higher_lower")} title="Higher or Lower">
              <span style={{ color: activeMode === "higher_lower" ? "#fbbf24" : "#0891b2" }}>⚖️</span>
                {hlHasPlayedToday && (
                  <div style={{ position: "absolute", bottom: -6, right: -6, background: "#22c55e", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: "bold", border: "2px solid #0a1f0a" }}>✓</div>
                )}
            </div>
            <div className={`nav-icon ${activeMode === "player_id" ? "active" : ""}`} onClick={() => setActiveMode("player_id")} title="Player Path" style={{ borderColor: activeMode === "player_id" ? "#a855f7" : "#0891b2" }}>
              <span style={{ color: activeMode === "player_id" ? "#a855f7" : "#0891b2" }}>🆔</span>
              {pathHasPlayedToday && (
                <div style={{ position: "absolute", bottom: -6, right: -6, background: "#22c55e", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: "bold", border: "2px solid #0a1f0a" }}>✓</div>
              )}
            </div>
            <div className="nav-icon" onClick={() => setActiveMode("menu")} title="Back to Menu" style={{ width: 40, height: 40, fontSize: 16 }}>
              🏠
            </div>
          </div>
        )}

        {activeMode === "menu" && (
          <div style={{ animation: "fadeIn 0.3s ease", marginTop: "40px" }}>
            <div className="menu-btn" onClick={() => setActiveMode("classic")}>
              <div className="menu-icon" style={{ borderColor: "#0891b2", color: "#0891b2", position: "relative" }}>
                ❓
                {won && <div style={{ position: "absolute", bottom: -4, right: -4, background: "#22c55e", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: "bold", border: "2px solid #111" }}>✓</div>}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontFamily: "'Barlow Condensed', sans-serif", color: "#fff" }}>Classic Eurodle</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Get clues on every try to find the player</p>
              </div>
            </div>

            <div className="menu-btn gold" onClick={() => setActiveMode("higher_lower")}>
              <div className="menu-icon" style={{ borderColor: "#fbbf24", color: "#fbbf24", position: "relative" }}>
                ⚖️
                {hlHasPlayedToday && (
                  <div style={{ position: "absolute", bottom: -4, right: -4, background: "#22c55e", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: "bold", border: "2px solid #111" }}>✓</div>
                )}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontFamily: "'Barlow Condensed', sans-serif", color: "#fff" }}>Higher or Lower</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Compare daily Euroleague stats</p>
              </div>
            </div>
            <div className="menu-btn" style={{ borderColor: "#a855f7" }} onClick={() => setActiveMode("player_id")}>
              <div className="menu-icon" style={{ borderColor: "#a855f7", color: "#a855f7", position: "relative" }}>
                🆔
                {pathHasPlayedToday && (
                  <div style={{ position: "absolute", bottom: -4, right: -4, background: "#22c55e", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: "bold", border: "2px solid #111" }}>✓</div>
                )}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontFamily: "'Barlow Condensed', sans-serif", color: "#fff" }}>Player Path</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Guess the player from his career</p>
              </div>
            </div>
          </div>
        )}

        {activeMode === "classic" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {!gameOver && (
              <div style={{ marginBottom: 24, position: "relative" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: 14, padding: "10px 10px 10px 16px" }} onClick={e => e.stopPropagation()}>
                  <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>

                  <input ref={inputRef} type="text" value={query} onChange={e => handleQueryChange(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (selected) handleGuess();
                        else if (suggestions.length > 0) handleGuess(suggestions[0]);
                      }
                      if (e.key === "Escape") setShowDropdown(false);
                    }}
                    placeholder="Type a player name..." style={{ flex: 1, background: "transparent", fontSize: 15, color: "#f1f5f9", fontFamily: "'Barlow', sans-serif", border: "none", outline: "none" }} disabled={loading}
                  />

                  <button onClick={() => handleGuess()} disabled={(!selected && suggestions.length === 0) || loading} style={{ padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 800, background: (selected || suggestions.length > 0) && !loading ? "linear-gradient(135deg, #f97316, #ea580c)" : "rgba(255,255,255,0.08)", color: (selected || suggestions.length > 0) && !loading ? "#fff" : "#374151" }}>{loading ? "···" : "GUESS"}</button>
                </div>
                {showDropdown && suggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "rgba(5,10,20,0.98)", backdropFilter: "blur(24px)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 12, zIndex: 100, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                    {suggestions.map((p, i) => (
                      <div key={p.playerId} onClick={() => { setSelected(p); setQuery(p.name); setShowDropdown(false); inputRef.current?.focus(); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif" }}>{p.position}</div>
                        <div><div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{p.name}</div><div style={{ fontSize: 11, color: "#64748b" }}>{p.team}</div></div>
                      </div>
                    ))}
                  </div>
                )}
                {error && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 6, textAlign: "center" }}>{error}</p>}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              {!gameOver ? <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.4)", fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>ATTEMPT <span style={{ color: "#f97316", fontSize: 15 }}>{guesses.length + 1}</span></div> : <div />}
              <div style={{ display: "flex", gap: 16 }}>
                {[{ color: "#16a34a", label: "CORRECT" }, { color: "#d97706", label: "CLOSE" }, { color: "#dc2626", label: "WRONG" }].map(({ color, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} /><span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{label}</span></div>
                ))}
              </div>
            </div>

            {guesses.length > 0 && (
              <div className="guess-grid">
                {["PLAYER", "TEAM", "POS", "NATION", "HEIGHT"].map(h => <div key={h} style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", fontWeight: 700, letterSpacing: 1.5, fontFamily: "'Barlow Condensed', sans-serif" }}>{h}</div>)}
              </div>
            )}

            {[...guesses].reverse().map((g) => (
              <div key={g.name} className="guess-grid" style={{ animation: "slideIn 0.4s ease both" }}>
                
                {/* ΚΟΥΤΙ ΠΑΙΚΤΗ */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{g.name}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{g.team}</div>
                  </div>
                </div>
                
                {/* ΥΠΟΛΟΙΠΑ ΣΤΑΤΙΣΤΙΚΑ */}
                <div className="guess-item" style={{ background: colorBg(g.feedback.team), borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 58, padding: 4, color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "center" }}>{shortTeam(g.team)}</div>
                <div className="guess-item" style={{ background: colorBg(g.feedback.position), borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 58, color: "#fff", fontSize: 10, fontWeight: 700 }}>{g.position}</div>
                <div className="guess-item" style={{ background: colorBg(g.feedback.nationality), borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 58, color: "#fff", fontSize: 10, fontWeight: 700 }}>{g.nationality}</div>
                <div className="guess-item" style={{ background: colorBg(g.feedback.height), borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 58, color: "#fff", fontSize: 10, fontWeight: 700 }}>{g.height}cm {g.feedback.heightArrow === "up" ? "↑" : g.feedback.heightArrow === "down" ? "↓" : ""}</div>
              </div>
            ))} 

            {gameOver && won && !showCelebration && (
              <div style={{ marginTop: 24, borderRadius: 16, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(249,115,22,0.4)", padding: "20px 24px", textAlign: "center", animation: "slideIn 0.4s ease" }}>
                <div style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", fontFamily: "'Barlow', sans-serif", marginBottom: 8 }}>
                  You scored <span style={{ color: "#f97316", fontWeight: 900, fontSize: 22, fontFamily: "'Barlow Condensed', sans-serif" }}>+{points} PTS</span> in {wonAtGuess} {wonAtGuess === 1 ? "guess" : "guesses"}!
                </div>

                <div style={{ fontSize: 13, color: "#fbbf24", marginBottom: 16 }}>
                  🌍 Global average today: <b>{globalAverage || "..."}</b> guesses
                  {!session?.user && <span style={{ color: "#94a3b8", fontStyle: "italic", marginLeft: 8 }}>(Log in to track)</span>}
                </div>

                <button onClick={() => setActiveMode("higher_lower")} style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 16, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", cursor: "pointer", textTransform: "uppercase", boxShadow: "0 4px 15px rgba(249,115,22,0.4)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  NEXT GAME➔
                </button>
              </div>
            )}
          </div>
        )}

        {activeMode === "higher_lower" && (
          <div style={{ textAlign: "center", marginTop: 40, animation: "fadeIn 0.3s ease" }}>
            <h2 style={{ fontSize: 32, fontFamily: "'Barlow Condensed', sans-serif", color: "#fbbf24", marginBottom: 10 }}>HIGHER OR LOWER</h2>
            <p style={{ color: "#94a3b8" }}>Coming next! Let's decide on the first stat.</p>
          </div>
        )}  
       {showHLCelebration && renderHLResult()}

        {activeMode === "higher_lower" && (
          <div style={{ marginTop: 20, animation: "fadeIn 0.3s ease" }}>  
            
            {!hlGameStarted ? (
              <div style={{ textAlign: "center", background: "rgba(0,0,0,0.6)", padding: "40px 20px", borderRadius: 16, border: "1px solid #fbbf24", margin: "0 auto", maxWidth: 450 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚖️</div>
                <h2 style={{ fontSize: 32, fontFamily: "'Barlow Condensed', sans-serif", color: "#fbbf24", marginBottom: 15 }}>HIGHER OR LOWER</h2>
                
                {hlHasPlayedToday ? (
                  /* --- ΠΙΝΑΚΑΚΙ ΣΚΟΡ (ΑΝ ΕΧΕΙ ΠΑΙΞΕΙ) --- */
                  <div style={{ animation: "fadeIn 0.5s ease" }}>
                    <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid #22c55e", borderRadius: 16, padding: "20px", marginBottom: 20 }}>
                      <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "uppercase", marginBottom: 5 }}>Today's Category</div>
                      <div style={{ fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 15, fontFamily: "'Barlow Condensed', sans-serif" }}>
                         {STAT_LABELS[hlStat] || "Points Per Game"}
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Your Streak</div>
                          <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e" }}>{hlScore}</div>
                        </div>
                        <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }}></div>
                        <div>
                          <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>Points</div>
                          <div style={{ fontSize: 28, fontWeight: 900, color: "#fbbf24" }}>+{hlScore * 10}</div>
                        </div>
                      </div>
                    </div>
                    
                    <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 15 }}>Next game in:</p>
                    <CountdownTimer />
                  </div>
                ) : (
                  /* --- ΚΟΥΜΠΙ PLAY (ΑΝ ΔΕΝ ΕΧΕΙ ΠΑΙΞΕΙ) --- */
                  <>
                    <p style={{ color: "#94a3b8", marginBottom: 24 }}>Guess if the next Euroleague player has better or worse stats!</p>
                    <button onClick={startHlGame} disabled={hlLoading} style={{ background: "linear-gradient(135deg, #fbbf24, #d97706)", color: "#111", border: "none", padding: "14px 32px", borderRadius: 12, fontSize: 18, fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif", cursor: hlLoading ? "default" : "pointer", textTransform: "uppercase", opacity: hlLoading ? 0.7 : 1 }}>
                      {hlLoading ? "LOADING..." : "PLAY NOW"}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                
                {/* Score Header */}
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", background: "rgba(255,255,255,0.05)", padding: "10px 20px", borderRadius: 12 }}>
                  <div style={{ fontSize: 14, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Current Stat: <span style={{ color: "#fbbf24" }}>{STAT_LABELS[hlStat]}</span></div>
                  <div style={{ fontSize: 14, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Score: <span style={{ color: "#16a34a", fontSize: 18 }}>{hlScore}</span></div>
                </div>

                {/* Cards Container */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 15, width: "100%", alignItems: "center" }}>
                  
                  {/* Player 1 Card (Reference) */}
                  <div style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.8), rgba(2,6,23,0.9))", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20, textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                      <PlayerCard 
                      teamCode={hlPlayer1?.teamCode || "UNK"} 
                      name={hlPlayer1?.name || "Player"} 
                      dorsal={hlPlayer1?.dorsal || "00"} 
                      />
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 15 }}>{hlPlayer1?.name}</div>
                    <div style={{ background: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>{STAT_LABELS[hlStat]}</div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif" }}>{hlPlayer1?.stats?.[hlStat] || 0}</div>
                    </div>
                  </div>

                  {/* VS Badge */}
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, fontStyle: "italic", zIndex: 10, boxShadow: "0 0 20px rgba(249,115,22,0.5)" }}>VS</div>

                  {/* Player 2 Card (To Guess) */}
                  <div style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.8), rgba(2,6,23,0.9))", border: "1px solid #fbbf24", borderRadius: 16, padding: 20, textAlign: "center", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                      <PlayerCard 
                      teamCode={hlPlayer2?.teamCode || "UNK"} 
                      name={hlPlayer2?.name || "Player"} 
                      dorsal={hlPlayer2?.dorsal || "00"} 
                      />
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 15 }}>{hlPlayer2?.name}</div>
                    
                    {hlGameOver || hlAnimating ? (
                      <div style={{ background: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: 8, animation: "fadeIn 0.3s ease" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase" }}>{STAT_LABELS[hlStat]}</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: hlGameOver ? "#ef4444" : "#22c55e", fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {hlPlayer2?.stats?.[hlStat] || 0}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button onClick={() => handleHlGuess("higher")} style={{ padding: "12px", borderRadius: 8, background: "rgba(22, 163, 74, 0.2)", border: "1px solid #16a34a", color: "#4ade80", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#16a34a"} onMouseLeave={e => e.currentTarget.style.background = "rgba(22, 163, 74, 0.2)"}>
                          ⬆ HIGHER
                        </button>
                        <button onClick={() => handleHlGuess("lower")} style={{ padding: "12px", borderRadius: 8, background: "rgba(220, 38, 38, 0.2)", border: "1px solid #dc2626", color: "#f87171", fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#dc2626"} onMouseLeave={e => e.currentTarget.style.background = "rgba(220, 38, 38, 0.2)"}>
                          ⬇ LOWER
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Over Panel */}
                {hlGameOver && (
                  <div style={{ background: "rgba(220, 38, 38, 0.1)", border: "1px solid #dc2626", borderRadius: 12, padding: "20px", width: "100%", textAlign: "center", animation: "slideIn 0.3s ease", marginTop: 10 }}>
                    <h3 style={{ fontSize: 24, color: "#f87171", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 5 }}>WRONG!</h3>
                    <p style={{ color: "#fff", marginBottom: 15 }}>Final Score: <span style={{ fontWeight: "bold", fontSize: 20 }}>{hlScore}</span></p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {activeMode === "player_id" && (
          <div style={{ animation: "fadeIn 0.3s ease", marginTop: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🆔</div>
              <h2 style={{ fontSize: 32, fontFamily: "'Barlow Condensed', sans-serif", color: "#a855f7", margin: 0 }}>PLAYER PATH</h2>
              <p style={{ color: "#94a3b8" }}>Guess the player from his career timeline!</p>
            </div>

            {!pathPlayer ? (
              <div style={{ textAlign: "center", color: "#a855f7" }}>Loading career data...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                
                {/* --- 1. CAREER PATH (Η Διαδρομή) --- */}
                <div style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(168, 85, 247, 0.4)", borderRadius: 16, padding: "24px 20px" }}>
                  <h3 style={{ color: "#a855f7", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 20, fontSize: 20, letterSpacing: 1, textTransform: "uppercase", textAlign: "center" }}>Career Timeline</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {pathPlayer.career.map((step: any, index: number) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <div style={{ minWidth: 60, fontSize: 13, color: "#94a3b8", fontWeight: "bold", textAlign: "right" }}>{step.years}</div>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#a855f7", position: "relative", zIndex: 2, boxShadow: "0 0 10px #a855f7" }}></div>
                        <div style={{ flex: 1, background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.3)", padding: "10px 15px", borderRadius: 10, fontSize: 16, fontWeight: "bold", color: "#fff" }}>
                          {step.team}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- 2. HINTS (Ξεκλειδώνουν σταδιακά) --- */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {[
                    { icon: "👕", label: "Jersey #", value: pathPlayer.hints.jersey, threshold: 3, color: "#0ea5e9" },
                    { icon: "🏀", label: "Position", value: pathPlayer.hints.position, threshold: 6, color: "#10b981" },
                    { icon: "🌍", label: "Nationality", value: pathPlayer.hints.nationality, threshold: 9, color: "#f59e0b" }
                  ].map((hint, i) => {
                    const isAvailable = pathGuesses.length >= hint.threshold;
                    const isUnlocked = pathUnlockedHints.includes(i) || pathGameOver;

                    return (
                      <div 
                        key={i} 
                        onClick={() => isAvailable && !isUnlocked && handleUnlockHint(i)}
                        style={{ 
                          background: isUnlocked ? "rgba(255,255,255,0.05)" : isAvailable ? "rgba(168, 85, 247, 0.1)" : "rgba(255,255,255,0.02)", 
                          padding: "15px 10px", 
                          borderRadius: 16, 
                          textAlign: "center", 
                          border: isUnlocked ? `1px solid ${hint.color}` : isAvailable ? "1px solid #a855f7" : "1px dashed rgba(255,255,255,0.1)",
                          cursor: isAvailable && !isUnlocked ? "pointer" : "default",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden"
                        }}
                      >
                        <div style={{ fontSize: 24, marginBottom: 8, filter: isUnlocked ? "none" : "grayscale(1) opacity(0.5)" }}>{hint.icon}</div>
                        
                        {isUnlocked ? (
                          <div style={{ animation: "fadeIn 0.5s ease" }}>
                            <div style={{ fontSize: 10, color: hint.color, textTransform: "uppercase", fontWeight: "bold", marginBottom: 2 }}>{hint.label}</div>
                            <div style={{ fontSize: 15, color: "#fff", fontWeight: 900, fontFamily: "'Barlow Condensed', sans-serif" }}>{hint.value}</div>
                          </div>
                        ) : isAvailable ? (
                          <div style={{ animation: "pulse 2s infinite" }}>
                            <div style={{ fontSize: 12, color: "#a855f7", fontWeight: "bold" }}>CLICK TO</div>
                            <div style={{ fontSize: 12, color: "#a855f7", fontWeight: "bold" }}>UNLOCK 🔓</div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase" }}>Locked</div>
                            <div style={{ fontSize: 10, color: "#64748b" }}>{hint.threshold} errors</div>
                          </div>
                        )}
                        
                        {/* Shimmer effect for available hints */}
                        {isAvailable && !isUnlocked && (
                          <div style={{
                            position: "absolute",
                            top: 0, left: "-100%",
                            width: "50%", height: "100%",
                            background: "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.2), transparent)",
                            animation: "shimmer 2s infinite",
                            transform: "skewX(-20deg)"
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* --- 3. SEARCH BAR Ή GAME OVER SCREEN --- */}
                {!pathGameOver ? (
                  <div style={{ position: "relative", zIndex: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: "#94a3b8", fontWeight: "bold" }}>
                      <span>ATTEMPT {pathGuesses.length + 1} OF 10</span>
                      {pathGuesses.length >= 9 && (
                        <button 
                          onClick={() => {
                            setPathGameOver(true); setPathWon(false); setPathHasPlayedToday(true);
                            const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());
                            localStorage.setItem(USER_PATH_KEY, JSON.stringify({ date: todayStr, gameOver: true, won: false, guesses: pathGuesses, player: pathPlayer, unlockedHints: pathUnlockedHints }));
                          }} 
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", textDecoration: "underline", fontSize: 12 }}
                        >
                          Give Up 🏳️
                        </button>
                      )}
                    </div>
                    
                    <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(0,0,0,0.6)", border: "1px solid #a855f7", borderRadius: 14, padding: "10px 10px 10px 16px" }}>
                      <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
                      <input 
                        ref={pathInputRef}
                        type="text" 
                        value={pathQuery} 
                        onChange={e => handlePathQueryChange(e.target.value)} 
                        onKeyDown={handlePathKeyDown}
                        placeholder="Type a player name..." 
                        style={{ flex: 1, background: "transparent", fontSize: 15, color: "#f1f5f9", fontFamily: "'Barlow', sans-serif", border: "none", outline: "none" }} 
                      />
                      <button onClick={handlePathGuess} disabled={!pathSelected && pathSuggestions.length === 0} style={{ padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 800, background: (pathSelected || pathSuggestions.length > 0) ? "#a855f7" : "rgba(255,255,255,0.08)", color: (pathSelected || pathSuggestions.length > 0) ? "#fff" : "#374151", border: "none", cursor: (pathSelected || pathSuggestions.length > 0) ? "pointer" : "default" }}>GUESS</button>
                    </div>

                    {pathSuggestions.length > 0 && (
                      <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "rgba(5,10,20,0.98)", border: "1px solid #a855f7", borderRadius: 12, zIndex: 100, overflow: "hidden" }}>
                        {pathSuggestions.map((p, i) => (
                          <div key={p.playerId} onClick={() => { setPathSelected(p); setPathQuery(p.name); setPathSuggestions([]); pathInputRef.current?.focus(); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", cursor: "pointer", background: i === 0 ? "rgba(168, 85, 247, 0.15)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{p.position}</div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>
                                {p.name} {i === 0 && <span style={{ fontSize: 10, color: "#a855f7", marginLeft: 6 }}>(Press Enter)</span>}
                              </div>
                              <div style={{ fontSize: 11, color: "#64748b" }}>{p.team}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ background: pathWon ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", border: pathWon ? "1px solid #22c55e" : "1px solid #ef4444", borderRadius: 16, padding: "20px", textAlign: "center", animation: "slideIn 0.4s ease" }}>
                    <h3 style={{ fontSize: 28, color: pathWon ? "#22c55e" : "#ef4444", fontFamily: "'Barlow Condensed', sans-serif", margin: "0 0 10px 0" }}>
                      {pathWon ? "CORRECT! 🎉" : "GAME OVER"}
                    </h3>
                    {pathWon && (
                      <div style={{ fontSize: 18, color: "#fbbf24", fontWeight: "bold", marginBottom: 15 }}>
                        YOU SCORED +{pathPoints} PTS
                      </div>
                    )}
                    <p style={{ color: "#fff", fontSize: 16 }}>The player was:</p>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif", marginTop: 5, letterSpacing: 1, marginBottom: 25 }}>{pathPlayer.name}</div>
                    
                    <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 10 }}>Next player in:</p>
                    <CountdownTimer />
                  </div>
                )}

                {/* --- 4. ΛΑΘΟΣ ΜΑΝΤΕΨΙΕΣ --- */}
                {pathGuesses.length > 0 && !pathWon && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {pathGuesses.map((guess, idx) => (
                      <span key={idx} style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", color: "#f87171", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: "bold" }}>
                        ❌ {guess}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}