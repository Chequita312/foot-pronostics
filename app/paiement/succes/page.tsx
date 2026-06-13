'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SuccesContent() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center"
    >
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold text-white mb-2">Abonnement activé !</h1>
      <p className="text-[#8a9bb0] mb-6">
        Bienvenue parmi les abonnés. Tu bénéficies désormais d&apos;analyses IA illimitées.
      </p>
      {sessionId && (
        <p className="text-[10px] text-[#3a4a5a] mb-6 font-mono break-all">
          Référence : {sessionId}
        </p>
      )}
      <Link
        href="/matchs"
        className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Analyser des matchs
      </Link>
    </motion.div>
  );
}

export default function PaiementSucces() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
      <Suspense>
        <SuccesContent />
      </Suspense>
    </main>
  );
}
