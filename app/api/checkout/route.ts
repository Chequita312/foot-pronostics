import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Foot Pronostics — Accès illimité',
            description: 'Analyses IA illimitées, mises à jour en temps réel.',
          },
          recurring: { interval: 'month' },
          unit_amount: 900,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/`,
  });

  return NextResponse.json({ url: session.url });
}
