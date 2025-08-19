import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, User, BarChart2, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Données des séances (7 jours) ---
const workouts = {
  Lundi: {
    type: "Push (Pecs/Épaules/Triceps)",
    duration: "45 min",
    exercises: [
      "Développé couché barre — 4 x 8",
      "Développé militaire haltères — 4 x 10",
      "Pompes lestées — 3 x 12",
      "Dips — 3 x 12",
    ],
  },
  Mardi: {
    type: "Pull (Dos/Biceps)",
    duration: "40 min",
    exercises: [
      "Tractions pronation — 4 x max",
      "Rowing barre — 4 x 10",
      "Curl barre — 3 x 12",
      "Face pull — 3 x 15",
    ],
  },
  Mercredi: {
    type: "Jambes + Abdos",
    duration: "50 min",
    exercises: [
      "Squat barre — 5 x 6-8",
      "Fentes haltères — 3 x 10/ jambe",
      "Soulevé de terre JT — 4 x 10",
      "Gainage planche — 3 x 60 sec",
    ],
  },
  Jeudi: {
    type: "HIIT / Cardio",
    duration: "35 min",
    exercises: [
      "Sprint 30s / Marche 90s — x10",
      "Burpees — 5 x 15",
      "Mountain climbers — 4 x 40 sec",
    ],
  },
  Vendredi: {
    type: "Full body charges lourdes",
    duration: "55 min",
    exercises: [
      "Soulevé de terre — 5 x 5",
      "Développé couché — 5 x 5",
      "Squat — 5 x 5",
    ],
  },
  Samedi: {
    type: "Jambes lourdes + Core",
    duration: "50 min",
    exercises: [
      "Squat avant — 5 x 8",
      "Hip thrust barre — 4 x 12",
      "Soulevé de terre sumo — 4 x 8",
      "Abdos roulettes — 3 x 15",
    ],
  },
  Dimanche: {
    type: "Repos actif",
    duration: "30 min",
    exercises: ["Yoga", "Marche rapide 30 min", "Étirements 15 min"],
  },
};

// --- Nutrition (printemps/été vs automne/hiver) ---
const meals = {
  ete: [
    "Poulet grillé + quinoa + légumes grillés",
    "Saumon + salade d’été + avocat",
    "Omelette + tomates + fromage frais",
  ],
  hiver: [
    "Ragoût de lentilles + patate douce",
    "Bœuf mijoté + riz complet + légumes rôtis",
    "Soupe de pois chiches + pain complet",
  ],
};

// --- Données de progression par défaut ---
const weightData = [
  { week: "S1", weight: 78 },
  { week: "S2", weight: 77.5 },
  { week: "S3", weight: 77 },
  { week: "S4", weight: 76.5 },
];

const strengthData = [
  { week: "S1", squat: 80, bench: 70, deadlift: 100 },
  { week: "S2", squat: 85, bench: 72, deadlift: 105 },
  { week: "S3", squat: 87, bench: 74, deadlift: 110 },
  { week: "S4", squat: 90, bench: 76, deadlift: 115 },
];

export default function App() {
  const [page, setPage] = useState("plan");
  const [selectedDay, setSelectedDay] = useState("Lundi");
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profile");
    return saved
      ? JSON.parse(saved)
      : { poids: "", taille: "", age: "", objectif: "" };
  });

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  // --- Calcul macros simples ---
  const calories =
    profile.poids && profile.taille && profile.age
      ? Math.round(profile.poids * 33)
      : null;

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 p-6 flex flex-col justify-between">
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
            alt="lion"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-center text-orange-400">
            Muscle Tracker 🦁
          </h1>
          <nav className="mt-8 space-y-4">
            <button onClick={() => setPage("plan")} className="flex items-center space-x-2 hover:text-orange-400">
              <Calendar /> <span>Plan</span>
            </button>
            <button onClick={() => setPage("nutrition")} className="flex items-center space-x-2 hover:text-orange-400">
              <Dumbbell /> <span>Nutrition</span>
            </button>
            <button onClick={() => setPage("progression")} className="flex items-center space-x-2 hover:text-orange-400">
              <BarChart2 /> <span>Progression</span>
            </button>
            <button onClick={() => setPage("profil")} className="flex items-center space-x-2 hover:text-orange-400">
              <User /> <span>Profil</span>
            </button>
          </nav>
        </div>
        <p className="text-xs text-zinc-500 text-center">Dark mode savane/lion</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* PLAN */}
        {page === "plan" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-orange-400 mb-6">Plan de la semaine</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.keys(workouts).map((day) => (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`p-4 rounded-xl cursor-pointer ${
                    selectedDay === day
                      ? "bg-orange-600"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  <h3 className="font-bold">{day}</h3>
                  <p className="text-sm">{workouts[day].type}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">{selectedDay}</h3>
              <p className="italic text-zinc-400 mb-4">
                {workouts[selectedDay].type} • {workouts[selectedDay].duration}
              </p>
              <ul className="space-y-2">
                {workouts[selectedDay].exercises.map((exo, i) => (
                  <li key={i} className="bg-zinc-800 p-2 rounded-lg">
                    {exo}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* NUTRITION */}
        {page === "nutrition" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-orange-400 mb-6">Nutrition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.ete.map((meal, i) => (
                <div key={i} className="bg-zinc-900 p-4 rounded-xl shadow-lg">
                  🌞 Été : {meal}
                </div>
              ))}
              {meals.hiver.map((meal, i) => (
                <div key={i} className="bg-zinc-900 p-4 rounded-xl shadow-lg">
                  ❄️ Hiver : {meal}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PROGRESSION */}
        {page === "progression" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-orange-400 mb-6">Progression</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 p-4 rounded-xl">
                <h3 className="font-bold mb-2">Poids (kg)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#f97316" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl">
                <h3 className="font-bold mb-2">Forces principales</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="squat" stroke="#f97316" />
                    <Line type="monotone" dataKey="bench" stroke="#facc15" />
                    <Line type="monotone" dataKey="deadlift" stroke="#22c55e" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* PROFIL */}
        {page === "profil" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-3xl font-bold text-orange-400 mb-6">Profil</h2>
            <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Poids (kg)"
                  className="p-2 rounded bg-zinc-800"
                  value={profile.poids}
                  onChange={(e) =>
                    setProfile({ ...profile, poids: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Taille (cm)"
                  className="p-2 rounded bg-zinc-800"
                  value={profile.taille}
                  onChange={(e) =>
                    setProfile({ ...profile, taille: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Âge"
                  className="p-2 rounded bg-zinc-800"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Objectif (perte, maintien, prise)"
                  className="p-2 rounded bg-zinc-800"
                  value={profile.objectif}
                  onChange={(e) =>
                    setProfile({ ...profile, objectif: e.target.value })
                  }
                />
              </form>
              {calories && (
                <div className="mt-6 p-4 bg-orange-600 rounded-xl">
                  <h3 className="font-bold">Besoins estimés :</h3>
                  <p>{calories} kcal/jour</p>
                  <p>Protéines : {Math.round(calories * 0.3 / 4)} g</p>
                  <p>Glucides : {Math.round(calories * 0.5 / 4)} g</p>
                  <p>Lipides : {Math.round(calories * 0.2 / 9)} g</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

