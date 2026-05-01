import Account from "@/database/model/account";
import NewUser from "@/database/model/user2";
import connectToDatabase from "@/database/mongoose";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      await connectToDatabase();

      let existingUser = await NewUser.findOne({ email: user.email });

      if (!existingUser) {
        existingUser = await NewUser.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });

        const newNotify = {
          code: 5,
          sendBy: user.name,
          data: "Welcome to our platform!",
          usefulId: existingUser._id,
        };

        // Push the notification to the user's notification array
        existingUser.notification.unshift(newNotify);

        // Save the updated user with the notification
        await existingUser.save();
      }

      let existingAccount = await Account.findOne({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });

      if (!existingAccount) {
        await Account.create({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          type: account.type,
          accessToken: account.access_token,
          idToken: account.id_token,
          userId: existingUser._id,
        });
      }

      user.id = existingUser._id;
      user.name=existingUser.name;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image;
      return session;
    },
  },
};

export async function getSession() {
  return await getServerSession(authOptions);
}
