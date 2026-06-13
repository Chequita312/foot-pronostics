import { NextResponse } from 'next/server';

type RawMatch = {
  id: number;
  homeTeam?: { name?: string };
  awayTeam?: { name?: string };
  competition?: { name?: string };
  utcDate: string;
  status: string;
};

export async function GET() {
  const today = new Date();
  const dateFrom = today.toISOString().split('T')[0];
  const future = new Date(today);
  future.setDate(today.getDate() + 3);
  const dateTo = future.toISOString().split('T')[0];

  try {
    const response = await fetch(
     `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&competitions=WC,CL,PL,FL1`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_API_KEY!,
        },
      }
    );

    const data = await response.json();

    const matches = (data.matches || []).map((m: RawMatch) => ({
      id: m.id,
      homeTeam: m.homeTeam?.name,
      awayTeam: m.awayTeam?.name,
      competition: m.competition?.name,
      date: m.utcDate,
      status: m.status,
    }));

    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la récupération des matchs.' }, { status: 500 });
  }
}