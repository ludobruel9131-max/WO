import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  BarChart3,
  User,
  Calendar,
  Salad,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ---------- Utils ---------- */
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, def) => {
  const x = localStorage.getItem(k);
  return x ? JSON.parse(x) : def;
};
const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

/* ---------- Données programmes (hebdo) ---------- */
const programme = {
  Lundi: {
    type: "Push (Pecs/Épaules/Triceps)",
    duration: 45,
    img: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1400&auto=format&fit=crop",
    exos: [
      { n: "Développé couché barre", s: 4, r: "6–8" },
      { n: "Développé militaire haltères", s: 4, r: "8–10" },
      { n: "Dips lestés", s: 3, r: "10–12" },
      { n: "Écarté poulie", s: 3, r: "12–15" },
    ],
  },
  Mardi: {
    type: "Pull (Dos/Biceps)",
    duration: 40,
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop",
    exos: [
      { n: "Tractions pronation", s: 4, r: "max" },
      { n: "Rowing barre", s: 4, r: "8–10" },
      { n: "Tirage vertical", s: 3, r: "10–12" },
      { n: "Curl incliné", s: 3, r: "12" },
    ],
  },
  Mercredi: {
    type: "Jambes + Core",
    duration: 50,
    img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1400&auto=format&fit=crop",
    exos: [
      { n: "Squat barre", s: 5, r: "5–6" },
      { n: "Fentes haltères", s: 3, r: "10 / jambe" },
      { n: "Soulevé de terre JT", s: 4, r: "8–10" },
      { n: "Gainage planche", s: 3, r: "60s" },
    ],
  },
  Jeudi: {
    type: "HIIT / Cardio",
    duration: 35,
    img: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1400&auto=format&fit=crop",
    exos: [
      { n: "Sprint 30s / Marche 90s", s: 10, r: "" },
      { n: "Burpees", s: 5, r: "15" },
      { n: "Mountain climbers", s: 4, r: "40s" },
    ],
  },
  Vendredi: {
    type: "Full Body Lourds",
    duration: 55,
    img: "https://images.unsplash.com/photo-1434656742621-5c4a7d73d0e7?q=80&w=1400&auto=format&fit=crop",
    exos: [
      { n: "Soulevé de terre", s: 5, r: "5" },
      { n: "Développé couché", s: 5, r: "5" },
      { n: "Squat", s: 5, r: "5" },
    ],
  },
  Samedi: {
    type: "Jambes lourdes + Core",
    duration: 50,
    img: "https://images.unsplash.com/photo-1546817372-628669db465b?q=80&w=1400&auto=format&fit=crop",
    exos: [
      { n: "Squat avant", s: 5, r: "6–8" },
      { n: "Hip thrust barre", s: 4, r: "8–10" },
      { n: "Soulevé de terre sumo", s: 4, r: "6–8" },
      { n: "Ab wheel", s: 3, r: "15" },
    ],
  },
  Dimanche: {
    type: "Repos actif",
    duration: 30,
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1400&auto=format&fit=crop",
    exos: [
      { n: "Marche rapide", s: 1, r: "30 min" },
      { n: "Étirements/yoga", s: 1, r: "15 min" },
      { n: "Gainage léger", s: 2, r: "30s" },
    ],
  },
};

/* ---------- Nutrition (saisons) ---------- */
const menus = {
  ete: [
    { t: "Poulet + quinoa + courgettes", kcal: 650 },
    { t: "Saumon + salade tomates/avocat + riz", kcal: 700 },
    { t: "Omelette + légumes d’été + pain complet", kcal: 550 },
  ],
  hiver: [
    { t: "Ragoût lentilles + patate douce", kcal: 600 },
    { t: "Poulet rôti + purée brocoli + PDT", kcal: 700 },
    { t: "Chili con carne + riz complet", kcal: 750 },
  ],
};

/* ---------- Données par défaut (progression) ---------- */
const defaultWeight = [
  { w: "S1", kg: 78 },
  { w: "S2", kg: 77.5 },
  { w: "S3", kg: 77 },
  { w: "S4", kg: 76.7 },
];
const defaultStrength = [
  { w: "S1", squat: 80, bench: 70, dead: 100 },
  { w: "S2", squat: 85, bench: 72, dead: 105 },
  { w: "S3", squat: 87, bench: 74, dead: 110 },
  { w: "S4", squat: 90, bench: 76, dead: 115 },
];

const [tab, setTab] = useState("plan");

// 'today' est créé une seule fois au montage, donc il reste stable
const today = useMemo(() => new Date(), []);

// Nom du jour basé sur 'today' (stable car 'today' ne change pas)
const dayName = useMemo(() => jours[today.getDay()], [today]);

// Initialisation du jour sélectionné sans dépendre d'un hook
const [selectedDay, setSelectedDay] = useState(() => {
  const d = jours[today.getDay()];
  return d === "Dimanche" ? "Lundi" : d;
});

  const [profile, setProfile] = useState(() =>
    load("mt_profile", { poids: "", taille: "", age: "", sexe: "homme", objectif: "maintenance" })
  );

  const [weight, setWeight] = useState(() => load("mt_weight", defaultWeight));
  const [strength, setStrength] = useState(() => load("mt_strength", defaultStrength));

  const [newKg, setNewKg] = useState("");
  const [newSquat, setNewSquat] = useState("");
  const [newBench, setNewBench] = useState("");
  const [newDead, setNewDead] = useState("");

  useEffect(() => save("mt_profile", profile), [profile]);
  useEffect(() => save("mt_weight", weight), [weight]);
  useEffect(() => save("mt_strength", strength), [strength]);

  // macros (Mifflin-St Jeor simplifié)
  const macros = useMemo(() => {
    const { poids, taille, age, sexe, objectif } = profile;
    if (!poids || !taille || !age) return null;
    let bmr =
      10 * Number(poids) + 6.25 * Number(taille) - 5 * Number(age) + (sexe === "femme" ? -161 : 5);
    const tdee = Math.round(bmr * 1.5);
    let cible = tdee;
    if (objectif === "perte") cible -= 300;
    if (objectif === "prise") cible += 300;
    return {
      kcal: cible,
      prot: Math.round(Number(poids) * 2.0),
      gluc: Math.round((cible * 0.5) / 4),
      lip: Math.round((cible * 0.25) / 9),
    };
  }, [profile]);

  // ajout progression
  const addProgress = () => {
    const nextW = `S${weight.length + 1}`;
    const wArr = [...weight];
    const sArr = [...strength];

    if (newKg) wArr.push({ w: nextW, kg: Number(newKg) });
    if (newSquat || newBench || newDead)
      sArr.push({
        w: nextW,
        squat: newSquat ? Number(newSquat) : sArr.at(-1)?.squat ?? 0,
        bench: newBench ? Number(newBench) : sArr.at(-1)?.bench ?? 0,
        dead: newDead ? Number(newDead) : sArr.at(-1)?.dead ?? 0,
      });

    setWeight(wArr);
    setStrength(sArr);
    setNewKg("");
    setNewSquat("");
    setNewBench("");
    setNewDead("");
  };

  const saison = useMemo(() => {
    const m = today.getMonth() + 1;
    return [4,5,6,7,8,9].includes(m) ? "ete" : "hiver";
  }, [today]);

  const daysOrder = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

  return (
    <div className="min-h-screen flex bg-savane-bg text-white">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between bg-savane-card border-r border-savane-line p-5">
        <div>
          <div className="hero-bg rounded-xl2 p-5 border border-savane-line shadow-soft">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?q=80&w=200&auto=format&fit=crop"
                alt="Lion"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-lg font-bold text-savane-accent">Muscle Tracker</h1>
                <p className="text-sm text-savane-textDim">Savane / Lion mode</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            <button
              onClick={() => setTab("plan")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${
                tab === "plan" ? "bg-savane-accent text-black" : "hover:bg-savane-line"
              }`}
            >
              <Calendar size={18} /> Plan
            </button>
            <button
              onClick={() => setTab("nutrition")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${
                tab === "nutrition" ? "bg-savane-accent text-black" : "hover:bg-savane-line"
              }`}
            >
              <Salad size={18} /> Nutrition
            </button>
            <button
              onClick={() => setTab("progress")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${
                tab === "progress" ? "bg-savane-accent text-black" : "hover:bg-savane-line"
              }`}
            >
              <BarChart3 size={18} /> Progression
            </button>
            <button
              onClick={() => setTab("profil")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${
                tab === "profil" ? "bg-savane-accent text-black" : "hover:bg-savane-line"
              }`}
            >
              <User size={18} /> Profil
            </button>
          </nav>
        </div>

        <div className="text-xs text-savane-textDim">
          <p>🦁 Force et constance.</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-5 md:p-8 space-y-8">
        {/* Header bandeau */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-bg rounded-xl2 p-6 border border-savane-line shadow-soft"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold">
                Programme de la semaine
              </h2>
              <p className="text-savane-textDim">Aujourd’hui&nbsp;: <span className="text-savane-accent font-semibold">{dayName === "Dimanche" ? "Repos actif" : selectedDay}</span></p>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge flex items-center gap-1"><Clock size={14}/> Durée cible ~40–55 min</div>
              <div className="badge flex items-center gap-1"><Dumbbell size={14}/> Muscu & Performance</div>
              <div className="badge flex items-center gap-1"><Flame size={14}/> HIIT & Core</div>
            </div>
          </div>
        </motion.div>

        {/* PLAN */}
        {tab === "plan" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Calendrier hebdo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {daysOrder.map((d) => {
                const active = d === selectedDay;
                const card = programme[d] || programme["Lundi"];
                return (
                  <div
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`relative overflow-hidden cursor-pointer rounded-xl2 border ${
                      active ? "border-savane-accent" : "border-savane-line"
                    } shadow-soft`}
                  >
                    <img src={card.img} alt={d} className="h-28 w-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 p-3">
                      <div className={`text-sm mb-1 ${active ? "text-savane-accent" : "text-savane-textDim"}`}>{d}</div>
                      <div className="text-sm font-semibold">{card.type}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Séance détaillée */}
            <div className="card p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <h3 className="text-xl font-bold">{selectedDay} — {programme[selectedDay].type}</h3>
                <div className="flex items-center gap-2 text-savane-textDim">
                  <Clock size={16} /> <span>{programme[selectedDay].duration} min</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {programme[selectedDay].exos.map((e, i) => (
                  <div key={i} className="bg-[#101010] border border-savane-line rounded-lg p-3 flex items-center justify-between">
                    <div className="font-medium">{e.n}</div>
                    <div className="text-savane-accent">{e.s} x {e.r}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* NUTRITION */}
        {tab === "nutrition" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-xl font-bold">Menus de saison</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {(menus[saison] || []).map((m, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{m.t}</div>
                    <div className="badge">{m.kcal} kcal</div>
                  </div>
                  <div className="mt-3 text-sm text-savane-textDim flex items-center gap-2">
                    <Salad size={16}/> Équilibré — protéines/ glucides/ fibres
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PROGRESSION */}
        {tab === "progress" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-4">
                <h3 className="font-semibold mb-2">Poids (kg)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weight}>
                      <CartesianGrid stroke="#2b2b2b" />
                      <XAxis dataKey="w" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="kg" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold mb-2">Forces (1RM approx.)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={strength}>
                      <CartesianGrid stroke="#2b2b2b" />
                      <XAxis dataKey="w" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="squat" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="bench" stroke="#fbbf24" strokeWidth={2} />
                      <Line type="monotone" dataKey="dead" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Formulaire d'ajout progression */}
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Ajouter une entrée</h3>
              <div className="grid md:grid-cols-4 gap-3">
                <input className="bg-[#101010] border border-savane-line rounded-lg p-2" type="number" placeholder="Poids (kg)" value={newKg} onChange={(e)=>setNewKg(e.target.value)} />
                <input className="bg-[#101010] border border-savane-line rounded-lg p-2" type="number" placeholder="Squat (kg)" value={newSquat} onChange={(e)=>setNewSquat(e.target.value)} />
                <input className="bg-[#101010] border border-savane-line rounded-lg p-2" type="number" placeholder="Bench (kg)" value={newBench} onChange={(e)=>setNewBench(e.target.value)} />
                <input className="bg-[#101010] border border-savane-line rounded-lg p-2" type="number" placeholder="Deadlift (kg)" value={newDead} onChange={(e)=>setNewDead(e.target.value)} />
              </div>
              <div className="mt-3">
                <button className="btn-accent" onClick={addProgress}>Enregistrer</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* PROFIL */}
        {tab === "profil" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="card p-5">
              <h3 className="text-xl font-semibold mb-3">Profil</h3>
              <div className="grid md:grid-cols-5 gap-3">
                <select
                  value={profile.sexe}
                  onChange={(e)=>setProfile({...profile, sexe: e.target.value})}
                  className="bg-[#101010] border border-savane-line rounded-lg p-2"
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
                <input className="bg-[#101010] border border-savane-line rounded-lg p-2" type="number" placeholder="Poids (kg)" value={profile.poids} onChange={(e)=>setProfile({...profile, poids: e.target.value})}/>
                <input className="bg-[#101010] border border-savane-line rounded-lg p-2" type="number" placeholder="Taille (cm)" value={profile.taille} onChange={(e)=>setProfile({...profile, taille: e.target.value})}/>
                <input className="bg-[#101010] border border-savane-line rounded-lg p-2" type="number" placeholder="Âge" value={profile.age} onChange={(e)=>setProfile({...profile, age: e.target.value})}/>
                <select
                  value={profile.objectif}
                  onChange={(e)=>setProfile({...profile, objectif: e.target.value})}
                  className="bg-[#101010] border border-savane-line rounded-lg p-2"
                >
                  <option value="perte">Perte</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="prise">Prise de masse</option>
                </select>
              </div>

              {macros && (
                <div className="mt-5 grid md:grid-cols-4 gap-4">
                  <div className="bg-[#101010] border border-savane-line rounded-lg p-4">
                    <div className="text-savane-textDim text-sm">Calories</div>
                    <div className="text-2xl font-extrabold text-savane-accent">{macros.kcal}</div>
                    <div className="text-sm">kcal / jour</div>
                  </div>
                  <div className="bg-[#101010] border border-savane-line rounded-lg p-4">
                    <div className="text-savane-textDim text-sm">Protéines</div>
                    <div className="text-2xl font-extrabold text-savane-accent">{macros.prot} g</div>
                  </div>
                  <div className="bg-[#101010] border border-savane-line rounded-lg p-4">
                    <div className="text-savane-textDim text-sm">Glucides</div>
                    <div className="text-2xl font-extrabold text-savane-accent">{macros.gluc} g</div>
                  </div>
                  <div className="bg-[#101010] border border-savane-line rounded-lg p-4">
                    <div className="text-savane-textDim text-sm">Lipides</div>
                    <div className="text-2xl font-extrabold text-savane-accent">{macros.lip} g</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Switch mobile */}
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 bg-savane-card border border-savane-line rounded-full px-2 py-1 flex gap-2">
          {[
            { id: "plan", icon: <Calendar size={18} /> },
            { id: "nutrition", icon: <Salad size={18} /> },
            { id: "progress", icon: <BarChart3 size={18} /> },
            { id: "profil", icon: <User size={18} /> },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTab(btn.id)}
              className={`p-2 rounded-full ${tab === btn.id ? "bg-savane-accent text-black" : "text-white"}`}
              title={btn.id}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
