// ============================================================
// El-Ghalban | lib/auth.ts — NextAuth Configuration
// Credential-based authentication for the Admin Dashboard
// ============================================================

import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Admin Login",
      credentials: {
        username: {
          label: "اسم المستخدم",
          type: "text",
          placeholder: "admin",
        },
        password: {
          label: "كلمة المرور",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("يرجى إدخال اسم المستخدم وكلمة المرور");
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
          console.error("ADMIN_USERNAME or ADMIN_PASSWORD_HASH env variables are not set.");
          throw new Error("خطأ في إعدادات الخادم");
        }

        // التحقق من اسم المستخدم
        if (credentials.username !== adminUsername) {
          throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
        }

        // ============================================================
        // تعديل الطوارئ: بيقارن الباسوورد باللي في الـ .env كـ نص عادي 
        // أو بيقارنه كـ Hash.. عشان لو التشفير معلق معاك تدخل برضه.
        // ============================================================
        const isPasswordValid = 
          credentials.password === adminPasswordHash || // دخول مباشر بالنص اللي في الـ .env
          await bcrypt.compare(credentials.password, adminPasswordHash); // دخول بنظام الـ Hash

        if (!isPasswordValid) {
          throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
        }

        return {
          id: "admin-001",
          name: "مدير النظام",
          email: "admin@elghalban.com",
          role: "admin",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};