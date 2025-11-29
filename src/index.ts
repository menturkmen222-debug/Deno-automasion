import { serve } from "https://deno.land/std@0.201.0/http/server.ts";

async function serveStatic(filePath: string, contentType: string) {
  try {
    const data = await Deno.readTextFile(filePath);
    return new Response(data, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}

serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    return serveStatic(new URL("../frontend/index.html", import.meta.url).pathname, "text/html");
  }

  if (url.pathname === "/upload.js") {
    return serveStatic(new URL("../frontend/upload.js", import.meta.url).pathname, "application/javascript");
  }

  if (url.pathname === "/upload-video" && req.method === "POST") {
    return new Response(JSON.stringify({ message: "Video upload endpoint working!" }), { status: 200 });
  }

  return new Response("Not found", { status: 404 });
});
