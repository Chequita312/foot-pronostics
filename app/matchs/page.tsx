'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  'Bosnia-Herzegovina': 'Bosnie-Herzégovine',
  'Curacao': 'Curaçao',
  'Haiti': 'Haïti',
  'Sweden': 'Suède',
  'Tunisia': 'Tunisie',
  'Cape Verde Islands': 'Cap-Vert',
  'Saudi Arabia': 'Arabie Saoudite',
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
        setError(data.error === 'Limite quotidienne atteinte. Réessayez demain.' ? data.error : 'Erreur lors de la génération. Réessayez.');
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
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) +
      ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen bg-[#05080f] text-[#e8eef5] flex flex-col items-center px-4 sm:px-6 py-10 font-sans relative overflow-hidden">

      {/* Glow de fond */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mb-12 relative z-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Kickdata
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">.</span>
          </h1>
        </div>
        <p className="text-[#7a8a9a] text-sm">
          Données, statistiques et pronostics football
        </p>
      </motion.div>

      {/* Liste des matchs */}
      <div className="w-full max-w-3xl flex flex-col gap-3 mb-16 relative z-10">
        <p className="text-xs uppercase tracking-widest text-[#5a6a7a] mb-2 pl-1 font-semibold">Matchs à venir</p>

        {loadingMatches && (
          <p className="text-[#5a6a7a] text-sm py-8 text-center">Chargement des matchs...</p>
        )}

        {!loadingMatches && matches.length === 0 && (
          <p className="text-[#5a6a7a] text-sm py-8 text-center">Aucun match trouvé pour les prochains jours.</p>
        )}

        {matches.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className="bg-[#0d1420]/80 border border-[#1c2838] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-sm transition-colors hover:border-emerald-500/40"
          >
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#5a6a7a] mb-1">{match.competition} · {formatDate(match.date)}</p>
              <p className="font-bold text-base">{translateTeam(match.homeTeam)} <span className="text-[#5a6a7a] font-normal">vs</span> {translateTeam(match.awayTeam)}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAnalyse(match)}
              disabled={analyzingId === match.id}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#05080f] px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-emerald-500/20"
            >
              {analyzingId === match.id ? 'Analyse...' : 'Analyser'}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mb-10 w-full max-w-3xl text-orange-400 border border-orange-500/30 bg-orange-500/5 rounded-xl px-4 py-3 text-sm relative z-10"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl flex flex-col gap-4 relative z-10"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <TeamCard team={result.team1} delay={0} />
              <TeamCard team={result.team2} delay={0.1} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[#0d1420]/80 border border-[#1c2838] rounded-xl p-6 backdrop-blur-sm"
            >
              <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-3">Confrontation directe</h3>
              <p className="text-[#c5d0db] leading-relaxed text-sm">{result.headToHead}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-[#0d1420]/80 border border-[#1c2838] rounded-xl p-6 backdrop-blur-sm"
            >
              <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-5">Pronostic</h3>

              <div className="flex flex-col gap-4 mb-6">
                <PredictionBar label={result.team1.name} percent={result.prediction.team1WinPercent} delay={0.4} />
                <PredictionBar label="Match nul" percent={result.prediction.drawPercent} delay={0.5} />
                <PredictionBar label={result.team2.name} percent={result.prediction.team2WinPercent} delay={0.6} />
              </div>

              <p className="text-[11px] uppercase tracking-wider text-[#5a6a7a] mb-3">
                Indice de confiance — <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold">{result.prediction.confidence}/100</span>
              </p>
              <p className="text-[#c5d0db] leading-relaxed text-sm">{result.prediction.justification}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6"
            >
              <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-3">Synthèse</h3>
              <p className="text-[#e8eef5] leading-relaxed text-sm italic">{result.summary}</p>
            </motion.div>

            <p className="text-center text-[11px] text-[#5a6a7a] py-2 uppercase tracking-wider">
              Analyse statistique générée par IA — aucun résultat sportif n'est garanti
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function TeamCard({ team, delay }: { team: TeamAnalysis; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#0d1420]/80 border border-[#1c2838] rounded-xl p-6 backdrop-blur-sm"
    >
      <h3 className="text-lg font-black tracking-tight mb-3">{team.name}</h3>
      <p className="text-[#8a9aaa] text-sm mb-5 leading-relaxed">{team.form}</p>

      <p className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold mb-2">Points forts</p>
      <ul className="text-sm text-[#c5d0db] mb-5 space-y-1.5">
        {team.strengths.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-emerald-400">▸</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>

      <p className="text-[11px] uppercase tracking-wider text-orange-400 font-bold mb-2">Points faibles</p>
      <ul className="text-sm text-[#c5d0db] space-y-1.5">
        {team.weaknesses.map((w, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-orange-400">▸</span>
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function PredictionBar({ label, percent, delay }: { label: string; percent: number; delay: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium">{label}</span>
        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold">{percent}%</span>
      </div>
      <div className="w-full bg-[#1c2838] h-1.5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 rounded-full"
        ></motion.div>
      </div>
    </div>
  );
}