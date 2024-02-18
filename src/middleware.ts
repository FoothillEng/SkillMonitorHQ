import { withAuth } from "next-auth/middleware"


export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // const tokenExists = token?.role === "TEACHER" || token?.role === "ADMIN" || token?.role === "STUDENT"
            if (req.nextUrl.pathname.startsWith("/teacher") || req.nextUrl.pathname.startsWith("/api/teacher")) {
                return token?.role === "TEACHER"
            }
            if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin")) {
                return token?.role === "TEACHER" || token?.role === "ADMIN"
            }

            if (req.nextUrl.pathname == '/' || req.nextUrl.pathname.startsWith('/api/machine/')) {
                return true;
            }

            // return token?.role === "TEACHER" || token?.role === "ADMIN"
            return false
        },
    },
})

// for timeout logic
// one route would be doing it possible through middleware??? probably not. safer, more reliable option is using setInterval to check if timeout has passed

// make sure /admin/teacher/:path* along with /api/admin/teacher checks if user is teacher
