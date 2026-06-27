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
          authProvider: "GOOGLE",
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
          authProvider: "GITHUB",
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
          const randomId = Math.random().toString(36).substring(7);
          
          const guestUser = await prisma.user.create({
            data: {
              name: `Guest Explorer`,
              email: `guest_${randomId}@example.com`,
              role: "GUEST",
              githubConnected: false,
              guestMode: true,
              authProvider: "GUEST_SESSION",
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
          select: { githubId: true, role: true, githubConnected: true, guestMode: true },
        });
        if (dbUser) {
          session.user.githubId = dbUser.githubId || undefined;
          session.user.role = dbUser.role;
          session.user.githubConnected = dbUser.githubConnected;
          // @ts-ignore
          session.user.guestMode = dbUser.guestMode;
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
        // @ts-ignore
        token.guestMode = user.guestMode;
      }
      
      // Fetch latest role from DB to ensure JWT token matches actual state (prevent role update lag)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
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
    signIn: "/signin",
  },
};
