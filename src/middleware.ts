import { withAuth } from "next-auth/middleware"


export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            console.log(req.nextUrl.pathname, token?.role)
            const tokenExists = token?.role === "TEACHER" || token?.role === "ADMIN" || token?.role === "STUDENT"
            if (req.nextUrl.pathname.startsWith("/admin/teacher") || req.nextUrl.pathname.startsWith("/api/admin/teacher")) {
                console.log("teacher route", token?.role === "TEACHER")
                return token?.role === "TEACHER"
            }
            if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/api/admin")) {
                console.log("admin route", token?.role === "TEACHER" || token?.role === "ADMIN")
                return token?.role === "TEACHER" || token?.role === "ADMIN"
            }
            if (tokenExists) return true;
            return false;
        },
    },
})

// for timeout logic
// one route would be doing it possible through middleware??? probably not. safer, more reliable option is using setInterval to check if timeout has passed

// make sure /admin/teacher/:path* along with /api/admin/teacher checks if user is teacher