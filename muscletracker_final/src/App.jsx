import "./App.css";
import React, { useState, useEffect } from "react";
import "./App.css";

const EXERCISES = {
  arms: [
    { name: "Curl Biceps", equipment: "dumbbell" },
    { name: "Triceps Dips", equipment: "bodyweight" },
    { name: "Hammer Curl", equipment: "dumbbell" },
    { name: "Push-up Diamond", equipment: "bodyweight" }
  ],
  legs: [
    { name: "Squat", equipment: "bodyweight" },
    { name: "Lunges", equipment: "bodyweight" },
    { name: "Leg Press", equipment: "machine" },
    { name: "Deadlift", equipment: "barbell" }
  ],
  back: [
    { name: "Pull-up", equipment: "bodyweight" },
    { name: "Lat Pull-down", equipment: "machine" },
    { name: "Bent-over Row", equipment: "barbell" },
    { name: "Superman", equipment: "bodyweight" }
  ],
  chest: [
    { name: "Bench Press", equipment: "barbell" },
    { name: "Push-up", equipment: "bodyweight" },
    { name: "Chest Fly", equipment: "dumbbell" },
    { name: "Incline Dumbbell Press", equipment: "dumbbell" }
  ],
  abs: [
    { name: "Crunch", equipment: "bodyweight" },
    { name: "Plank", equipment: "bodyweight" },
    { name: "Russian Twist", equipment: "bodyweight" },
    { name: "Leg Raise", equipment: "bodyweight" }
  ],
  cardio: [
    { name: "Jump Rope", equipment: "rope" },
    { name: "Running", equipment: "none" },
    { name: "Cycling", equipment: "bike" },
    { name: "Burpees", equipment: "bodyweight" }
  ]
};

function generateProgram(profile) {
  const { level } = profile;
  const dayPrograms = [];
  for (let day = 0; day < 7; day++) {
    const exercises = [];
    Object.keys(EXERCISES).forEach((muscle) => {
      const allEx = EXERCISES[muscle];
      const exercise = allEx[Math.floor(Math.random() * allEx.length)];
      const sets = level === "beginner" ? 3 : level === "intermediate" ? 4 : 5;
      const reps = level === "beginner" ? 10 : level === "intermediate" ? 12 : 15;
      exercises.push({
        ...exercise,
        sets,
        reps,
        done: false
      });
    });
    dayPrograms.push({ day: `Day ${day + 1}`, exercises });
  }
  return dayPrograms;
}

function App() {
  const [profile, setProfile] = useState({
    age: 25,
    weight: 70,
    height: 170,
    level: "intermediate"
  });
  const [program, setProgram] = useState([]);
  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => {
    const savedProgram = JSON.parse(localStorage.getItem("muscleProgram"));
    if (savedProgram) {
      setProgram(savedProgram);
    } else {
      const newProgram = generateProgram(profile);
      setProgram(newProgram);
      localStorage.setItem("muscleProgram", JSON.stringify(newProgram));
    }
  }, [profile]);

  const toggleDone = (dayIndex, exIndex) => {
    const newProgram = [...program];
    newProgram[dayIndex].exercises[exIndex].done = !newProgram[dayIndex].exercises[exIndex].done;
    setProgram(newProgram);
    localStorage.setItem("muscleProgram", JSON.stringify(newProgram));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: ["age", "weight", "height"].includes(name) ? parseInt(value) : value
    });
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#111",
        color: "#FFD700",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "#FFD700",
            borderRadius: "50%",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#111",
            fontSize: "24px"
          }}
        >
          💪
        </div>
        <h1>MuscleTracker Pro</h1>
      </div>

      {/* Profil utilisateur */}
      <div className="profile" style={{ marginBottom: "30px" }}>
        <h2>Profil Utilisateur</h2>
        <label>
          Age: <input type="number" name="age" value={profile.age} onChange={handleProfileChange} />
        </label>
        <br />
        <label>
          Poids (kg): <input type="number" name="weight" value={profile.weight} onChange={handleProfileChange} />
        </label>
        <br />
        <label>
          Taille (cm): <input type="number" name="height" value={profile.height} onChange={handleProfileChange} />
        </label>
        <br />
        <label>
          Niveau:
          <select name="level" value={profile.level} onChange={handleProfileChange}>
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </select>
        </label>
      </div>

      {/* Navigation par jour */}
      <div className="days-navigation" style={{ marginBottom: "20px" }}>
        {program.map((day, index) => (
          <button
            key={index}
            onClick={() => setCurrentDay(index)}
            style={{
              margin: "5px",
              padding: "10px",
              backgroundColor: index === currentDay ? "#FFD700" : "#222",
              color: index === currentDay ? "#111" : "#FFD700",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "0.3s"
            }}
          >
            {day.day}
          </button>
        ))}
      </div>

      {/* Programme du jour */}
      <div className="day-program">
        <h3>{program[currentDay]?.day}</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {program[currentDay]?.exercises.map((ex, exIndex) => (
            <li
              key={exIndex}
              onClick={() => toggleDone(currentDay, exIndex)}
              style={{
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: ex.done ? "#444" : "#222",
                cursor: "pointer",
                transition: "0.3s",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ textDecoration: ex.done ? "line-through" : "none" }}>
                {ex.name} ({ex.sets}x{ex.reps})
              </span>
              <span style={{ fontSize: "12px", fontStyle: "italic" }}>
                {ex.equipment === "bodyweight" ? "💪 Poids du corps" : ex.equipment}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
