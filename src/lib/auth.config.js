export const authConfig = {
    pages: {
        signIn: "/login", // if authroized fn return false, it redirects to login page
    },
    providers: [],
    callbacks: {
        // FOR MORE DETAIL ABOUT CALLBACK FUNCTIONS CHECK https://next-auth.js.org/configuration/callbacks
        async jwt({ token, user }) { // after login, create token
            if (user) {
                token.id = user.id;
                token.isAdmin = user.isAdmin;
            }
            return token;
        },
        async session({ session, token }) { // using the above token, we can update the session
            if (token) {
                session.user.id = token.id;
                session.user.isAdmin = token.isAdmin;
            }
            return session;
        },
        authorized({ auth, request }) {
            /* auth?.user
            - github: {user: {name, email, image}}
            - credentials: {user: {email}} => to prevent this, we should add user information
            - credentials after jwt, session : {user: {email, id, isAdmin}}
            */
            const user = auth?.user;
            const isOnAdminPanel = request.nextUrl?.pathname.startsWith("/admin");
            const isOnBlogPage = request.nextUrl?.pathname.startsWith("/blog");
            const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");

            // ONLY ADMIN CAN REACH THE ADMIN DASHBOARD

            if (isOnAdminPanel && !user?.isAdmin) {
                return false; // redirect to login page
            }

            // ONLY AUTHENTICATED USERS CAN REACH THE BLOG PAGE

            if (isOnBlogPage && !user) {
                return false;
            }

            // ONLY UNAUTHENTICATED USERS CAN REACH THE LOGIN PAGE

            if (isOnLoginPage && user) {
                return Response.redirect(new URL("/", request.nextUrl)); // home page
            }

            return true; // authorize user
        },
    },
};