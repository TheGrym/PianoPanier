import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LEVELS, GOALS, THEORY, PROGRAMS, getProgram } from "./data/curriculum.js";

/* ══════════════════════════════════════════════════════════════ STORAGE */
const LS = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ══════════════════════════════════════════════════════════════ THEME */
const BG = "#0a0a18";
const CARD = "#11111e";
const CARD2 = "#16162a";
const BORDER = "#1e1e38";
const TEXT = "#eeeef8";
const MUTED = "#4a4a70";
const ACCENT = "#7C3AED";
const FONT = "'DM Sans', sans-serif";
const SERIF = "'DM Serif Display', Georgia, serif";

const TYPE_COLORS = {
  technique: "#F59E0B",
  exercice:  "#10B981",
  morceau:   "#7C3AED",
  theorie:   "#3B82F6",
  culture:   "#EC4899",
};

const CheckIco = ({ size = 12 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function Tag({ label, color, small }) {
  return (
    <span style={{ fontSize: small ? 9 : 11, color, background: `${color}18`, padding: small ? "2px 7px" : "3px 10px", borderRadius: 99, border: `1px solid ${color}33`, whiteSpace: "nowrap", fontFamily: FONT }}>
      {label}
    </span>
  );
}

function Btn({ label, onClick, color = ACCENT, variant = "fill", style: s = {}, disabled = false, small = false }) {
  const base = { fontFamily: FONT, fontSize: small ? 13 : 15, fontWeight: 600, borderRadius: small ? 10 : 14, padding: small ? "8px 14px" : "13px 20px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1, border: "none", transition: "opacity .15s", ...s };
  if (variant === "fill")    return <button onClick={onClick} disabled={disabled} style={{ ...base, background: color, color: "#fff" }}>{label}</button>;
  if (variant === "outline") return <button onClick={onClick} disabled={disabled} style={{ ...base, background: "transparent", color, border: `1.5px solid ${color}` }}>{label}</button>;
  return <button onClick={onClick} disabled={disabled} style={{ ...base, background: CARD2, color: TEXT, border: `1px solid ${BORDER}` }}>{label}</button>;
}

/* ══════════════════════════════════════════════════════════════ PIANO KEYBOARD */
const NOTES_OCTAVE = [
  { note: "C",  black: false }, { note: "C#", black: true  }, { note: "D",  black: false },
  { note: "D#", black: true  }, { note: "E",  black: false }, { note: "F",  black: false },
  { note: "F#", black: true  }, { note: "G",  black: false }, { note: "G#", black: true  },
  { note: "A",  black: false }, { note: "A#", black: true  }, { note: "B",  black: false },
];

const SCALE_NOTES = {
  "Do majeur":   ["C","D","E","F","G","A","B"],
  "Sol majeur":  ["G","A","B","C","D","E","F#"],
  "Ré majeur":   ["D","E","F#","G","A","B","C#"],
  "Fa majeur":   ["F","G","A","A#","C","D","E"],
  "La mineur":   ["A","B","C","D","E","F","G"],
  "Do majeur 7": ["C","E","G","B"],
  "Am7":         ["A","C","E","G"],
  "G7":          ["G","B","D","F"],
};

function PianoKeyboard({ highlightNotes = [], small = false }) {
  const octaves = small ? 1 : 2;
  const whiteW  = small ? 28 : 34;
  const whiteH  = small ? 80 : 100;
  const blackW  = small ? 18 : 22;
  const blackH  = small ? 50 : 62;
  const whites  = [];
  const blacks  = [];
  let wIdx = 0;

  for (let oct = 0; oct < octaves; oct++) {
    NOTES_OCTAVE.forEach(({ note, black }) => {
      const noteBase = note.replace("#", "");
      const isHigh   = highlightNotes.includes(note) || highlightNotes.includes(noteBase);
      if (!black) {
        whites.push({ note, octave: oct + 4, x: (wIdx + oct * 7) * whiteW, isHigh, wIdx: wIdx + oct * 7 });
        wIdx++;
      } else {
        blacks.push({ note, octave: oct + 4, wIdx: wIdx + oct * 7 - 0.6, isHigh });
      }
    });
    wIdx = 0;
  }

  const totalW = (7 * octaves) * whiteW;

  return (
    <div style={{ overflowX: "auto", padding: "4px 0" }}>
      <svg width={totalW} height={whiteH + 4} style={{ display: "block" }}>
        {whites.map((k, i) => (
          <g key={i}>
            <rect x={k.x + 1} y={2} width={whiteW - 2} height={whiteH} rx={4}
              fill={k.isHigh ? `${ACCENT}` : "#e8e8f0"} stroke={k.isHigh ? ACCENT : "#ccc"} strokeWidth={1} />
            {k.isHigh && (
              <circle cx={k.x + whiteW / 2} cy={whiteH - 12} r={5} fill="white" />
            )}
            <text x={k.x + whiteW / 2} y={whiteH - 4} textAnchor="middle" fontSize={9} fill={k.isHigh ? "#fff" : "#999"} fontFamily={FONT}>{k.note}</text>
          </g>
        ))}
        {blacks.map((k, i) => (
          <rect key={i} x={k.wIdx * whiteW + 1} y={2} width={blackW} height={blackH} rx={3}
            fill={k.isHigh ? ACCENT : "#1a1a2e"} stroke={k.isHigh ? "#fff3" : "#0005"} strokeWidth={1} />
        ))}
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ METRONOME */
function Metronome() {
  const [bpm, setBpm]         = useState(60);
  const [running, setRunning] = useState(false);
  const [beat, setBeat]       = useState(0);
  const [sig, setSig]         = useState(4);
  const ref    = useRef(null);
  const audCtx = useRef(null);

  const click = useCallback((strong) => {
    try {
      if (!audCtx.current) audCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = strong ? 1200 : 800;
      gain.gain.setValueAtTime(strong ? 0.4 : 0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!running) { clearInterval(ref.current); return; }
    let b = 0;
    ref.current = setInterval(() => {
      setBeat(b);
      click(b === 0);
      b = (b + 1) % sig;
    }, (60 / bpm) * 1000);
    return () => clearInterval(ref.current);
  }, [running, bpm, sig]);

  const tap = useCallback(() => {
    // simple tap tempo could be added later
  }, []);

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "18px 16px" }}>
      <div style={{ fontFamily: SERIF, fontSize: 18, color: TEXT, marginBottom: 14 }}>🥁 Métronome</div>

      {/* Beat indicators */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
        {Array.from({ length: sig }, (_, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: running && beat === i ? (i === 0 ? "#EF4444" : ACCENT) : BORDER, transition: "background .05s" }} />
        ))}
      </div>

      {/* BPM display */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: SERIF, fontSize: 52, color: running ? ACCENT : TEXT, lineHeight: 1 }}>{bpm}</div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>BPM</div>
      </div>

      {/* BPM control */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button onClick={() => setBpm(b => Math.max(20, b - 5))} style={{ flex: 1, padding: "10px 0", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, color: TEXT, fontSize: 20, cursor: "pointer", fontFamily: FONT }}>−5</button>
        <button onClick={() => setBpm(b => Math.max(20, b - 1))} style={{ flex: 1, padding: "10px 0", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, color: TEXT, fontSize: 20, cursor: "pointer", fontFamily: FONT }}>−1</button>
        <button onClick={() => setBpm(b => Math.min(220, b + 1))} style={{ flex: 1, padding: "10px 0", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, color: TEXT, fontSize: 20, cursor: "pointer", fontFamily: FONT }}>+1</button>
        <button onClick={() => setBpm(b => Math.min(220, b + 5))} style={{ flex: 1, padding: "10px 0", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, color: TEXT, fontSize: 20, cursor: "pointer", fontFamily: FONT }}>+5</button>
      </div>

      {/* Slider */}
      <input type="range" min={20} max={220} value={bpm} onChange={e => setBpm(+e.target.value)}
        style={{ width: "100%", accentColor: ACCENT, marginBottom: 14 }} />

      {/* Signature */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, justifyContent: "center" }}>
        {[2, 3, 4, 6].map(s => (
          <button key={s} onClick={() => setSig(s)} style={{ padding: "6px 14px", background: sig === s ? ACCENT : CARD2, border: `1px solid ${sig === s ? ACCENT : BORDER}`, borderRadius: 8, color: TEXT, fontSize: 12, cursor: "pointer", fontFamily: FONT }}>
            {s}/4
          </button>
        ))}
      </div>

      {/* Common tempos */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {[["Largo", 50], ["Adagio", 66], ["Andante", 80], ["Moderato", 100], ["Allegro", 130], ["Presto", 168]].map(([name, b]) => (
          <button key={name} onClick={() => setBpm(b)} style={{ fontSize: 10, color: MUTED, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontFamily: FONT }}>
            {name} {b}
          </button>
        ))}
      </div>

      <Btn label={running ? "⏹ Stop" : "▶ Démarrer"} onClick={() => setRunning(r => !r)} color={running ? "#EF4444" : ACCENT} style={{ width: "100%" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ THEORY QUIZ */
function TheoryCard({ topicId, onClose }) {
  const topic = THEORY[topicId];
  const [quizIdx, setQuizIdx] = useState(null);
  const [showA, setShowA]     = useState(false);
  if (!topic) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: CARD, borderRadius: "20px 20px 0 0", padding: "24px 20px 36px", maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: TEXT }}>{topic.title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ fontSize: 14, color: "#aaa", lineHeight: 1.75, background: CARD2, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>{topic.content}</div>

        {quizIdx === null ? (
          <Btn label="🧠 Tester mes connaissances" onClick={() => { setQuizIdx(0); setShowA(false); }} style={{ width: "100%" }} />
        ) : (
          <div style={{ background: CARD2, borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Question {quizIdx + 1}/{topic.quiz.length}</div>
            <div style={{ fontSize: 15, color: TEXT, marginBottom: 14, lineHeight: 1.6 }}>{topic.quiz[quizIdx].q}</div>
            {showA ? (
              <>
                <div style={{ background: "#10B98118", border: "1px solid #10B98155", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "#10B981" }}>✓ {topic.quiz[quizIdx].a}</div>
                </div>
                {quizIdx < topic.quiz.length - 1 ? (
                  <Btn label="Question suivante →" onClick={() => { setQuizIdx(q => q + 1); setShowA(false); }} style={{ width: "100%" }} />
                ) : (
                  <Btn label="Terminé ✓" onClick={() => { setQuizIdx(null); setShowA(false); }} color="#10B981" style={{ width: "100%" }} />
                )}
              </>
            ) : (
              <Btn label="Voir la réponse" onClick={() => setShowA(true)} variant="outline" color={ACCENT} style={{ width: "100%" }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ ONBOARDING */
function Onboarding({ onComplete }) {
  const [step,  setStep]  = useState(0);
  const [level, setLevel] = useState(null);
  const [goal,  setGoal]  = useState(null);
  const [time,  setTime]  = useState(20);
  const [name,  setName]  = useState("");

  const program = level && goal ? getProgram(level, goal) : null;

  const finish = () => {
    const profile = { name: name || "Pianiste", level, goal, dailyMinutes: time, programId: program.id };
    LS.set("piano:profile", profile);
    LS.set("piano:progress", {});
    LS.set("piano:sessions", []);
    onComplete(profile);
  };

  const steps = [
    // 0 — Welcome
    <div key={0}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎹</div>
        <div style={{ fontFamily: SERIF, fontSize: 36, color: TEXT, lineHeight: 1.1, marginBottom: 12 }}>PianoFlow</div>
        <div style={{ fontSize: 15, color: MUTED, lineHeight: 1.7 }}>La méthode progressive pour apprendre le piano — du premier Do au premier récital.</div>
      </div>
      {[
        ["📚", "Curriculum structuré semaine par semaine"],
        ["🥁", "Métronome intégré"],
        ["🎹", "Clavier interactif visuel"],
        ["🧠", "Fiches de théorie et quiz"],
        ["📈", "Suivi de progression détaillé"],
      ].map(([ic, tx], i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "11px 14px", marginBottom: 9 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{ic}</span>
          <span style={{ fontSize: 13, color: "#888" }}>{tx}</span>
        </div>
      ))}
      <Btn label="Commencer →" onClick={() => setStep(1)} style={{ width: "100%", marginTop: 20 }} />
    </div>,

    // 1 — Name
    <div key={1}>
      <div style={{ fontFamily: SERIF, fontSize: 30, color: TEXT, marginBottom: 6 }}>Ton prénom</div>
      <div style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Pour personnaliser le programme</div>
      <input type="text" placeholder="Ex : Julien" value={name} onChange={e => setName(e.target.value)}
        style={{ width: "100%", background: CARD2, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", color: TEXT, fontSize: 17, fontFamily: FONT, outline: "none", boxSizing: "border-box", marginBottom: 24 }} />
      <div style={{ display: "flex", gap: 10 }}>
        <Btn label="← Retour" onClick={() => setStep(0)} variant="ghost" style={{ flex: 1 }} />
        <Btn label="Continuer →" onClick={() => setStep(2)} style={{ flex: 2 }} />
      </div>
    </div>,

    // 2 — Level
    <div key={2}>
      <div style={{ fontFamily: SERIF, fontSize: 30, color: TEXT, marginBottom: 6 }}>Ton niveau</div>
      <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>Sois honnête — le programme s'adapte</div>
      {LEVELS.map(l => (
        <div key={l.id} onClick={() => setLevel(l.id)} style={{ background: CARD2, border: `1.5px solid ${level === l.id ? ACCENT : BORDER}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", transition: "border-color .2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>{l.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, color: level === l.id ? ACCENT : TEXT, fontWeight: 500 }}>{l.label}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{l.desc}</div>
            </div>
            {level === l.id && <div style={{ color: ACCENT }}><CheckIco size={16} /></div>}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label="← Retour" onClick={() => setStep(1)} variant="ghost" style={{ flex: 1 }} />
        <Btn label="Continuer →" onClick={() => setStep(3)} disabled={!level} style={{ flex: 2 }} />
      </div>
    </div>,

    // 3 — Goal
    <div key={3}>
      <div style={{ fontFamily: SERIF, fontSize: 30, color: TEXT, marginBottom: 6 }}>Ton objectif</div>
      <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>Quel style de musique t'attire ?</div>
      {GOALS.map(g => (
        <div key={g.id} onClick={() => setGoal(g.id)} style={{ background: CARD2, border: `1.5px solid ${goal === g.id ? ACCENT : BORDER}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", transition: "border-color .2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>{g.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, color: goal === g.id ? ACCENT : TEXT, fontWeight: 500 }}>{g.label}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{g.desc}</div>
            </div>
            {goal === g.id && <div style={{ color: ACCENT }}><CheckIco size={16} /></div>}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn label="← Retour" onClick={() => setStep(2)} variant="ghost" style={{ flex: 1 }} />
        <Btn label="Continuer →" onClick={() => setStep(4)} disabled={!goal} style={{ flex: 2 }} />
      </div>
    </div>,

    // 4 — Practice time + program reveal
    <div key={4}>
      <div style={{ fontFamily: SERIF, fontSize: 30, color: TEXT, marginBottom: 6 }}>Temps de pratique</div>
      <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>Combien de minutes par jour peux-tu pratiquer ?</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        {[15, 20, 30, 45].map(t => (
          <div key={t} onClick={() => setTime(t)} style={{ background: CARD2, border: `1.5px solid ${time === t ? ACCENT : BORDER}`, borderRadius: 12, padding: "14px 8px", textAlign: "center", cursor: "pointer", transition: "border-color .2s" }}>
            <div style={{ fontFamily: SERIF, fontSize: 24, color: time === t ? ACCENT : TEXT }}>{t}</div>
            <div style={{ fontSize: 10, color: MUTED }}>min</div>
          </div>
        ))}
      </div>
      {program && (
        <div style={{ background: `${ACCENT}12`, border: `1.5px solid ${ACCENT}44`, borderRadius: 14, padding: "16px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Programme recommandé</div>
          <div style={{ fontFamily: SERIF, fontSize: 20, color: TEXT, marginBottom: 4 }}>{program.name}</div>
          <div style={{ fontSize: 12, color: ACCENT, marginBottom: 8 }}>{program.subtitle} · {program.weeks.length} semaines</div>
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{program.description}</div>
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <Btn label="← Retour" onClick={() => setStep(3)} variant="ghost" style={{ flex: 1 }} />
        <Btn label="Lancer le programme →" onClick={finish} disabled={!program} style={{ flex: 2 }} />
      </div>
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: FONT }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 380, width: "100%" }}>{steps[step]}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ BOTTOM NAV */
function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: "home",     icon: "🏠", label: "Accueil" },
    { id: "practice", icon: "🎹", label: "Pratique" },
    { id: "tools",    icon: "🛠️", label: "Outils" },
    { id: "progress", icon: "📈", label: "Progrès" },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,24,0.97)", backdropFilter: "blur(12px)", borderTop: `1px solid ${BORDER}`, display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom,4px)" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 0 6px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
          <span style={{ fontSize: 9, letterSpacing: "0.04em", color: tab === t.id ? ACCENT : MUTED, transition: "color .2s" }}>{t.label}</span>
          {tab === t.id && <div style={{ width: 20, height: 2, borderRadius: 1, background: ACCENT, marginTop: 1 }} />}
        </button>
      ))}
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════ ACTIVE PRACTICE */
function ActivePractice({ session, weekNum, onComplete, onCancel }) {
  const [exIdx,    setExIdx]    = useState(0);
  const [done,     setDone]     = useState([]);
  const [showNote, setShowNote] = useState(false);
  const [bpmLog,   setBpmLog]   = useState({});
  const [bpmInput, setBpmInput] = useState("");
  const [timer,    setTimer]    = useState(0);
  const [paused,   setPaused]   = useState(false);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);

  const ex = session.exercises[exIdx];
  const typeColor = TYPE_COLORS[ex?.type] || ACCENT;

  useEffect(() => {
    setTimer(0);
    setBpmInput(ex?.bpm ? String(ex.bpm) : "");
  }, [exIdx]);

  useEffect(() => {
    if (paused || finished) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [paused, finished]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const completeEx = () => {
    const newDone = [...done, ex.id];
    const newBpm  = bpmInput ? { ...bpmLog, [ex.id]: parseInt(bpmInput) } : bpmLog;
    setDone(newDone);
    setBpmLog(newBpm);
    if (exIdx < session.exercises.length - 1) {
      setExIdx(i => i + 1);
      setShowNote(false);
    } else {
      setFinished(true);
      clearInterval(timerRef.current);
      onComplete({ exercisesDone: newDone, bpmLog: newBpm, duration: Math.round(timer / 60), date: new Date().toISOString().split("T")[0], sessionTitle: session.title, weekNum });
    }
  };

  if (finished) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: FONT }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: 360, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎹</div>
          <div style={{ fontFamily: SERIF, fontSize: 32, color: TEXT, marginBottom: 8 }}>Bravo !</div>
          <div style={{ fontSize: 14, color: MUTED, marginBottom: 28, lineHeight: 1.7 }}>Séance terminée. La régularité est la clé du progrès en musique.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {[
              { label: "Exercices", val: done.length, color: ACCENT },
              { label: "Durée", val: `${fmt(timer)}`, color: "#10B981" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: CARD, border: `1px solid ${color}22`, borderRadius: 14, padding: "14px" }}>
                <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>{label}</div>
                <div style={{ fontFamily: SERIF, fontSize: 26, color }}>{val}</div>
              </div>
            ))}
          </div>
          <Btn label="Retour à l'accueil" onClick={onCancel} style={{ width: "100%" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: FONT, paddingBottom: 20 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "rgba(10,10,24,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "14px 16px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Semaine {weekNum} — {session.title}</div>
              <div style={{ fontSize: 13, color: TEXT, marginTop: 2 }}>Exercice {exIdx + 1}/{session.exercises.length} · {fmt(timer)}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPaused(p => !p)} style={{ fontSize: 12, color: MUTED, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontFamily: FONT }}>
                {paused ? "▶" : "⏸"}
              </button>
              <button onClick={onCancel} style={{ fontSize: 12, color: MUTED, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontFamily: FONT }}>✕</button>
            </div>
          </div>
          <div style={{ height: 3, background: BORDER, borderRadius: 99 }}>
            <div style={{ width: `${(exIdx / session.exercises.length) * 100}%`, height: "100%", background: ACCENT, borderRadius: 99, transition: "width .4s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 14px 0" }}>

        {/* Exercise card */}
        <div style={{ background: `${typeColor}0c`, border: `1.5px solid ${typeColor}44`, borderRadius: 20, padding: "18px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <Tag label={{ technique: "🔧 Technique", exercice: "🎯 Exercice", morceau: "🎵 Morceau", theorie: "📖 Théorie", culture: "🎧 Culture" }[ex.type] || ex.type} color={typeColor} />
            <span style={{ fontSize: 12, color: MUTED }}>{ex.duration} min</span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, color: TEXT, marginBottom: 8 }}>{ex.label}</div>
          {ex.bpm && <div style={{ fontSize: 13, color: typeColor, marginBottom: 10 }}>🥁 Tempo cible : {ex.bpm} BPM</div>}

          <button onClick={() => setShowNote(n => !n)} style={{ fontSize: 11, color: MUTED, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, padding: 0, textDecoration: "underline", marginBottom: showNote ? 10 : 0 }}>
            {showNote ? "Masquer les instructions" : "📋 Voir les instructions"}
          </button>
          {showNote && (
            <div style={{ fontSize: 13, color: "#999", lineHeight: 1.75, background: CARD2, borderRadius: 12, padding: "12px 14px" }}>{ex.desc}</div>
          )}
        </div>

        {/* BPM log */}
        {ex.bpm && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>BPM atteint aujourd'hui</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
                <button onClick={() => setBpmInput(b => String(Math.max(20, (parseInt(b) || ex.bpm) - 5))} style={{ width: 34, height: 34, borderRadius: 10, background: CARD2, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 16, cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}>−</button>
                <input type="number" value={bpmInput} onChange={e => setBpmInput(e.target.value)} placeholder={String(ex.bpm)}
                  style={{ flex: 1, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 0", color: TEXT, fontSize: 16, fontFamily: FONT, outline: "none", textAlign: "center" }} />
                <button onClick={() => setBpmInput(b => String((parseInt(b) || ex.bpm) + 5))} style={{ width: 34, height: 34, borderRadius: 10, background: CARD2, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 16, cursor: "pointer", fontFamily: FONT, flexShrink: 0 }}>+</button>
              </div>
            </div>
            {bpmInput && parseInt(bpmInput) >= (ex.bpm || 0) && (
              <div style={{ fontSize: 12, color: "#10B981", marginTop: 8 }}>🎉 Objectif atteint ! (+{parseInt(bpmInput) - ex.bpm} BPM)</div>
            )}
          </div>
        )}

        {/* Done list */}
        {done.length > 0 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
            {done.map((id, i) => {
              const dEx = session.exercises.find(e => e.id === id);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", opacity: 0.6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#10B98120", border: "1px solid #10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", flexShrink: 0 }}>
                    <CheckIco size={10} />
                  </div>
                  <span style={{ fontSize: 12, color: TEXT }}>{dEx?.label}</span>
                </div>
              );
            })}
          </div>
        )}

        <Btn label={exIdx < session.exercises.length - 1 ? "✓ Exercice suivant →" : "🎹 Terminer la séance"} onClick={completeEx} color={typeColor} style={{ width: "100%", fontSize: 15 }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ HOME VIEW */
function HomeView({ profile, program, progress, sessions, onStartPractice }) {
  const completedSessions = Object.keys(progress).length;
  const totalSessions     = program.weeks.reduce((a, w) => a + w.sessions.length, 0);
  const currentWeekNum    = Math.min(program.weeks.length, Math.floor(completedSessions / 3) + 1);
  const currentWeek       = program.weeks[currentWeekNum - 1];
  const sessionsThisWeek  = Object.keys(progress).filter(k => k.startsWith(`w${currentWeekNum}`)).length;
  const nextSessionDay    = Math.min(3, sessionsThisWeek + 1);
  const nextSession       = currentWeek?.sessions.find(s => s.day === nextSessionDay);
  const pct               = Math.round((completedSessions / totalSessions) * 100);
  const today             = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const streak            = (() => {
    if (!sessions.length) return 0;
    const byDate = new Set(sessions.map(s => s.date));
    let s = 0; const d = new Date();
    for (let i = 0; i < 30; i++) {
      d.setDate(d.getDate() - (i > 0 ? 1 : 0));
      if (byDate.has(d.toISOString().split("T")[0])) s++; else if (i > 0) break;
    }
    return s;
  })();

  const doneTodayKey = nextSession ? `w${currentWeekNum}_d${nextSession.day}` : null;
  const doneToday    = doneTodayKey && progress[doneTodayKey];

  return (
    <div style={{ paddingBottom: 90 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ background: "rgba(10,10,24,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "18px 16px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 10, color: MUTED, textTransform: "capitalize", marginBottom: 2 }}>{today}</div>
            <div style={{ fontFamily: SERIF, fontSize: 26, color: TEXT }}>Bonjour, {profile.name} 🎹</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: SERIF, fontSize: 22, color: ACCENT }}>{streak}🔥</div>
            <div style={{ fontSize: 10, color: MUTED }}>jours streak</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 14px 0" }}>

        {/* Global progress */}
        <div style={{ background: `${ACCENT}0e`, border: `1px solid ${ACCENT}33`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: TEXT }}>{program.name} — Semaine {currentWeekNum}/{program.weeks.length}</span>
            <span style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 5, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${ACCENT}88, ${ACCENT})`, borderRadius: 99, transition: "width .6s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>{completedSessions} / {totalSessions} séances complétées</div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Séances", val: sessions.length, color: ACCENT },
            { label: "Cette semaine", val: `${sessionsThisWeek}/3`, color: "#10B981" },
            { label: "Temps total", val: `${sessions.reduce((a, s) => a + (s.duration || 0), 0)}min`, color: "#F59E0B" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: CARD, border: `1px solid ${color}22`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: MUTED, marginBottom: 4, letterSpacing: "0.08em" }}>{label}</div>
              <div style={{ fontFamily: SERIF, fontSize: 18, color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Week objective */}
        {currentWeek && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Objectif semaine {currentWeekNum}</div>
            <div style={{ fontFamily: SERIF, fontSize: 17, color: TEXT, marginBottom: 4 }}>{currentWeek.title}</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{currentWeek.objective}</div>
          </div>
        )}

        {/* Today's session */}
        {doneToday ? (
          <div style={{ background: "#10B98110", border: "1.5px solid #10B98144", borderRadius: 18, padding: "20px 18px", marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
            <div style={{ fontFamily: SERIF, fontSize: 18, color: "#10B981" }}>Séance du jour complète !</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Reviens demain pour continuer ta progression.</div>
          </div>
        ) : nextSession ? (
          <div style={{ background: `${ACCENT}0e`, border: `1.5px solid ${ACCENT}44`, borderRadius: 18, padding: "18px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
              Séance du jour — Jour {nextSession.day}/3
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 20, color: TEXT, marginBottom: 4 }}>{nextSession.title}</div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>⏱️ {nextSession.duration} minutes · {nextSession.exercises.length} exercices</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {nextSession.exercises.map(e => (
                <Tag key={e.id} label={e.label} color={TYPE_COLORS[e.type] || ACCENT} small />
              ))}
            </div>
            <Btn label="🎹 Commencer la pratique" onClick={() => onStartPractice(nextSession, currentWeekNum)} color={ACCENT} style={{ width: "100%" }} />
          </div>
        ) : (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "18px", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: 18, color: TEXT, marginBottom: 4 }}>Programme terminé ! 🏆</div>
            <div style={{ fontSize: 13, color: MUTED }}>Tu as complété tout le programme. Félicitations !</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ PRACTICE PLAN VIEW */
function PracticeView({ program, progress, onStartPractice }) {
  const [openWeek, setOpenWeek] = useState(null);

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ background: "rgba(10,10,24,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "18px 16px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontFamily: SERIF, fontSize: 26, color: TEXT, marginBottom: 2 }}>Programme</div>
          <div style={{ fontSize: 12, color: MUTED }}>{program.weeks.length} semaines · {program.durationWeeks} semaines</div>
        </div>
      </div>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "14px 14px 0" }}>
        {program.weeks.map((week, wi) => {
          const weekDone = week.sessions.filter(s => progress[`w${week.n}_d${s.day}`]).length;
          const isOpen   = openWeek === wi;
          const isDone   = weekDone === week.sessions.length;
          return (
            <div key={wi} style={{ background: CARD, border: `1.5px solid ${isDone ? "#10B98155" : isOpen ? `${ACCENT}55` : BORDER}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setOpenWeek(isOpen ? null : wi)}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 16, color: isDone ? "#10B981" : TEXT }}>Sem. {week.n} — {week.title}</div>
                    {isDone && <CheckIco size={14} />}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED }}>{week.objective}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                  <div style={{ fontSize: 12, color: isDone ? "#10B981" : ACCENT }}>{weekDone}/{week.sessions.length}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{isOpen ? "▲" : "▼"}</div>
                </div>
              </div>
              {isOpen && (
                <div style={{ marginTop: 14, borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
                  {week.sessions.map((sess, si) => {
                    const key   = `w${week.n}_d${sess.day}`;
                    const done  = progress[key];
                    return (
                      <div key={si} style={{ background: CARD2, border: `1px solid ${done ? "#10B98133" : BORDER}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ fontSize: 14, color: done ? "#10B981" : TEXT }}>Jour {sess.day} — {sess.title}</div>
                          {done ? (
                            <div style={{ color: "#10B981" }}><CheckIco size={14} /></div>
                          ) : (
                            <Btn label="Pratiquer" onClick={() => onStartPractice(sess, week.n)} color={ACCENT} small style={{ flexShrink: 0 }} />
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>⏱️ {sess.duration} min · {sess.exercises.length} exercices</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {sess.exercises.map(e => (
                            <Tag key={e.id} label={e.label.substring(0, 20) + (e.label.length > 20 ? "…" : "")} color={TYPE_COLORS[e.type] || ACCENT} small />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ TOOLS VIEW */
function ToolsView() {
  const [tool, setTool]           = useState("metro");
  const [scaleName, setScaleName] = useState("Do majeur");
  const [theoryTopic, setTheoryTopic] = useState(null);

  return (
    <div style={{ paddingBottom: 90 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ background: "rgba(10,10,24,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "18px 16px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontFamily: SERIF, fontSize: 26, color: TEXT }}>Outils</div>
        </div>
      </div>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "14px 14px 0" }}>

        {/* Tab selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { id: "metro",  label: "🥁 Métronome" },
            { id: "clavier",label: "🎹 Clavier" },
            { id: "theorie",label: "📖 Théorie" },
          ].map(t => (
            <button key={t.id} onClick={() => setTool(t.id)} style={{ flex: 1, padding: "9px 6px", background: tool === t.id ? `${ACCENT}22` : CARD2, border: `1.5px solid ${tool === t.id ? ACCENT : BORDER}`, borderRadius: 12, color: tool === t.id ? ACCENT : MUTED, fontSize: 12, cursor: "pointer", fontFamily: FONT }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Metronome */}
        {tool === "metro" && <Metronome />}

        {/* Keyboard */}
        {tool === "clavier" && (
          <div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "18px 16px", marginBottom: 14 }}>
              <div style={{ fontFamily: SERIF, fontSize: 18, color: TEXT, marginBottom: 14 }}>🎹 Visualiseur de gammes</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {Object.keys(SCALE_NOTES).map(name => (
                  <button key={name} onClick={() => setScaleName(name)} style={{ padding: "5px 10px", background: scaleName === name ? `${ACCENT}22` : CARD2, border: `1px solid ${scaleName === name ? ACCENT : BORDER}`, borderRadius: 8, color: scaleName === name ? ACCENT : MUTED, fontSize: 11, cursor: "pointer", fontFamily: FONT }}>
                    {name}
                  </button>
                ))}
              </div>
              <div style={{ overflowX: "auto", background: CARD2, borderRadius: 12, padding: "12px" }}>
                <PianoKeyboard highlightNotes={SCALE_NOTES[scaleName] || []} />
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 10, textAlign: "center" }}>
                Notes en violet : {(SCALE_NOTES[scaleName] || []).join(" · ")}
              </div>
            </div>
          </div>
        )}

        {/* Theory */}
        {tool === "theorie" && (
          <div>
            {Object.entries(THEORY).map(([id, topic]) => (
              <div key={id} onClick={() => setTheoryTopic(id)} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 15, color: TEXT, marginBottom: 3 }}>{topic.title}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{topic.quiz.length} questions de quiz</div>
                  </div>
                  <span style={{ color: ACCENT, fontSize: 18 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {theoryTopic && <TheoryCard topicId={theoryTopic} onClose={() => setTheoryTopic(null)} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ PROGRESS VIEW */
function ProgressView({ sessions, progress, program }) {
  const chartData = sessions.slice(-14).map(s => ({
    d: new Date(s.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    dur: s.duration || 0,
  }));

  const bpmLogs = sessions.reduce((acc, s) => {
    Object.entries(s.bpmLog || {}).forEach(([exId, bpm]) => {
      if (!acc[exId]) acc[exId] = [];
      acc[exId].push({ date: s.date, bpm });
    });
    return acc;
  }, {});

  const totalMin = sessions.reduce((a, s) => a + (s.duration || 0), 0);
  const completedW = new Set(Object.keys(progress).map(k => k.split("_")[0])).size;

  return (
    <div style={{ paddingBottom: 90 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ background: "rgba(10,10,24,0.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "18px 16px 14px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontFamily: SERIF, fontSize: 26, color: TEXT }}>Mes progrès</div>
        </div>
      </div>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "14px 14px 0" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Séances", val: sessions.length, color: ACCENT },
            { label: "Temps total", val: `${Math.round(totalMin / 60)}h ${totalMin % 60}m`, color: "#F59E0B" },
            { label: "Semaines", val: completedW, color: "#10B981" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: CARD, border: `1px solid ${color}22`, borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: MUTED, marginBottom: 5 }}>{label}</div>
              <div style={{ fontFamily: SERIF, fontSize: 20, color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Duration chart */}
        {chartData.length > 1 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 14px 10px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Durée des séances (min)</div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <XAxis dataKey="d" tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#444", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, color: TEXT, fontSize: 12 }} formatter={v => [`${v} min`, ""]} />
                <Line type="monotone" dataKey="dur" stroke={ACCENT} strokeWidth={2} dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* BPM progress */}
        {Object.keys(bpmLogs).length > 0 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Progression BPM par exercice</div>
            {Object.entries(bpmLogs).slice(0, 8).map(([exId, logs]) => {
              const first = logs[0]?.bpm;
              const last  = logs[logs.length - 1]?.bpm;
              const gain  = last - first;
              return (
                <div key={exId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid #16162a` }}>
                  <div>
                    <div style={{ fontSize: 12, color: TEXT }}>{exId.replace(/_/g, " ")}</div>
                    <div style={{ fontSize: 10, color: MUTED }}>{logs.length} session{logs.length > 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, color: gain >= 0 ? "#10B981" : "#EF4444", fontWeight: 600 }}>{last} BPM</div>
                    {gain > 0 && <div style={{ fontSize: 10, color: "#10B981" }}>+{gain} BPM</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Session history */}
        {sessions.length > 0 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Historique</div>
            {sessions.slice(0, 10).map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < Math.min(sessions.length, 10) - 1 ? `1px solid #16162a` : "none" }}>
                <div>
                  <div style={{ fontSize: 13, color: TEXT }}>{s.sessionTitle}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>Semaine {s.weekNum} · {new Date(s.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                  <div style={{ fontSize: 12, color: ACCENT }}>{s.duration || "?"} min</div>
                  <div style={{ fontSize: 10, color: MUTED }}>{s.exercisesDone?.length || 0} ex.</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!sessions.length && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎹</div>
            <div style={{ fontFamily: SERIF, fontSize: 20, color: TEXT, marginBottom: 6 }}>Tes progrès apparaîtront ici</div>
            <div style={{ fontSize: 13, color: MUTED }}>Commence ta première séance !</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ MAIN APP */
export default function App() {
  const [profile,  setProfile]  = useState(null);
  const [progress, setProgress] = useState({});
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("home");
  const [active,   setActive]   = useState(null); // { session, weekNum }

  useEffect(() => {
    const p = LS.get("piano:profile");
    const pr = LS.get("piano:progress");
    const s  = LS.get("piano:sessions");
    if (p)  setProfile(p);
    if (pr) setProgress(pr);
    if (s)  setSessions(s);
    setLoading(false);
  }, []);

  const handleOnboarding = (p) => { setProfile(p); setProgress({}); setSessions([]); };

  const handleStartPractice = (session, weekNum) => setActive({ session, weekNum });

  const handleComplete = (log) => {
    const key     = `w${log.weekNum}_d${log.date ? active?.session?.day : 1}`;
    const realKey = `w${log.weekNum}_d${active?.session?.day}`;
    const newProg = { ...progress, [realKey]: true };
    const newSess = [{ ...log, weekNum: log.weekNum }, ...sessions].slice(0, 200);
    setProgress(newProg);
    setSessions(newSess);
    LS.set("piano:progress", newProg);
    LS.set("piano:sessions", newSess);
    setActive(null);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${ACCENT}`, borderTopColor: "transparent", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!profile) return <Onboarding onComplete={handleOnboarding} />;

  const program = PROGRAMS.find(p => p.id === profile.programId) || PROGRAMS[0];

  if (active) return (
    <ActivePractice session={active.session} weekNum={active.weekNum} onComplete={handleComplete} onCancel={() => setActive(null)} />
  );

  const views = {
    home:     <HomeView     profile={profile} program={program} progress={progress} sessions={sessions} onStartPractice={handleStartPractice} />,
    practice: <PracticeView program={program} progress={progress} onStartPractice={handleStartPractice} />,
    tools:    <ToolsView />,
    progress: <ProgressView sessions={sessions} progress={progress} program={program} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: FONT, color: TEXT }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      {views[tab]}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
