// db/queue.ts
import { VideoRequest } from "../types.ts";

const kv = await Deno.openKv();

const QUEUE_KEY = ["video_queue"];

export async function enqueueVideo(video: Omit<VideoRequest, "id" | "status" | "createdAt">): Promise<string> {
  const id = crypto.randomUUID();
  const request: VideoRequest = {
    id,
    ...video,
    status: "pending",
    createdAt: new Date(),
  };
  await kv.set([...QUEUE_KEY, id], request);
  return id;
}

export async function getPendingVideos(): Promise<VideoRequest[]> {
  const entries = kv.list<VideoRequest>({ prefix: QUEUE_KEY });
  const videos: VideoRequest[] = [];
  for await (const { value } of entries) {
    if (value.status === "pending") {
      videos.push(value);
    }
  }
  return videos;
}

export async function updateVideoStatus(id: string, status: VideoRequest["status"], metadata?: Partial<VideoRequest>) {
  const key = [...QUEUE_KEY, id];
  const res = await kv.get<VideoRequest>(key);
  if (!res.value) throw new Error(`Video ${id} not found`);
  const updated = { ...res.value, status, ...metadata };
  await kv.set(key, updated);
}
