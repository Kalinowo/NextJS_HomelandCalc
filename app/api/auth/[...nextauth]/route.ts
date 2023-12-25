import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import prisma from "@/app/libs/prismadb";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { type: "text" },
        hashedPassword: { type: "password" },
      },
      async authorize(credentials) {
        const { name, hashedPassword } = credentials as any;
        // check if user already exists
        const nameExists = await prisma.user.findUnique({
          where: { name: name },
        });

        if (nameExists) {
          const checkPassword = await compare(
            hashedPassword,
            nameExists.hashedPassword as any
          );
          if (!checkPassword) {
            throw new Error("password doesn't match");
          }
        } else {
          throw new Error("username not found");
        }

        // if not, create a new document and save user in MongoDB
        // if (!nameExists) {
        //   await prisma.user.create({
        //     data: {
        //       name: name,
        //       hashedPassword: await hash(hashedPassword, 12),
        //     },
        //   });
        // }
        return { name: name } as any;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user?.name) {
        const sessionUser = await prisma.user.findUnique({
          where: {
            name: session.user.name,
          },
        });
        session.user.id = sessionUser?.id;
        session.user.replaceName = sessionUser?.replaceName;
      }

      return session;
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
