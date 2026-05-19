import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Player } from '@/lib/models/Player';

async function connectDB() {
  const state = mongoose.connection.readyState;
  if (state === 1) return;
  if (state === 2) {
    await mongoose.connection.asPromise();
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
}

// Συνάρτηση που μετατρέπει δυναμικά το όνομα της ομάδας στο σωστό teamCode
function getCleanTeamCode(teamName: string): string {
  if (!teamName) return "UNK";
  
  if (/Panathinaikos/i.test(teamName)) return "PAO";
  if (/Virtus.*Bologna/i.test(teamName)) return "VIR";
  if (/Olympiacos/i.test(teamName)) return "OLY";
  if (/Maccabi/i.test(teamName)) return "MAC";
  if (/Fenerbahce/i.test(teamName)) return "FNB";
  if (/Anadolu.*Efes/i.test(teamName)) return "EFS";
  if (/Real.*Madrid/i.test(teamName)) return "RMB";
  if (/Barcelona/i.test(teamName)) return "FCB";
  if (/Partizan/i.test(teamName)) return "PAR";
  if (/Crvena.*Zvezda/i.test(teamName)) return "CZV";
  if (/Monaco/i.test(teamName)) return "MON";
  if (/Baskonia/i.test(teamName)) return "BKN";
  if (/Milano|EA7/i.test(teamName)) return "EA7";
  if (/Zalgiris/i.test(teamName)) return "ZAL";
  if (/Bayern/i.test(teamName)) return "BAY";
  if (/ALBA/i.test(teamName)) return "ALB";
  if (/ASVEL/i.test(teamName)) return "ASV";
  if (/Paris/i.test(teamName)) return "PFC";
  if (/Dubai/i.test(teamName)) return "DUB";
  if (/Hapoel.*Tel.*Aviv/i.test(teamName)) return "HTA";
  if (/Valencia/i.test(teamName)) return "VBC";

  return "UNK";
}

export async function GET() {
  try {
    await connectDB();

    // Φέρνουμε 2 τυχαίους, ενεργούς και έγκυρους παίκτες
    const randomPlayers = await Player.aggregate([
      { 
        $match: { 
          active: true, 
          eligibleForHL: { $ne: false },
          $or: [
            { "stats.ppg": { $gt: 0 } },
            { "stats.rpg": { $gt: 0 } },
            { "stats.apg": { $gt: 0 } }
          ]
        } 
      },
      { $sample: { size: 2 } },
      { 
        $project: {
          _id: 0,
          id: "$playerId",
          name: 1,
          team: 1, // Παίρνουμε το full name της ομάδας για να το ελέγξουμε
          dorsal: 1,
          stats: 1
        }
      }
    ]);

    if (randomPlayers.length < 2) {
      return NextResponse.json({ error: "Not enough players found" }, { status: 400 });
    }

    // Διορθώνουμε δυναμικά το teamCode πριν το στείλουμε στο Frontend
    const mappedPlayers = randomPlayers.map(player => ({
      id: player.id,
      name: player.name,
      dorsal: player.dorsal,
      stats: player.stats,
      teamCode: getCleanTeamCode(player.team) // Δημιουργεί το σωστό FNB, PAO, κλπ.
    }));

    return NextResponse.json(mappedPlayers);
  } catch (error) {
    console.error("Higher-Lower API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}