'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Données en temps réel',
    text: 'Nous récupérons les matchs à venir directement depuis des bases de données football officielles, mises à jour en continu.',
  },
  {
    title: 'Analyse par intelligence artificielle',
    text: 'Chaque match est analysé par un modèle d\'IA qui évalue la forme récente, les forces et faiblesses de chaque équipe, ainsi que leur historique de confrontations.',
  },
  {
    title: 'Pronostic structuré',
    text: 'L\'analyse aboutit à un pronostic présenté sous forme de probabilités (victoire, nul, défaite) accompagné d\'un indice de confiance et d\'une justification claire.',
  },
];

export default function CommentCaMarche() {
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
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Comment ça marche</h1>
        <p className="text-[#7a8a9a] text-sm">
          La méthode derrière chaque analyse Kickdata
        </p>
      </motion.div>

      <div className="w-full max-w-3xl flex flex-col gap-4 relative z-10">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-[#0d1420]/80 border border-[#1c2838] rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-bold">{step.title}</h3>
            </div>
            <p className="text-[#c5d0db] leading-relaxed text-sm">{step.text}</p>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-6 mt-2"
        >
          <p className="text-[#e8eef5] leading-relaxed text-sm italic">
            Important : ces analyses sont des outils d&apos;aide à la compréhension des matchs, basés sur des données statistiques.
            Elles ne garantissent aucun résultat sportif, le football restant par nature imprévisible.
          </p>
        </motion.div>
      </div>
    </main>
  );
}