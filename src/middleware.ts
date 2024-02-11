import { withAuth } from "next-auth/middleware"


export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            const tokenExists = token?.role === "TEACHER" || token?.role === "ADMIN" || token?.role === "STUDENT"
            // if (req.nextUrl.pathname.startsWith("/admin/teacher") || req.nextUrl.pathname.startsWith("/api/admin/teacher")) {
            //     return token?.role === "TEACHER"
            // }
            // if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin")) {
            //     return token?.role === "TEACHER" || token?.role === "ADMIN"
            // }

            const safeRoutes = ['/', '/api/machine/get', '/api/checkLastLogin']
            if (tokenExists || safeRoutes.includes(req.nextUrl.pathname)) return true;

            return token?.role === "TEACHER" || token?.role === "ADMIN"
        },
    },
})

// for timeout logic
// one route would be doing it possible through middleware??? probably not. safer, more reliable option is using setInterval to check if timeout has passed

// make sure /admin/teacher/:path* along with /api/admin/teacher checks if user is teacher
