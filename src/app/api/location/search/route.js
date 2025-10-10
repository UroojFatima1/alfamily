export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return Response.json([], { status: 200 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "User-Agent": "RideApp/1.0 (contact@rideapp.com)", // Required by Nominatim
        },
      }
    );
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("Error fetching location:", err);
    return Response.json([], { status: 500 });
  }
}
