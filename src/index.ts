// src/index.ts

// Oddiy Deno HTTP server
Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Root endpoint
  if (url.pathname === "/") {
    return new Response(
      JSON.stringify({ status: "OK", message: "Deno Server Working" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Video yaratish endpoint
  if (url.pathname === "/run") {
    try {
      // Bu yerda API chaqiriladi — hozircha demo
      const result = {
        success: true,
        message: "Video queue triggered successfully!",
        time: new Date().toISOString(),
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Not Found", { status: 404 });
});
