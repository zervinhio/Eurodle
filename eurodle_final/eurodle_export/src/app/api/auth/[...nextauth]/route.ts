import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../lib/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    })
  ],

  pages: {
    signIn: '/login', // Λέμε στο σύστημα να χρησιμοποιεί τη δική μας σελίδα
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        // Αν υπάρχει ήδη ο χρήστης αλλά συνδέεται με άλλο provider (π.χ. είχε Google και τώρα μπαίνει με Discord)
        // Σημείωση: Στο τωρινό schema δεν αποθηκεύουμε τον provider, οπότε το account linking γίνεται αυτόματα.
        // Αν θέλουμε να τον ενημερώσουμε, μπορούμε να περάσουμε ένα flag στο URL.
        return true;
      } else {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          score: 0,
          streak: 0,
          maxStreak: 0
        });
      }
      return true;
    },
    async session({ session }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user?.email });
      
      if (dbUser && session.user) {
        let currentStreak = dbUser.streak || 0;

        // Έλεγχος αν το Streak πρέπει να μηδενιστεί
        if (dbUser.lastPlayed && currentStreak > 0) {
          // Παίρνουμε τη σημερινή ημερομηνία και την ημερομηνία της τελευταίας νίκης σε ώρα Αθήνας (YYYY-MM-DD)
          const athensFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' });
          const todayStr = athensFormatter.format(new Date());
          const lastPlayedStr = athensFormatter.format(dbUser.lastPlayed);

          // Υπολογίζουμε τη διαφορά σε ημέρες
          const todayDate = new Date(todayStr);
          const lastDate = new Date(lastPlayedStr);
          const diffDays = (todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

          // Αν η τελευταία νίκη ήταν ΠΡΙΝ από χθες (δηλαδή diffDays > 1), το streak έσπασε!
          if (diffDays > 1) {
            currentStreak = 0;
            // Ενημερώνουμε και τη βάση για να αποθηκευτεί η απώλεια του streak
            await User.updateOne({ _id: dbUser._id }, { $set: { streak: 0 } });
          }
        }

        (session.user as any).id = dbUser._id;
        (session.user as any).score = dbUser.score || 0;
        (session.user as any).streak = currentStreak;
      }
      return session;
    }
  },
});

export { handler as GET, handler as POST };