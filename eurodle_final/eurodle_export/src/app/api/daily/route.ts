// Μέσα στο src/app/api/daily/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Παίρνουμε τη σημερινή ημερομηνία Ώρας Ελλάδος!
  const athensFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit' });
  const todayDateStr = athensFormatter.format(new Date());

  // ... εδώ κανονικά είναι ο δικός σου κώδικας που βρίσκει τον παίκτη με βάση το todayDateStr

  return NextResponse.json({ date: todayDateStr /*, playerId: ... */ });
}