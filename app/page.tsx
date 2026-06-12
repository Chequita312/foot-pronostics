'use client';

import { useState } from 'react';

interface TeamAnalysis {
  name: string;
  form: string;
  strengths: string[];
  weaknesses: string[];
}

interface Analysis {
  team1: TeamAnalysis;
  team2: TeamAnalysis;
  headToHead: string;
  prediction: {
    team1WinPercent: number;
    drawPercent: number;
    team2WinPercent: number;
    confidence: number;
    justification: string;
  };
  summary: string;
}

export default function Home() {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [result, setResult] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyse = async () => {
    if (!team1 || !team2) return;
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team1, team2 }),
      });
      const data = await res.json();
      if (data.error) {
        setError('Erreur lors de la génération. Réessayez.');
      } else {
        setResult(data.analysis);
      }
    } catch (err) {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center p-6 sm:p-10">
      <div className="text-center mb-10 mt-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-green-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
          Pronostics Foot IA
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Analyse complète générée par intelligence artificielle
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-4 bg-slate-800/60 backdrop-blur p-6 rounded-2xl border border-slate-700 shadow-2xl">
        <input
          type="text"
          placeholder="Équipe 1 (ex: France)"
          value={team1}
          onChange={(e) => setTeam1(e.target.value)}
          className="p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-green-500 focus:outline-none transition text-white placeholder:text-slate-500"
        />
        <input
          type="text"
          placeholder="Équipe 2 (ex: Brésil)"
          value={team2}
          onChange={(e) => setTeam2(e.target.value)}
          className="p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-green-500 focus:outline-none transition text-white placeholder:text-slate-500"
        />
        <button
          onClick={handleAnalyse}
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 active:scale-[0.98] p-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              Analyse en cours...
            </>
          ) : (
            'Analyser le match'
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 text-red-400 bg-red-950/50 border border-red-800 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-10 w-full max-w-4xl flex flex-col gap-6">
          {/* Cartes équipes */}
          <div className="grid sm:grid-cols-2 gap-6">
            <TeamCard team={result.team1} color="blue" />
            <TeamCard team={result.team2} color="red" />
          </div>

          {/* Confrontation directe */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-amber-300 mb-2">⚔️ Confrontation directe</h3>
            <p className="text-slate-300 leading-relaxed">{result.headToHead}</p>
          </div>

          {/* Pronostic */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-emerald-300 mb-4">📊 Pronostic</h3>

            <div className="flex flex-col gap-3 mb-4">
              <PredictionBar label={result.team1.name} percent={result.prediction.team1WinPercent} color="bg-blue-500" />
              <PredictionBar label="Match nul" percent={result.prediction.drawPercent} color="bg-slate-500" />
              <PredictionBar label={result.team2.name} percent={result.prediction.team2WinPercent} color="bg-red-500" />
            </div>

            <p className="text-sm text-slate-400 mb-2">
              Indice de confiance : <span className="text-white font-semibold">{result.prediction.confidence}/100</span>
            </p>
            <p className="text-slate-300 leading-relaxed">{result.prediction.justification}</p>
          </div>

          {/* Synthèse */}
          <div className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">💬 Synthèse</h3>
            <p className="text-slate-200 italic leading-relaxed">{result.summary}</p>
          </div>

          <p className="text-center text-xs text-slate-500 mt-2">
            ⚠️ Analyse statistique générée par IA — aucun résultat sportif n'est garanti.
          </p>
        </div>
      )}
    </main>
  );
}

function TeamCard({ team, color }: { team: TeamAnalysis; color: 'blue' | 'red' }) {
  const accent = color === 'blue' ? 'text-blue-300 border-blue-700/50' : 'text-red-300 border-red-700/50';
  return (
    <div className={`bg-slate-800/60 border rounded-2xl p-6 shadow-xl ${accent}`}>
      <h3 className="text-xl font-bold mb-2">{team.name}</h3>
      <p className="text-slate-300 text-sm mb-4">{team.form}</p>

      <p className="text-sm font-semibold text-green-400 mb-1">✅ Points forts</p>
      <ul className="text-sm text-slate-300 list-disc list-inside mb-4 space-y-1">
        {team.strengths.map((s, i) => <li key={i}>{s}</li>)}
      </ul>

      <p className="text-sm font-semibold text-red-400 mb-1">❌ Points faibles</p>
      <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
        {team.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
      </ul>
    </div>
  );
}

function PredictionBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-slate-400">{percent}%</span>
      </div>
      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
        <div className={`${color} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}