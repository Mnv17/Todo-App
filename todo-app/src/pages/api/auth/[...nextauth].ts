import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    // Add other providers as needed
  ],
  // Add custom configurations if necessary
});
