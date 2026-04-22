/**
 * SleepScore — App.jsx (redesign premium)
 *
 * Setup :
 *  1. Copier ce fichier dans src/App.jsx
 *  2. Copier App.css dans src/App.css
 *  3. Ajouter dans public/index.html dans <head> :
 *     <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,400;1,500;1,600;1,700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
 *  4. Mettre votre logo dans public/logo.jpg  (ou adapter LOGO_SRC)
 *  5. Remplacer STRIPE_URL par votre lien Stripe réel
 */

import React, { useState, useEffect } from "react";
import "./App.css";

// ── CONFIG ─────────────────────────────────────────────────────────────────
const LOGO_SRC  = "/logo.jpg";          // logo dans /public
const STRIPE_URL = "https://buy.stripe.com/fZu14n06EfiW1etbJy5EY00"; // ← remplacer

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
const C = {
  bg:         "#1A6650",
  bgCard:     "rgba(255,255,255,0.10)",
  bgRaised:   "rgba(255,255,255,0.16)",
  gold:       "#C8892A",
  goldLight:  "#E8B86D",
  goldPale:   "#F5E4C0",
  green:      "#2ABF8A",
  text:       "#F5F0E8",
  textMuted:  "rgba(245,240,232,0.80)",
  textDim:    "rgba(245,240,232,0.50)",
  border:     "rgba(255,255,255,0.20)",
  borderGold: "rgba(220,160,60,0.55)",
};

// ── DATA ───────────────────────────────────────────────────────────────────
const QUESTIONS = [
  { q: "Combien d'heures dormez-vous en moyenne par nuit ?", sub: "Week-ends inclus",
    opts: [["Moins de 5h",10],["5h à 6h",25],["6h à 7h",38],["7h à 8h",50],["Plus de 8h",42]] },
  { q: "Comment qualifieriez-vous votre endormissement ?", sub: "Au moment de vous coucher",
    opts: [["Rapide — moins de 10 min",50],["Normal — 10 à 20 min",35],["Long — 20 à 45 min",20],["Très difficile — plus de 45 min",5]] },
  { q: "Vous réveillez-vous la nuit ?", sub: "",
    opts: [["Jamais ou rarement",50],["1 à 2 fois par semaine",30],["Plusieurs fois par semaine",15],["Toutes les nuits",5]] },
  { q: "Comment vous sentez-vous au réveil ?", sub: "",
    opts: [["Reposé et en forme",50],["Correct, mais pas au top",30],["Fatigué, j'ai du mal à démarrer",15],["Épuisé, comme si je n'avais pas dormi",5]] },
  { q: "Utilisez-vous un écran avant de dormir ?", sub: "Dans l'heure précédant le coucher",
    opts: [["Non, jamais",50],["Rarement",35],["Souvent",15],["Toujours",5]] },
  { q: "Ressentez-vous de la fatigue dans la journée ?", sub: "",
    opts: [["Non, j'ai de l'énergie",50],["Un coup de pompe après le déjeuner",30],["Souvent fatigué, du mal à me concentrer",15],["Épuisé en permanence",5]] },
  { q: "Consommez-vous caféine ou alcool le soir ?", sub: "",
    opts: [["Non, ni l'un ni l'autre",50],["Parfois l'un ou l'autre",30],["Régulièrement",15],["Les deux, souvent",5]] },
  { q: "Comment évaluez-vous votre niveau de stress ?", sub: "",
    opts: [["Faible — je me sens serein",50],["Modéré — quelques tensions",30],["Élevé — souvent sous pression",15],["Très élevé — anxiété fréquente",5]] },
];

const PROFILES = {
  high: {
    name: "Bon dormeur", accent: C.green,
    accentLight: "rgba(42,191,138,0.18)", textAccent: "#7ED4B5",
    desc: "Votre sommeil est globalement sain. Quelques ajustements ciblés peuvent encore l'optimiser.",
    recos: [
      { t: "Maintenez vos horaires",      d: "Votre régularité est votre meilleur atout. Couchez-vous et levez-vous aux mêmes heures." },
      { t: "Optimisez la récupération",   d: "10 min de stretching léger avant le coucher consolide votre sommeil profond." },
      { t: "Anticipez le stress",         d: "Même avec un bon sommeil de base, les pics de stress peuvent tout dérégler." },
    ],
  },
  mid: {
    name: "Dormeur instable", accent: C.gold,
    accentLight: "rgba(200,137,42,0.18)", textAccent: C.goldLight,
    desc: "Votre sommeil est irrégulier. Des habitudes simples et ciblées peuvent transformer votre repos.",
    recos: [
      { t: "Fixez une heure de coucher fixe", d: "L'irrégularité est votre ennemi principal. Tenez une heure fixe 7j/7 pendant 2 semaines." },
      { t: "Coupez les écrans à 21h30",       d: "La lumière bleue retarde votre mélatonine de 1 à 2h." },
      { t: "Limitez la caféine après 14h",    d: "Un café à 16h, c'est encore de la caféine à minuit." },
    ],
  },
  low: {
    name: "Épuisé chronique", accent: "#C05030",
    accentLight: "rgba(192,80,48,0.18)", textAccent: "#E09070",
    desc: "Votre fatigue est profonde. Un programme structuré est indispensable pour récupérer durablement.",
    recos: [
      { t: "Consultez un médecin",                  d: "Un score aussi bas mérite une attention sérieuse. Une apnée du sommeil est à écarter." },
      { t: "Instaurez un rituel de décompression",  d: "30 min avant de dormir : lumière tamisée, 18°C, pas d'écran." },
      { t: "Supprimez alcool et caféine le soir",   d: "Ces deux substances sabotent le sommeil profond. Résultats visibles en 5 jours." },
    ],
  },
};

const DAY_COLORS = [
  { acc: "#1D9E75", label: "#7ED4B5" },
  { acc: "#3A7FBA", label: "#8DC4E8" },
  { acc: C.gold,   label: C.goldLight },
  { acc: "#7B5EA7", label: "#BBA0D8" },
  { acc: "#5A9E35", label: "#9ED475" },
  { acc: "#C05030", label: "#E09070" },
  { acc: "#BA4070", label: "#E890B0" },
];

const PLANS = {
  high: [
    { theme: "Ancrer la régularité",       matin: "Notez vos heures de lever des 7 derniers jours — identifiez les écarts.",     journee: "Planifiez vos horaires de sommeil dans votre agenda comme un rendez-vous.",    soir: "Éteignez les écrans 30 min avant le coucher et lisez 10 min.",           tip: "La régularité du lever est plus puissante que l'heure du coucher." },
    { theme: "Optimiser l'environnement",  matin: "Ouvrez les volets dès le réveil — 5 min de lumière naturelle synchronise l'horloge.", journee: "Vérifiez la température de votre chambre : l'idéal est 17–19°C.",       soir: "Investissez dans des rideaux occultants.",                              tip: "Un environnement sombre et frais améliore le sommeil profond de 20%." },
    { theme: "Affiner l'alimentation",     matin: "Repoussez le premier café à 90 min après le réveil.",                         journee: "Dînez léger, au moins 2h avant de dormir.",                               soir: "Une tisane de camomille ou mélisse favorise la détente.",               tip: "L'alcool fragmente le sommeil profond même en petite quantité." },
    { theme: "Gérer le stress résiduel",   matin: "5 min de respiration profonde avant de se lever.",                             journee: "Identifiez votre principale source de tension et planifiez-la pour demain.", soir: "Écrivez 3 choses positives de la journée.",                             tip: "Un journal de gratitude réduit l'activité du cortex préfrontal avant le sommeil." },
    { theme: "Consolider le sommeil profond", matin: "Notez votre énergie de 0 à 10 — comparez avec J1.",                        journee: "20 min de marche ou activité légère avant 18h.",                          soir: "Stretching 10 min : cou, épaules, dos.",                               tip: "L'exercice régulier augmente la proportion de sommeil lent profond." },
    { theme: "Prévenir les régressions",   matin: "Identifiez les situations qui perturbent votre sommeil.",                     journee: "Préparez un plan B : heure adaptée, sieste courte.",                      soir: "Répétez votre rituel du soir — même le week-end.",                      tip: "La constance du week-end évite le 'social jet lag' du lundi matin." },
    { theme: "Ancrer pour la durée",       matin: "Évaluez votre score de forme — la progression devrait être visible.",         journee: "Choisissez 2 habitudes clés à conserver définitivement.",                soir: "Célébrez sans écran : musique, lecture, ou tranquillité.",             tip: "21 jours pour une habitude — vous avez fait le plus dur." },
  ],
  mid: [
    { theme: "Poser les bases",                    matin: "Levez-vous à heure fixe — choisissez une heure et tenez-la.",              journee: "Notez vos habitudes : coucher, réveil, caféine, écrans.",                 soir: "Éteignez tous les écrans à 21h30.",                                     tip: "L'heure de lever fixe est plus puissante que l'heure de coucher." },
    { theme: "Apprivoiser la caféine",             matin: "Repoussez le premier café à 90 min après le réveil.",                      journee: "Dernier café ou thé avant 14h strictement.",                              soir: "Chambre à 17–19°C, rideaux fermés, téléphone hors de la chambre.",     tip: "La caféine a une demi-vie de 6h — un café à 15h reste actif à minuit." },
    { theme: "Créer un rituel de décompression",   matin: "Exposez-vous à la lumière naturelle 5 min dès le lever.",                  journee: "Arrêtez emails et réseaux à 20h.",                                        soir: "20 min de rituel : douche tiède, lecture papier, ou étirements.",      tip: "Un rituel répété entraîne le cerveau à associer ces gestes à l'endormissement." },
    { theme: "Apprivoiser les réveils nocturnes",  matin: "Si vous vous êtes réveillé la nuit, ne consultez pas l'heure.",            journee: "Évitez la sieste longue (max 20 min avant 15h).",                         soir: "Respiration 4-7-8 : inspirez 4s, bloquez 7s, expirez 8s.",            tip: "Se réveiller 1–2 fois par nuit est normal — c'est l'anxiété qui perturbe." },
    { theme: "Optimiser l'alimentation du soir",   matin: "Évaluez votre énergie de 0 à 10.",                                         journee: "Dînez au moins 2h avant de dormir, repas léger.",                         soir: "Préparez mentalement demain en 5 min pour vider votre tête.",          tip: "L'alcool aide à s'endormir mais fragmente le sommeil profond." },
    { theme: "Consolider les acquis",              matin: "Résistez à la grasse matinée — votre corps s'adapte.",                      journee: "20 min de marche avant 18h.",                                             soir: "Répétez votre rituel de J3. Notez votre progression.",                 tip: "La régularité prime sur la perfection." },
    { theme: "Ancrer les habitudes",               matin: "Notez votre score de forme sur 10.",                                        journee: "Identifiez les 2 habitudes ayant eu le plus d'impact.",                   soir: "Célébrez sans écran : musique douce, lecture, tranquillité.",         tip: "Il faut 21 jours pour ancrer une habitude — vous avez fait le plus dur." },
  ],
  low: [
    { theme: "Évaluer et accepter",           matin: "Notez votre niveau d'énergie de 0 à 10 — sans jugement.",                journee: "Consultez votre médecin — une apnée du sommeil est à écarter.",        soir: "Couchez-vous à la même heure. Choisissez une heure réaliste.",        tip: "Accepter sa fatigue sans culpabilité est la première étape." },
    { theme: "Supprimer les saboteurs",       matin: "Repoussez le premier café à 90 min après le réveil.",                    journee: "Zéro alcool et zéro caféine après 14h cette semaine.",                soir: "Éteignez tous les écrans à 21h. Lumière tamisée uniquement.",        tip: "Ces deux changements peuvent améliorer le sommeil profond en 3–5 jours." },
    { theme: "Créer un refuge",               matin: "Ouvrez les volets 5 min dès le lever.",                                   journee: "Bouchons d'oreilles ou masque de nuit si votre environnement est perturbant.", soir: "Chambre à 17–19°C, sombre, téléphone dans une autre pièce.", tip: "L'environnement de sommeil agit comme un signal puissant au cerveau." },
    { theme: "Instaurer un rituel anti-stress", matin: "5 min de respiration lente avant de regarder le téléphone.",           journee: "Identifiez votre principale source de stress et planifiez-la.",        soir: "Bain chaud ou douche tiède 1h avant le coucher.",                    tip: "La respiration 4-7-8 active le système parasympathique en moins de 2 min." },
    { theme: "Nourrir autrement",             matin: "Notez votre énergie — une amélioration devrait être perceptible.",       journee: "Dînez léger et tôt — au moins 2h avant le coucher.",                  soir: "Tisane de camomille ou valériane. Pas d'écran, pas d'actualités.",   tip: "Un repas lourd perturbe l'endormissement en élevant la température corporelle." },
    { theme: "Bouger doucement",              matin: "10 min de marche matinale — même courte, elle améliore le sommeil.",     journee: "Évitez tout effort intense après 18h.",                               soir: "Étirements doux 10 min — nuque, épaules, bas du dos.",               tip: "L'exercice modéré est l'un des meilleurs traitements non médicamenteux." },
    { theme: "Mesurer et projeter",           matin: "Évaluez votre score de forme — même +1 point est un succès.",            journee: "Choisissez 3 habitudes à conserver absolument.",                       soir: "Écrivez une intention pour les 7 prochains jours.",                  tip: "La fatigue chronique se construit sur des mois — la guérison aussi." },
  ],
};

const REVIEWS = [
  { name: "Sophie M.",  initial: "S", before: "Dormeur instable",  txt: "Je dors 7h d'affilée pour la première fois depuis des années." },
  { name: "Thomas R.",  initial: "T", before: "Épuisé chronique",  txt: "Le plan m'a redonné une énergie que j'avais complètement oubliée." },
  { name: "Camille D.", initial: "C", before: "Bon dormeur",        txt: "J'ai affiné mes habitudes, mon réveil est devenu un plaisir." },
];

const FAQS = [
  { q: "Est-ce vraiment personnalisé ?",       a: "Oui — votre plan est généré selon vos réponses. Chaque profil reçoit un programme distinct." },
  { q: "Et si je ne vois pas de résultat ?",   a: "La majorité observe une amélioration dès le 4e jour. Si ce n'est pas le cas, consultez votre médecin." },
  { q: "C'est quoi exactement pour 1,99€ ?",   a: "Le quiz et le score sont gratuits. Vous payez uniquement pour débloquer votre plan 7 jours complet." },
  { q: "Sans abonnement ?",                    a: "Oui, paiement unique. Aucun renouvellement, aucune surprise." },
];

const LOADING_STEPS = [
  "Analyse de vos réponses…",
  "Identification de votre profil…",
  "Calcul de votre score…",
  "Génération de votre programme…",
];

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────

function GoldBtn({ children, onClick, disabled = false, full = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: 15, fontWeight: 500, borderRadius: 14,
        padding: "14px 32px", border: "none", lineHeight: 1,
        letterSpacing: "0.01em", cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto",
        background: disabled
          ? "rgba(255,255,255,0.08)"
          : `linear-gradient(135deg, ${C.gold} 0%, #A86E1A 100%)`,
        color: disabled ? "rgba(240,234,216,0.3)" : "#0A1F14",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1.5rem", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children, style = {} }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textDim, ...style }}>
      {children}
    </div>
  );
}

function Logo({ onReset }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={LOGO_SRC} alt="SleepScore" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.borderGold}` }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: C.goldPale, letterSpacing: "0.05em" }}>
          SLEEP<span style={{ color: C.green }}>SCORE</span>
        </span>
      </div>

    </div>
  );
}

function ScoreArc({ score, accent }) {
  const r = 56, cx = 70, cy = 70;
  const rad = (a) => ((a - 90) * Math.PI) / 180;
  const start = -130, sweep = 260;
  const angle = (score / 100) * sweep;
  const x1 = cx + r * Math.cos(rad(start)), y1 = cy + r * Math.sin(rad(start));
  const x2 = cx + r * Math.cos(rad(start + sweep)), y2 = cy + r * Math.sin(rad(start + sweep));
  const ax = cx + r * Math.cos(rad(start + angle)), ay = cy + r * Math.sin(rad(start + angle));
  const lg = angle > 180 ? 1 : 0;
  return (
    <svg width="140" height="120" viewBox="0 0 140 120">
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" strokeLinecap="round" />
      {score > 0 && <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${ax} ${ay}`} fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" />}
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="30" fontWeight="400" fontFamily="'Playfair Display',serif" fill={C.goldPale}>{score}</text>
      <text x={cx} y={cy + 24} textAnchor="middle" fontSize="11" fill={C.textDim}>/100</text>
    </svg>
  );
}

function ProgressDots({ total, current }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 3, flex: 1, borderRadius: 2,
          background: i < current ? C.gold : i === current ? "rgba(200,137,42,0.4)" : "rgba(255,255,255,0.08)",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
}

// ── LANDING ────────────────────────────────────────────────────────────────

function Landing({ onStart, onReset }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="ss-screen" style={{ padding: "0 1.25rem 3rem" }}>
      {/* Nav */}
      <div style={{ padding: "1.5rem 0 2rem" }}>
        <Logo onReset={onReset} />
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "1rem 0 3rem" }}>
        <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, marginBottom: "1.25rem" }}>
          Quiz de sommeil gratuit
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 42, fontWeight: 600, lineHeight: 1.15, color: C.goldPale, marginBottom: "1.5rem" }}>
          Et si vous dormiez<br />enfin bien&nbsp;?
        </h1>
        <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75, maxWidth: 340, margin: "0 auto 2.5rem" }}>
          Découvrez votre profil de sommeil en 3 minutes et recevez un plan personnalisé pour retrouver un repos profond.
        </p>
        <GoldBtn onClick={onStart}>Faire le quiz gratuit →</GoldBtn>
        <div style={{ marginTop: 12, fontSize: 12, color: C.textDim }}>Plan 7 jours · 1,99€ · Sans abonnement</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: "2.5rem" }}>
        {[["3 min", "Quiz rapide"], ["1 score", "Personnalisé"], ["7 jours", "De programme"]].map(([n, l]) => (
          <div key={n} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.125rem 0.75rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 500, color: C.goldLight, marginBottom: 4 }}>{n}</div>
            <div style={{ fontSize: 11, color: C.textDim }}>{l}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ marginBottom: "2.5rem" }}>
        <SectionLabel style={{ marginBottom: "1rem" }}>Comment ça marche</SectionLabel>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {[["1", "Faites le quiz", "8 questions sur vos habitudes", C.green],
            ["2", "Obtenez votre score", "Profil précis, points faibles identifiés", C.gold],
            ["3", "Suivez votre plan", "7 jours d'actions concrètes", "#7B5EA7"]
          ].map(([n, t, d, c], i, arr) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "15px 18px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{n}</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{t}</div>
                <div style={{ fontSize: 12, color: C.textDim }}>{d}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Reviews */}
      <div style={{ marginBottom: "2.5rem" }}>
        <SectionLabel style={{ marginBottom: "1rem" }}>Ils ont testé</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {REVIEWS.map((r, i) => (
            <Card key={i} style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
                    {r.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: C.textDim }}>Profil : {r.before}</div>
                  </div>
                </div>
                <span style={{ color: C.gold, fontSize: 12 }}>★★★★★</span>
              </div>
              <p style={{ fontSize: 13, color: C.textMuted, fontStyle: "italic", lineHeight: 1.65, margin: 0 }}>"{r.txt}"</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Price block */}
      <div style={{ background: "linear-gradient(135deg,#0F3526,#0A2519)", border: `1px solid ${C.borderGold}`, borderRadius: 22, padding: "2rem", textAlign: "center", marginBottom: "2.5rem" }}>
        <SectionLabel style={{ color: C.gold, marginBottom: 8 }}>Offre unique</SectionLabel>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, fontWeight: 500, color: C.goldPale, lineHeight: 1 }}>1,99€</div>
        <div style={{ fontSize: 12, color: C.textDim, margin: "8px 0 1.5rem" }}>Paiement unique · Accès immédiat · Sans abonnement</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, maxWidth: 280, margin: "0 auto 1.5rem", textAlign: "left" }}>
          {["Quiz complet + score personnalisé", "Identification de votre profil", "Plan 7 jours détaillé", "Conseils adaptés à vos habitudes"].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: "#fff", fontWeight: 600 }}>✓</span>
              </div>
              <span style={{ fontSize: 13, color: C.textMuted }}>{item}</span>
            </div>
          ))}
        </div>
        <GoldBtn onClick={onStart} full style={{ maxWidth: 300 }}>Commencer maintenant →</GoldBtn>
        <div style={{ fontSize: 11, color: C.textDim, marginTop: 10 }}>Moins cher qu'un café · Pour le sommeil que vous méritez</div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: "2rem" }}>
        <SectionLabel style={{ marginBottom: "1rem" }}>Questions fréquentes</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{f.q}</span>
                <span style={{ fontSize: 11, color: C.textDim, flexShrink: 0 }}>{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 16px 13px", fontSize: 13, color: C.textMuted, lineHeight: 1.65 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", borderTop: `1px solid ${C.border}`, paddingTop: "1.25rem" }}>
        <div style={{ fontSize: 11, color: C.textDim }}>SleepScore · Pas un dispositif médical · Résultats variables selon les individus</div>
      </div>
    </div>
  );
}

// ── QUIZ ───────────────────────────────────────────────────────────────────

function Quiz({ step, answers, onSelect, onNext, onBack }) {
  const q = QUESTIONS[step];
  const sel = answers[step];
  return (
    <div className="ss-screen" style={{ padding: "1.5rem 1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 13, padding: 0, flexShrink: 0 }}>← Retour</button>
        <div style={{ flex: 1 }}><ProgressDots total={QUESTIONS.length} current={step} /></div>
        <span style={{ fontSize: 12, color: C.textDim, flexShrink: 0 }}>{step + 1}/{QUESTIONS.length}</span>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
          Question {step + 1}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 24, fontWeight: 500, color: C.goldPale, lineHeight: 1.35, marginBottom: q.sub ? "0.5rem" : 0 }}>
          {q.q}
        </h2>
        {q.sub && <p style={{ fontSize: 13, color: C.textDim }}>{q.sub}</p>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.25rem" }}>
        {q.opts.map(([label, val], i) => {
          const active = sel === val;
          return (
            <button key={i} onClick={() => onSelect(step, val)} style={{
              padding: "14px 16px", borderRadius: 14, cursor: "pointer", fontSize: 14,
              color: active ? C.goldPale : C.textMuted,
              background: active ? "rgba(200,137,42,0.12)" : C.bgCard,
              border: active ? `1.5px solid ${C.gold}` : `1px solid ${C.border}`,
              textAlign: "left", display: "flex", alignItems: "center", gap: 14,
              transition: "all 0.15s",
            }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: active ? `6px solid ${C.gold}` : "1.5px solid rgba(255,255,255,0.3)", transition: "border 0.15s" }} />
              {label}
            </button>
          );
        })}
      </div>
      <GoldBtn onClick={onNext} disabled={sel === undefined} full>
        {step === QUESTIONS.length - 1 ? "Voir mon résultat →" : "Suivant →"}
      </GoldBtn>
    </div>
  );
}

// ── LOADER ─────────────────────────────────────────────────────────────────

function Loader({ onDone }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx < LOADING_STEPS.length - 1) {
      const t = setTimeout(() => setIdx((i) => i + 1), 650);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [idx, onDone]);
  const pct = Math.round(((idx + 1) / LOADING_STEPS.length) * 100);
  return (
    <div className="ss-screen" style={{ maxWidth: 360, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(200,137,42,0.1)", border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontSize: 32 }}>◑</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 20, color: C.goldPale, marginBottom: "0.5rem" }}>{LOADING_STEPS[idx]}</div>
      <div style={{ fontSize: 13, color: C.textDim, marginBottom: "2rem" }}>Quelques secondes…</div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${C.green},${C.gold})`, borderRadius: 2, width: pct + "%", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ── RESULT ─────────────────────────────────────────────────────────────────

function Result({ score, profileKey, onUnlock }) {
  const p = PROFILES[profileKey];
  return (
    <div className="ss-screen" style={{ padding: "1.5rem 1.25rem" }}>
      <Card style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <ScoreArc score={score} accent={p.accent} />
          <div style={{ display: "inline-block", background: p.accent, color: "#fff", fontSize: 13, fontWeight: 500, padding: "5px 18px", borderRadius: 20, marginTop: 4 }}>{p.name}</div>
        </div>
        <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 16, color: C.textMuted, lineHeight: 1.65, maxWidth: 320, margin: "0 auto 1.25rem" }}>{p.desc}</p>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.25rem", textAlign: "left" }}>
          <SectionLabel style={{ marginBottom: "1rem" }}>Vos points d'amélioration</SectionLabel>
          {p.recos.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent, flexShrink: 0, marginTop: 6 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 2 }}>{r.t}</div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>{r.d}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Paywall */}
      <div style={{ background: "linear-gradient(135deg,#0F3526,#0A2519)", border: `1px solid ${C.borderGold}`, borderRadius: 22, padding: "1.75rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <SectionLabel style={{ color: C.gold, marginBottom: 8 }}>Passez à l'action</SectionLabel>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 22, color: C.goldPale, marginBottom: 6 }}>Votre programme 7 jours personnalisé</div>
          <p style={{ fontSize: 13, color: C.textDim, lineHeight: 1.65, margin: 0 }}>Adapté à votre profil "{p.name}" — actions concrètes matin, journée et soir.</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "1rem 1.125rem", marginBottom: "1.125rem", border: `1px solid ${C.border}` }}>
          {["Actions guidées chaque matin, journée et soir", "Astuces scientifiques adaptées à votre profil", "Progression logique sur 7 jours"].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: i < 2 ? 9 : 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 9, color: "#fff", fontWeight: 600 }}>✓</span>
              </div>
              <span style={{ fontSize: 13, color: C.textMuted }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 500, color: C.goldPale, lineHeight: 1, marginBottom: 4 }}>1,99€</div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: "1rem" }}>Paiement unique · Accès immédiat</div>
          <GoldBtn full onClick={onUnlock} style={{ maxWidth: 300 }}>Débloquer mon programme →</GoldBtn>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 8 }}>Moins cher qu'un café</div>
        </div>
      </div>
    </div>
  );
}

// ── PLAN ───────────────────────────────────────────────────────────────────

function Plan({ score, profileKey, onReset }) {
  const p = PROFILES[profileKey];
  const plan = PLANS[profileKey];
  const [openDay, setOpenDay] = useState(0);
  const [checked, setChecked] = useState({});
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="ss-screen" style={{ padding: "1.5rem 1.25rem 3rem" }}>
      <div style={{ marginBottom: "1.25rem" }}><Logo onReset={onReset} /></div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: p.accent, color: "#fff", fontSize: 12, fontWeight: 500, padding: "4px 14px", borderRadius: 20 }}>{p.name}</div>
          <div style={{ background: "rgba(255,255,255,0.08)", color: C.textDim, fontSize: 12, padding: "4px 14px", borderRadius: 20 }}>Score {score}/100</div>
        </div>
        <span style={{ fontSize: 12, color: C.textDim }}>{doneCount}/7 jours</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, marginBottom: "1rem", overflow: "hidden" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,${C.green},${C.gold})`, width: Math.round((doneCount / 7) * 100) + "%", transition: "width 0.4s ease", borderRadius: 2 }} />
      </div>
      <p style={{ fontSize: 13, color: C.textDim, marginBottom: "1.25rem", lineHeight: 1.65 }}>
        Cochez chaque jour complété. L'effet cumulatif se ressent dès le 4e jour.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plan.map((d, i) => {
          const dc = DAY_COLORS[i];
          const isOpen = openDay === i;
          const isDone = !!checked[i];
          return (
            <div key={i} style={{ background: C.bgCard, border: isOpen ? `2px solid ${dc.acc}` : `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s" }}>
              <button onClick={() => setOpenDay(isOpen ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: dc.acc, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{d.theme}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: C.textDim }}>{isOpen ? "▲" : "▼"}</span>
                  <div
                    onClick={(e) => { e.stopPropagation(); setChecked((prev) => ({ ...prev, [i]: !prev[i] })); }}
                    style={{ width: 22, height: 22, borderRadius: "50%", background: isDone ? C.green : "rgba(255,255,255,0.22)", border: isDone ? "none" : "1.5px solid rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  >
                    {isDone && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
                  </div>
                </div>
              </button>
              {isOpen && (
                <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.border}` }}>
                  {[["Matin", d.matin], ["Journée", d.journee], ["Soir", d.soir]].map(([lbl, txt]) => (
                    <div key={lbl} style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: dc.label, marginBottom: 4 }}>{lbl}</div>
                      <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>{txt}</div>
                    </div>
                  ))}
                  <div style={{ background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 10, padding: "10px 12px", marginTop: 12 }}>
                    <span style={{ fontSize: 12, color: dc.label, lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 500 }}>◑ </span>{d.tip}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
     </div>
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "rgba(240,234,216,0.4)", marginBottom: 8 }}>
          💡 Pensez à noter ou prendre en screenshot votre plan avant de recommencer.
        </div>
        <button onClick={onReset} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, padding: "8px 20px", fontSize: 13, color: "rgba(240,234,216,0.5)", cursor: "pointer" }}>
          Refaire le quiz
        </button>
      </div>
    </div>
    );
}

// ── APP (MAIN) ──────────────────────────────────────────────────────────────

export default function App() {
  const savedProfile = localStorage.getItem("sleepscore_profil");
  const savedScore   = parseInt(localStorage.getItem("sleepscore_score")) || 0;

  const [screen,     setScreen]     = useState(savedProfile ? "plan" : "landing");
  const [step,       setStep]       = useState(0);
  const [answers,    setAnswers]    = useState({});
  const [score,      setScore]      = useState(savedScore);
  const [profileKey, setProfileKey] = useState(savedProfile || "mid");

  function go(s) { setScreen(s); window.scrollTo(0, 0); }

  function reset() {
    localStorage.removeItem("sleepscore_profil");
    localStorage.removeItem("sleepscore_score");
    setAnswers({}); setStep(0); go("landing");
  }

  function startQuiz() { setAnswers({}); setStep(0); go("quiz"); }

  function selectAnswer(qi, val) { setAnswers((p) => ({ ...p, [qi]: val })); }

  function nextStep() {
    if (step < QUESTIONS.length - 1) { setStep((s) => s + 1); window.scrollTo(0, 0); }
    else {
      const raw = Object.values(answers).reduce((a, b) => a + b, 0);
      const s   = Math.round((raw / (8 * 50)) * 100);
      const pk  = s >= 75 ? "high" : s >= 50 ? "mid" : "low";
      setScore(s); setProfileKey(pk); go("loading");
    }
  }

  function backStep() { step === 0 ? go("landing") : (setStep((s) => s - 1), window.scrollTo(0, 0)); }

  function onLoaderDone() {
    localStorage.setItem("sleepscore_profil", profileKey);
    localStorage.setItem("sleepscore_score",  score);
    go("result");
  }

  function onUnlock() {
    localStorage.setItem("sleepscore_profil", profileKey);
    localStorage.setItem("sleepscore_score",  score);
    window.open(STRIPE_URL, "_blank");
    go("plan");
  }

  return (
    <div className="ss-shell">
      {screen === "landing"  && <Landing  onStart={startQuiz} onReset={reset} />}
      {screen === "quiz"     && <Quiz     step={step} answers={answers} onSelect={selectAnswer} onNext={nextStep} onBack={backStep} />}
      {screen === "loading"  && <Loader   onDone={onLoaderDone} />}
      {screen === "result"   && <Result   score={score} profileKey={profileKey} onUnlock={onUnlock} />}
      {screen === "plan"     && <Plan     score={score} profileKey={profileKey} onReset={reset} />}
    </div>
  );
}
