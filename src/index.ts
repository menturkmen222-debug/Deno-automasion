import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { readFileStr } from "https://deno.land/std@0.201.0/fs/mod.ts";

// Serve static index.html
serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/") {
    const html = await Deno.readTextFile("./frontend/index.html");
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  if (url.pathname === "/upload.js") {
    const js = await Deno.readTextFile("./frontend/upload.js");
    return new Response(js, { headers: { "Content-Type": "application/javascript" } });
  }

  // API endpoints
  if (url.pathname === "/upload-video" && req.method === "POST") {
    // ... shu yerda upload-video logikasi
  }

  if (url.pathname === "/run-schedule") {
    // ... shu yerda scheduler
  }

  return new Response("Not found", { status: 404 });
});
