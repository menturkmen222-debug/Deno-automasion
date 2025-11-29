// src/index.ts
import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { uploadToCloudinary } from "./utils.ts";
import { addVideoToQueue } from "./db.ts";
import { runScheduler } from "./scheduler.ts";

serve(async (req) => {
  const url = new URL(req.url);

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

  if (url.pathname === "/run-schedule") {
    await runScheduler();
    return new Response(JSON.stringify({ message: "Scheduler executed" }), { status: 200 });
  }

  return new Response("Not found", { status: 404 });
});
