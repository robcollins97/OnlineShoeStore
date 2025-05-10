import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const { MongoClient } = require('mongodb'); // Using MongoDB client as per your request

const url = "mongodb://admin:pass@localhost:27017/?authSource=admin"; // MongoDB connection string
const dbName = 'ShoeStoreDB'; // Your database name

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" }, // Changed label to Email
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Direct MongoDB connection
        const client = new MongoClient(url);
        try {
          await client.connect();
          console.log("Connected successfully to server for authorization");
          const db = client.db(dbName);
          const collection = db.collection('login'); // Collection name

          // Find the user by username (which you are using as email in the form)
          const user = await collection.findOne({ username: credentials.email });

          if (!user) {
            return null; // User not found
          }

          // Compare passwords (assuming password is stored hashed)
          const passwordMatch = credentials.password === user.pass; // Assuming 'pass' is the password field in your DB
          if (!passwordMatch) {
            return null; // Invalid password
          }

          return { id: user._id.toString(), username: user.username, email: user.username }; // Return user object (including email as username for now)
        } catch (error) {
          console.error("Database error during authorization:", error);
          return null;
        } finally {
          await client.close(); // Close the connection
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Using JWT session strategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      if (token?.username) {
        session.user.username = token.username;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };