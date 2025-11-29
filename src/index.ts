import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { uploadToCloudinary, generateMetadata, uploadToYouTube, uploadToTikTok, uploadToInstagram, uploadToFacebook } from "./utils.ts";
import { addVideoToQueue, getNextVideo, markUploaded } from "./db.ts";

// Static fa yl o‘qish funksiyasi
async function serveStaticFile(filePath: string, contentType: string) {
  try {
    const fileContent = await Deno.readTextFile(filePath);
    return new Response(fileContent, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}

serve(async (req) => {
  const url = new URL(req.url);

  // ====================
  // index.html
  // ====================
  if (url.pathname === "/" || url.pathname === "/index.html") {
    return serveStaticFile(new URL("../frontend/index.html", import.meta.url).pathname, "text/html");
  }

  // ====================
  // upload.js
  // ====================
  if (url.pathname === "/upload.js") {
    return serveStaticFile(new URL("../frontend/upload.js", import.meta.url).pathname, "application/javascript");
  }

  // ====================
  // /upload-video endpoint
  // ====================
  if (url.pathname === "/upload-video" && req.method === "POST") {
    const formData = await req.formData();
    const videoFile = formData.get("video") as File;
    const prompt = formData.get("prompt") as string;
    const channels = formData.getAll("channels") as string[];

    if (!videoFile || !prompt || channels.length === 0) {
      return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
    }

    const cloudUrl = await uploadToCloudinary(videoFile);

    await addVideoToQueue({
      videoUrl: cloudUrl,
      prompt,
      channels,
      status: "pending",
    });

    return new Response(JSON.stringify({ message: "Video queued", cloudUrl }), { status: 200 });
  }

  // ====================
  // /run-schedule endpoint
  // ====================
  if (url.pathname === "/run-schedule") {
    await runScheduler();
    return new Response(JSON.stringify({ message: "Scheduler executed" }), { status: 200 });
  }

  return new Response("Not found", { status: 404 });
});
