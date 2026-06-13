'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '30', label: 'Analyses générées par jour' },
  { value: '4', label: 'Compétitions couvertes' },
  { value: '100%', label: 'Données en temps réel' },
  { value: 'IA', label: 'Modèle Claude Sonnet 4.6' },
];

export default function Statistiques() {
  return (
    <main className="min-h-screen bg-[#05080f] text-[#e8eef5] flex flex-col items-center px-4 sm:px-6 py-10 font-sans relative overflow-hidden">

      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mb-12 relative z-10"
      >
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Statistiques</h1>
        <p className="text-[#7a8a9a] text-sm">
          Kickdata en chiffres
        </p>
      </motion.div>

      <div className="w-full max-w-3xl grid sm:grid-cols-2 gap-4 relative z-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-[#0d1420]/80 border border-[#1c2838] rounded-xl p-6 backdrop-blur-sm"
          >
            <p className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              {stat.value}
            </p>
            <p className="text-[#9aaabb] text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}