import { withAuth } from "next-auth/middleware"


export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // `/admin` requires admin role
            if (req.nextUrl.pathname === "/admin") {
                return token?.admin === true
            }

            // `/me` only requires the user to be logged in
            return !!token
        },
    },
})

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] }

// for timeout logic
// one route would be doing it possible through middleware??? probably not. safer, more reliable option is using setInterval to check if timeout has passed