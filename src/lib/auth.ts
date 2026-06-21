import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          googleId: profile.sub,
          githubConnected: false,
          role: "CONTRIBUTOR",
        };
      },
    }),
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
          githubUsername: profile.login,
          githubConnected: true,
          role: "CONTRIBUTOR", // Default until onboarding
        };
      },
    }),
    CredentialsProvider({
      name: "Guest",
      credentials: {
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        try {
          const role = credentials?.role === "MAINTAINER" ? "MAINTAINER" : "CONTRIBUTOR";
          const randomId = Math.random().toString(36).substring(7);
          
          const guestUser = await prisma.user.create({
            data: {
              name: `Guest ${role}`,
              email: `guest_${randomId}@example.com`,
              role: role as "MAINTAINER" | "CONTRIBUTOR",
              githubConnected: false,
            }
          });
          
          return guestUser as any;
        } catch (error) {
          console.error("Prisma error during guest creation:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string || token.sub as string;
        // Fetch real role and github connected status from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { githubId: true, role: true, githubConnected: true },
        });
        if (dbUser) {
          session.user.githubId = dbUser.githubId;
          session.user.role = dbUser.role;
          session.user.githubConnected = dbUser.githubConnected;
        }
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // @ts-ignore
        token.githubConnected = user.githubConnected;
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};
