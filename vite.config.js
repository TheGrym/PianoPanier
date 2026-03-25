// ══════════════════════════════════════════════════════════════
// CURRICULUM — Méthode structurée inspirée de Adult Piano Adventures,
// Faber & Faber, et la méthode Alfred.
// ══════════════════════════════════════════════════════════════

export const LEVELS = [
  { id: "debutant",      label: "Débutant",      emoji: "🌱", desc: "Jamais joué ou très peu — moins de 6 mois" },
  { id: "intermediaire", label: "Intermédiaire",  emoji: "🌿", desc: "Bases acquises, solfège basique — 6 mois à 2 ans" },
  { id: "avance",        label: "Avancé",         emoji: "🌳", desc: "Lecture courante, répertoire varié — 2+ ans" },
];

export const GOALS = [
  { id: "classique", label: "Classique",    emoji: "🎼", desc: "Bach, Mozart, Beethoven, technique académique" },
  { id: "pop",       label: "Pop / Rock",   emoji: "🎸", desc: "Chansons modernes, accompagnements, lead sheets" },
  { id: "jazz",      label: "Jazz",         emoji: "🎷", desc: "Accords jazz, improvisation, swing" },
  { id: "general",   label: "Culture générale", emoji: "🎹", desc: "Tout apprendre : technique, théorie, répertoire varié" },
];

// ── THÉORIE ───────────────────────────────────────────────────
export const THEORY = {
  notes: {
    title: "Les notes",
    content: "Les 7 notes naturelles sont : Do (C) · Ré (D) · Mi (E) · Fa (F) · Sol (G) · La (A) · Si (B). Elles se répètent sur tout le clavier. La note Do se trouve toujours à gauche d'un groupe de 2 touches noires.",
    quiz: [
      { q: "Quelle note est à gauche d'un groupe de 2 touches noires ?", a: "Do (C)" },
      { q: "Combien y a-t-il de notes naturelles ?", a: "7 — Do Ré Mi Fa Sol La Si" },
      { q: "Quelle est la note américaine du Sol ?", a: "G" },
    ]
  },
  gammes: {
    title: "Les gammes majeures",
    content: "Une gamme majeure suit le schéma Ton-Ton-Demi-Ton-Ton-Ton-Ton-Demi-ton (T-T-D-T-T-T-D). Do majeur est la plus simple : uniquement des touches blanches. C'est le point de départ obligatoire.",
    quiz: [
      { q: "Quel est le schéma d'une gamme majeure ?", a: "T-T-D-T-T-T-D (Ton Ton Demi-ton...)" },
      { q: "Pourquoi Do majeur est la plus simple ?", a: "Car elle n'a aucune touche noire (aucune altération)" },
    ]
  },
  accords: {
    title: "Les accords fondamentaux",
    content: "Un accord de base (triade) = 3 notes jouées ensemble. Accord majeur = Do + Mi + Sol (Do-M). Accord mineur = Do + Mib + Sol (Do-m). La 1ère note donne le nom de l'accord.",
    quiz: [
      { q: "Combien de notes dans une triade ?", a: "3 notes" },
      { q: "Notes de l'accord de Do majeur ?", a: "Do + Mi + Sol" },
      { q: "Différence majeur / mineur ?", a: "Le mineur a la tierce baissée d'un demi-ton (Mib au lieu de Mi)" },
    ]
  },
  rythme: {
    title: "Le rythme et la mesure",
    content: "La mesure 4/4 est la plus courante : 4 temps par mesure. La noire = 1 temps · La blanche = 2 temps · La ronde = 4 temps · La croche = 1/2 temps. Compter à voix haute en jouant est essentiel.",
    quiz: [
      { q: "Combien de temps dans une mesure 4/4 ?", a: "4 temps" },
      { q: "Combien de temps vaut une blanche ?", a: "2 temps" },
      { q: "Combien de croches dans une noire ?", a: "2 croches" },
    ]
  },
  positions: {
    title: "Les positions de la main",
    content: "Position C : pouce sur Do4, index sur Ré, majeur sur Mi, annulaire sur Fa, auriculaire sur Sol. Les doigts sont numérotés 1 (pouce) à 5 (auriculaire). La main droite (MD) joue souvent la mélodie, la main gauche (MG) l'accompagnement.",
    quiz: [
      { q: "Quel doigt est le numéro 1 ?", a: "Le pouce" },
      { q: "Quelle main joue généralement la mélodie ?", a: "La main droite (MD)" },
      { q: "Note du doigt 1 en position C ?", a: "Do (C4 — le Do du milieu)" },
    ]
  },
};

// ── PROGRAMMES ────────────────────────────────────────────────
export const PROGRAMS = [

  // ─── DÉBUTANT GÉNÉRAL (16 semaines) ──────────────────────
  {
    id: "debutant_general",
    name: "Piano pour débutants",
    subtitle: "Programme 16 semaines",
    levels: ["debutant"],
    goals: ["general", "pop", "classique"],
    durationWeeks: 16,
    color: "#8B5CF6",
    description: "Méthode complète du zéro absolu. Posture, solfège, gammes, accords et premières chansons. À l'issue de ce programme tu joueras 10 morceaux complets.",
    weeks: [
      {
        n: 1, title: "Découverte du clavier",
        objective: "Identifier toutes les touches, posture correcte, position 5 doigts",
        sessions: [
          {
            day: 1, title: "Posture et anatomie du clavier",
            duration: 20, theory: "notes",
            exercises: [
              { id: "posture",        label: "Posture & position des mains",  duration: 5,  bpm: null, desc: "Dos droit, coudes à hauteur des touches, bras décontractés. Doigts arrondis comme si tu tenais une balle de tennis.", type: "technique" },
              { id: "touches_noms",   label: "Repérer les Do sur le clavier", duration: 5,  bpm: null, desc: "Trouve et nomme tous les Do du clavier. Le Do est toujours à gauche d'un groupe de 2 touches noires.", type: "theorie" },
              { id: "5doigts_md",     label: "Exercice 5 doigts MD (Do-Sol)", duration: 10, bpm: 60,  desc: "MD position C. Joue Do-Ré-Mi-Fa-Sol puis Sol-Fa-Mi-Ré-Do. Doigté 1-2-3-4-5. Lent et régulier.", type: "exercice" },
            ]
          },
          {
            day: 2, title: "La main gauche",
            duration: 20, theory: null,
            exercises: [
              { id: "gamme_mg_c",     label: "Gamme Do majeur MG",            duration: 10, bpm: 60,  desc: "MG position C. Joue Do-Ré-Mi-Fa-Sol-Fa-Mi-Ré-Do. Doigté 5-4-3-2-1-2-3-4-5.", type: "exercice" },
              { id: "5doigts_mg",     label: "Exercice 5 doigts MG",          duration: 10, bpm: 60,  desc: "Répète l'exercice 5 doigts avec la main gauche. Concentre-toi sur l'égalité des doigts.", type: "exercice" },
            ]
          },
          {
            day: 3, title: "Première mélodie",
            duration: 25, theory: "rythme",
            exercises: [
              { id: "reveil_md",      label: "Échauffement MD 5 doigts",      duration: 5,  bpm: 60,  desc: "Révision de l'exercice 5 doigts MD. Vise la régularité du son.", type: "exercice" },
              { id: "frere_jacques_1",label: "Frère Jacques — MD seule",       duration: 15, bpm: 60,  desc: "Do-Ré-Mi-Do / Do-Ré-Mi-Do / Mi-Fa-Sol / Mi-Fa-Sol. Doigtés: 1-2-3-1 / 1-2-3-1 / 3-4-5 / 3-4-5. Compte à voix haute.", type: "morceau" },
              { id: "ecoute",         label: "Écoute active",                  duration: 5,  bpm: null, desc: "Écoute Frère Jacques joué par un pianiste. Identifie la mélodie que tu viens d'apprendre.", type: "culture" },
            ]
          },
        ]
      },
      {
        n: 2, title: "Les deux mains ensemble",
        objective: "Coordination main gauche/droite, rythme régulier, Frère Jacques complet",
        sessions: [
          {
            day: 1, title: "Accords de base MG",
            duration: 25, theory: "accords",
            exercises: [
              { id: "echauffement",   label: "Échauffement 5 doigts MD+MG",   duration: 5,  bpm: 65,  desc: "5 doigts alternés MD et MG. Augmente légèrement le tempo.", type: "exercice" },
              { id: "do_accord",      label: "Accord Do majeur (C)",           duration: 10, bpm: null, desc: "MG : joue Do-Mi-Sol ensemble (doigts 5-3-1). Maintiens 4 temps. Répète 10 fois. Le son doit être clair et net.", type: "exercice" },
              { id: "frere_mg_acc",   label: "Frère Jacques MG accords",       duration: 10, bpm: 60,  desc: "Pendant que tu mémorises la mélodie MD, la MG tient l'accord de Do pendant 4 mesures.", type: "morceau" },
            ]
          },
          {
            day: 2, title: "Coordination mains ensemble",
            duration: 30, theory: null,
            exercises: [
              { id: "alt_mains",      label: "Alternance MD-MG",               duration: 10, bpm: 60,  desc: "Joue une note MD, puis une note MG en alternance sur Do-Ré-Mi-Fa-Sol. Comme un balancier.", type: "exercice" },
              { id: "frere_complet",  label: "Frère Jacques mains ensemble",   duration: 20, bpm: 55,  desc: "MD : mélodie / MG : accord de Do tenu. Commence très lentement. La coordination viendra progressivement.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Consolidation semaine 2",
            duration: 30, theory: "positions",
            exercises: [
              { id: "gamme_c_2m",     label: "Gamme Do majeur 2 mains",        duration: 10, bpm: 60,  desc: "MD et MG jouent la gamme ensemble (mouvement parallèle). Lent et précis.", type: "exercice" },
              { id: "frere_tempo",    label: "Frère Jacques — Augmente le BPM", duration: 20, bpm: 70, desc: "Si tu tiens bien à 55, passe à 65 puis 70. Objectif : jouer proprement à 80 BPM.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 3, title: "Les accords principaux",
        objective: "Apprendre Do (C), Sol (G), La mineur (Am), Fa (F) — la progression magique",
        sessions: [
          {
            day: 1, title: "Accord Sol (G) majeur",
            duration: 30, theory: null,
            exercises: [
              { id: "echauffement_3", label: "Échauffement gamme Do",          duration: 5,  bpm: 70,  desc: "Gamme Do majeur montante et descendante. Objectif : régularité et sons égaux.", type: "exercice" },
              { id: "g_accord",       label: "Accord Sol (G) majeur",          duration: 10, bpm: null, desc: "MG doigts 5-3-1 sur Sol-Si-Ré. Alterne Do et Sol : 4 temps Do, 4 temps Sol. Écoute la différence sonore.", type: "exercice" },
              { id: "au_clair",       label: "Au Clair de la Lune — MD",       duration: 15, bpm: 60,  desc: "Do-Do-Do-Ré-Mi-Ré / Do-Mi-Ré-Ré-Do. Mélodie MD seule. Doigtés : 1-1-1-2-3-2 / 1-3-2-2-1.", type: "morceau" },
            ]
          },
          {
            day: 2, title: "Accord La mineur (Am)",
            duration: 30, theory: "gammes",
            exercises: [
              { id: "am_accord",      label: "Accord La mineur (Am)",          duration: 10, bpm: null, desc: "MG doigts 5-3-1 sur La-Do-Mi. Écoute la couleur plus sombre par rapport au majeur.", type: "exercice" },
              { id: "c_g_am",         label: "Enchainement C - G - Am",        duration: 15, bpm: 60,  desc: "4 temps chaque accord : Do / Sol / La mineur / Sol. Enchaîne proprement. C'est la progression la plus utilisée en pop.", type: "exercice" },
              { id: "au_clair_mg",    label: "Au Clair de la Lune MG accords", duration: 5,  bpm: 60,  desc: "Ajoute la MG avec accords C et G sur Au Clair de la Lune.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Accord Fa (F) — La progression complète",
            duration: 35, theory: null,
            exercises: [
              { id: "f_accord",       label: "Accord Fa (F) majeur",           duration: 10, bpm: null, desc: "MG doigts 5-3-1 sur Fa-La-Do. Attention : le pouce sur Do du milieu. C'est souvent l'accord le plus difficile au début.", type: "exercice" },
              { id: "c_g_am_f",       label: "Progression C-G-Am-F",           duration: 15, bpm: 60,  desc: "LA progression : C-G-Am-F, 4 temps chaque. Cette suite est dans des centaines de chansons pop. Travaille les enchaînements.", type: "exercice" },
              { id: "au_clair_full",  label: "Au Clair de la Lune — complet",  duration: 10, bpm: 65,  desc: "Mains ensemble, mélodie et accords. Objectif final : 80 BPM proprement.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 4, title: "Gamme Do majeur complète",
        objective: "Gamme sur une octave avec changement de pouce, lecture de notes",
        sessions: [
          {
            day: 1, title: "Le passage du pouce",
            duration: 30, theory: null,
            exercises: [
              { id: "pouce_ex",       label: "Exercice passage du pouce MD",   duration: 15, bpm: 50,  desc: "Gamme Do majeur MD avec doigté complet : 1-2-3-1-2-3-4-5. Le pouce passe SOUS le 3ème doigt à Mi. C'est la clé des gammes.", type: "technique" },
              { id: "pouce_mg",       label: "Passage du pouce MG",            duration: 15, bpm: 50,  desc: "Gamme Do majeur MG avec doigté : 5-4-3-2-1-3-2-1. Le 3ème doigt passe PAR-DESSUS le pouce à Mi.", type: "technique" },
            ]
          },
          {
            day: 2, title: "Gamme complète 2 octaves",
            duration: 35, theory: null,
            exercises: [
              { id: "gamme_c_oct",    label: "Gamme Do — 1 octave MD",         duration: 10, bpm: 60,  desc: "Gamme complète sur une octave. Régularité absolue, son égal. Compte : 1-2-3-4-5-6-7-8.", type: "exercice" },
              { id: "gamme_c_2oct",   label: "Gamme Do — 2 octaves MD",        duration: 15, bpm: 55,  desc: "Monte et descends sur 2 octaves. Passage du pouce fluide. Pas de 'bosse' rythmique au passage.", type: "exercice" },
              { id: "ode_joy_1",      label: "Ode à la Joie — MD seule",       duration: 10, bpm: 60,  desc: "Mi-Mi-Fa-Sol / Sol-Fa-Mi-Ré / Do-Do-Ré-Mi / Mi-Ré-Ré. Doigtés : 3-3-4-5 / 5-4-3-2 / 1-1-2-3 / 3-2-2.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Ode à la Joie — objectif semaine 4",
            duration: 35, theory: null,
            exercises: [
              { id: "echauffement_g", label: "Gamme + arpège Do majeur",       duration: 10, bpm: 65,  desc: "Gamme puis arpège (Do-Mi-Sol-Do) MD. Variation pour échauffer les doigts.", type: "exercice" },
              { id: "ode_joy_mg",     label: "Ode à la Joie — MG accords",     duration: 10, bpm: 60,  desc: "MG : accord C (4 temps) / G (2 temps) / C (2 temps) en boucle. Écoute l'harmonie.", type: "morceau" },
              { id: "ode_joy_full",   label: "Ode à la Joie — Mains ensemble", duration: 15, bpm: 58,  desc: "Combine les deux mains. Objectif de fin de mois : jouer à 80 BPM proprement.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 5, title: "Les arpèges et le pédalier",
        objective: "Arpèges brisés, introduction à la pédale de sustain, nouveau morceau",
        sessions: [
          {
            day: 1, title: "Les arpèges brisés",
            duration: 30, theory: null,
            exercises: [
              { id: "arpege_c",       label: "Arpège Do majeur brisé MD",      duration: 10, bpm: 60,  desc: "Do-Mi-Sol-Do joués UN PAR UN (pas ensemble). Mouvement de bas en haut. Compte 1-2-3-4. Doigtés : 1-2-3-5.", type: "exercice" },
              { id: "arpege_mg_waltz",label: "Accompagnement valse MG",        duration: 15, bpm: 60,  desc: "Basse + accord : Do grave (temps 1) puis Mi-Sol (temps 2-3). Rythme ternaire. Pattern ultra-courant.", type: "exercice" },
              { id: "minuet_1",       label: "Minuet en Sol (Bach) — MD",      duration: 5,  bpm: 50,  desc: "Sol-La-Sol-Fa#-Mi / Fa#-Sol-La-Si-Do. Introduction au Do# et Fa#. La pièce la plus célèbre de Bach débutant.", type: "morceau" },
            ]
          },
          {
            day: 2, title: "La pédale de sustain",
            duration: 30, theory: null,
            exercises: [
              { id: "pedale_expl",    label: "Exercice pédale de sustain",     duration: 10, bpm: null, desc: "Appuie la pédale droite avec le talon posé au sol. Change la pédale à chaque accord. Écoute la différence : le son résonne.", type: "technique" },
              { id: "arpege_pedale",  label: "Arpèges avec pédale",            duration: 10, bpm: 60,  desc: "Joue les arpèges du Do avec la pédale. Change à chaque harmonie. Son beaucoup plus riche.", type: "exercice" },
              { id: "minuet_mg",      label: "Minuet en Sol — MG",             duration: 10, bpm: 50,  desc: "MG : Ré-Sol-Si / Ré-Sol-Si / Ré-Sol-Si / Mi-Do-Sol. Arpèges brisés à 3 notes.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Minuet en Sol — mains ensemble",
            duration: 35, theory: null,
            exercises: [
              { id: "gamme_g",        label: "Gamme Sol majeur (Fa#)",         duration: 10, bpm: 60,  desc: "Sol-La-Si-Do-Ré-Mi-Fa#-Sol. Le Fa# (touche noire) est nouveau ! Doigté identique à Do majeur.", type: "exercice" },
              { id: "minuet_full",    label: "Minuet en Sol — complet",        duration: 25, bpm: 55,  desc: "Bach BWV Anh. 114. Travaille section par section. Objectif : jouer les 16 premières mesures proprement.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 6, title: "Gammes et nouvelle tonalité",
        objective: "Sol majeur complète, lecture de partition, accords à 4 sons",
        sessions: [
          {
            day: 1, title: "Gamme Sol majeur",
            duration: 30, theory: null,
            exercises: [
              { id: "gamme_g_full",   label: "Gamme Sol — 2 octaves MD",       duration: 15, bpm: 60,  desc: "Sol-La-Si-Do-Ré-Mi-Fa#-Sol. Doigté identique au Do. Attention au Fa# : touche noire en position 7.", type: "exercice" },
              { id: "gamme_g_mg",     label: "Gamme Sol — 2 octaves MG",       duration: 15, bpm: 60,  desc: "Même gamme MG. Doigté : 5-4-3-2-1-3-2-1. Passage fluide au Do.", type: "exercice" },
            ]
          },
          {
            day: 2, title: "Accords de 7ème",
            duration: 35, theory: "accords",
            exercises: [
              { id: "g7_accord",      label: "Accord G7 (Sol septième)",       duration: 15, bpm: null, desc: "Sol-Si-Ré-Fa : 4 notes. Le G7 crée une tension qui appelle le Do. C'est la cadence V-I fondamentale.", type: "exercice" },
              { id: "c_g7_c",         label: "Cadence C-G7-C",                 duration: 10, bpm: null, desc: "Enchaîne Do / Sol7 / Do avec les deux mains. Écoute la résolution : tension → repos.", type: "exercice" },
              { id: "minuet_revise",  label: "Minuet en Sol — révision",       duration: 10, bpm: 65,  desc: "Augmente le tempo. Vise 80 BPM proprement.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Bilan du mois 1 et 2",
            duration: 40, theory: null,
            exercises: [
              { id: "gammes_c_g",     label: "Gammes Do + Sol mains ensemble", duration: 15, bpm: 70,  desc: "Joue les deux gammes alternativement. Régularité, son beau, doigtés propres.", type: "exercice" },
              { id: "morceaux_revue", label: "Révision de tous les morceaux",  duration: 25, bpm: null, desc: "Joue dans l'ordre : Frère Jacques → Au Clair de la Lune → Ode à la Joie → Minuet. C'est ton répertoire actuel !", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 7, title: "La gamme de Ré majeur + nouvelles pièces",
        objective: "3ème gamme, introduction à la musique baroque, lecture fluide",
        sessions: [
          {
            day: 1, title: "Gamme Ré majeur",
            duration: 30, theory: null,
            exercises: [
              { id: "gamme_d",        label: "Gamme Ré (Fa# + Do#) MD",       duration: 15, bpm: 55,  desc: "Ré-Mi-Fa#-Sol-La-Si-Do#-Ré. Deux touches noires. Doigté identique : 1-2-3-1-2-3-4-5.", type: "exercice" },
              { id: "gamme_d_mg",     label: "Gamme Ré — MG",                  duration: 15, bpm: 55,  desc: "MG doigté : 5-4-3-2-1-3-2-1. Les deux altérations Fa# et Do# donnent la couleur de Ré majeur.", type: "exercice" },
            ]
          },
          {
            day: 2, title: "Menuet en Ré (Purcell)",
            duration: 35, theory: null,
            exercises: [
              { id: "purcell_md",     label: "Menuet Purcell — MD seule",      duration: 20, bpm: 55,  desc: "Pièce baroque simple en Ré majeur. Travaille mesure par mesure. Attention aux Fa# et Do#.", type: "morceau" },
              { id: "purcell_mg",     label: "Menuet Purcell — MG seule",      duration: 15, bpm: 55,  desc: "Basse albertine (Do-Sol-Mi-Sol) ou accords. Travaille séparément avant d'assembler.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Assemblage et tempo",
            duration: 35, theory: null,
            exercises: [
              { id: "purcell_full",   label: "Menuet Purcell — mains ensemble",duration: 25, bpm: 55,  desc: "Assemble les deux mains très lentement. Un bar à la fois. Patience : c'est ainsi qu'on progresse.", type: "morceau" },
              { id: "arpege_d",       label: "Arpège Ré majeur",               duration: 10, bpm: 60,  desc: "Ré-Fa#-La-Ré arpégé. Ajoute à ta collection d'arpèges.", type: "exercice" },
            ]
          },
        ]
      },
      {
        n: 8, title: "Introduction aux gammes mineures",
        objective: "La mineur naturelle, couleur émotionnelle, morceau romantique",
        sessions: [
          {
            day: 1, title: "La mineur naturelle",
            duration: 30, theory: "gammes",
            exercises: [
              { id: "am_scale",       label: "Gamme La mineur naturelle MD",   duration: 15, bpm: 60,  desc: "La-Si-Do-Ré-Mi-Fa-Sol-La. Aucune altération ! Même touches que Do majeur mais en commençant par La. Couleur plus sombre.", type: "exercice" },
              { id: "am_scale_mg",    label: "Gamme La mineur MG",             duration: 15, bpm: 60,  desc: "Doigté MG : 5-4-3-2-1-3-2-1. La gamme relative mineure de Do majeur.", type: "exercice" },
            ]
          },
          {
            day: 2, title: "Fur Elise — Introduction",
            duration: 35, theory: null,
            exercises: [
              { id: "fur_theme",      label: "Für Elise — Thème principal MD", duration: 20, bpm: 50,  desc: "Mi-Ré#-Mi-Ré#-Mi-Si-Ré-Do / La. C'est le thème le plus connu du piano. Très lentement au début. Ré# = touche noire.", type: "morceau" },
              { id: "fur_mg_base",    label: "Für Elise — Basse MG",           duration: 15, bpm: 50,  desc: "La-Mi-La (arpège brisé) puis Do-Mi-Sol (accord). Répète jusqu'à automatisation.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Für Elise — mains ensemble",
            duration: 40, theory: null,
            exercises: [
              { id: "fur_ensemble",   label: "Für Elise — assemblage lent",    duration: 30, bpm: 45,  desc: "Assemble le thème avec la basse. TRÈS lent. Ce morceau demande de la patience. Mais le résultat vaut l'effort.", type: "morceau" },
              { id: "fur_revise",     label: "Révision + augmentation tempo",  duration: 10, bpm: 55,  desc: "Si propre à 45, passe à 55. Objectif final : 70 BPM.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 9, title: "Technique : le legato et le staccato",
        objective: "Contrôle du toucher, nuances, expressions musicales",
        sessions: [
          {
            day: 1, title: "Le legato — notes liées",
            duration: 30, theory: null,
            exercises: [
              { id: "legato_ex",      label: "Exercice legato 5 doigts",       duration: 15, bpm: 60,  desc: "Joue Do-Ré-Mi-Fa-Sol en legato : chaque note se connecte à la suivante sans interruption. Soulève le doigt juste quand le suivant joue.", type: "technique" },
              { id: "legato_song",    label: "Für Elise en legato pur",        duration: 15, bpm: 50,  desc: "Applique le legato parfait sur le thème de Für Elise. Connexion fluide entre toutes les notes.", type: "morceau" },
            ]
          },
          {
            day: 2, title: "Le staccato — notes détachées",
            duration: 30, theory: null,
            exercises: [
              { id: "staccato_ex",    label: "Exercice staccato rebond",       duration: 15, bpm: 60,  desc: "Même exercice 5 doigts mais staccato : notes courtes, rebond du poignet. Comme des petits sauts. Signe : point sous la note.", type: "technique" },
              { id: "legato_staccato",label: "Alternance legato/staccato",     duration: 15, bpm: 60,  desc: "1 mesure legato / 1 mesure staccato. Contrôle conscient du toucher.", type: "exercice" },
            ]
          },
          {
            day: 3, title: "Nuances : fort et doux",
            duration: 35, theory: null,
            exercises: [
              { id: "nuances_ex",     label: "Piano (p) et Forte (f)",         duration: 15, bpm: 60,  desc: "p = doux, f = fort. Joue la même gamme deux fois : une fois très doucement, une fois fort. La différence vient du poids du bras.", type: "technique" },
              { id: "ecossaise",      label: "Écossaise (Beethoven) — MD",     duration: 20, bpm: 60,  desc: "Pièce vivante de Beethoven alternant legato et staccato. Application directe des techniques de la semaine.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 10, title: "Lecture de partition et nouvelles gammes",
        objective: "Lire la clé de Sol couramment, Mi bémol majeur, morceau pop",
        sessions: [
          {
            day: 1, title: "Lecture de notes — Clé de Sol",
            duration: 30, theory: "notes",
            exercises: [
              { id: "lecture_notes",  label: "Flashcards notes portée",        duration: 15, bpm: null, desc: "Identifie les notes sur la portée : lignes (Mi-Sol-Si-Ré-Fa) et interlignes (Fa-La-Do-Mi). Moyen mnémotechnique : 'Mon Sol Si Ré Faux' et 'Faites La Do Ré Mi'.", type: "theorie" },
              { id: "lecture_ex",     label: "Exercice lecture à vue",         duration: 15, bpm: 60,  desc: "Joue une mélodie simple en lisant la partition. Commence par identifier toutes les notes avant de jouer.", type: "exercice" },
            ]
          },
          {
            day: 2, title: "Gamme Mi bémol (Eb) majeur",
            duration: 35, theory: null,
            exercises: [
              { id: "eb_scale",       label: "Gamme Mib majeur MD",            duration: 20, bpm: 50,  desc: "Mib-Fa-Sol-Lab-Sib-Do-Ré-Mib. 3 bémols (Mib, Lab, Sib). Doigté spécial : 2-1-2-3-4-1-2-3. Le pouce évite les touches noires.", type: "exercice" },
              { id: "eb_scale_mg",    label: "Gamme Mib — MG",                 duration: 15, bpm: 50,  desc: "MG doigté : 3-2-1-4-3-2-1-2. Les gammes à bémols ont des doigtés spécifiques à mémoriser.", type: "exercice" },
            ]
          },
          {
            day: 3, title: "Let It Be — Introduction",
            duration: 40, theory: null,
            exercises: [
              { id: "let_it_be_mg",   label: "Let It Be — Pattern MG (C-G-Am-F)", duration: 20, bpm: 65, desc: "La progression magique C-G-Am-F que tu connais déjà ! Pattern arpège brisé MG : basse + 3 notes. Très reconnaissable.", type: "morceau" },
              { id: "let_it_be_md",   label: "Let It Be — Mélodie MD",         duration: 20, bpm: 60,  desc: "Mélodie simplifiée. Les premières notes : Do-Si-La / Do-Si-La-Sol. Application de tout ce que tu as appris.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 11, title: "Let It Be — Finition et nouvelle pièce",
        objective: "Finaliser Let It Be, introduction à la gamme de Fa majeur",
        sessions: [
          {
            day: 1, title: "Let It Be — mains ensemble",
            duration: 40, theory: null,
            exercises: [
              { id: "let_it_be_full", label: "Let It Be — couplet complet",    duration: 30, bpm: 62,  desc: "Assemble mélodie et accompagnement. Le couplet d'abord, puis le refrain. Utilise la pédale de sustain.", type: "morceau" },
              { id: "gamme_f_intro",  label: "Gamme Fa majeur — introduction", duration: 10, bpm: 55,  desc: "Fa-Sol-La-Sib-Do-Ré-Mi-Fa. Un seul bémol (Sib). Doigté MD : 1-2-3-4-1-2-3-4.", type: "exercice" },
            ]
          },
          {
            day: 2, title: "Gamme de Fa majeur complète",
            duration: 35, theory: null,
            exercises: [
              { id: "gamme_f_full",   label: "Gamme Fa — 2 octaves MD+MG",     duration: 20, bpm: 60,  desc: "Doigté MD : 1-2-3-4-1-2-3-4. MG : 5-4-3-2-1-3-2-1. Le Sib (Bémol) en position 4 MD.", type: "exercice" },
              { id: "let_it_be_tempo",label: "Let It Be — montée en tempo",     duration: 15, bpm: 70,  desc: "Pousse progressivement vers 76-80 BPM. Le tempo original de la chanson.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Révision du trimestre",
            duration: 45, theory: null,
            exercises: [
              { id: "gammes_all",     label: "Toutes les gammes apprises",     duration: 20, bpm: 70,  desc: "Do / Sol / Ré / La mineur / Fa / Mib. Un tour complet de tes gammes. Régularité et beauté du son.", type: "exercice" },
              { id: "repertoire_2",   label: "Récital personnel",               duration: 25, bpm: null, desc: "Joue dans l'ordre : Minuet Bach → Ode à la Joie → Für Elise → Let It Be. Ton répertoire actuel. Tu as progressé !", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 12, title: "Les accords renversés",
        objective: "1er et 2ème renversements, voix leading, son plus fluide",
        sessions: [
          {
            day: 1, title: "Premier renversement",
            duration: 30, theory: "accords",
            exercises: [
              { id: "renversement_1", label: "Do majeur — 1er renversement",   duration: 15, bpm: null, desc: "Position fondamentale : Do-Mi-Sol / 1er renversement : Mi-Sol-Do / 2ème renversement : Sol-Do-Mi. Même accord, notes réorganisées.", type: "theorie" },
              { id: "voice_leading",  label: "Voice leading C-G-Am-F",         duration: 15, bpm: 60,  desc: "Joue la progression C-G-Am-F en gardant les voix proches. Utilise les renversements pour bouger le moins possible entre les accords.", type: "exercice" },
            ]
          },
          {
            day: 2, title: "Application des renversements",
            duration: 35, theory: null,
            exercises: [
              { id: "renv_ex",        label: "Exercice renversements tous accords", duration: 20, bpm: null, desc: "C, G, Am, F chacun en position fondamentale, 1er et 2ème renversement. Mémorise les positions.", type: "exercice" },
              { id: "nouvelle_chanson",label: "Hallelujah (Cohen) — Intro",    duration: 15, bpm: 55,  desc: "Progression classique avec renversements : Do-Am-Fa-Sol. Intro de Hallelujah en version piano solo.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Hallelujah — développement",
            duration: 40, theory: null,
            exercises: [
              { id: "hallelujah_mg",  label: "Hallelujah — Pattern arpège MG", duration: 20, bpm: 55,  desc: "Arpège brisé en 8 notes : Do-Sol-Mi-Sol / La-Sol-Mi-Sol. Pattern fluide et répétitif.", type: "morceau" },
              { id: "hallelujah_full",label: "Hallelujah — mains ensemble",    duration: 20, bpm: 52,  desc: "Mélodie MD + arpège MG. Ce morceau est la synthèse de tout ce que tu as appris.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 13, title: "Vitesse et fluidité",
        objective: "Travailler la vitesse méthodiquement, exercices Hanon",
        sessions: [
          {
            day: 1, title: "Exercices Hanon n°1",
            duration: 35, theory: null,
            exercises: [
              { id: "hanon_1",        label: "Hanon n°1 — Do majeur",          duration: 20, bpm: 60,  desc: "Do-Mi-Fa-Sol-La-Sol-Fa-Mi. 8 notes en motif. Hanon est la bible de la technique pianistique. Commence lent, augmente par paliers de 5 BPM.", type: "technique" },
              { id: "hanon_1_up",     label: "Hanon n°1 — montée en tempo",    duration: 15, bpm: 80,  desc: "Vise 80-100 BPM proprement. Le vrai travail de vélocité commence.", type: "technique" },
            ]
          },
          {
            day: 2, title: "Hanon n°2 et gammes rapides",
            duration: 35, theory: null,
            exercises: [
              { id: "hanon_2",        label: "Hanon n°2",                      duration: 15, bpm: 60,  desc: "Do-Ré-Mi-Fa-Sol-Fa-Mi-Ré. 2ème exercice Hanon. Renforce les doigts faibles (4 et 5).", type: "technique" },
              { id: "gammes_speed",   label: "Gammes en vitesse",              duration: 20, bpm: 80,  desc: "Gamme Do majeur 2 octaves à 80 BPM. Augmente par 5 BPM. Objectif : 120 BPM propre.", type: "exercice" },
            ]
          },
          {
            day: 3, title: "Application de la vitesse aux morceaux",
            duration: 40, theory: null,
            exercises: [
              { id: "fur_vitesse",    label: "Für Elise — push tempo",         duration: 20, bpm: 65,  desc: "Pousse Für Elise vers 70-76 BPM. Seules les parties maîtrisées méritent d'être accélérées.", type: "morceau" },
              { id: "let_it_be_final",label: "Let It Be — version finale",     duration: 20, bpm: 76,  desc: "Version finale à tempo réel. Musicalité, nuances, pédale. C'est ton grand morceau pop !", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 14, title: "Musique romantique — Chopin et Liszt",
        objective: "Approche du répertoire romantique, rubato, pédalisation fine",
        sessions: [
          {
            day: 1, title: "Le rubato — liberté temporelle",
            duration: 30, theory: null,
            exercises: [
              { id: "rubato_ex",      label: "Exercice rubato conscient",      duration: 15, bpm: null, desc: "Rubato = 'volé' en italien. Accélère légèrement sur les tensions, ralentis sur les résolutions. La musique respire comme une voix.", type: "technique" },
              { id: "nocturne_intro", label: "Nocturne Op.9 n°2 (Chopin) — thème", duration: 15, bpm: 45, desc: "Le thème le plus célèbre de Chopin. Mélodie MD seule. Mi bémol - Ré - Mi bémol - Si bémol. Sonorité chantante.", type: "morceau" },
            ]
          },
          {
            day: 2, title: "Nocturne — développement",
            duration: 40, theory: null,
            exercises: [
              { id: "nocturne_mg",    label: "Nocturne — arpège MG 6/8",       duration: 20, bpm: 45,  desc: "Arpège à 6 notes en MG. La basse donne le tempo, l'arpège crée l'atmosphère. Pédale soigneuse.", type: "morceau" },
              { id: "nocturne_full",  label: "Nocturne — 8 premières mesures", duration: 20, bpm: 44,  desc: "Les 8 premières mesures mains ensemble. Tempo libre, rubato, beauté du son.", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Consolider le répertoire romantique",
            duration: 40, theory: null,
            exercises: [
              { id: "hanon_3",        label: "Hanon n°3 — entretien technique",duration: 15, bpm: 80,  desc: "Troisième exercice Hanon. Maintient la technique pendant le travail expressif.", type: "technique" },
              { id: "nocturne_revise",label: "Nocturne — révision et musicalité", duration: 25, bpm: 44, desc: "Travaille l'expression : nuances pp à mf, legato parfait, rubato naturel.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 15, title: "Improvisation et accords jazz",
        objective: "Introduction à l'improvisation libre, accords de 7ème jazz",
        sessions: [
          {
            day: 1, title: "Accords de 7ème jazz",
            duration: 35, theory: "accords",
            exercises: [
              { id: "cmaj7",          label: "Cmaj7 (Do majeur 7ème)",         duration: 10, bpm: null, desc: "Do-Mi-Sol-Si. La 7ème majeure ajoute une couleur douce et lumineuse. Très utilisé en jazz et en pop.", type: "exercice" },
              { id: "am7_dm7",        label: "Am7 et Dm7",                     duration: 15, bpm: null, desc: "Am7 : La-Do-Mi-Sol / Dm7 : Ré-Fa-La-Do. Les accords de 7ème mineurs. Jazz pur.", type: "exercice" },
              { id: "jazz_prog",      label: "Progression ii-V-I en Do",       duration: 10, bpm: 60,  desc: "Dm7-G7-Cmaj7 : la cadence fondamentale du jazz. Joue lentement et écoute les couleurs.", type: "exercice" },
            ]
          },
          {
            day: 2, title: "Pentatonique et improvisation",
            duration: 35, theory: null,
            exercises: [
              { id: "pentatonique",   label: "Gamme pentatonique de Do",       duration: 15, bpm: 60,  desc: "Do-Ré-Mi-Sol-La-Do. 5 notes. Toutes les notes sonnent bien ensemble. C'est la gamme d'improvisation par excellence.", type: "exercice" },
              { id: "impro_libre",    label: "Improvisation libre 5 min",      duration: 20, bpm: null, desc: "Joue librement avec la pentatonique de Do en MD. MG : accord C tenu. Il n'y a pas de fausses notes avec la pentatonique !", type: "exercice" },
            ]
          },
          {
            day: 3, title: "Autumn Leaves — Introduction",
            duration: 40, theory: null,
            exercises: [
              { id: "autumn_chords",  label: "Autumn Leaves — accords",        duration: 20, bpm: 55,  desc: "Am7-D7-Gmaj7-Cmaj7-Fm7b5-B7-Em. La progression jazz la plus connue. Enchaîne les accords proprement.", type: "morceau" },
              { id: "autumn_melody",  label: "Autumn Leaves — mélodie MD",     duration: 20, bpm: 50,  desc: "Mélodie simplifiée. Tons chantants. Rubato naturel.", type: "morceau" },
            ]
          },
        ]
      },
      {
        n: 16, title: "Grand récital — Bilan du programme",
        objective: "Polir tous les morceaux, récital complet, préparer la suite",
        sessions: [
          {
            day: 1, title: "Révision intensive — Classique",
            duration: 45, theory: null,
            exercises: [
              { id: "final_classique",label: "Révision : Minuet + Ode à la Joie + Für Elise", duration: 45, bpm: null, desc: "Travaille chaque morceau classique dans sa version finale. Nuances, tempo, musicalité. Tu as fait un long chemin !", type: "morceau" },
            ]
          },
          {
            day: 2, title: "Révision intensive — Pop et Jazz",
            duration: 45, theory: null,
            exercises: [
              { id: "final_pop",      label: "Let It Be + Hallelujah + Autumn Leaves", duration: 45, bpm: null, desc: "Tes morceaux pop et jazz. Polis chaque détail : pédale, nuances, fluidité. Tu peux maintenant jouer pour tes proches !", type: "morceau" },
            ]
          },
          {
            day: 3, title: "Grand récital + Cap sur la suite",
            duration: 50, theory: null,
            exercises: [
              { id: "grand_recital",  label: "Récital complet — 6 morceaux",   duration: 40, bpm: null, desc: "Joue tout ton répertoire sans interruption. Minuet → Ode à la Joie → Für Elise → Let It Be → Hallelujah → Autumn Leaves. Félicitations ! 🎹", type: "morceau" },
              { id: "prochaine_etape",label: "Préparer la prochaine étape",    duration: 10, bpm: null, desc: "Tu maîtrises maintenant les bases solides du piano. Les prochaines étapes : programme intermédiaire, nouveau répertoire, lectures avancées.", type: "theorie" },
            ]
          },
        ]
      },
    ]
  },

  // ─── INTERMÉDIAIRE (12 semaines) ─────────────────────────
  {
    id: "intermediaire_general",
    name: "Piano Intermédiaire",
    subtitle: "Programme 12 semaines",
    levels: ["intermediaire"],
    goals: ["general", "classique", "pop"],
    durationWeeks: 12,
    color: "#10B981",
    description: "Pour pianistes ayant déjà les bases. Répertoire plus exigeant, technique avancée, lecture de partition, approche du répertoire du conservatoire.",
    weeks: [
      { n:1, title:"Remise en forme technique", objective:"Hanon, gammes chromatiques, Czerny", sessions:[
        { day:1, title:"Hanon intensif", duration:40, theory:null, exercises:[
          { id:"hanon_1_4",label:"Hanon n°1 à 4",duration:20,bpm:100,desc:"Les 4 premiers exercices Hanon à 100 BPM. Si une main accroche, ralentis à 80.",type:"technique"},
          { id:"chromatique",label:"Gamme chromatique 2 octaves",duration:20,bpm:80,desc:"Toutes les touches noires et blanches en montant et descendant. Doigté : 1-3 sur les touches noires.",type:"exercice"},
        ]},
        { day:2, title:"Czerny op.599", duration:40, theory:null, exercises:[
          { id:"czerny_1",label:"Czerny op.599 n°1",duration:20,bpm:80,desc:"Exercice de base Czerny. Articulation claire, doigts indépendants.",type:"technique"},
          { id:"gammes_all_int",label:"Toutes gammes majeures Do-Sol-Ré-La-Mi",duration:20,bpm:80,desc:"5 gammes en enchaînement. Doigtés mémorisés, transitions fluides.",type:"exercice"},
        ]},
        { day:3, title:"Évaluation du niveau", duration:45, theory:null, exercises:[
          { id:"eval_tech",label:"Joue ta meilleure pièce",duration:15,bpm:null,desc:"Joue ce que tu connais le mieux. Identifie tes points faibles.",type:"morceau"},
          { id:"sonate_intro",label:"Sonate Facile K.545 (Mozart) — Exposition", duration:30,bpm:80,desc:"Premier mouvement de la Sonate en Do K.545. La pièce phare du répertoire intermédiaire. Travaille l'exposition (mesures 1-28).",type:"morceau"},
        ]},
      ]},
      { n:2, title:"Sonate Mozart K.545", objective:"Maîtriser le 1er mouvement complet", sessions:[
        { day:1, title:"Développement de la Sonate", duration:45, theory:null, exercises:[
          { id:"mozart_dev",label:"K.545 — Développement (m.28-56)",duration:30,bpm:75,desc:"Section centrale plus complexe. Modulations en Sol majeur. Travaille section par section.",type:"morceau"},
          { id:"gamme_a",label:"Gamme La majeur (3 dièses)",duration:15,bpm:80,desc:"La-Si-Do#-Ré-Mi-Fa#-Sol#-La. Nouvelle gamme pour la section en La de Mozart.",type:"exercice"},
        ]},
        { day:2, title:"Récapitulation Mozart", duration:45, theory:null, exercises:[
          { id:"mozart_recap",label:"K.545 — Récapitulation complète",duration:35,bpm:80,desc:"Retour en Do majeur. Réunir les 3 sections. Le plus dur est d'enchaîner sans break.",type:"morceau"},
          { id:"trilles",label:"Technique des trilles",duration:10,bpm:null,desc:"Trille = alternance rapide 2 notes. Commence lent (3-4), accélère. Poignet détendu absolument.",type:"technique"},
        ]},
        { day:3, title:"Mozart — version complète", duration:50, theory:null, exercises:[
          { id:"mozart_full",label:"K.545 1er mvt complet",duration:50,bpm:100,desc:"Version complète. Objectif tempo : 120 BPM. Nuances : f dans l'exposition, p dans le développement.",type:"morceau"},
        ]},
      ]},
      { n:3, title:"Bach et le contrepoint", objective:"Prélude en Do, indépendance des mains", sessions:[
        { day:1, title:"Prélude en Do (Bach)", duration:45, theory:null, exercises:[
          { id:"bach_prelude_md",label:"Prélude C — arpège MD seule",duration:20,bpm:60,desc:"Do-Mi-Sol-Do-Mi (arpège en 5 notes). Même pattern sur chaque harmonie. MD seule d'abord.",type:"morceau"},
          { id:"bach_prelude_mg",label:"Prélude C — basse MG",duration:25,bpm:60,desc:"La basse change d'harmonie chaque mesure. C-Dm-G7-C... Mémorise la progression.",type:"morceau"},
        ]},
        { day:2, title:"Prélude en Do — assemblage", duration:45, theory:null, exercises:[
          { id:"bach_full",label:"Prélude en Do — complet",duration:35,bpm:60,desc:"Bach WTC Livre 1. Mains ensemble. Pédale sur toute la durée de chaque harmonie. Effet hypnotique.",type:"morceau"},
          { id:"indep_mains",label:"Exercice indépendance des mains",duration:10,bpm:60,desc:"MD : notes longues / MG : notes courtes. Puis inverse. L'indépendance est la clé du contrepoint.",type:"technique"},
        ]},
        { day:3, title:"Invention à 2 voix (Bach)", duration:45, theory:null, exercises:[
          { id:"invention_1",label:"Invention n°1 en Do — voix 1",duration:20,bpm:55,desc:"Bach BWV 772. MD seule : motif de base 4 croches + liaison. La cellule génératrice.",type:"morceau"},
          { id:"invention_mg",label:"Invention n°1 — voix 2",duration:25,bpm:55,desc:"MG reprend exactement le même motif 2 temps plus tard (imitation). Le contrepoint en action.",type:"morceau"},
        ]},
      ]},
      { n:4, title:"Chopin — Valse et Nocturne", objective:"Répertoire romantique avancé, rubato maîtrisé", sessions:[
        { day:1, title:"Valse Op.64 n°2 (Chopin)", duration:45, theory:null, exercises:[
          { id:"valse_theme",label:"Valse en Do# mineur — Thème",duration:30,bpm:50,desc:"Mesure à 3/4. Thème mélancolique en Do# mineur. Attention : beaucoup de dièses. Travaille la mélodie seule.",type:"morceau"},
          { id:"valse_trio",label:"Valse — Trio central (majeur)",duration:15,bpm:50,desc:"Le trio en Do# majeur — couleur plus lumineuse. Contraste expressif fort.",type:"morceau"},
        ]},
        { day:2, title:"Nocturne Op.9 n°2 complet", duration:45, theory:null, exercises:[
          { id:"nocturne_full_int",label:"Nocturne — version complète 40 mes.",duration:35,bpm:50,desc:"Les 40 premières mesures. Ornements (trilles, gruppettos). Rubato naturel, son chanté.",type:"morceau"},
          { id:"ornements",label:"Technique des ornements",duration:10,bpm:null,desc:"Mordant, gruppetto, trille avec terminaison. Exercices dédiés avant de les intégrer au Nocturne.",type:"technique"},
        ]},
        { day:3, title:"Expression romantique", duration:45, theory:null, exercises:[
          { id:"chopin_revue",label:"Chopin — révision Valse + Nocturne",duration:35,bpm:null,desc:"Travaille l'expression : vibrato du poignet, rubato, crescendo/decrescendo. La musique doit raconter une histoire.",type:"morceau"},
          { id:"pedale_fine",label:"Pédalisation avancée",duration:10,bpm:null,desc:"Pédale syncopée, pédale à moitié, changements au bon moment. La pédale est le 3ème pied du piano.",type:"technique"},
        ]},
      ]},
    ]
  },

];

export const getProgram = (levelId, goalId) => {
  const candidates = PROGRAMS.filter(p =>
    p.levels.includes(levelId) && p.goals.includes(goalId)
  );
  return candidates[0] || PROGRAMS.find(p => p.levels.includes(levelId)) || PROGRAMS[0];
};
