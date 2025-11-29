import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { uploadToCloudinary, generateMetadata, uploadToYouTube, uploadToTikTok, uploadToInstagram, uploadToFacebook } from "./utils.ts";
import { addVideoToQueue, getNextVideo, markUploaded } from "./db.ts";

// Serve static files
async function serveStaticFile(filePath: string, contentType: string) {
  try {
    const fileContent = await Deno.readTextFile(filePath);
    return new Response(fileContent, { headers: { "Content-Type": contentType } });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}

// Scheduler
async function runScheduler() {
  const video = await getNextVideo();
  if (!video) return;

  const metadata = await generateMetadata(video.prompt);

  for (const channel of video.channels) {
    await uploadToYouTube(video.videoUrl, metadata, channel);
    await uploadToTikTok(video.videoUrl, metadata, channel);
    await uploadToInstagram(video.videoUrl, metadata, channel);
    await uploadToFacebook(video.videoUrl, metadata, channel);
  }

  await markUploaded(video);
}

// Server
serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/" || url.pathname === "/index.html")
    return serveStaticFile("./frontend/index.html", "text/html");

  if (url.pathname === "/upload.js")
    return serveStaticFile("./frontend/upload.js", "application/javascript");

  if (url.pathname === "/upload-video" && req.method === "POST") {
    try {
      const formData = await req.formData();
      const videoFile = formData.get("video") as File;
      const prompt = formData.get("prompt") as string;
      const channels = formData.getAll("channels") as string[];

      if (!videoFile || !prompt || channels.length === 0)
        return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });

      const cloudUrl = await uploadToCloudinary(videoFile);

      await addVideoToQueue({
        videoUrl: cloudUrl,
        prompt,
        channels,
        status: "pending",
      });

      return new Response(JSON.stringify({ message: "Video queued", cloudUrl }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (url.pathname === "/run-schedule") {
    try {
      await runScheduler();
      return new Response(JSON.stringify({ message: "Scheduler executed" }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response("Not found", { status: 404 });
});
