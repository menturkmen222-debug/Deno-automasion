export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); // Cloudinary preset

  const CLOUD_NAME = Deno.env.get("CLOUD_NAME");
  const CLOUD_API_KEY = Deno.env.get("CLOUD_API_KEY");
  const CLOUD_API_SECRET = Deno.env.get("CLOUD_API_SECRET");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Basic " + btoa(`${CLOUD_API_KEY}:${CLOUD_API_SECRET}`),
    },
  });

  const data = await response.json();
  return data.secure_url; // Cloud URL
}
