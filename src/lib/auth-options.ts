import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getPrisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/enums";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const prisma = getPrisma();
        if (!prisma || !credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            organization: { select: { isActive: true, name: true } },
          },
        });
        if (!user?.isActive) return null;

        const valid = await compare(String(credentials.password), user.passwordHash);
        if (!valid) return null;

        if (
          user.role === "ORG_USER" &&
          user.organizationId &&
          user.organization &&
          !user.organization.isActive
        ) {
          return null;
        }

        const name =
          [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
          email.split("@")[0] ||
          email;

        return {
          id: user.id,
          email: user.email,
          name,
          role: user.role as UserRole,
          organizationId: user.organizationId,
          organizationName:
            user.role === "ORG_USER" && user.organization
              ? user.organization.name
              : undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role as UserRole;
        token.organizationId = user.organizationId ?? null;
        token.organizationName =
          typeof user.organizationName === "string" && user.organizationName.trim()
            ? user.organizationName.trim()
            : null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = (token.email as string) ?? session.user.email ?? "";
        session.user.name = token.name as string | null | undefined;
        session.user.role = token.role as UserRole;
        session.user.organizationId = (token.organizationId as string | null) ?? null;
        const on = token.organizationName as string | null | undefined;
        session.user.organizationName =
          typeof on === "string" && on.trim() ? on.trim() : null;
      }
      return session;
    },
  },
};
