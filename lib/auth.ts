import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }
        await connectDB();

        // Find user by email (case insensitive)
        const user = await User.findOne({ 
          email: credentials.email.toLowerCase() 
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Return user object (without password)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
      }

      // Allow updating session from client
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.image = session.image;
      }

      return token;
    },
    
    async session({ session, token }) {
      // Add token data to session object
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};