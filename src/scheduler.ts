// src/scheduler.ts
import { getNextVideo, markUploaded } from "./db.ts";
import { generateMetadata, uploadToYouTube, uploadToTikTok, uploadToInstagram, uploadToFacebook } from "./utils.ts";

export async function runScheduler() {
  const video = await getNextVideo();
  if (!video) {
    console.log("No pending videos");
    return;
  }

  const metadata = await generateMetadata(video.prompt);

  for (const channel of video.channels) {
    await uploadToYouTube(video.videoUrl, metadata, channel);
    await uploadToTikTok(video.videoUrl, metadata, channel);
    await uploadToInstagram(video.videoUrl, metadata, channel);
    await uploadToFacebook(video.videoUrl, metadata, channel);
  }

  await markUploaded(video);
  console.log("Video uploaded to all channels:", video.channels);
}
