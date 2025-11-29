import { getNextVideo, markUploaded } from "./db.ts";
import { uploadToYouTube } from "./utils.ts";

export async function runScheduler() {
  const video = await getNextVideo();
  if (!video) {
    console.log("No pending videos");
    return;
  }

  for (const channel of video.channels) {
    // Har bir kanalga YouTube upload (keyin TikTok, IG, FB)
    await uploadToYouTube(video.videoUrl, video.prompt, channel);
  }

  await markUploaded(video);
  console.log("Video uploaded to all channels:", video.channels);
}
