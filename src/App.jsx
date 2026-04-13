import React from "react";
import { useState, useEffect } from "react";

const G = "#1D9E75",
  GL = "#E1F5EE",
  GD = "#085041",
  GM = "#0F6E56";

const questions = [
  {
    q: "Combien d'heures dormez-vous en moyenne par nuit ?",
    sub: "Incluez les week-ends",
    opts: [
      ["Moins de 5h", 10],
      ["5h à 6h", 25],
      ["6h à 7h", 38],
      ["7h à 8h", 50],
      ["Plus de 8h", 42],
    ],
  },
  {
    q: "Comment qualifieriez-vous votre endormissement ?",
    sub: "Le soir au moment de vous coucher",
    opts: [
      ["Rapide — moins de 10 min", 50],
      ["Normal — 10 à 20 min", 35],
      ["Long — 20 à 45 min", 20],
      ["Très difficile — plus de 45 min", 5],
    ],
  },
  {
    q: "Vous réveillez-vous la nuit ?",
    sub: "",
    opts: [
      ["Jamais ou rarement", 50],
      ["1 à 2 fois par semaine", 30],
      ["Plusieurs fois par semaine", 15],
      ["Toutes les nuits", 5],
    ],
  },
  {
    q: "Comment vous sentez-vous au réveil ?",
    sub: "",
    opts: [
      ["Reposé et en forme", 50],
      ["Correct, mais pas au top", 30],
      ["Fatigué, j'ai du mal à démarrer", 15],
      ["Épuisé, comme si je n'avais pas dormi", 5],
    ],
  },
  {
    q: "Utilisez-vous un écran dans l'heure avant de dormir ?",
    sub: "",
    opts: [
      ["Non, jamais", 50],
      ["Rarement", 35],
      ["Souvent", 15],
      ["Toujours — c'est ma routine", 5],
    ],
  },
  {
    q: "Ressentez-vous de la fatigue dans la journée ?",
    sub: "",
    opts: [
      ["Non, j'ai de l'énergie toute la journée", 50],
      ["Un petit coup de pompe après le déjeuner", 30],
      ["Souvent fatigué, du mal à me concentrer", 15],
      ["Épuisé en permanence", 5],
    ],
  },
  {
    q: "Consommez-vous caféine ou alcool le soir ?",
    sub: "",
    opts: [
      ["Non, ni l'un ni l'autre", 50],
      ["Parfois l'un ou l'autre", 30],
      ["Régulièrement l'un ou l'autre", 15],
      ["Les deux, souvent", 5],
    ],
  },
  {
    q: "Comment évaluez-vous votre niveau de stress général ?",
    sub: "",
    opts: [
      ["Faible — je me sens serein", 50],
      ["Modéré — quelques tensions", 30],
      ["Élevé — souvent sous pression", 15],
      ["Très élevé — anxiété fréquente", 5],
    ],
  },
];

const profiles = {
  high: {
    name: "Bon dormeur",
    color: G,
    bg: GL,
    text: GD,
    border: GM,
    desc: "Votre sommeil est globalement sain. Quelques ajustements ciblés peuvent encore l'optimiser.",
    recos: [
      {
        t: "Maintenez vos horaires",
        d: "Votre régularité est votre meilleur atout. Couchez-vous et levez-vous aux mêmes heures.",
      },
      {
        t: "Optimisez la récupération",
        d: "10 min de stretching léger avant le coucher consolide votre sommeil profond.",
      },
      {
        t: "Anticipez le stress",
        d: "Même avec un bon sommeil de base, les pics de stress peuvent tout dérégler.",
      },
    ],
  },
  mid: {
    name: "Dormeur instable",
    color: "#BA7517",
    bg: "#FAEEDA",
    text: "#633806",
    border: "#854F0B",
    desc: "Votre sommeil est irrégulier. Des habitudes simples et ciblées peuvent transformer votre repos.",
    recos: [
      {
        t: "Fixez une heure de coucher fixe",
        d: "L'irrégularité est votre ennemi principal. Tenez une heure fixe 7j/7 pendant 2 semaines.",
      },
      {
        t: "Coupez les écrans à 21h30",
        d: "La lumière bleue retarde votre mélatonine de 1 à 2h.",
      },
      {
        t: "Limitez la caféine après 14h",
        d: "La demi-vie de la caféine est de 5 à 6h. Un café à 16h, c'est encore de la caféine à minuit.",
      },
    ],
  },
  low: {
    name: "Épuisé chronique",
    color: "#993C1D",
    bg: "#FAECE7",
    text: "#4A1B0C",
    border: "#993C1D",
    desc: "Votre fatigue est profonde. Un programme structuré est indispensable pour récupérer durablement.",
    recos: [
      {
        t: "Consultez un médecin",
        d: "Un score aussi bas mérite une attention sérieuse. Une apnée du sommeil est à écarter.",
      },
      {
        t: "Instaurez un rituel de décompression",
        d: "30 min avant de dormir : lumière tamisée, 18°C, pas d'écran.",
      },
      {
        t: "Supprimez alcool et caféine le soir",
        d: "Ces deux substances sabotent le sommeil profond. Résultats visibles en 5 jours.",
      },
    ],
  },
};

const dayColors = [
  "#E1F5EE",
  "#E6F1FB",
  "#FAEEDA",
  "#EEEDFE",
  "#EAF3DE",
  "#FAECE7",
  "#FBEAF0",
];
const dayText = [
  "#085041",
  "#0C447C",
  "#633806",
  "#3C3489",
  "#27500A",
  "#712B13",
  "#72243E",
];
const dayBorder = [
  "#0F6E56",
  "#185FA5",
  "#854F0B",
  "#534AB7",
  "#3B6D11",
  "#993C1D",
  "#993556",
];

const plans = {
  high: [
    {
      theme: "Ancrer la régularité",
      matin:
        "Notez vos heures de lever des 7 derniers jours — identifiez les écarts.",
      journee:
        "Planifiez vos horaires de sommeil dans votre agenda comme un rendez-vous.",
      soir: "Éteignez les écrans 30 min avant le coucher et lisez 10 min.",
      tip: "La régularité du lever est plus puissante que l'heure du coucher.",
    },
    {
      theme: "Optimiser l'environnement",
      matin:
        "Ouvrez les volets dès le réveil — 5 min de lumière naturelle synchronise l'horloge.",
      journee:
        "Vérifiez la température de votre chambre — l'idéal est entre 17 et 19°C.",
      soir: "Investissez dans des rideaux occultants si ce n'est pas déjà fait.",
      tip: "Un environnement sombre et frais améliore la qualité du sommeil profond de 20%.",
    },
    {
      theme: "Affiner l'alimentation",
      matin: "Repoussez le premier café à 90 min après le réveil.",
      journee: "Dînez léger, au moins 2h avant de dormir.",
      soir: "Une tisane de camomille ou de mélisse favorise la détente.",
      tip: "L'alcool fragmente le sommeil profond même en petite quantité.",
    },
    {
      theme: "Gérer le stress résiduel",
      matin: "5 min de respiration profonde avant de se lever.",
      journee:
        "Identifiez votre principale source de tension et planifiez-la pour le lendemain.",
      soir: "Écrivez 3 choses positives de la journée — le cerveau se déconnecte mieux.",
      tip: "Un journal de gratitude réduit l'activité du cortex préfrontal avant le sommeil.",
    },
    {
      theme: "Consolider le sommeil profond",
      matin: "Notez votre énergie de 0 à 10 — comparez avec J1.",
      journee: "20 min de marche ou activité physique légère avant 18h.",
      soir: "Stretching 10 min : cou, épaules, dos.",
      tip: "L'exercice régulier augmente la proportion de sommeil lent profond.",
    },
    {
      theme: "Prévenir les régressions",
      matin:
        "Identifiez les situations qui perturbent votre sommeil (voyages, stress pro).",
      journee:
        "Préparez un plan B pour ces situations : heure adaptée, sieste courte.",
      soir: "Répétez votre rituel du soir — même le week-end.",
      tip: "La constance du week-end évite le 'social jet lag' du lundi matin.",
    },
    {
      theme: "Ancrer pour la durée",
      matin:
        "Évaluez votre score de forme — la progression devrait être visible.",
      journee:
        "Choisissez 2 habitudes clés de cette semaine à conserver définitivement.",
      soir: "Célébrez sans écran : musique, lecture, ou simple tranquillité.",
      tip: "21 jours pour une habitude — vous avez fait le plus dur. Continuez 2 semaines de plus.",
    },
  ],
  mid: [
    {
      theme: "Poser les bases",
      matin:
        "Levez-vous à heure fixe — choisissez une heure et tenez-la toute la semaine.",
      journee:
        "Notez vos habitudes actuelles : coucher, réveil, caféine, écrans.",
      soir: "Éteignez tous les écrans à 21h30. Première fois ce soir.",
      tip: "L'heure de lever fixe est plus puissante que l'heure de coucher.",
    },
    {
      theme: "Apprivoiser la caféine",
      matin: "Repoussez le premier café à 90 min après le réveil.",
      journee: "Dernier café ou thé avant 14h strictement.",
      soir: "Préparez votre chambre : 17-19°C, rideaux fermés, téléphone hors de la chambre.",
      tip: "La caféine a une demi-vie de 6h — un café à 15h représente encore la moitié à minuit.",
    },
    {
      theme: "Créer un rituel de décompression",
      matin: "Exposez-vous à la lumière naturelle 5 min dès le lever.",
      journee: "Arrêtez emails et réseaux à 20h.",
      soir: "20 min de rituel fixe : douche tiède, lecture papier, ou étirements.",
      tip: "Un rituel répété entraîne le cerveau à associer ces gestes à l'endormissement.",
    },
    {
      theme: "Apprivoiser les réveils nocturnes",
      matin: "Si vous vous êtes réveillé la nuit, ne consultez pas l'heure.",
      journee: "Évitez la sieste longue (max 20 min avant 15h).",
      soir: "Essayez la respiration 4-7-8 : inspirez 4s, bloquez 7s, expirez 8s.",
      tip: "Se réveiller 1 à 2 fois par nuit est normal — c'est l'anxiété qui perturbe, pas le réveil.",
    },
    {
      theme: "Optimiser l'alimentation du soir",
      matin: "Évaluez votre énergie de 0 à 10 — comparez avec J1.",
      journee: "Dînez au moins 2h avant de dormir, repas léger.",
      soir: "Préparez mentalement demain en 5 min pour vider votre tête.",
      tip: "L'alcool aide à s'endormir mais fragmente le sommeil profond.",
    },
    {
      theme: "Consolider les acquis",
      matin:
        "Résistez à la grasse matinée — votre corps intègre les nouveaux horaires.",
      journee: "20 min de marche ou activité légère avant 18h.",
      soir: "Répétez votre rituel du soir de J3. Notez votre progression.",
      tip: "La régularité prime sur la perfection.",
    },
    {
      theme: "Ancrer les habitudes",
      matin: "Notez votre score de forme sur 10 — comparez avec J1.",
      journee: "Identifiez les 2 habitudes qui ont eu le plus d'impact.",
      soir: "Célébrez sans écran : musique douce, lecture, ou tranquillité.",
      tip: "Il faut 21 jours pour ancrer une habitude — vous avez fait le plus dur.",
    },
  ],
  low: [
    {
      theme: "Évaluer et accepter",
      matin: "Notez votre niveau d'énergie de 0 à 10 — sans jugement.",
      journee:
        "Consultez votre médecin si ce n'est pas fait — une apnée du sommeil est à écarter.",
      soir: "Couchez-vous à la même heure ce soir. Choisissez une heure réaliste.",
      tip: "Accepter sa fatigue sans culpabilité est la première étape vers l'amélioration.",
    },
    {
      theme: "Supprimer les saboteurs",
      matin: "Repoussez le premier café à 90 min après le réveil.",
      journee: "Zéro alcool et zéro caféine après 14h cette semaine.",
      soir: "Éteignez tous les écrans à 21h. Lumière tamisée uniquement.",
      tip: "Ces deux changements seuls peuvent améliorer le sommeil profond en 3 à 5 jours.",
    },
    {
      theme: "Créer un refuge",
      matin:
        "Ouvrez les volets 5 min dès le lever pour réinitialiser l'horloge biologique.",
      journee:
        "Achetez des bouchons d'oreilles ou un masque de nuit si votre environnement est perturbant.",
      soir: "Chambre à 17-19°C, complètement sombre, téléphone dans une autre pièce.",
      tip: "L'environnement de sommeil agit comme un signal puissant au cerveau.",
    },
    {
      theme: "Instaurer un rituel anti-stress",
      matin:
        "5 min de respiration lente au réveil avant de regarder le téléphone.",
      journee:
        "Identifiez votre principale source de stress et planifiez-la — ne la ressassez pas.",
      soir: "Bain chaud ou douche tiède 1h avant le coucher.",
      tip: "La respiration 4-7-8 active le système parasympathique en moins de 2 minutes.",
    },
    {
      theme: "Nourrir autrement",
      matin:
        "Notez votre énergie — une légère amélioration devrait être perceptible.",
      journee: "Dînez léger et tôt — au moins 2h avant le coucher.",
      soir: "Tisane de camomille ou de valériane. Pas d'écran, pas d'actualités.",
      tip: "Un repas lourd le soir augmente la température corporelle et perturbe l'endormissement.",
    },
    {
      theme: "Bouger doucement",
      matin:
        "10 min de marche matinale — même courte, elle améliore le sommeil nocturne.",
      journee: "Évitez tout effort physique intense après 18h.",
      soir: "Étirements doux 10 min — nuque, épaules, bas du dos.",
      tip: "L'exercice modéré est l'un des meilleurs traitements non médicamenteux de la fatigue chronique.",
    },
    {
      theme: "Mesurer et projeter",
      matin:
        "Évaluez votre score de forme — même +1 ou +2 points est un succès.",
      journee:
        "Choisissez les 3 habitudes de cette semaine à conserver absolument.",
      soir: "Écrivez une intention pour les 7 prochains jours.",
      tip: "La fatigue chronique se construit sur des mois — la guérison aussi. Soyez patient.",
    },
  ],
};

const reviews = [
  {
    name: "Sophie M.",
    initial: "S",
    before: "Dormeur instable",
    txt: "Je dors 7h d'affilée pour la première fois depuis des années.",
  },
  {
    name: "Thomas R.",
    initial: "T",
    before: "Épuisé chronique",
    txt: "Le plan m'a redonné une énergie que j'avais complètement oubliée.",
  },
  {
    name: "Camille D.",
    initial: "C",
    before: "Bon dormeur",
    txt: "J'ai affiné mes habitudes, mon réveil est devenu un plaisir.",
  },
];

const faqs = [
  {
    q: "Est-ce vraiment personnalisé ?",
    a: "Oui — votre plan est généré selon vos réponses. Chaque profil reçoit un programme distinct.",
  },
  {
    q: "Et si je ne vois pas de résultat ?",
    a: "La majorité observe une amélioration dès le 4e jour. Si ce n'est pas le cas, consultez votre médecin.",
  },
  {
    q: "C'est quoi exactement pour 1,99€ ?",
    a: "Le quiz et le score sont gratuits. Vous payez uniquement pour débloquer votre plan 7 jours complet.",
  },
  {
    q: "Sans abonnement ?",
    a: "Oui, paiement unique. Aucun renouvellement, aucune surprise.",
  },
];

const loadingSteps = [
  "Analyse de vos réponses...",
  "Identification de votre profil...",
  "Calcul de votre score...",
  "Génération de votre programme...",
];

function ScoreArc({ score, color, bg }) {
  const r = 52,
    cx = 64,
    cy = 64;
  const toRad = (a) => ((a - 90) * Math.PI) / 180;
  const start = -125,
    sweep = 250;
  const angle = (score / 100) * sweep;
  const x1 = cx + r * Math.cos(toRad(start)),
    y1 = cy + r * Math.sin(toRad(start));
  const x2 = cx + r * Math.cos(toRad(start + sweep)),
    y2 = cy + r * Math.sin(toRad(start + sweep));
  const ax = cx + r * Math.cos(toRad(start + angle)),
    ay = cy + r * Math.sin(toRad(start + angle));
  const lg = angle > 180 ? 1 : 0;
  return (
    <svg width="128" height="110" viewBox="0 0 128 110">
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`}
        fill="none"
        stroke={bg}
        strokeWidth="9"
        strokeLinecap="round"
      />
      {score > 0 && (
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${ax} ${ay}`}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
        />
      )}
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fontSize="26"
        fontWeight="500"
        fill={color}
      >
        {score}
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="11" fill={color}>
        /100
      </text>
    </svg>
  );
}

function Loader({ onDone }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx < loadingSteps.length - 1) {
      const t = setTimeout(() => setIdx((i) => i + 1), 650);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [idx]);
  const pct = Math.round(((idx + 1) / loadingSteps.length) * 100);
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: "4rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: GL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 2rem",
          fontSize: 28,
          color: G,
        }}
      >
        ◑
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginBottom: "0.5rem",
        }}
      >
        {loadingSteps[idx]}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--color-text-tertiary)",
          marginBottom: "2rem",
        }}
      >
        Quelques secondes...
      </div>
      <div
        style={{
          height: 6,
          background: "var(--color-background-secondary)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 6,
            background: G,
            borderRadius: 3,
            width: pct + "%",
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const savedProfil = localStorage.getItem("sleepscore_profil");
  const savedScore = parseInt(localStorage.getItem("sleepscore_score")) || 0;
  const [screen, setScreen] = useState(savedProfil ? "plan" : "landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(savedScore);
  const [profileKey, setProfileKey] = useState(savedProfil || null);
  const [openDay, setOpenDay] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [paid, setPaid] = useState(false);
  const [checkedDays, setCheckedDays] = useState({});

  function selectAnswer(qi, val) {
    setAnswers((prev) => ({ ...prev, [qi]: val }));
  }

  function nextStep() {
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      const vals = Object.values(answers);
      const raw = vals.reduce((a, b) => a + b, 0);
      const s = Math.round((raw / (8 * 50)) * 100);
      setScore(s);
      setProfileKey(s >= 75 ? "high" : s >= 50 ? "mid" : "low");
      setScreen("loading");
    }
  }

  function toggleDay(i) {
    setCheckedDays((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  const p = profileKey ? profiles[profileKey] : null;
  const plan = profileKey ? plans[profileKey] : [];
  const doneCount = Object.values(checkedDays).filter(Boolean).length;

  const Btn = ({ children, onClick, full, secondary, style = {} }) => (
    <button
      onClick={onClick}
      style={{
        background: secondary ? "var(--color-background-secondary)" : G,
        color: secondary ? "var(--color-text-primary)" : "#fff",
        border: secondary
          ? "0.5px solid var(--color-border-secondary)"
          : "none",
        borderRadius: 12,
        padding: "14px 28px",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        width: full ? "100%" : "auto",
        ...style,
      }}
    >
      {children}
    </button>
  );

  if (screen === "loading")
    return <Loader onDone={() => setScreen("result")} />;

  if (screen === "landing")
    return (
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 1rem 3rem" }}>
        <div style={{ textAlign: "center", padding: "3rem 0 2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: GL,
              borderRadius: 20,
              padding: "5px 14px",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ fontSize: 14, color: GD }}>◑</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: GD }}>
              Sommeil · Bien-être
            </span>
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.2,
              margin: "0 0 1rem",
              color: "var(--color-text-primary)",
            }}
          >
            Améliorez votre sommeil
            <br />
            en 7 jours
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              maxWidth: 380,
              margin: "0 auto 2rem",
            }}
          >
            Découvrez votre profil en 3 minutes. Recevez un plan personnalisé
            jour par jour pour retrouver un vrai repos.
          </p>
          <Btn
            onClick={() => {
              setScreen("quiz");
              setStep(0);
              setAnswers({});
            }}
          >
            Faire le quiz gratuit →
          </Btn>
          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              color: "var(--color-text-tertiary)",
            }}
          >
            Quiz gratuit · Plan 7 jours à 1,99€ · Sans abonnement
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: 10,
            marginBottom: "2.5rem",
          }}
        >
          {[
            ["3 min", "Quiz rapide", "◷"],
            ["1 score", "Personnalisé", "◈"],
            ["7 jours", "De programme guidé", "◉"],
          ].map(([n, l, ic]) => (
            <div
              key={n}
              style={{
                background: "var(--color-background-secondary)",
                borderRadius: 14,
                padding: "1.25rem 1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20, color: G, marginBottom: 6 }}>
                {ic}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  marginTop: 2,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--color-text-tertiary)",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Comment ça marche
          </p>
          <div
            style={{
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: 14,
              overflow: "hidden",
              background: "var(--color-background-primary)",
            }}
          >
            {[
              [
                "1",
                "Faites le quiz",
                "8 questions sur vos habitudes de sommeil",
                G,
              ],
              [
                "2",
                "Obtenez votre score",
                "Un profil précis avec vos points faibles identifiés",
                "#BA7517",
              ],
              [
                "3",
                "Suivez votre plan",
                "7 jours d'actions concrètes adaptées à votre profil",
                "#534AB7",
              ],
            ].map(([num, title, desc, c], i, arr) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  padding: "16px 18px",
                  borderBottom:
                    i < arr.length - 1
                      ? "0.5px solid var(--color-border-tertiary)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c + "22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: c }}>
                    {num}
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "2.5rem" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--color-text-tertiary)",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Ils ont testé
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reviews.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 16px",
                  background: "var(--color-background-primary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: GL,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 500,
                        color: GD,
                        flexShrink: 0,
                      }}
                    >
                      {r.initial}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {r.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--color-text-tertiary)",
                        }}
                      >
                        Profil : {r.before}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{ fontSize: 13, color: "#EF9F27", flexShrink: 0 }}
                  >
                    ★★★★★
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--color-text-secondary)",
                    margin: 0,
                    fontStyle: "italic",
                    lineHeight: 1.6,
                  }}
                >
                  "{r.txt}"
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: GL,
            borderRadius: 18,
            padding: "2rem",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: GM,
              fontWeight: 500,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Offre unique
          </div>
          <div
            style={{ fontSize: 40, fontWeight: 500, color: GD, lineHeight: 1 }}
          >
            1,99€
          </div>
          <div style={{ fontSize: 13, color: GM, margin: "6px 0 1.5rem" }}>
            Paiement unique · Accès immédiat · Sans abonnement
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxWidth: 270,
              margin: "0 auto 1.5rem",
              textAlign: "left",
            }}
          >
            {[
              "Quiz complet + score personnalisé",
              "Identification de votre profil",
              "Plan 7 jours détaillé jour par jour",
              "Conseils adaptés à vos habitudes",
            ].map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 10, alignItems: "center" }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: G,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{ fontSize: 10, color: "#fff", fontWeight: 500 }}
                  >
                    ✓
                  </span>
                </div>
                <span style={{ fontSize: 13, color: GD }}>{item}</span>
              </div>
            ))}
          </div>
          <Btn
            onClick={() => {
              setScreen("quiz");
              setStep(0);
              setAnswers({});
            }}
            full
            style={{ maxWidth: 280 }}
          >
            Commencer maintenant →
          </Btn>
          <div style={{ fontSize: 12, color: GM, marginTop: 10 }}>
            Moins cher qu'un café · Pour récupérer le sommeil que vous méritez
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--color-text-tertiary)",
              marginBottom: "1rem",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Questions fréquentes
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map((f, i) => (
              <div
                key={i}
                style={{
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: 12,
                  background: "var(--color-background-primary)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "13px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {f.q}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-tertiary)",
                      flexShrink: 0,
                    }}
                  >
                    {openFaq === i ? "▲" : "▼"}
                  </span>
                </button>
                {openFaq === i && (
                  <div
                    style={{
                      padding: "0 16px 13px",
                      fontSize: 14,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            borderTop: "0.5px solid var(--color-border-tertiary)",
            paddingTop: "1.25rem",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
            SleepScore · Pas un dispositif médical · Résultats variables selon
            les individus
          </div>
        </div>
      </div>
    );

  if (screen === "quiz") {
    const q = questions[step];
    const pct = Math.round((step / questions.length) * 100);
    const sel = answers[step];
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={() =>
              step === 0 ? setScreen("landing") : setStep((s) => s - 1)
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: "var(--color-text-secondary)",
              padding: 0,
              flexShrink: 0,
            }}
          >
            ← Retour
          </button>
          <div
            style={{
              flex: 1,
              height: 6,
              background: "var(--color-background-secondary)",
              borderRadius: 3,
            }}
          >
            <div
              style={{
                height: 6,
                background: G,
                borderRadius: 3,
                width: pct + "%",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 13,
              color: "var(--color-text-tertiary)",
              flexShrink: 0,
            }}
          >
            {step + 1} / {questions.length}
          </span>
        </div>

        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 18,
            padding: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: GL,
              borderRadius: 20,
              padding: "3px 10px",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 500, color: GD }}>
              Question {step + 1} sur {questions.length}
            </span>
          </div>
          <h2
            style={{
              fontSize: 19,
              fontWeight: 500,
              color: "var(--color-text-primary)",
              marginBottom: q.sub ? "0.4rem" : 0,
              lineHeight: 1.4,
            }}
          >
            {q.q}
          </h2>
          {q.sub && (
            <p
              style={{
                fontSize: 13,
                color: "var(--color-text-secondary)",
                margin: 0,
              }}
            >
              {q.sub}
            </p>
          )}
        </div>

        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 18,
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--color-text-tertiary)",
              marginBottom: "0.75rem",
              paddingLeft: 4,
            }}
          >
            Choisissez une réponse
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.opts.map(([label, val], oi) => (
              <button
                key={oi}
                onClick={() => selectAnswer(step, val)}
                style={{
                  padding: "14px 16px",
                  border: sel === val ? `2px solid ${G}` : "1px solid #d0d0d0",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 14,
                  color: sel === val ? GD : "#222",
                  background: sel === val ? GL : "#f5f5f5",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border:
                      sel === val
                        ? `6px solid ${G}`
                        : "1.5px solid var(--color-border-secondary)",
                    flexShrink: 0,
                    background: "var(--color-background-primary)",
                  }}
                />
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={nextStep}
          disabled={sel === undefined}
          style={{
            background: sel !== undefined ? G : "var(--color-border-tertiary)",
            color: sel !== undefined ? "#fff" : "var(--color-text-tertiary)",
            border: "none",
            borderRadius: 12,
            padding: "14px 0",
            fontSize: 15,
            fontWeight: 500,
            cursor: sel !== undefined ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          {step === questions.length - 1 ? "Voir mon résultat →" : "Suivant →"}
        </button>
      </div>
    );
  }

  if (screen === "result")
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 18,
            padding: "2rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <ScoreArc score={score} color={p.color} bg={p.bg} />
            <div
              style={{
                display: "inline-block",
                background: p.bg,
                color: p.text,
                fontSize: 14,
                fontWeight: 500,
                padding: "5px 16px",
                borderRadius: 20,
                marginTop: 4,
              }}
            >
              {p.name}
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                maxWidth: 340,
                margin: "0.75rem auto 0",
              }}
            >
              {p.desc}
            </p>
          </div>
          <div
            style={{
              borderTop: "0.5px solid var(--color-border-tertiary)",
              paddingTop: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-tertiary)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Vos points d'amélioration
            </div>
            {p.recos.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: p.color,
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      marginBottom: 2,
                    }}
                  >
                    {r.t}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.55,
                    }}
                  >
                    {r.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!paid ? (
          <div style={{ background: GL, borderRadius: 18, padding: "1.75rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: GM,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                Passez à l'action
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: GD,
                  marginBottom: 4,
                }}
              >
                Votre programme 7 jours personnalisé
              </div>
              <p
                style={{ fontSize: 14, color: GM, lineHeight: 1.6, margin: 0 }}
              >
                Adapté à votre profil "{p.name}" — actions concrètes matin,
                journée et soir.
              </p>
            </div>
            <div
              style={{
                background: "var(--color-background-primary)",
                borderRadius: 12,
                padding: "1rem 1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              {[
                "Actions guidées chaque matin, journée et soir",
                "Astuces scientifiques adaptées à votre profil",
                "Progression logique sur 7 jours",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: i < 2 ? 10 : 0,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: G,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 10, color: "#fff" }}>✓</span>
                  </div>
                  <span
                    style={{ fontSize: 14, color: "var(--color-text-primary)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  color: GD,
                  marginBottom: 4,
                }}
              >
                1,99€
              </div>
              <div style={{ fontSize: 12, color: GM, marginBottom: "1rem" }}>
                Paiement unique · Accès immédiat
              </div>
              <Btn
                full
                onClick={() => {
                  localStorage.setItem("sleepscore_profil", profileKey);
                  localStorage.setItem("sleepscore_score", score);
                  window.open(
                    "https://buy.stripe.com/fZu14n06EfiW1etbJy5EY00",
                    "_blank"
                  );
                }}
                style={{ maxWidth: 300 }}
              >
                Débloquer mon programme →
              </Btn>
              <div style={{ fontSize: 12, color: GM, marginTop: 8 }}>
                Moins cher qu'un café · Pour récupérer le sommeil que vous
                méritez
              </div>
            </div>
          </div>
        ) : (
          <Btn full onClick={() => setScreen("plan")}>
            Voir mon programme 7 jours →
          </Btn>
        )}
      </div>
    );

  if (screen === "plan")
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <span
              style={{
                background: p.bg,
                color: p.text,
                fontSize: 12,
                fontWeight: 500,
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              {p.name}
            </span>
            <span
              style={{
                background: "var(--color-background-secondary)",
                color: "var(--color-text-secondary)",
                fontSize: 12,
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              Score {score}/100
            </span>
          </div>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            {doneCount}/7 jours
          </span>
        </div>

        <div
          style={{
            height: 6,
            background: "var(--color-background-secondary)",
            borderRadius: 3,
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              height: 6,
              background: G,
              borderRadius: 3,
              width: Math.round((doneCount / 7) * 100) + "%",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            marginBottom: "1.25rem",
            lineHeight: 1.6,
          }}
        >
          Cochez chaque jour complété. L'effet cumulatif se ressent dès le 4e
          jour.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {plan.map((d, i) => (
            <div
              key={i}
              style={{
                border:
                  openDay === i
                    ? `2px solid ${dayBorder[i]}`
                    : "0.5px solid var(--color-border-tertiary)",
                borderRadius: 14,
                background: checkedDays[i]
                  ? dayColors[i] + "55"
                  : "var(--color-background-primary)",
                overflow: "hidden",
                opacity: checkedDays[i] ? 0.85 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <button
                  onClick={() => toggleDay(i)}
                  style={{
                    width: 52,
                    height: 54,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: checkedDays[i]
                        ? `none`
                        : `1.5px solid var(--color-border-secondary)`,
                      background: checkedDays[i] ? G : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {checkedDays[i] && (
                      <span style={{ fontSize: 11, color: "#fff" }}>✓</span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setOpenDay(openDay === i ? -1 : i)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "13px 14px 13px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: dayColors[i],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: dayText[i],
                      }}
                    >
                      J{i + 1}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                        textDecoration: checkedDays[i]
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {d.theme}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    {openDay === i ? "▲" : "▼"}
                  </span>
                </button>
              </div>
              {openDay === i && (
                <div style={{ padding: "0 16px 16px 52px" }}>
                  <div
                    style={{
                      borderTop: "0.5px solid var(--color-border-tertiary)",
                      paddingTop: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {[
                      ["Matin", d.matin],
                      ["Journée", d.journee],
                      ["Soir", d.soir],
                    ].map(([l, v], j) => (
                      <div key={j} style={{ display: "flex", gap: 10 }}>
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: dayBorder[i],
                            flexShrink: 0,
                            marginTop: 6,
                          }}
                        />
                        <div>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: "var(--color-text-secondary)",
                              marginRight: 6,
                            }}
                          >
                            {l}
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              color: "var(--color-text-primary)",
                              lineHeight: 1.6,
                            }}
                          >
                            {v}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div
                      style={{
                        background: dayColors[i],
                        borderRadius: 10,
                        padding: "10px 14px",
                        marginTop: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: dayText[i],
                        }}
                      >
                        Astuce —{" "}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: dayText[i],
                          lineHeight: 1.5,
                        }}
                      >
                        {d.tip}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {doneCount === 7 && (
          <div
            style={{
              marginTop: "1.5rem",
              background: GL,
              borderRadius: 14,
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 28, color: G, marginBottom: 8 }}>◎</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: GD,
                marginBottom: 4,
              }}
            >
              Programme terminé !
            </div>
            <p
              style={{
                fontSize: 14,
                color: GM,
                marginBottom: "1.25rem",
                lineHeight: 1.6,
              }}
            >
              Refaites le quiz pour mesurer votre progression.
            </p>
            <Btn
              onClick={() => {
                localStorage.removeItem("sleepscore_profil");
                localStorage.removeItem("sleepscore_score");
                setScreen("landing");
                setAnswers({});
                setStep(0);
                setPaid(false);
                setCheckedDays({});
              }}
            >
              Mesurer ma progression →
            </Btn>
          </div>
        )}

        {doneCount < 7 && (
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              onClick={() => {
                localStorage.removeItem("sleepscore_profil");
                localStorage.removeItem("sleepscore_score");
                setScreen("landing");
                setAnswers({});
                setStep(0);
                setPaid(false);
                setCheckedDays({});
              }}
              style={{
                fontSize: 13,
                color: "var(--color-text-tertiary)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Recommencer depuis le début
            </button>
          </div>
        )}
      </div>
    );
}
