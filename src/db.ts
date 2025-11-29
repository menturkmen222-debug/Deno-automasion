interface VideoQueueItem {
  videoUrl: string;
  prompt: string;
  channels: string[];
  status: "pending" | "uploaded";
}

let videoQueue: VideoQueueItem[] = [];

export async function addVideoToQueue(item: VideoQueueItem) {
  videoQueue.push(item);
}

export async function getNextVideo(): Promise<VideoQueueItem | null> {
  return videoQueue.find((v) => v.status === "pending") || null;
}

export async function markUploaded(item: VideoQueueItem) {
  item.status = "uploaded";
}
