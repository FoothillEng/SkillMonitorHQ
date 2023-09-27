import { withAuth } from "next-auth/middleware"


export default withAuth({
    callbacks: {
        authorized({ req, token }) {            // `/admin` requires admin role
            if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin")) {
                return token?.admin === true
            }
            return !!token
        },
    },
})

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] }

// for timeout logic
// one route would be doing it possible through middleware??? probably not. safer, more reliable option is using setInterval to check if timeout has passed

// make sure /admin/teacher/:path* along with /api/admin/teacher checks if user is teacher