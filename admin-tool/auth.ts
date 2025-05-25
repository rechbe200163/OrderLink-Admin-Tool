import { Employees } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from './prisma/client';
import { JWT } from 'next-auth/jwt';
import { authConfig } from './auth.config';

// Your own logic for dealing with plaintext password strings; be careful!

declare module 'next-auth' {
  interface Session {
    user: {
      id: Employees['employeeId'];
      role: Employees['role'];
      firstName: Employees['firstName'];
      lastName: Employees['lastName'];
      email: Employees['email'];
      password: Employees['password'];
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: Employees['employeeId'];
    role: Employees['role'];
    firstName: Employees['firstName'];
    lastName: Employees['lastName'];
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'test@test.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const employee = await prisma.employees.findUnique({
          where: {
            email: credentials.email?.toString(),
          },
        });

        if (!employee) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password?.toString(),
          employee.password
        );

        if (!isPasswordValid) {
          return null;
        }

        if (employee && isPasswordValid) {
          return {
            id: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            role: employee.role,
          };
        }

        return {
          id: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role,
        };
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }: { auth: any }) => {
      return !!auth;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/';
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Employees['role'];
      }
      if (token.firstName && session.user) {
        if (typeof token.firstName === 'string') {
          session.user.firstName = token.firstName;
        }
      }

      if (token.lastName && session.user) {
        if (typeof token.lastName === 'string') {
          session.user.lastName = token.lastName;
        }
      }

      if (token.email && session.user) {
        if (typeof token.email === 'string') {
          session.user.email = token.email;
        }
      }

      if (token.password && session.user) {
        if (typeof token.password === 'string') {
          session.user.password = token.password;
        }
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const e = await prisma.employees.findUnique({
        where: {
          employeeId: token.sub,
        },
      });

      if (!e) return token;

      token.role = e.role;
      token.sub = e.employeeId;
      token.firstName = e.firstName;
      token.lastName = e.lastName;
      token.email = e.email;
      token.password = e.password;

      return token;
    },
  },
});
