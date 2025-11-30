// types.ts
export interface VideoRequest {
  id: string;
  videoUrl: string;
  prompt: string;
  channel: "youtube" | "tiktok" | "instagram" | "facebook";
  status: "pending" | "processing" | "uploaded" | "failed";
  title?: string;
  description?: string;
  tags?: string[];
  createdAt: Date;
  scheduledAt?: Date;
}

export interface PlatformConfig {
  tokens: string[];
  maxPerDay: number;
}
