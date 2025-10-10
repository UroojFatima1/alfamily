import { NextResponse } from "next/server";

export function middleware(req)
{
    const url = req.nextUrl.clone();
    const { pathname } = url;

    const token = req.cookies.get("token")?.value;
    const userCookie = req.cookies.get("user")?.value;

    // 🚫 If no token → redirect to root (login modal shows there)
    if (!token)
    {
        if (
            !pathname.startsWith("/_next") &&
            !pathname.startsWith("/api") &&
            pathname !== "/"
        )
        {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // ✅ Extract role from cookie JSON (no decoding)
    let userRole = "";
    try
    {
        if (userCookie)
        {
            const parsed = JSON.parse(userCookie);
            userRole = parsed.role || parsed.user?.role || "";
        }
    } catch (err)
    {
        console.error("❌ Failed to parse user cookie:", err);
    }

    // 🚦 Role-based access control
    if (userRole === "driver" && pathname.startsWith("/rider"))
    {
        url.pathname = "/driver/home";
        return NextResponse.redirect(url);
    }

    if (userRole === "rider" && pathname.startsWith("/driver"))
    {
        url.pathname = "/rider/home";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// ✅ Apply middleware only to protected routes
export const config = {
    matcher: [
        "/rider",
        "/rider/:path*",
        "/driver",
        "/driver/:path*",
    ],
};
