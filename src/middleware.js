import { NextResponse } from "next/server";

export function middleware(req)
{
    const url = req.nextUrl.clone();
    const { pathname } = url;

    const token = req.cookies.get("token")?.value;
    const userCookie = req.cookies.get("user")?.value;


    if (!token || !userCookie)
    {
        if (
            pathname.startsWith("/driver") ||
            pathname.startsWith("/rider")
        )
        {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    let role = "";
    try
    {
        const parsed = JSON.parse(userCookie);
        role = parsed?.role || parsed?.user?.role || "";
    } catch (err)
    {
        console.error("❌ Error parsing user cookie:", err);
    }


    if (pathname.startsWith("/driver") && role !== "driver")
    {
        url.pathname = "/rider/home";
        return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/rider") && role !== "rider")
    {
        url.pathname = "/driver/home";
        return NextResponse.redirect(url);
    }


    return NextResponse.next();
}


export const config = {
    matcher: [
        "/driver/:path*",
        "/rider/:path*",
    ],
};
