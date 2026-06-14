import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PACKS = {
  standard: { priceId: process.env.STRIPE_PRICE_STANDARD!, credits: 120 },
  pro:      { priceId: process.env.STRIPE_PRICE_PRO!,      credits: 300 },
} as const;

export async function POST(req: NextRequest) {
  const { pack } = await req.json() as { pack: string };

  const packConfig = PACKS[pack as keyof typeof PACKS];
  if (!packConfig) {
    return NextResponse.json({ error: 'Pack invalide.' }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Vous devez être connecté pour acheter des crédits.' }, { status: 401 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: packConfig.priceId, quantity: 1 }],
    metadata: {
      userId: session.user.id,
      pack,
      credits: String(packConfig.credits),
    },
    success_url: `${baseUrl}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/matchs`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
