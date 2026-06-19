import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      githubId?: string | null;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    githubId?: string | null;
    role?: string;
  }
}
