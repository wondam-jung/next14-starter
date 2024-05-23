import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};

/*
    matcher allows you to filter Middleware to run (or not to run like in the example) on specific paths.
    if you don't add any matchers, Middleware will be invoked for every route in your project.
*/

// FOR MORE INFORMATION CHECK: https://nextjs.org/docs/app/building-your-application/routing/middleware