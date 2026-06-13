'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/matchs', label: 'Matchs' },
  { href: '/comment-ca-marche', label: 'Comment ça marche' },
  { href: '/statistiques', label: 'Statistiques' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden sm:flex flex-col w-56 min-h-screen bg-[#05080f] border-r border-[#1c2838] px-6 py-10 fixed left-0 top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight mb-12">
          Kickdata
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">.</span>
        </h1>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-2.5 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 font-semibold'
                  : 'text-[#7a8a9a] hover:text-[#e8eef5] hover:bg-[#0d1420]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#05080f] border-t border-[#1c2838] flex justify-around py-3 z-20">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${
              pathname === link.href ? 'text-emerald-400 font-semibold' : 'text-[#7a8a9a]'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}