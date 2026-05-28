import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => Boolean(token),
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});

export const config = { matcher: ["/cv/:path*"] };
