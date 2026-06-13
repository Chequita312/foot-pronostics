'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05080f] text-[#e8eef5] flex flex-col items-center justify-center px-4 sm:px-6 py-10 font-sans relative overflow-hidden">

      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl relative z-10"
      >
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-4">
          Kickdata
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">.</span>
        </h1>
        <p className="text-[#9aaabb] text-base sm:text-lg mb-10 leading-relaxed">
          Analyses, statistiques et pronostics football générés par intelligence artificielle,
          à partir de données réelles et mises à jour en continu.
        </p>

        <Link href="/matchs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#05080f] px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20"
          >
            Voir les matchs
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
}