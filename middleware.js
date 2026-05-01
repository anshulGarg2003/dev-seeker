export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/user/:path*",
    "/room/:path*",
    "/create-room",
    "/feedback",
  ],
};
