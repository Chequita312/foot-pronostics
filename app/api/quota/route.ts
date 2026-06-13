import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionStatus: true, analysesUsedThisMonth: true, analysesResetDate: true },
  });

  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  if (user.subscriptionStatus === 'active') {
    return NextResponse.json({ authenticated: true, isUnlimited: true, used: 0, remaining: 3 });
  }

  const now = new Date();
  const needsReset = user.analysesResetDate !== null && user.analysesResetDate < now;
  const used = needsReset ? 0 : user.analysesUsedThisMonth;
  const MAX = 3;

  return NextResponse.json({
    authenticated: true,
    isUnlimited: false,
    used,
    remaining: Math.max(MAX - used, 0),
  });
}
