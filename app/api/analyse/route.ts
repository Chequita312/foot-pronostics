import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { team1, team2 } = await req.json();

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

    // Nettoyage si l'IA entoure le JSON de balises markdown
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    const analysis = JSON.parse(text);

    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la génération.' }, { status: 500 });
  }
}