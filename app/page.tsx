'use client';

import { useState, useEffect, useRef } from 'react';

const teamNamesFr: Record<string, string> = {
  'Brazil': 'Brésil',
  'Czechia': 'Tchéquie',
  'Ivory Coast': 'Côte d\'Ivoire',
  'Morocco': 'Maroc',
  'Germany': 'Allemagne',
  'Netherlands': 'Pays-Bas',
  'Japan': 'Japon',
  'Spain': 'Espagne',
  'Portugal': 'Portugal',
  'England': 'Angleterre',
  'Belgium': 'Belgique',
  'Croatia': 'Croatie',
  'Switzerland': 'Suisse',
  'Poland': 'Pologne',
  'Senegal': 'Sénégal',
  'South Korea': 'Corée du Sud',
  'United States': 'États-Unis',
  'Mexico': 'Mexique',
  'Argentina': 'Argentine',
  'Uruguay': 'Uruguay',
  'Ecuador': 'Équateur',
  'Canada': 'Canada',
  'Australia': 'Australie',
  'Scotland': 'Écosse',
  'Turkey': 'Turquie',
  'Qatar': 'Qatar',
  'Paraguay': 'Paraguay',
  'Bosnia and Herzegovina': 'Bosnie-Herzégovine',
  'Curacao': 'Curaçao',
  'Haiti': 'Haïti',
};

function translateTeam(name: string): string {
  return teamNamesFr[name] || name;
}

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  status: string;
}

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
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [result, setResult] = useState<Analysis | null>(null);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/matches')
      .then((res) => res.json())
      .then((data) => {
        setMatches(data.matches || []);
        setLoadingMatches(false);
      })
      .catch(() => setLoadingMatches(false));
  }, []);

  const handleAnalyse = async (match: Match) => {
    setAnalyzingId(match.id);
    setResult(null);
    setError('');

    try {
      const res = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team1: translateTeam(match.homeTeam), team2: translateTeam(match.awayTeam) }),
      });
      const data = await res.json();
      if (data.error) {
        setError('Erreur lors de la génération. Réessayez.');
      } else {
        setResult(data.analysis);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err) {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) +
      ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center p-6 sm:p-10">
      <div className="text-center mb-10 mt-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-green-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
          Pronostics Foot IA
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Matchs des prochains jours — analyses générées par IA
        </p>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-3 mb-10">
        {loadingMatches && (
          <p className="text-center text-slate-400">Chargement des matchs...</p>
        )}

        {!loadingMatches && matches.length === 0 && (
          <p className="text-center text-slate-400">Aucun match trouvé pour les prochains jours.</p>
        )}

        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <p className="text-xs text-slate-400 mb-1">{match.competition} · {formatDate(match.date)}</p>
              <p className="font-semibold text-lg">{translateTeam(match.homeTeam)} <span className="text-slate-500">vs</span> {translateTeam(match.awayTeam)}</p>
            </div>
            <button
              onClick={() => handleAnalyse(match)}
              disabled={analyzingId === match.id}
              className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 active:scale-[0.98] px-4 py-2 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {analyzingId === match.id ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Analyse...
                </>
              ) : (
                'Analyser'
              )}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 text-red-400 bg-red-950/50 border border-red-800 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div ref={resultRef} className="w-full max-w-4xl flex flex-col gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <TeamCard team={result.team1} color="blue" />
            <TeamCard team={result.team2} color="red" />
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-amber-300 mb-2">⚔️ Confrontation directe</h3>
            <p className="text-slate-300 leading-relaxed">{result.headToHead}</p>
          </div>

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