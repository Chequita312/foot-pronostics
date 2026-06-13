"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/matchs", label: "Matchs" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/statistiques", label: "Statistiques" },
];

function AuthSection() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 rounded-lg bg-[#0d1420] animate-pulse" />;
  }

  if (session?.user) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-[#7a8a9a] truncate" title={session.user.email ?? ""}>
          {session.user.email}
        </p>
        <button
          onClick={() => signOut()}
          className="w-full text-left text-xs px-3 py-2 rounded-lg text-[#7a8a9a] hover:text-red-400 hover:bg-red-400/5 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/connexion"
      className="block text-sm px-3 py-2.5 rounded-lg text-[#7a8a9a] hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors"
    >
      Se connecter
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col w-56 min-h-screen bg-[#05080f] border-r border-[#1c2838] px-6 py-10 fixed left-0 top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight mb-12">
          Kickdata
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            .
          </span>
        </h1>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-2.5 rounded-lg transition-colors ${
                pathname === link.href
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 font-semibold"
                  : "text-[#7a8a9a] hover:text-[#e8eef5] hover:bg-[#0d1420]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-[#1c2838] mt-6">
          <AuthSection />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#05080f] border-t border-[#1c2838] flex justify-around py-3 z-20">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${
              pathname === link.href ? "text-emerald-400 font-semibold" : "text-[#7a8a9a]"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/connexion"
          className={`text-xs px-2 py-1 rounded-lg transition-colors ${
            pathname === "/connexion" ? "text-emerald-400 font-semibold" : "text-[#7a8a9a]"
          }`}
        >
          Compte
        </Link>
      </nav>
    </>
  );
}
