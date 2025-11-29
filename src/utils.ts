// src/utils.ts

/** 
 * src/utils.ts
 * 
 * Barcha tarmoq upload funksiyalari, Groq metadata yaratish va yordamchi funksiyalar
 * YouTube / TikTok / Instagram / Facebook / Cloudinary
 */

///////////////////////////
// CLOUDINARY UPLOAD
///////////////////////////

export async function uploadToCloudinary(file: File): Promise<string> {
  const CLOUD_NAME = Deno.env.get("CLOUD_NAME");
  const CLOUD_API_KEY = Deno.env.get("CLOUD_API_KEY");
  const CLOUD_API_SECRET = Deno.env.get("CLOUD_API_SECRET");

  if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
    throw new Error("Cloudinary API keys missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Basic " + btoa(`${CLOUD_API_KEY}:${CLOUD_API_SECRET}`)
    },
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
}


///////////////////////////
// GROQ METADATA GENERATION
///////////////////////////

export async function generateMetadata(prompt: string) {
  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
  if (!GROQ_API_KEY) throw new Error("Groq API key missing");

  const response = await fetch("https://api.groq.com/v1/ai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-metadata-1",
      prompt: `Generate a YouTube/Instagram/TikTok/Facebook short video metadata for the following prompt:\n"${prompt}"\nReturn JSON with title, description, tags.`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq metadata generation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    title: data.title || prompt,
    description: data.description || prompt,
    tags: data.tags || prompt.split(" ").slice(0, 10),
  };
}


///////////////////////////
// YOUTUBE UPLOAD
///////////////////////////

export async function uploadToYouTube(videoUrl: string, metadata: any, channelNumber: string) {
  const refreshToken = Deno.env.get(`YT_REFRESH_${channelNumber}`);
  if (!refreshToken) throw new Error(`YouTube refresh token missing for channel ${channelNumber}`);

  // TODO: Implement OAuth2 token exchange and YouTube upload API
  console.log(`[YouTube] Uploading video to channel ${channelNumber}`);
  console.log("Title:", metadata.title);
  console.log("Description:", metadata.description);
  console.log("Tags:", metadata.tags.join(", "));
}


///////////////////////////
// TIKTOK UPLOAD
///////////////////////////

export async function uploadToTikTok(videoUrl: string, metadata: any, channelNumber: string) {
  const TIKTOK_TOKEN = Deno.env.get(`TIKTOK_TOKEN_${channelNumber}`);
  if (!TIKTOK_TOKEN) throw new Error(`TikTok token missing for channel ${channelNumber}`);

  // TODO: TikTok upload API integration
  console.log(`[TikTok] Uploading video to channel ${channelNumber}`);
  console.log("Title:", metadata.title);
  console.log("Description:", metadata.description);
  console.log("Tags:", metadata.tags.join(", "));
}


///////////////////////////
// INSTAGRAM UPLOAD
///////////////////////////

export async function uploadToInstagram(videoUrl: string, metadata: any, pageNumber: string) {
  const IG_TOKEN = Deno.env.get(`IG_TOKEN_${pageNumber}`);
  if (!IG_TOKEN) throw new Error(`Instagram token missing for page ${pageNumber}`);

  // TODO: Instagram Graph API upload
  console.log(`[Instagram] Uploading video to page ${pageNumber}`);
  console.log("Title:", metadata.title);
  console.log("Description:", metadata.description);
}


///////////////////////////
// FACEBOOK UPLOAD
///////////////////////////

export async function uploadToFacebook(videoUrl: string, metadata: any, pageNumber: string) {
  const FB_TOKEN = Deno.env.get(`FB_TOKEN_${pageNumber}`);
  if (!FB_TOKEN) throw new Error(`Facebook token missing for page ${pageNumber}`);

  // TODO: Facebook Graph API upload
  console.log(`[Facebook] Uploading video to page ${pageNumber}`);
  console.log("Title:", metadata.title);
  console.log("Description:", metadata.description);
}
