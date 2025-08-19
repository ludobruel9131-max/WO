import React, { useState, useMemo } from "react";
import { Dumbbell, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const App = () => {
  // --- States ---
  const [exercises, setExercises] = useState([
    { name: "Développé couché", weight: 60, reps: 10 },
    { name: "Tractions", weight: "PDC", reps: 8 },
    { name: "Squat", weight: 80, reps: 12 },
  ]);

  const [newExercise, setNewExercise] = useState({ name: "", weight: "", reps: "" });
  const [selectedDay, setSelectedDay] = useState("Lundi");

  const daysOrder = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];

  // --- Progression calculée ---
  const progression = useMemo(() => {
    return exercises.map((ex) => ({
      ...ex,
      progression: Math.round((ex.reps / 12) * 100), // simple % basé sur reps
    }));
  }, [exercises]);

  // --- Ajouter un exercice ---
  const addExercise = () => {
    if (newExercise.name && newExercise.weight && newExercise.reps) {
      setExercises([...exercises, { ...newExercise, reps: Number(newExercise.reps) }]);
      setNewExercise({ name: "", weight: "", reps: "" });
    }
  };

  return (
    <div className="min-h-screen flex bg-savane-bg text-white">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col justify-between bg-savane-card border-r border-savane-line p-5">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400 mb-8 flex items-center gap-2">
            <Dumbbell /> Muscle Tracker
          </h1>
          <nav>
            {daysOrder.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`block w-full text-left px-4 py-2 rounded-xl mb-2 transition ${
                  selectedDay === day ? "bg-yellow-500 text-black" : "hover:bg-savane-hover"
                }`}
              >
                {day}
              </button>
            ))}
          </nav>
        </div>
        <p className="text-xs text-savane-text/50">© 2025 Muscle Tracker</p>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
          <Calendar /> {selectedDay}
        </h2>

        {/* Liste des exercices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {progression.map((ex, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-savane-card p-4 rounded-2xl shadow-lg border border-savane-line"
            >
              <h3 className="font-semibold text-lg text-yellow-300">{ex.name}</h3>
              <p className="text-savane-text">Charge : {ex.weight} kg</p>
              <p className="text-savane-text">Répétitions : {ex.reps}</p>
              <div className="mt-2 h-2 bg-savane-line rounded-full">
                <div
                  className="h-2 bg-yellow-500 rounded-full"
                  style={{ width: `${ex.progression}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ajouter un nouvel exercice */}
        <div className="bg-savane-card p-4 rounded-2xl shadow-lg border border-savane-line">
          <h3 className="font-semibold text-lg text-yellow-300 mb-2 flex items-center gap-2">
            <TrendingUp /> Ajouter un exercice
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              placeholder="Nom"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              className="p-2 rounded-lg bg-savane-bg border border-savane-line"
            />
            <input
              type="text"
              placeholder="Poids"
              value={newExercise.weight}
              onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
              className="p-2 rounded-lg bg-savane-bg border border-savane-line"
            />
            <input
              type="number"
              placeholder="Reps"
              value={newExercise.reps}
              onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
              className="p-2 rounded-lg bg-savane-bg border border-savane-line"
            />
          </div>
          <button
            onClick={addExercise}
            className="px-4 py-2 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition"
          >
            Ajouter
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
