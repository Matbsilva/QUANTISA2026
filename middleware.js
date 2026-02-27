import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/api/auth/signin",
    },
});

export const config = {
    // Proteger TODAS as rotas, exceto de login e auth
    // Importante permitir _next e favicon para não quebrar a tela de login
    matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};
