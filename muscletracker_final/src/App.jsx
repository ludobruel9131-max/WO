import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, Dumbbell, Flame, Home, LineChart, Plus, Save, Trash2, Download, Calendar as CalIcon, Target, User, Info } from "lucide-react";
import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart as RBarChart, Bar } from "recharts";

const LS = {
  PROFILE: "mt_profile_v3",
  WEIGHT: "mt_weight_log_v3",
  MEALS: "mt_meals_v3",
  WORKOUTS: "mt_workouts_v3",
};
const load = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback)); } catch { return fallback; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const fmt = (n, d=1) => (isFinite(n) ? Number(n).toLocaleString(undefined, { maximumFractionDigits: d }) : "-");
const todayISO = () => new Date().toISOString().slice(0,10);

function calcBMR({ sex="male", weight=70, height=170, age=18 }) {
  const w = Number(weight), h = Number(height), a = Number(age);
  const base = 10 * w + 6.25 * h - 5 * a;
  return sex === "female" ? base - 161 : base + 5;
}
const ACT = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very: 1.9 };

function planMacros({ weight=70, kcalTarget=2000, proteinPerKg=1.9, fatPerKg=0.8 }) {
  const w = Number(weight) || 0;
  const p = Math.round(w * proteinPerKg);
  const f = Math.round(w * fatPerKg);
  const kcalPF = p*4 + f*9;
  const c = Math.max(0, Math.round((kcalTarget - kcalPF) / 4));
  return { kcalTarget, protein:p, fat:f, carbs:c };
}

const addDays = (iso, d) => { const dt = new Date(iso); dt.setDate(dt.getDate()+d); return dt.toISOString().slice(0,10); };

const EXERCISES = [
  { id:"pushups", name:"Pompes", group:"push", mode:"reps", tip:"Corps gainé, coudes ~45°, poitrine vers le sol, amplitude complète." },
  { id:"dips", name:"Dips (barres parallèles/chaise)", group:"push", mode:"reps", tip:"Épaules basses, descendre jusqu'aux coudes à 90°, buste légèrement penché." },
  { id:"pike_pushups", name:"Pompes pike", group:"push", mode:"reps", tip:"Hanches hautes, angle épaules élevé, tête vers le sol entre les mains." },
  { id:"pullups", name:"Tractions (pronation ou supination)", group:"pull", mode:"reps", tip:"Épaules basses, poitrine vers la barre, contrôle à la descente." },
  { id:"inverted_rows", name:"Rowing inversé sous table/barre", group:"pull", mode:"reps", tip:"Corps gainé en planche, tirer la poitrine à la barre." },
  { id:"squats_bw", name:"Squats poids du corps", group:"legs", mode:"reps", tip:"Pieds largeur d'épaules, genoux suivent les orteils, dos neutre." },
  { id:"lunges", name:"Fentes alternées", group:"legs", mode:"reps", tip:"Grand pas, genou avant au-dessus du pied, buste droit." },
  { id:"bulgarian_split", name:"Fentes bulgares", group:"legs", mode:"reps", tip:"Pied arrière surélevé, descendre verticalement, contrôle du genou avant." },
  { id:"jump_squats", name:"Squats sautés", group:"legs", mode:"reps", tip:"Atterrissage souple, genoux stables, pousser fort au sol." },
  { id:"plank", name:"Gainage planche", group:"core", mode:"secs", tip:"Coudes sous épaules, bassin rentré, respiration calme." },
  { id:"side_plank", name:"Gainage latéral", group:"core", mode:"secs", tip:"Alignement oreille-épaule-hanche-cheville, hanches élevées." },
  { id:"hollow_hold", name:"Hollow hold", group:"core", mode:"secs", tip:"Bas du dos plaqué, bras et jambes tendus bas, petite amplitude." },
  { id:"mountain_climbers", name:"Mountain climbers", group:"core", mode:"secs", tip:"Corps gainé, cadence régulière, genou poitrine sans creuser le dos." },
  { id:"burpees", name:"Burpees", group:"full", mode:"reps", tip:"Saut + pompe contrôlée, garder le rythme sans s'écrouler." },
];
const MUSCLE_GROUPS = ["push","pull","legs","core","full"];

export default function App() {
  const [profile, setProfile] = useState(load(LS.PROFILE, { sex:"male", height:170, weight:70, age:18, activity:"sedentary", goal:"recomp" }));
  useEffect(() => save(LS.PROFILE, profile), [profile]);

  const [weightLog, setWeightLog] = useState(load(LS.WEIGHT, [{ date: todayISO(), weight: profile.weight }]))
  useEffect(() => save(LS.WEIGHT, weightLog), [weightLog]);

  const [meals, setMeals] = useState(load(LS.MEALS, { [todayISO()]: [] }));
  useEffect(() => save(LS.MEALS, meals), [meals]);

  const [workouts, setWorkouts] = useState(load(LS.WORKOUTS, { [todayISO()]: [] }));
  useEffect(() => save(LS.WORKOUTS, workouts), [workouts]);

  const [tab, setTab] = useState("dashboard");
  const [day, setDay] = useState(todayISO());

  const bmr = useMemo(() => calcBMR(profile), [profile]);
  const tdee = useMemo(() => Math.round(bmr * (ACT[profile.activity] || ACT.sedentary)), [bmr, profile.activity]);
  const macroPlan = useMemo(() => planMacros({ weight: profile.weight, kcalTarget: 2000 }), [profile.weight]);

  const weightData = useMemo(() => ([...weightLog].sort((a,b)=> a.date.localeCompare(b.date)).map(w => ({ date: w.date, weight: Number(w.weight) }))), [weightLog]);

  const volumeData = useMemo(() => {
    return Object.entries(workouts).map(([date, sets]) => {
      const vol = sets.reduce((s, set) => {
        const ex = EXERCISES.find(e=>e.id===set.exercise);
        if (ex?.mode === "secs") return s + (Number(set.secs||0) * Number(set.sets||1));
        return s + (Number(set.reps||0) * Number(set.sets||1));
      }, 0);
      return { date, volume: vol };
    }).sort((a,b)=> a.date.localeCompare(b.date));
  }, [workouts]);

  const [plan, setPlan] = useState({ date: day, group: null, workout: [], meals: [], estMinutes: 45 });

  function groupsFromSets(sets = []) {
    const gs = new Set();
    sets.forEach(s => { const ex = EXERCISES.find(e => e.id === s.exercise); if (ex?.group) gs.add(ex.group); });
    return gs;
  }
  function lastTrainedMap() {
    const map = {};
    Object.entries(workouts).forEach(([d, sets]) => { groupsFromSets(sets).forEach(g => { map[g] = d; }); });
    return map;
  }
  function pickTodayGroup(date) {
    const prev = addDays(date, -1);
    const yesterdayGroups = groupsFromSets(workouts[prev] || []);
    const lastMap = lastTrainedMap();
    const candidates = MUSCLE_GROUPS.filter(g => !yesterdayGroups.has(g));
    candidates.sort((a,b)=> (lastMap[a]||"0000-00-00").localeCompare(lastMap[b]||"0000-00-00"));
    return candidates[0] || "core";
  }

  function generateWorkoutForGroup(group) {
    const pick = (...ids) => ids.map(id => {
      const ex = EXERCISES.find(e=>e.id===id);
      if (ex?.mode === "secs") return { id, sets: 3, secs: 40, restSec: 45 };
      return { id, sets: 4, reps: 10, restSec: 60 };
    });

    let list = [];
    if (group === "push") list = pick("pushups","dips","pike_pushups");
    if (group === "pull") list = pick("pullups","inverted_rows","mountain_climbers");
    if (group === "legs") list = pick("squats_bw","lunges","bulgarian_split","jump_squats");
    if (group === "core") list = pick("plank","side_plank","hollow_hold","mountain_climbers");
    if (group === "full") list = pick("burpees","pushups","squats_bw");

    const perSetSec = (it) => (it.secs ? it.secs + it.restSec : (it.reps||10)*3 + it.restSec);
    const estimateMins = items => Math.round(items.reduce((s,it)=> s + it.sets*perSetSec(it),0)/60);
    let mins = estimateMins(list);
    while (mins > 50 && list.length > 2) { list.pop(); mins = estimateMins(list); }
    if (mins < 40) { list.push({ id: "plank", sets: 3, secs: 40, restSec: 45 }); }
    mins = estimateMins(list);
    return { exercises: list, estMinutes: Math.max(40, Math.min(50, mins)) };
  }

  function mealTemplates(kcalTarget){
    const m1 = { label: "Bowl protéiné: 2 œufs + 150g poulet + 120g riz + 150g légumes + 10g huile + yaourt grec", kcal: 1000, p: 80, c: 85, f: 35 };
    const m2 = { label: "Assiette saumon: 200g saumon + 250g pommes de terre + salade + 20g avocat + fromage blanc", kcal: 1000, p: 70, c: 90, f: 35 };
    return [m1, m2];
  }

  function generatePlan(date){
    const group = pickTodayGroup(date);
    const w = generateWorkoutForGroup(group);
    const meals2 = mealTemplates(macroPlan.kcalTarget);
    setPlan({ date, group, workout: w.exercises, estMinutes: w.estMinutes, meals: meals2 });
  }

  function acceptPlanToLogs(){
    setWorkouts(prev => {
      const daySets = prev[day] || [];
      const newSets = (plan.workout||[]).map(it => ({ exercise: it.id, sets: it.sets, reps: it.reps||0, secs: it.secs||0, notes: "Plan du jour" }));
      return { ...prev, [day]: [...daySets, ...newSets] };
    });
    setMeals(prev => {
      const dayMeals = prev[day] || [];
      return { ...prev, [day]: [...dayMeals, ...((plan.meals)||[])] };
    });
  }

  useEffect(()=>{ generatePlan(day); }, []);
  useEffect(()=>{ generatePlan(day); }, [day]);

  function addWeightEntry(date, weight) {
    setWeightLog(prev => { const others = prev.filter(e => e.date !== date); return [...others, { date, weight: Number(weight) }]; });
  }
  function addMeal(date, meal) {
    setMeals(prev => { const dayMeals = prev[date] || []; return { ...prev, [date]: [...dayMeals, meal] }; });
  }
  function removeMeal(date, idx) {
    setMeals(prev => { const dayMeals = [...(prev[date]||[])]; dayMeals.splice(idx,1); return { ...prev, [date]: dayMeals }; });
  }
  function addSet(date, set) {
    setWorkouts(prev => { const daySets = prev[date] || []; return { ...prev, [date]: [...daySets, set] }; });
  }
  function removeSet(date, idx) {
    setWorkouts(prev => { const daySets = [...(prev[date]||[])]; daySets.splice(idx,1); return { ...prev, [date]: daySets }; });
  }

  const dayMeals = meals[day] || [];
  const mealTotals = dayMeals.reduce((acc, m) => { acc.kcal += Number(m.kcal||0); acc.p += Number(m.p||0); acc.c += Number(m.c||0); acc.f += Number(m.f||0); return acc; }, { kcal:0, p:0, c:0, f:0 });

  function exportAll() {
    const lines = [
      "# Profile",
      `sex,${profile.sex}`,
      `height_cm,${profile.height}`,
      `weight_kg,${profile.weight}`,
      `age,${profile.age}`,
      `activity,${profile.activity}`,
      `goal,${profile.goal}`,
      "",
      "# Weight Log",
      "date,weight_kg",
      ...[...weightLog].sort((a,b)=>a.date.localeCompare(b.date)).map(e => `${e.date},${e.weight}`),
      "",
      "# Meals (kcal, p, c, f)",
      "date,label,kcal,protein_g,carbs_g,fat_g",
      ...Object.entries(meals).flatMap(([d, arr]) => arr.map(m => `${d},${m.label||""},${m.kcal||0},${m.p||0},${m.c||0},${m.f||0}`)),
      "",
      "# Workouts",
      "date,exercise,sets,reps,secs,notes",
      ...Object.entries(workouts).flatMap(([d, arr]) => arr.map(s => `${d},${s.exercise},${s.sets||1},${s.reps||0},${s.secs||0},${(s.notes||"").replaceAll(',', ';')}`)),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `muscletracker_export_${todayISO()}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto grid gap-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">MuscleTracker</h1>
            <p className="text-gray-600 text-sm">Plan du jour, nutrition, entraînement, progression. 100% poids du corps.</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="date" className="px-3 py-2 rounded-2xl border bg-white shadow-sm" value={day} onChange={(e)=>setDay(e.target.value)} />
            <button className="px-3 py-2 rounded-2xl border" onClick={()=>setDay(todayISO())}>Aujourd'hui</button>
            <button className="px-3 py-2 rounded-2xl border" onClick={exportAll}>Exporter</button>
          </div>
        </header>

        <nav className="flex gap-2 flex-wrap">
          {[
            { id:"dashboard", label:"Tableau de bord" },
            { id:"plan", label:"Plan du jour" },
            { id:"profile", label:"Profil & objectifs" },
            { id:"nutrition", label:"Nutrition" },
            { id:"training", label:"Entraînement" },
            { id:"progress", label:"Progression" },
          ].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} className={`px-3 py-2 rounded-2xl border shadow-sm ${tab===t.id?"bg-black text-white":"bg-white"}`}>
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "dashboard" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-semibold mb-2">Cibles du jour</h3>
              <div className="text-sm text-gray-700">TDEE estimé (info): <b>{Math.round(tdee)}</b> kcal</div>
              <div className="text-sm text-gray-700">Objectif kcal: <b>{2000}</b> kcal</div>
              <div className="text-sm text-gray-700">Protéines: <b>{macroPlan.protein}</b> g • Glucides: <b>{macroPlan.carbs}</b> g • Lipides: <b>{macroPlan.fat}</b> g</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-semibold mb-2">Apports aujourd'hui</h3>
              <div className="text-sm">{Math.round(dayMeals.reduce((k,m)=>k+Number(m.kcal||0),0))} / 2000 kcal</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-semibold mb-2">Volume séance (derniers jours)</h3>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function MealForm(){ return null; }
function MealTable(){ return null; }
function WorkoutForm(){ return null; }
function WorkoutTable(){ return null; }
