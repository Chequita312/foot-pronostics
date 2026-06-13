import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

let requestCount = 0;
let lastResetDate = new Date().toDateString();

function checkDailyLimit(): boolean {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    requestCount = 0;
    lastResetDate = today;
  }
  if (requestCount >= 30) return false;
  requestCount++;
  return true;
}

function nextMonthFirst(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

export async function POST(req: NextRequest) {
  if (!checkDailyLimit()) {
    return NextResponse.json(
      { error: 'Limite quotidienne atteinte. Réessayez demain.' },
      { status: 429 },
    );
  }

  const { team1, team2 } = await req.json();

  const session = await auth();
  const userId = session?.user?.id;

  // Quota check for authenticated users
  let shouldIncrementQuota = false;
  let effectiveUsed = 0;
  let effectiveResetDate: Date | null = null;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true, analysesUsedThisMonth: true, analysesResetDate: true },
    });

    if (user && user.subscriptionStatus !== 'active') {
      const now = new Date();
      const needsReset = user.analysesResetDate !== null && user.analysesResetDate < now;

      effectiveUsed = needsReset ? 0 : user.analysesUsedThisMonth;
      effectiveResetDate =
        needsReset || user.analysesResetDate === null
          ? nextMonthFirst()
          : user.analysesResetDate;

      if (effectiveUsed >= 3) {
        return NextResponse.json(
          { error: 'Quota mensuel atteint. Abonnez-vous pour des analyses illimitées.' },
          { status: 429 },
        );
      }

      shouldIncrementQuota = true;
    }
  }

  // AI analysis
  const prompt = `Tu es un analyste sportif expert. Analyse le match à venir entre ${team1} et ${team2}.

Réponds UNIQUEMENT avec un objet JSON valide (sans texte avant ou après, sans balises markdown), respectant exactement cette structure :

{
  "team1": {
    "name": "${team1}",
    "form": "résumé de la forme récente en 1-2 phrases",
    "strengths": ["point fort 1", "point fort 2", "point fort 3"],
    "weaknesses": ["point faible 1", "point faible 2", "point faible 3"]
  },
  "team2": {
    "name": "${team2}",
    "form": "résumé de la forme récente en 1-2 phrases",
    "strengths": ["point fort 1", "point fort 2", "point fort 3"],
    "weaknesses": ["point faible 1", "point faible 2", "point faible 3"]
  },
  "headToHead": "résumé de la confrontation directe en 2-3 phrases",
  "prediction": {
    "team1WinPercent": nombre entre 0 et 100,
    "drawPercent": nombre entre 0 et 100,
    "team2WinPercent": nombre entre 0 et 100,
    "confidence": nombre entre 0 et 100,
    "justification": "explication du pronostic en 2-3 phrases"
  },
  "summary": "synthèse finale en 1-2 phrases"
}

Les trois pourcentages team1WinPercent, drawPercent et team2WinPercent doivent totaliser 100. Réponds en français. Reste factuel et nuancé.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    let text = data.content?.[0]?.text || '{}';
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const analysis = JSON.parse(text);

    // Increment quota after successful analysis
    if (userId && shouldIncrementQuota) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          analysesUsedThisMonth: effectiveUsed + 1,
          analysesResetDate: effectiveResetDate,
        },
      });
    }

    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la génération.' }, { status: 500 });
  }
}
