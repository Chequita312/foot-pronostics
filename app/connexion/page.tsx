"use client";

import { useState, useTransition, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function ConnexionForm() {
  const searchParams = useSearchParams();
  const emailEnvoye = searchParams.get("email-envoye") === "1";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(emailEnvoye);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/matchs",
      });
      if (result?.error) {
        setError("Une erreur est survenue. Vérifiez votre adresse email.");
      } else {
        setSent(true);
      }
    });
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-[#e8eef5] font-semibold mb-1">
            Vérifiez votre boîte mail
          </p>
          <p className="text-[#7a8a9a] text-sm">
            Un lien de connexion a été envoyé à{" "}
            <span className="text-cyan-400">{email || "votre adresse"}</span>
          </p>
        </div>
        <button
          onClick={() => setSent(false)}
          className="text-xs text-[#7a8a9a] hover:text-[#e8eef5] transition-colors underline underline-offset-2"
        >
          Renvoyer ou changer d&apos;adresse
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#e8eef5] mb-2">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.fr"
          className="w-full bg-[#05080f] border border-[#1c2838] rounded-xl px-4 py-3 text-[#e8eef5] placeholder-[#3a4858] text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending || !email}
        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200"
      >
        {isPending ? "Envoi en cours…" : "Recevoir le lien de connexion"}
      </button>

      <p className="text-xs text-[#7a8a9a] text-center leading-relaxed">
        Pas de mot de passe. Nous vous envoyons un lien sécurisé par email.
      </p>
    </form>
  );
}

export default function ConnexionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight mb-2">
            Kickdata
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              .
            </span>
          </h1>
          <p className="text-[#7a8a9a] text-sm">
            Connexion sans mot de passe
          </p>
        </div>

        <div className="bg-[#0a0f1a] border border-[#1c2838] rounded-2xl p-8">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-[#0d1420]" />}>
            <ConnexionForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
