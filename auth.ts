import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      // Pour la prod, remplacez par votre domaine vérifié dans Resend
      from: "Kickdata <onboarding@resend.dev>",
    }),
  ],
  pages: {
    signIn: "/connexion",
    verifyRequest: "/connexion?email-envoye=1",
  },
  session: {
    strategy: "database",
  },
});
