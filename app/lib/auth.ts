import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db, adminUsers } from "@/db";
import { eq } from "drizzle-orm";

// Ensure we have a proper URL for NextAuth
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const [user] = await db
            .select()
            .from(adminUsers)
            .where(eq(adminUsers.email, credentials.email))
            .limit(1);

          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  // Fix for Invalid URL error
  useSecureCookies: process.env.NODE_ENV === 'production',
};

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function isAuthed(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !!session?.user?.id;
}
