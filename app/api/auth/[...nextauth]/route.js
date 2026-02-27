import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Acesso Quantisa",
            credentials: {
                username: { label: "E-mail ou Usuário", type: "text", placeholder: "admin" },
                password: { label: "Senha Mestra", type: "password" }
            },
            async authorize(credentials) {
                // Check if the provided password matches the ADMIN_PASSWORD from .env
                if (credentials?.password === process.env.ADMIN_PASSWORD) {
                    return { id: "1", name: "Administrador Quantisa", email: credentials.username || "admin" };
                }
                // Return null if user data could not be retrieved
                return null;
            }
        })
    ],
    pages: {
        // We use NextAuth's default unbranded sign-in page since the user is the only one using it,
        // but we could make a custom /login page in the future if needed.
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
