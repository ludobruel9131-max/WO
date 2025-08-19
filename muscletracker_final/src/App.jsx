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

// --- Données programmes (rotation 7 jours) ---
const workoutPlan = [
  {
    day: "Jour 1 - Push",
    duration: "45 min",
    exercises: [
      { name: "Développé couché haltères", sets: 4, reps: "8-10" },
      { name: "Développé militaire barre", sets: 4, reps: "8-10" },
      { name: "Dips lestés", sets: 3, reps: "10-12" },
      { name: "Écarté machine", sets: 3, reps: "12-15" },
    ],
  },
  {
    day: "Jour 2 - Pull",
    duration: "40 min",
    exercises: [
      { name: "Tractions lestées", sets: 4, reps: "8-10" },
      { name: "Rowing barre", sets: 4, reps: "8-10" },
      { name: "Curl incliné", sets: 3, reps: "12" },
      { name: "Face pull", sets: 3, reps: "12-15" },
    ],
  },
  {
    day: "Jour 3 - Jambes + Core",
    duration: "50 min",
    exercises: [
      { name: "Squat barre", sets: 5, reps: "6-8" },
      { name: "Fentes haltères", sets: 3, reps: "10/ jambe" },
      { name: "Soulevé de terre jambes tendues", sets: 4, reps: "8-10" },
      { name: "Gainage planche", sets: 3, reps: "60 sec" },
    ],
  },
  {
    day: "Jour 4 - HIIT/Cardio",
    duration: "35 min",
    exercises: [
      { name: "Sprints 30s", sets: 10, reps: "repos 60s" },
      { name: "Burpees", sets: 3, reps: "15" },
      { name: "Mountain climbers", sets: 3, reps: "30s" },
    ],
  },
  {
    day: "Jour 5 - Full Body Force",
    duration: "60 min",
    exercises: [
      { name: "Soulevé de terre", sets: 5, reps: "5" },
      { name: "Développé couché barre", sets: 5, reps: "5" },
      { name: "Squat avant", sets: 4, reps: "6" },
      { name: "Tractions", sets: 4, reps: "8-10" },
    ],
  },
  {
    day: "Jour 6 - Jambes lourdes",
    duration: "50 min",
    exercises: [
      { name: "Presse à cuisses", sets: 4, reps: "8-10" },
      { name: "Soulevé de terre sumo", sets: 4, reps: "6-8" },
      { name: "Hip thrust", sets: 4, reps: "8-10" },
      { name: "Crunch lesté", sets: 3, reps: "20" },
    ],
  },
  {
    day: "Jour 7 - Repos actif",
    duration: "30 min",
    exercises: [
      { name: "Marche rapide", sets: 1, reps: "30 min" },
      { name: "Étirements yoga", sets: 1, reps: "15 min" },
      { name: "Gainage léger", sets: 2, reps: "30 sec" },
    ],
  },
];

// --- Nutrition saisonnière ---
const meals = {
  ete: [
    { meal: "Poulet grillé + quinoa + courgettes grillées", kcal: 650 },
    { meal: "Saumon + salade tomates/avocat + riz basmati", kcal: 700 },
    { meal: "Omelette 3 œufs + légumes d’été + pain complet", kcal: 550 },
  ],
  hiver: [
    { meal: "Ragoût de lentilles + patate douce + carottes", kcal: 600 },
    { meal: "Poulet rôti + purée de brocoli + pommes de terre", kcal: 700 },
    { meal: "Chili con carne + riz complet", kcal: 750 },
  ],
};

// --- Progression poids/charges ---
const initialProgress = {
  weight: [
    { week: "S1", poids: 78 },
    { week: "S2", poids: 77.5 },
    { week: "S3", poids: 77 },
  ],
  strength: [
    { week: "S1", bench: 80, squat: 100, deadlift: 120 },
    { week: "S2", bench: 82, squat: 105, deadlift: 125 },
    { week: "S3", bench: 85, squat: 110, deadlift: 130 },
  ],
};

export default function App() {
  const [tab, setTab] = useState("plan");
  const [dayIndex, setDayIndex] = useState(0);
  const [progress, setProgress] = useState(initialProgress);

  // --- Rotation automatique du programme chaque jour ---
  useEffect(() => {
    const today = new Date();
    setDayIndex(today.getDay()); // 0=Dimanche → Jour 7
  }, []);

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

      {/* Contenu principal */}
      <div className="flex-1 p-6">
        {tab === "plan" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              {workoutPlan[dayIndex].day} ({workoutPlan[dayIndex].duration})
            </h2>
            <ul className="space-y-2">
              {workoutPlan[dayIndex].exercises.map((ex, i) => (
                <li
                  key={i}
                  className="bg-[#1e1e1e] p-3 rounded-lg border border-[#333]"
                >
                  <span className="font-semibold text-orange-300">
                    {ex.name}
                  </span>{" "}
                  — {ex.sets} x {ex.reps}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {tab === "nutrition" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              Menus saisonniers
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {meals.ete.map((m, i) => (
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
            <div className="h-64 bg-[#1e1e1e] p-2 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progress.strength}>
                  <CartesianGrid stroke="#333" />
                  <XAxis dataKey="week" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bench" stroke="#f97316" />
                  <Line type="monotone" dataKey="squat" stroke="#facc15" />
                  <Line type="monotone" dataKey="deadlift" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {tab === "profil" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Profil</h2>
            <p>
              Ici tu pourras entrer ton poids, taille, objectif et calculer tes
              macros 🔥 (à compléter).
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
