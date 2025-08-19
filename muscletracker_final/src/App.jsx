import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Flame,
  BarChart3,
  User,
  Calendar,
  Leaf,
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

// --- Gestion stockage local ---
const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const loadData = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

// --- Programmes (rotation 7 jours) ---
const workouts = [
  {
    day: "Push (Pectoraux / Triceps / Épaules)",
    duration: 45,
    exercises: [
      { name: "Développé couché haltères", sets: 4, reps: "8-10" },
      { name: "Développé militaire barre", sets: 4, reps: "8-10" },
      { name: "Dips lestés", sets: 3, reps: "10-12" },
      { name: "Écarté machine", sets: 3, reps: "12-15" },
    ],
  },
  {
    day: "Pull (Dos / Biceps)",
    duration: 40,
    exercises: [
      { name: "Tractions lestées", sets: 4, reps: "8-10" },
      { name: "Rowing barre", sets: 4, reps: "8-10" },
      { name: "Curl incliné", sets: 3, reps: "12" },
      { name: "Face pull", sets: 3, reps: "12-15" },
    ],
  },
  {
    day: "Jambes + Core",
    duration: 50,
    exercises: [
      { name: "Squat barre", sets: 5, reps: "6-8" },
      { name: "Fentes haltères", sets: 3, reps: "10/ jambe" },
      { name: "Soulevé de terre jambes tendues", sets: 4, reps: "8-10" },
      { name: "Gainage planche", sets: 3, reps: "60 sec" },
    ],
  },
  {
    day: "HIIT/Cardio",
    duration: 35,
    exercises: [
      { name: "Sprints 30s", sets: 10, reps: "repos 60s" },
      { name: "Burpees", sets: 3, reps: "15" },
      { name: "Mountain climbers", sets: 3, reps: "30s" },
    ],
  },
  {
    day: "Full Body Force",
    duration: 60,
    exercises: [
      { name: "Soulevé de terre", sets: 5, reps: "5" },
      { name: "Développé couché barre", sets: 5, reps: "5" },
      { name: "Squat avant", sets: 4, reps: "6" },
      { name: "Tractions", sets: 4, reps: "8-10" },
    ],
  },
  {
    day: "Jambes lourdes",
    duration: 50,
    exercises: [
      { name: "Presse à cuisses", sets: 4, reps: "8-10" },
      { name: "Soulevé de terre sumo", sets: 4, reps: "6-8" },
      { name: "Hip thrust", sets: 4, reps: "8-10" },
      { name: "Crunch lesté", sets: 3, reps: "20" },
    ],
  },
  {
    day: "Repos actif",
    duration: 30,
    exercises: [
      { name: "Marche rapide", sets: 1, reps: "30 min" },
      { name: "Étirements yoga", sets: 1, reps: "15 min" },
      { name: "Gainage léger", sets: 2, reps: "30 sec" },
    ],
  },
];

// --- Nutrition ---
const baseMeals = {
  ete: [
    { meal: "Poulet grillé + quinoa + courgettes grillées", kcal: 650 },
    { meal: "Saumon + salade tomates/avocat + riz basmati", kcal: 700 },
    { meal: "Omelette + légumes d’été + pain complet", kcal: 550 },
  ],
  hiver: [
    { meal: "Ragoût de lentilles + patate douce + carottes", kcal: 600 },
    { meal: "Poulet rôti + purée de brocoli + pommes de terre", kcal: 700 },
    { meal: "Chili con carne + riz complet", kcal: 750 },
  ],
};

export default function App() {
  const [tab, setTab] = useState("plan");
  const [dayIndex, setDayIndex] = useState(0);
  const [profile, setProfile] = useState(
    loadData("profile", { poids: "", taille: "", objectif: "maintenance" })
  );
  const [progress, setProgress] = useState(
    loadData("progress", { weight: [], strength: [] })
  );

  const [newWeight, setNewWeight] = useState("");
  const [newStrength, setNewStrength] = useState("");

  // Choisir le jour automatiquement
  useEffect(() => {
    const today = new Date();
    setDayIndex(today.getDay()); // 0=Dimanche
  }, []);

  // Sauvegarde auto
  useEffect(() => {
    saveData("profile", profile);
    saveData("progress", progress);
  }, [profile, progress]);

  // Calcul macros
  const calcMacros = () => {
    if (!profile.poids || !profile.taille) return null;
    let bmr = 10 * profile.poids + 6.25 * profile.taille - 5 * 25 + 5; // Mifflin homme approx
    if (profile.objectif === "perte") bmr -= 300;
    if (profile.objectif === "prise") bmr += 300;
    return {
      kcal: bmr,
      proteines: Math.round(profile.poids * 2),
      glucides: Math.round((bmr * 0.5) / 4),
      lipides: Math.round((bmr * 0.25) / 9),
    };
  };

  const macros = calcMacros();

  // Ajouter progression
  const addProgress = () => {
    const week = progress.weight.length + 1;
    const updated = { ...progress };

    if (newWeight) {
      updated.weight.push({ week, poids: Number(newWeight) });
    }
    if (newStrength) {
      updated.strength.push({ week, charge: Number(newStrength) });
    }

    setProgress(updated);
    setNewWeight("");
    setNewStrength("");
  };

  return (
    <div className="min-h-screen flex bg-[#121212] text-white font-sans">
      {/* Sidebar */}
      <div className="w-60 bg-[#1a1a1a] border-r border-[#333] p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-orange-400 flex items-center gap-2">
          <Dumbbell /> MuscleTracker
        </h1>
        <button
          onClick={() => setTab("plan")}
          className={`flex items-center gap-2 p-2 rounded-lg ${
            tab === "plan" ? "bg-orange-500 text-black" : "hover:bg-[#2a2a2a]"
          }`}
        >
          <Calendar size={18} /> Plan du jour
        </button>
        <button
          onClick={() => setTab("nutrition")}
          className={`flex items-center gap-2 p-2 rounded-lg ${
            tab === "nutrition"
              ? "bg-orange-500 text-black"
              : "hover:bg-[#2a2a2a]"
          }`}
        >
          <Leaf size={18} /> Nutrition
        </button>
        <button
          onClick={() => setTab("progress")}
          className={`flex items-center gap-2 p-2 rounded-lg ${
            tab === "progress"
              ? "bg-orange-500 text-black"
              : "hover:bg-[#2a2a2a]"
          }`}
        >
          <BarChart3 size={18} /> Progression
        </button>
        <button
          onClick={() => setTab("profil")}
          className={`flex items-center gap-2 p-2 rounded-lg ${
            tab === "profil"
              ? "bg-orange-500 text-black"
              : "hover:bg-[#2a2a2a]"
          }`}
        >
          <User size={18} /> Profil
        </button>
      </div>

      {/* Contenu */}
      <div className="flex-1 p-6">
        {tab === "plan" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              {workouts[dayIndex].day} ({workouts[dayIndex].duration} min)
            </h2>
            <div className="space-y-2">
              {workouts[dayIndex].exercises.map((ex, i) => (
                <div
                  key={i}
                  className="bg-[#1e1e1e] p-3 rounded-lg border border-[#333]"
                >
                  <span className="font-semibold text-orange-300">
                    {ex.name}
                  </span>{" "}
                  — {ex.sets} x {ex.reps}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "nutrition" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              Nutrition
            </h2>
            {macros && (
              <div className="bg-[#1e1e1e] p-4 rounded-lg mb-4">
                <p>Calories : {macros.kcal} kcal</p>
                <p>Protéines : {macros.proteines} g</p>
                <p>Glucides : {macros.glucides} g</p>
                <p>Lipides : {macros.lipides} g</p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {baseMeals.ete.map((m, i) => (
                <div
                  key={i}
                  className="bg-[#1e1e1e] p-4 rounded-lg border border-[#333]"
                >
                  <p>{m.meal}</p>
                  <p className="text-sm text-orange-300">{m.kcal} kcal</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "progress" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              Progression
            </h2>

            {/* Formulaire */}
            <div className="bg-[#1e1e1e] p-4 rounded-lg mb-4 space-y-2">
              <input
                type="number"
                placeholder="Poids (kg)"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full p-2 rounded bg-[#2a2a2a]"
              />
              <input
                type="number"
                placeholder="Charge max (kg)"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                className="w-full p-2 rounded bg-[#2a2a2a]"
              />
              <button
                onClick={addProgress}
                className="bg-orange-500 text-black px-4 py-2 rounded w-full"
              >
                Ajouter
              </button>
            </div>

            {/* Graphique poids */}
            <div className="h-64 mb-6 bg-[#1e1e1e] p-2 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress.weight}>
                  <CartesianGrid stroke="#333" />
                  <XAxis dataKey="week" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="poids"
                    stroke="#f97316"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Graphique force */}
            <div className="h-64 bg-[#1e1e1e] p-2 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress.strength}>
                  <CartesianGrid stroke="#333" />
                  <XAxis dataKey="week" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="charge"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {tab === "profil" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Profil</h2>
            <div className="bg-[#1e1e1e] p-4 rounded-lg space-y-2">
              <input
                type="number"
                placeholder="Poids (kg)"
                value={profile.poids}
                onChange={(e) =>
                  setProfile({ ...profile, poids: e.target.value })
                }
                className="w-full p-2 rounded bg-[#2a2a2a]"
              />
              <input
                type="number"
                placeholder="Taille (cm)"
                value={profile.taille}
                onChange={(e) =>
                  setProfile({ ...profile, taille: e.target.value })
                }
                className="w-full p-2 rounded bg-[#2a2a2a]"
              />
              <select
                value={profile.objectif}
                onChange={(e) =>
                  setProfile({ ...profile, objectif: e.target.value })
                }
                className="w-full p-2 rounded bg-[#2a2a2a]"
              >
                <option value="perte">Perte de poids</option>
                <option value="maintenance">Maintenance</option>
                <option value="prise">Prise de masse</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
