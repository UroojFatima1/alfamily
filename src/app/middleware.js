import { NextResponse } from "next/server";

export function middleware(req)
{
    const url = req.nextUrl.clone();
    const { pathname } = url;

    // Read cookies
    const token = req.cookies.get("token")?.value || "";
    const userCookie = req.cookies.get("user")?.value || "";

    // No token → redirect to homepage (login modal will appear)
    if (!token)
    {
        if (!pathname.startsWith("/_next") && !pathname.startsWith("/api"))
        {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Parse role from cookie
    let userRole = "";
    try
    {
        if (userCookie)
        {
            const parsed = JSON.parse(decodeURIComponent(userCookie));
            userRole = parsed?.role || parsed?.user?.role || "";
        }
    } catch (err)
    {
        console.error("❌ Cookie parse error:", err);
    }

    // 🚦 Route protection logic
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

// ✅ Middleware will run for all driver/rider pages
export const config = {
    matcher: [
        "/rider",
        "/rider/:path*",
        "/driver",
        "/driver/:path*",
    ],
};
