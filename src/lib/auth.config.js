/*
Session: 사용자의 로그인 상태를 나타내는 정보입니다. 이 정보는 클라이언트 측에서 저장되고, 서버와의 상호작용 시 사용됩니다.
Token: 사용자가 로그인할 때 발급되는 임시 인증 토큰입니다. 이 토큰은 사용자 정보를 포함하고 있으며, 이를 통해 세션을 갱신하거나 새로운 세션을 생성할 수 있습니다.
*/
export const authConfig = {
    pages: {
        signIn: "/login", // if authroized fn return false, it redirects to login page
    },
    providers: [],
    callbacks: {
        // FOR MORE DETAIL ABOUT CALLBACK FUNCTIONS CHECK https://next-auth.js.org/configuration/callbacks
        /*
            이 코드는 인증 토큰에 포함된 사용자 ID와 관리자 여부 정보를 세션 객체에 추가하여 클라이언트가 이 정보를 사용할 수 있도록 합니다.
            이를 통해 클라이언트는 사용자의 ID와 관리자 여부를 쉽게 확인할 수 있습니다.
        */
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