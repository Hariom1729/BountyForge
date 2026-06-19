import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          githubId: profile.id.toString(),
          role: "CONTRIBUTOR", // Default role
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch custom fields
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { githubId: true, role: true },
        });
        if (dbUser) {
          session.user.githubId = dbUser.githubId;
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
};
