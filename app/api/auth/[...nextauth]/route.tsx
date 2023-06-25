import NextAuth from "next-auth/next";
import { prisma } from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { AuthOptions, Awaitable, RequestInternal, User } from "next-auth";
import type { LoginData } from "@/types/auth";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: "" + process.env.GITHUB_ID,
      clientSecret: "" + process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: "" + process.env.GOOGLE_ID,
      clientSecret: "" + process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "cardlover@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "******",
        },
        username: {
          label: "Username",
          type: "text",
          placeholder: "CardsLover",
        },
      },
      authorize: async function (
        credentials: Record<string, string> | LoginData | undefined,
        req: Pick<RequestInternal, "query" | "headers" | "body" | "method">
      ): Promise<User> {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter the email and password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("No user found");
        }

        const passMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!passMatch) {
          throw new Error("Wrong password");
        }

        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
